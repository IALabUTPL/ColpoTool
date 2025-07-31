from datetime import datetime

from django.db import connection
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

# Funciones del módulo queries.py


# Funciones del cliente de base de datos
from backend.db.railway_client import (
    get_connection,
    fetch_all,
    fetch_one,
    execute_query
)

  # si está en el mismo módulo

# 1. Obtener usuario por username y password usando codigo como identificador principal
def get_user_by_username_and_password(username: str, password_hash: str):
    query = """
        SELECT codigo, username, full_name, role_id, created_at, is_active, email
        FROM users
        WHERE username = %s AND password_hash = %s
    """
    conn = get_connection()
    try:
        with conn.cursor() as cur:
            cur.execute(query, (username, password_hash))
            result = cur.fetchone()
            if result:
                user = {
                    "codigo": result[0],
                    "username": result[1],
                    "full_name": result[2],
                    "role_id": str(result[3]) if result[3] else None,
                    "created_at": result[4],
                    "is_active": result[5],
                    "email": result[6]
                }
                return user
            return None
    finally:
        conn.close()

# 2. Funciones de conteo (sin cambios necesarios)
def count_users():
    query = "SELECT COUNT(*) FROM users;"
    conn = get_connection()
    try:
        with conn.cursor() as cur:
            cur.execute(query)
            return cur.fetchone()[0]
    finally:
        conn.close()

def count_patients():
    query = "SELECT COUNT(*) FROM patients;"
    conn = get_connection()
    try:
        with conn.cursor() as cur:
            cur.execute(query)
            return cur.fetchone()[0]
    finally:
        conn.close()

def count_exams():
    query = "SELECT COUNT(*) FROM exams;"
    conn = get_connection()
    try:
        with conn.cursor() as cur:
            cur.execute(query)
            return cur.fetchone()[0]
    finally:
        conn.close()

def count_lesions():
    query = "SELECT COUNT(*) FROM lesion_detections;"
    conn = get_connection()
    try:
        with conn.cursor() as cur:
            cur.execute(query)
            return cur.fetchone()[0]
    finally:
        conn.close()

def count_predictions():
    query = "SELECT COUNT(*) FROM risk_predictions;"
    conn = get_connection()
    try:
        with conn.cursor() as cur:
            cur.execute(query)
            return cur.fetchone()[0]
    finally:
        conn.close()

def count_models():
    query = "SELECT COUNT(*) FROM models;"
    conn = get_connection()
    try:
        with conn.cursor() as cur:
            cur.execute(query)
            return cur.fetchone()[0]
    finally:
        conn.close()

# 3. Distribución de factores clínicos
def clinical_factor_distribution():
    query = """
        SELECT
            (SELECT COUNT(*) FROM clinical_info WHERE early_detection IS TRUE) AS early_detected,
            (SELECT COUNT(*) FROM clinical_info WHERE has_children IS TRUE) AS has_children,
            (SELECT COUNT(*) FROM exams WHERE ets = 'true') AS hiv_positive
    """
    conn = get_connection()
    try:
        with conn.cursor() as cur:
            cur.execute(query)
            result = cur.fetchone()
            return [
                {"label": "Detección temprana", "value": result[0], "percentage": 0},
                {"label": "Con hijos", "value": result[1], "percentage": 0},
                {"label": "VIH positivo", "value": result[2], "percentage": 0},
            ]
    finally:
        conn.close()


# 4. Obtener exámenes recientes
def get_recent_exams(limit=5):
    query = """
        SELECT 
            p.first_name || ' ' || p.last_name AS patient_name,
            e.date,
            'Completado' AS status,
            'Sin observaciones' AS notes,
            'https://randomuser.me/api/portraits/lego/1.jpg' AS avatar
        FROM exams e
        JOIN patients p ON e.patient_id = p.id  -- <== CAMBIO AQUÍ
        ORDER BY e.date DESC
        LIMIT %s;
    """
    conn = get_connection()
    try:
        with conn.cursor() as cur:
            cur.execute(query, (limit,))
            rows = cur.fetchall()
            return [
                {
                    "patientName": row[0],
                    "date": row[1].strftime("%Y-%m-%d"),
                    "status": row[2],
                    "notes": row[3],
                    "avatar": row[4],
                }
                for row in rows
            ]
    finally:
        conn.close()

# 5. Obtener todos los pacientes
def get_all_patients():
    query = """
        SELECT id, first_name || ' ' || last_name AS full_name, record_code, created_at
        FROM patients
        ORDER BY created_at DESC;
    """
    conn = get_connection()
    try:
        with conn.cursor() as cur:
            cur.execute(query)
            rows = cur.fetchall()
            return [
                {
                    "codigo": row[0],
                    "full_name": row[1],
                    "record_code": row[2],
                    "created_at": row[3].isoformat()
                }
                for row in rows
            ]
    finally:
        conn.close()

def get_next_patient_code():
    query = """
        SELECT record_code
        FROM patients
        WHERE record_code ~ '^P-\\d+$'
        ORDER BY CAST(SUBSTRING(record_code FROM '\\d+$') AS INTEGER) DESC
        LIMIT 1;
    """
    conn = get_connection()
    try:
        with conn.cursor() as cur:
            cur.execute(query)
            result = cur.fetchone()
            if result:
                last_number = int(result[0].split('-')[1])
                next_code = f"P-{last_number + 1:03d}"
            else:
                next_code = "P-001"
            return next_code
    finally:
        conn.close()

# 6. Insertar un nuevo paciente sin UUID en el ID (opcional si ID es serial)
def insert_patient(data):
    from .queries import get_next_patient_code
    record_code = get_next_patient_code()

    query = """
        INSERT INTO patients (
            first_name, last_name, birth_date, phone, record_code,
            created_by_codigo, created_at, dni, address
        ) VALUES (
            %s, %s, %s, %s, %s,
            %s, %s, %s, %s
        )
        RETURNING id;
    """
    values = [
        data.get("first_name"),
        data.get("last_name"),
        data.get("birthdate"),
        data.get("phone"),
        record_code,
        int(data.get("created_by")) if data.get("created_by") else 1001,
        datetime.utcnow(),
        data.get("national_doc"),
        data.get("address")
    ]

    conn = get_connection()
    try:
        with conn.cursor() as cur:
            cur.execute(query, values)
            patient_id = cur.fetchone()[0]
            conn.commit()
            return patient_id
    finally:
        conn.close()


def insert_clinical_info(data, patient_id):
    from datetime import datetime
    from backend.db.railway_client import get_connection

    def to_int(value):
        try:
            return int(value)
        except (ValueError, TypeError):
            return None

    def to_float(value):
        try:
            return float(value)
        except (ValueError, TypeError):
            return None

    def to_bool(value):
        if isinstance(value, bool):
            return value
        if isinstance(value, str):
            return value.lower() in ['true', '1', 'yes', 'on']
        return False

    def to_str(value):
        return str(value).strip() if value else None

    def to_date(value):
        try:
            return datetime.strptime(value, '%Y-%m-%d').date()
        except (ValueError, TypeError):
            return None

    query = """
        INSERT INTO clinical_info (
            patient_id, g, p, a, sexual_partners, menarche_age,
            cycle_days, smoking, vaccinated_hpv,
            education_level, marital_status, age_sex_start,
            num_pap, last_exam, has_children, early_detection,
            weight, height, blood_pressure, blood_type,
            uses_contraceptives, alcohol, active_life
        ) VALUES (
            %s, %s, %s, %s, %s, %s,
            %s, %s, %s,
            %s, %s, %s,
            %s, %s, %s, %s,
            %s, %s, %s, %s,
            %s, %s, %s
        );
    """

    values = [
        patient_id,
        to_int(data.get("pregnancies")),
        to_int(data.get("births")),
        to_int(data.get("abortions")),
        to_int(data.get("sexual_partners")),
        to_int(data.get("menarche_age")),
        to_int(data.get("cycle_days")),
        to_bool(data.get("smoking")),
        to_bool(data.get("vaccinated_hpv")),
        to_str(data.get("education_level")),
        to_str(data.get("marital_status")),
        to_int(data.get("age_sex_start")),
        to_int(data.get("num_pap")),
        to_date(data.get("last_exam")),
        to_bool(data.get("has_children")),
        to_bool(data.get("early_detection")),
        to_float(data.get("weight")),
        to_float(data.get("height")),
        to_int(data.get("pressure_level")),
        to_str(data.get("blood_group")),
        to_bool(data.get("contraceptive_use")),
        to_bool(data.get("alcohol")),
        to_bool(data.get("active_life")),
    ]

    conn = get_connection()
    try:
        with conn.cursor() as cur:
            cur.execute(query, values)
            conn.commit()
    finally:
        conn.close()




def get_patient_detail(patient_id):
    query = "SELECT * FROM patients WHERE id = %s"
    conn = get_connection()
    try:
        with conn.cursor() as cur:
            cur.execute(query, (patient_id,))
            row = cur.fetchone()
            if row:
                return {
                    "id": row[0],
                    "first_name": row[1],
                    "last_name": row[2],
                    "birthdate": row[3],
                    "phone": row[4],
                    "address": row[5],
                    "national_doc": row[6],
                    "weight": row[7],
                    "height": row[8],
                    "pressure_level": row[9],
                    "blood_group": row[10],
                    "has_children": row[11],
                    "early_detection": row[12],
                    "marital_status": row[13],
                    "menarche_age": row[14],
                    "cycle_days": row[15],
                    "pregnancies": row[16],
                    "births": row[17],
                    "abortions": row[18],
                    "contraceptive_use": row[19],
                    "anticonceptive_type": row[20],
                    "smoking": row[21],
                    "alcohol": row[22],
                    "sexual_activity": row[23],
                    "sexual_partners": row[24],
                    "active_life": row[25],
                    "clinical_notes": row[26],
                    "created_at": row[27].isoformat() if row[27] else None,
                }
            return None
    finally:
        conn.close()

        
# Paso 1: Agregar la consulta SQL en `queries.py`
def delete_patient_by_id(patient_id):
    conn = get_connection()
    try:
        with conn.cursor() as cur:
            # 1. Eliminar primero los datos clínicos (si existen)
            cur.execute("DELETE FROM clinical_info WHERE patient_id = %s", (patient_id,))

            # 2. Luego eliminar el paciente
            cur.execute("DELETE FROM patients WHERE id = %s", (patient_id,))

            conn.commit()
    finally:
        conn.close()


# backend/db/queries.py

def get_patient_with_clinical_data(patient_id):
    from backend.db.railway_client import get_connection

    query = """
        SELECT
            p.id, p.first_name, p.last_name, p.dni, p.birth_date, p.phone,
            p.address, p.created_by, p.created_by_codigo, p.record_code,
            c.g, c.p, c.a, c.sexual_partners, c.menarche_age, c.cycle_days,
            c.smoking, c.vaccinated_hpv, c.education_level, c.marital_status,
            c.age_sex_start, c.num_pap, c.has_children, c.early_detection,
            c.weight, c.height, c.blood_pressure, c.blood_type,
            c.uses_contraceptives, c.contraceptive_type, c.alcohol, c.sexual_activity,
            c.active_life, c.clinical_notes, c.occupation,
            c.family_income, c.prior_cc_diagnosis
        FROM patients p
        LEFT JOIN clinical_info c ON p.id = c.patient_id
        WHERE p.id = %s;
    """

    conn = get_connection()
    try:
        with conn.cursor() as cur:
            cur.execute(query, (patient_id,))
            row = cur.fetchone()
            if row:
                return {
                    "id": row[0],
                    "first_name": row[1],
                    "last_name": row[2],
                    "dni": row[3],
                    "birth_date": row[4].isoformat() if row[4] else None,
                    "phone": row[5],
                    "address": row[6],
                    "created_by": row[7],
                    "created_by_codigo": row[8],
                    "record_code": row[9],
                    "clinical_info": {
                        "pregnancies": row[10],
                        "births": row[11],
                        "abortions": row[12],
                        "sexual_partners": row[13],
                        "menarche_age": row[14],
                        "cycle_days": row[15],
                        "smoking": row[16],
                        "vaccinated_hpv": row[17],
                        "education_level": row[18],
                        "marital_status": row[19],
                        "age_sex_start": row[20],
                        "num_pap": row[21],
                        "has_children": row[22],
                        "early_detection": row[23],
                        "weight": float(row[24]) if row[24] is not None else None,
                        "height": float(row[25]) if row[25] is not None else None,
                        "blood_pressure": row[26],
                        "blood_type": row[27],
                        "uses_contraceptives": row[28],
                        "contraceptive_type": row[29],
                        "alcohol": row[30],
                        "sexual_activity": row[31],
                        "active_life": row[32],
                        "clinical_notes": row[33],
                        "occupation": row[34],
                        "family_income": row[35],
                        "prior_cc_diagnosis": row[36]
                    }
                }
            return None
    finally:
        conn.close()


 

from backend.db.railway_client import get_connection

def get_patient_by_uuid(patient_uuid):
    from backend.db.railway_client import get_connection

    query = """
        SELECT id, first_name, last_name, dni, birth_date, phone,
               address, created_by, created_by_codigo, record_code
        FROM patients
        WHERE id = %s;
    """

    conn = get_connection()
    try:
        with conn.cursor() as cur:
            cur.execute(query, (patient_uuid,))
            row = cur.fetchone()
            if row:
                return {
                    "id": row[0],
                    "first_name": row[1],
                    "last_name": row[2],
                    "dni": row[3],
                    "birth_date": row[4].isoformat() if row[4] else None,
                    "phone": row[5],
                    "address": row[6],
                    "created_by": row[7],
                    "created_by_codigo": row[8],
                    "record_code": row[9],
                }
            return None
    finally:
        conn.close()


def search_patients(query):
    sql = """
        SELECT id::text, first_name, last_name, dni, record_code
        FROM patients
        WHERE LOWER(first_name || ' ' || last_name) LIKE %s
           OR dni ILIKE %s
        LIMIT 10;
    """
    like_query = f"%{query.lower()}%"
    conn = get_connection()
    try:
        with conn.cursor() as cur:
            cur.execute(sql, (like_query, like_query))
            rows = cur.fetchall()
            return [
                {
                    "id": row[0],  # UUID como string
                    "first_name": row[1],
                    "last_name": row[2],
                    "dni": row[3],
                    "record_code": row[4],  # Solo visualización
                }
                for row in rows
            ]
    finally:
        conn.close()

# === Obtener el siguiente código incremental del examinador ===
def get_next_examiner_code():
    conn = get_connection()
    try:
        with conn.cursor() as cur:
            cur.execute("SELECT MAX(examiner_codigo) FROM exams")
            max_codigo = cur.fetchone()[0]
            return (max_codigo or 1000) + 1
    finally:
        conn.close()


# === Insertar nuevo examen con código incremental automático ===
def insert_exam(data, patient_id):
    from datetime import datetime
    from .queries import get_next_examiner_code
    from backend.db.railway_client import get_connection

    def to_date(value):
        try:
            return datetime.strptime(value, '%Y-%m-%d').date()
        except (ValueError, TypeError):
            return None

    def to_bool(value):
        if isinstance(value, bool):
            return value
        if isinstance(value, str):
            return value.lower() in ['true', '1', 'yes', 'on']
        if isinstance(value, int):
            return value == 1
        return False

    def to_str(value):
        return str(value).strip() if value else None

    def to_int(value):
        try:
            return int(value)
        except:
            return None

    # Obtener el código incremental del examinador si no se proporciona
    examiner_codigo = data.get("examiner_codigo")
    if examiner_codigo is None or str(examiner_codigo).strip() == "":
        examiner_codigo = get_next_examiner_code()
    else:
        examiner_codigo = to_int(examiner_codigo)

    query = """
        INSERT INTO exams (
            patient_id,
            date,
            fur,
            has_ets,
            ets,
            detalle_motivo,
            motivo_referencia,
            recent_sexual_activity,
            pap_done,
            pap_date,
            pap_result,
            examiner_id,
            examiner_codigo
        ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        RETURNING id;
    """

    values = [
        patient_id,
        datetime.utcnow(),
        to_date(data.get("fur")),
        to_bool(data.get("has_ets")),
        to_str(data.get("ets")),
        to_str(data.get("detalle_motivo")),
        to_str(data.get("motivo_referencia")),
        to_bool(data.get("recent_sexual_activity")),
        to_bool(data.get("pap_done")),
        to_date(data.get("pap_date")),
        to_str(data.get("pap_result")),
        to_str(data.get("examiner_id")),
        examiner_codigo
    ]

    conn = get_connection()
    try:
        with conn.cursor() as cur:
            cur.execute(query, values)
            exam_id = cur.fetchone()[0]
            conn.commit()
            return exam_id
    finally:
        conn.close()




def insert_patient_with_clinical_info(data):
    from datetime import datetime
    from backend.db.railway_client import get_connection

    def to_int(value):
        try:
            return int(value)
        except (ValueError, TypeError):
            return 0

    def to_float(value):
        try:
            return float(value)
        except (ValueError, TypeError):
            return 0.0

    def to_bool(value):
        if isinstance(value, bool):
            return value
        if isinstance(value, str):
            return value.lower() in ['true', '1', 'yes', 'on']
        if isinstance(value, int):
            return value == 1
        return False

    def to_str(value):
        return str(value).strip() if value else ""

    def to_date(value):
        try:
            return datetime.strptime(value, '%Y-%m-%d').date()
        except (ValueError, TypeError):
            return None

    from .queries import get_next_patient_code
    record_code = get_next_patient_code()

    patient_query = """
        INSERT INTO patients (
            first_name, last_name, birth_date, phone, record_code,
            created_by_codigo, created_at, dni, address
        ) VALUES (
            %s, %s, %s, %s, %s,
            %s, %s, %s, %s
        )
        RETURNING id;
    """
    patient_values = [
        to_str(data.get("first_name")),
        to_str(data.get("last_name")),
        to_date(data.get("birthdate")),
        to_str(data.get("phone")),
        record_code,
        int(data.get("created_by")) if data.get("created_by") else 1001,
        datetime.utcnow(),
        to_str(data.get("national_doc")),
        to_str(data.get("address"))
    ]

    conn = get_connection()
    try:
        with conn.cursor() as cur:
            cur.execute(patient_query, patient_values)
            patient_id = cur.fetchone()[0]

            g = to_int(data.get("pregnancies"))
            p = to_int(data.get("births"))
            a = to_int(data.get("abortions"))

            has_children = p > 0
            num_pap = 0  # Siempre 0 al registrar un nuevo paciente

            clinical_query = """
                INSERT INTO clinical_info (
                    patient_id, g, p, a, sexual_partners, menarche_age,
                    cycle_days, smoking, vaccinated_hpv,
                    education_level, marital_status, age_sex_start,
                    num_pap, has_children, early_detection,
                    weight, height, blood_pressure, blood_type,
                    uses_contraceptives, contraceptive_type,
                    alcohol, sexual_activity, active_life,
                    clinical_notes, occupation, family_income, prior_cc_diagnosis
                ) VALUES (
                    %s, %s, %s, %s, %s, %s,
                    %s, %s, %s,
                    %s, %s, %s,
                    %s, %s, %s,
                    %s, %s, %s, %s,
                    %s, %s,
                    %s, %s, %s,
                    %s, %s, %s, %s
                );
            """
            clinical_values = [
                patient_id,
                g, p, a,
                to_int(data.get("sexual_partners")),
                to_int(data.get("menarche_age")),
                to_int(data.get("cycle_days")),
                to_bool(data.get("smoking")),
                to_bool(data.get("vaccinated_hpv")),
                to_str(data.get("education_level")),
                to_str(data.get("marital_status")),
                to_int(data.get("age_sex_start")),
                num_pap,
                has_children,
                to_bool(data.get("early_detection")),
                to_float(data.get("weight")),
                to_float(data.get("height")),
                to_int(data.get("pressure_level")),
                to_str(data.get("blood_group")),
                to_bool(data.get("contraceptive_use")),
                to_str(data.get("anticonceptive_type")),
                to_bool(data.get("alcohol")),
                to_bool(data.get("sexual_activity")),
                to_bool(data.get("active_life")),
                to_str(data.get("clinical_notes")),
                to_str(data.get("occupation")),
                to_str(data.get("family_income")),
                to_bool(data.get("prior_cc_diagnosis"))
            ]

            cur.execute(clinical_query, clinical_values)
            conn.commit()
            return patient_id
    finally:
        conn.close()


def get_exams_by_patient_uuid(uuid):
    from backend.db.railway_client import get_connection

    query = """
        SELECT
            id,
            date,
            fur,
            has_ets,
            ets,
            detalle_motivo,
            motivo_referencia,
            recent_sexual_activity,
            pap_done,
            pap_date,
            pap_result
        FROM exams
        WHERE patient_id = %s
        ORDER BY date DESC;
    """

    conn = get_connection()
    try:
        with conn.cursor() as cur:
            cur.execute(query, (uuid,))
            rows = cur.fetchall()
            return [
                {
                    "id": str(row[0]),
                    "date": row[1].isoformat() if row[1] else None,
                    "fur": row[2].isoformat() if row[2] else None,
                    "has_ets": row[3],
                    "ets": row[4],
                    "detalle_motivo": row[5],
                    "motivo_referencia": row[6],
                    "recent_sexual_activity": row[7],
                    "pap_done": row[8],
                    "pap_date": row[9].isoformat() if row[9] else None,
                    "pap_result": row[10]
                }
                for row in rows
            ]
    finally:
        conn.close()


import uuid
from datetime import datetime
from backend.db.railway_client import get_connection

def insert_exam_image(exam_id: str, image_type: str, url: str):
    conn = get_connection()
    try:
        with conn.cursor() as cur:
            image_id = str(uuid.uuid4())
            uploaded_at = datetime.utcnow()

            cur.execute("""
                INSERT INTO images (id, exam_id, image_type, url, uploaded_at)
                VALUES (%s, %s, %s, %s, %s)
            """, (image_id, exam_id, image_type, url, uploaded_at))

            conn.commit()
            return image_id
    finally:
        conn.close()

def get_exam_details_by_id(exam_id):
    from backend.db.railway_client import get_connection

    query = """
        SELECT 
            e.id,
            e.patient_id,
            e.date AS exam_date,
            e.fur,
            e.has_ets,
            e.ets,
            e.detalle_motivo,
            e.motivo_referencia,
            e.recent_sexual_activity,
            e.pap_done,
            e.pap_date,
            e.pap_result,
            e.examiner_id,
            e.examiner_codigo,
            p.record_code AS patient_code
        FROM exams e
        JOIN patients p ON e.patient_id = p.id
        WHERE e.id = %s
    """

    conn = get_connection()
    try:
        with conn.cursor() as cur:
            cur.execute(query, (exam_id,))
            row = cur.fetchone()
            if not row:
                return None

            return {
                "id": str(row[0]),
                "patient_id": str(row[1]),
                "exam_date": row[2].isoformat() if row[2] else None,
                "fur": row[3].isoformat() if row[3] else None,
                "has_ets": row[4],
                "ets": row[5],
                "detalle_motivo": row[6],
                "motivo_referencia": row[7],
                "recent_sexual_activity": row[8],
                "pap_done": row[9],
                "pap_date": row[10].isoformat() if row[10] else None,
                "pap_result": row[11],
                "examiner_id": str(row[12]) if row[12] else None,
                "examiner_codigo": row[13],
                "patient_code": row[14]
            }
    finally:
        conn.close()



def get_exam_by_id(exam_id):
    query = """
        SELECT
            id, date, fur, has_ets, ets, detalle_motivo,
            motivo_referencia, recent_sexual_activity,
            pap_done, pap_date, pap_result
        FROM exams
        WHERE CAST(id AS TEXT) = %s;
    """
    conn = get_connection()
    try:
        with conn.cursor() as cur:
            cur.execute(query, (str(exam_id),))
            row = cur.fetchone()
            if row:
                return {
                    "id": row[0],
                    "examDate": row[1].isoformat() if row[1] else None,
                    "furDate": row[2].isoformat() if row[2] else None,
                    "has_ets": row[3],
                    "ets": row[4],
                    "detalle_motivo": row[5],
                    "motivo_referencia": row[6],
                    "recentIntercourse": row[7],
                    "pap_done": row[8],
                    "pap_date": row[9].isoformat() if row[9] else None,
                    "pap_result": row[10],
                }
            return None
    finally:
        conn.close()


# === Obtener imágenes y versiones asociadas a un examen ===

def get_exam_images_with_versions(exam_id):
    query = """
    SELECT 
        img.id AS image_id,
        img.url AS image_url,
        img.image_type,
        img.exam_id,
        img.uploaded_at,
        COALESCE(v.version_type, '') AS version_type,
        COALESCE(v.url, '') AS version_url,
        COALESCE(v.format, '') AS format
    FROM images img
    LEFT JOIN image_versions v ON img.id = v.image_id
    WHERE img.exam_id = %s
    """
    return fetch_all(query, (exam_id,))

def get_exam_by_uuid(uuid):
    from backend.db.railway_client import get_connection

    query = """
        SELECT
            id,
            patient_id,
            date,
            fur,
            has_ets,
            ets,
            detalle_motivo,
            motivo_referencia,
            recent_sexual_activity,
            pap_done,
            pap_date,
            pap_result,
            examiner_id,
            examiner_codigo
        FROM exams
        WHERE id = %s;
    """

    conn = get_connection()
    try:
        with conn.cursor() as cur:
            cur.execute(query, (str(uuid),))
            row = cur.fetchone()
            if not row:
                return None

            return {
                "id": str(row[0]),
                "patient_id": str(row[1]),
                "date": row[2].isoformat() if row[2] else None,
                "fur": row[3].isoformat() if row[3] else None,
                "has_ets": row[4],
                "ets": row[5],
                "detalle_motivo": row[6],
                "motivo_referencia": row[7],
                "recent_sexual_activity": row[8],
                "pap_done": row[9],
                "pap_date": row[10].isoformat() if row[10] else None,
                "pap_result": row[11],
                "examiner_id": str(row[12]) if row[12] else None,
                "examiner_codigo": row[13],
            }
    finally:
        conn.close()


def delete_exam_by_id(exam_id):
    # Paso 1: Buscar IDs de imágenes asociadas al examen
    image_ids_query = "SELECT id FROM images WHERE exam_id = %s"
    image_ids = fetch_all(image_ids_query, (str(exam_id),))  # fetch_all debe retornar lista de dicts o tuplas

    # Paso 2: Borrar versiones de cada imagen
    for image in image_ids:
        image_id = image["id"] if isinstance(image, dict) else image[0]
        delete_versions_query = "DELETE FROM image_versions WHERE image_id = %s"
        execute_query(delete_versions_query, (str(image_id),))

    # Paso 3: Borrar las imágenes del examen
    delete_images_query = "DELETE FROM images WHERE exam_id = %s"
    execute_query(delete_images_query, (str(exam_id),))

    # Paso 4: Borrar el examen
    delete_exam_query = "DELETE FROM exams WHERE id = %s"
    return execute_query(delete_exam_query, (str(exam_id),))


def fetch_images_by_exam(exam_id):
    query = """
        SELECT id, exam_id, image_type, url, uploaded_at
        FROM images
        WHERE exam_id = %s
        ORDER BY uploaded_at;
    """
    return fetch_all(query, (str(exam_id),))

def get_exam_images(exam_id):
    conn = get_connection()
    cursor = conn.cursor()

    # 1. Traer imágenes originales asociadas al examen
    query = """
        SELECT
            id,
            url,
            image_type,
            uploaded_at
        FROM images
        WHERE exam_id = %s
        ORDER BY uploaded_at ASC
    """
    cursor.execute(query, (exam_id,))
    results = cursor.fetchall()

    images = []

    # 2. Por cada imagen, buscar la versión segmentada en image_versions (si existe)
    for row in results:
        image_id = row[0]

        cursor.execute("""
            SELECT url FROM image_versions
            WHERE image_id = %s AND version_type = 'segmented'
            ORDER BY created_at DESC LIMIT 1
        """, (image_id,))
        seg_row = cursor.fetchone()
        segmented_url = seg_row[0] if seg_row else ""

        images.append({
            "id": image_id,
            "url": row[1],
            "segmented_url": segmented_url,
            "type": row[2],
            "uploaded_at": row[3].isoformat() if row[3] else ""
        })

    conn.close()
    return images


def get_full_exam_data(exam_id):
    conn = get_connection()
    cursor = conn.cursor()

    # 1. Consulta principal: examen + paciente + clínica
    query = """
    SELECT
        e.id AS exam_id,
        e.date AS exam_date,
        e.fur,
        e.ets,
        e.detalle_motivo,
        e.motivo_referencia,
        e.recent_sexual_activity,
        e.pap_done,
        e.pap_date,
        e.pap_result,
        e.examiner_id,
        e.examiner_codigo,
        p.id AS patient_id,
        p.record_code,
        p.first_name,
        p.last_name,
        p.dni,
        p.birth_date,
        p.address,
        p.phone,

        c.num_pap,
        c.occupation,
        c.family_income,
        c.prior_cc_diagnosis,
        c.contraceptive_type,
        c.sexual_activity,
        c.clinical_notes,

        c.marital_status,
        c.education_level,
        c.weight,
        c.height,
        c.blood_pressure,
        c.blood_type,
        c.early_detection,
        c.menarche_age,
        c.age_sex_start,
        c.sexual_partners,
        c.cycle_days,
        c.g,
        c.p,
        c.a,
        c.has_children,
        c.smoking,
        c.alcohol,
        c.active_life,
        c.vaccinated_hpv,
        c.uses_contraceptives
    FROM exams e
    JOIN patients p ON e.patient_id = p.id
    LEFT JOIN clinical_info c ON p.id = c.patient_id
    WHERE e.id = %s
    """
    cursor.execute(query, (exam_id,))
    row = cursor.fetchone()

    # 2. Consulta para hallazgos colposcópicos manuales (colpo_findings)
    findings_query = """
        SELECT 
            normal_epithelium,
            abnormal_changes_minor,
            abnormal_changes_major,
            iodine_positive,
            iodine_negative,
            suggestive_cancer,
            satisfactory_result,
            cervical_topography,
            miscellaneous_findings,
            diagnostic_impression
        FROM colpo_findings
        WHERE exam_id = %s
        LIMIT 1
    """
    cursor.execute(findings_query, (exam_id,))
    findings_row = cursor.fetchone()

    conn.close()

    # Procesar datos base
    if row is None:
        return None

    result = {
        "exam": {
            "id": row[0],
            "date": row[1].isoformat() if row[1] else None,
            "fur": row[2].isoformat() if row[2] else None,
            "has_ets": row[3],
            "referral_detail": row[4],
            "referral_reason": row[5],
            "recent_sex": row[6],
            "pap_done": row[7],
            "pap_date": row[8].isoformat() if row[8] else None,
            "pap_result": row[9],
            "examiner_id": row[10],
            "examiner_code": row[11]
        },
        "patient": {
            "id": row[12],
            "record_code": row[13],
            "first_name": row[14],
            "last_name": row[15],
            "dni": row[16],
            "birth_date": row[17].isoformat() if row[17] else None,
            "address": row[18],
            "phone": row[19]
        },
        "clinical": {
            "num_pap": row[20],
            "occupation": row[21],
            "family_income": row[22],
            "prior_cc_diagnosis": row[23],
            "contraceptive_type": row[24],
            "sexual_activity": row[25],
            "clinical_notes": row[26],
            "marital_status": row[27],
            "education_level": row[28],
            "weight": row[29],
            "height": row[30],
            "blood_pressure": row[31],
            "blood_type": row[32],
            "early_detection": row[33],
            "menarche_age": row[34],
            "age_sex_start": row[35],
            "sexual_partners": row[36],
            "cycle_days": row[37],
            "g": row[38],
            "p": row[39],
            "a": row[40],
            "has_children": row[41],
            "smoking": row[42],
            "alcohol": row[43],
            "active_life": row[44],
            "vaccinated_hpv": row[45],
            "uses_contraceptives": row[46]
        }
    }

    # 3. Procesar hallazgos manuales en formato compatible con PDF
    if findings_row:
        findings = {
            "normal_findings": bool(findings_row[0]),
            "squamous_epithelium": None,
            "columnar_epithelium": None,
            "normal_transformation_zone": None,
            "minor_changes": ["Presente"] if findings_row[1] else [],
            "major_changes": ["Presente"] if findings_row[2] else [],
            "iodine_test": [
                label for label, flag in zip(["Positiva", "Negativa"], [findings_row[3], findings_row[4]]) if flag
            ],
            "satisfactory_exam": findings_row[6] or "",
            "lesion_topography": findings_row[7] or "",
            "miscellaneous": findings_row[8] or "",
            "manual_diagnosis": findings_row[9] or ""
        }
    else:
        findings = {
            "normal_findings": False,
            "squamous_epithelium": None,
            "columnar_epithelium": None,
            "normal_transformation_zone": None,
            "minor_changes": [],
            "major_changes": [],
            "iodine_test": [],
            "satisfactory_exam": "",
            "lesion_topography": "",
            "miscellaneous": "",
            "manual_diagnosis": ""
        }

    # 4. Agregar imágenes asociadas al examen
    result["images"] = get_exam_images(exam_id)

    # 5. Agregar findings al resultado final
    result["findings"] = findings
        # 6. Agregar lesiones detectadas por IA (tabla lesion_detections)
    lesion_query = """
        SELECT
            ld.lesion_type,
            ld.severity_level,
            i.url
        FROM lesion_detections ld
        JOIN images i ON ld.image_id = i.id
        WHERE i.exam_id = %s
    """
    cursor = get_connection().cursor()
    cursor.execute(lesion_query, (exam_id,))
    lesion_rows = cursor.fetchall()
    cursor.connection.close()

    lesion_data = []
    for lesion in lesion_rows:
        lesion_data.append({
            "lesion_type": lesion[0],
            "severity_level": lesion[1],
            "image_url": lesion[2]
        })

    result["lesions"] = lesion_data
    # 7. Agregar plan clínico (esto debe agregarse al final de get_full_exam_data)
    result["clinical_plan"] = {
        "diagnosis": findings["manual_diagnosis"],
        "procedures": ["Biopsia dirigida", "Seguimiento colposcópico"],  # Puedes ajustar
        "recommendations": ["Evitar relaciones sexuales por 7 días", "Consultar en 1 mes"],
        "follow_up": "Revisión colposcópica en 6 meses",
        "examiner": f"{row[14]} {row[15]}",
        "code": row[11]
    }

    return result


import uuid
import hashlib
from datetime import datetime
from backend.db.railway_client import get_connection  # ✅ IMPORTACIÓN CORRECTA


def get_next_user_code():
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("SELECT MAX(codigo) FROM users")
    max_codigo = cur.fetchone()[0]
    conn.close()
    return (max_codigo or 1000) + 1

from datetime import datetime
import hashlib

def get_next_user_code():
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("SELECT MAX(codigo) FROM users")
    max_codigo = cur.fetchone()[0]
    conn.close()
    return (max_codigo or 1000) + 1


def insert_user(data):
    conn = get_connection()
    cur = conn.cursor()

    created_at = datetime.now()
    user_code = get_next_user_code()

    full_name = data['full_name']
    email = data['email']
    username = data['username']
    password_hash = hashlib.md5(data['password'].encode()).hexdigest()
    role_id = 2  # Médico
    is_active = True

    query = """
        INSERT INTO users (
            email,
            username,
            password_hash,
            full_name,
            role_id,
            created_at,
            is_active,
            codigo
        )
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
    """
    cur.execute(query, (
        email, username, password_hash, full_name,
        role_id, created_at, is_active, user_code
    ))

    conn.commit()
    conn.close()

def get_clinical_dashboard_summary(user_id):
        with connection.cursor() as cursor:
            # Total pacientes creados por el usuario
            cursor.execute("SELECT COUNT(*) FROM patients WHERE created_by = %s", [user_id])
            total_patients = cursor.fetchone()[0]

            # Total exámenes creados por el usuario
            cursor.execute("SELECT COUNT(*) FROM exams WHERE created_by = %s", [user_id])
            total_exams = cursor.fetchone()[0]

            # Total de predicciones (simularemos con cantidad de imágenes segmentadas por el usuario)
            cursor.execute("""
                SELECT COUNT(*) 
                FROM image_versions iv
                INNER JOIN images i ON iv.image_id = i.id
                INNER JOIN exams e ON i.exam_id = e.id
                WHERE iv.version_type = 'segmentation' AND e.created_by = %s
            """, [user_id])
            total_predictions = cursor.fetchone()[0]

            # Últimos 5 exámenes creados por el usuario
            cursor.execute("""
                SELECT p.first_name || ' ' || p.last_name AS patient_name,
                    e.exam_date,
                    'Completado' AS status,
                    COALESCE(e.ccv_history, 'Sin observaciones') AS notes
                FROM exams e
                INNER JOIN patients p ON e.patient_id = p.id
                WHERE e.created_by = %s
                ORDER BY e.exam_date DESC
                LIMIT 5
            """, [user_id])
            recent_exams = [
                {
                    "patientName": row[0],
                    "date": row[1].strftime("%Y-%m-%d") if row[1] else "",
                    "status": row[2],
                    "notes": row[3],
                    "avatar": f"https://ui-avatars.com/api/?name={'+'.join(row[0].split())}"
                }
                for row in cursor.fetchall()
            ]

            # Distribución de factores clínicos básicos
            factors = [
                ("ETS previas", "has_ets"),
                ("Vida sexual activa", "sexual_activity"),
                ("Uso de anticonceptivos", "uses_contraceptives"),
            ]

            clinical_stats = []
            for label, column in factors:
                cursor.execute(f"""
                    SELECT COUNT(*) FROM clinical_info
                    WHERE {column} = TRUE AND created_by = %s
                """, [user_id])
                value = cursor.fetchone()[0]

                # Total del mismo factor para calcular %
                cursor.execute("SELECT COUNT(*) FROM clinical_info WHERE created_by = %s", [user_id])
                total = cursor.fetchone()[0] or 1  # evitar división por cero

                percentage = int((value / total) * 100)
                clinical_stats.append({
                    "label": label,
                    "value": value,
                    "percentage": percentage
                })

            return {
                "totalPatients": total_patients,
                "totalExams": total_exams,
                "totalPredictions": total_predictions,
                "recentExams": recent_exams,
                "clinicalStats": clinical_stats
            }


def get_image_by_id(image_id):
    query = """
        SELECT id, exam_id, url, image_type, uploaded_at
        FROM images
        WHERE id = %s
    """
    return fetch_one(query, (image_id,))


def delete_exam_image(exam_id: int, filename: str):
    query = """
    DELETE FROM images
    WHERE exam_id = %s AND url LIKE %s
    """
    params = (exam_id, f"%/{filename}")
    return query, params

def get_patient_uuid_by_record_code(codigo):
    sql = "SELECT id FROM patients WHERE record_code = %s;"
    conn = get_connection()
    try:
        with conn.cursor() as cur:
            cur.execute(sql, (codigo,))
            row = cur.fetchone()
            return row[0] if row else None
    finally:
        conn.close()

def search_patients_by_text(query):
    query = f"%{query}%"
    sql = """
        SELECT id, first_name, last_name, dni, record_code
        FROM patients
        WHERE first_name ILIKE %s
           OR last_name ILIKE %s
           OR dni ILIKE %s
           OR record_code ILIKE %s
        ORDER BY last_name
        LIMIT 10;
    """
    return fetch_all(sql, (query, query, query, query))

def get_exams_by_patient_id(patient_id):
    sql = """
        SELECT id, exam_code, exam_date
        FROM exams
        WHERE patient_id = %s
        ORDER BY exam_date DESC
    """
    return execute_query(sql, (patient_id,), fetchall=True)

def search_patients_by_name_or_dni(query):
    query = f"%{query.lower()}%"
    sql = """
        SELECT id, first_name, last_name, dni
        FROM patients
        WHERE LOWER(first_name) LIKE %s
           OR LOWER(last_name) LIKE %s
           OR dni LIKE %s
        LIMIT 10
    """
    return execute_query(sql, (query, query, query)) 

from backend.db.railway_client import fetch_all  # ✅ IMPORTACIÓN CORRECTA

def get_patient_exams(patient_id):
    sql = """
        SELECT * FROM exams
        WHERE patient_id = %s
        ORDER BY date DESC
    """
    return fetch_all(sql, (str(patient_id),))  # ✅ ESTA ES LA CORRECCIÓN CLAVE

