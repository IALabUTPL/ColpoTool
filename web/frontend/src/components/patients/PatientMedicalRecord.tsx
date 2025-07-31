import React, { useEffect, useState } from "react";
import axios from "axios";

import PatientInfoGrid from "./PatientInfoGrid";
import PatientDetailsAccordion from "./PatientDetailsAccordion";
import PatientExamsTable from "./PatientExamsTable";

interface ClinicalInfo {
  pregnancies?: number;
  births?: number;
  abortions?: number;
  sexual_partners?: number;
  menarche_age?: number;
  cycle_days?: number;
  smoking?: boolean;
  vaccinated_hpv?: boolean;
  education_level?: string;
  marital_status?: string;
  age_sex_start?: number;
  num_pap?: number;
  last_exam?: string;
  has_children?: boolean;
  early_detection?: boolean;
  weight?: number;
  height?: number;
  blood_type?: string;
  uses_contraceptives?: boolean;
  contraceptive_type?: string;
  alcohol?: boolean;
  sexual_activity?: boolean;
  active_life?: boolean;
  clinical_notes?: string;
  fur?: string;
  ets?: boolean;
}

interface PatientData {
  id: string;
  first_name: string;
  last_name: string;
  birth_date: string;
  phone: string;
  dni: string;
  address: string;
  weight?: number;
  height?: number;
  blood_type?: string;
  marital_status?: string;
  has_children?: boolean;
  early_detection?: boolean;
  education_level?: string;
  clinical_info?: ClinicalInfo;
  record_code: string;
  exams?: any[];
  created_by?: string | null;
  created_by_codigo?: number | null;
}

interface Props {
  codigo: string;
}

const PatientMedicalRecord: React.FC<Props> = ({ codigo }) => {
  const [patient, setPatient] = useState<PatientData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  if (!codigo) return;

  const fetchPatient = async () => {
    setLoading(true);
    console.log("[🧪] Cargando datos del paciente con UUID:", codigo);
    try {
      const response = await axios.get(`/api/patients/id/${codigo}`);
      const data = response.data;

      if (!data || !data.id || !data.first_name) {
        console.warn("⚠️ Datos incompletos o inválidos:", data);
        setPatient(null);
      } else {
        const fullPatient: PatientData = {
          id: data.id,
          first_name: data.first_name,
          last_name: data.last_name,
          dni: data.dni,
          birth_date: data.birth_date,
          address: data.address,
          phone: data.phone,
          record_code: data.record_code,
          created_by: data.created_by,
          created_by_codigo: data.created_by_codigo,
          clinical_info: data.clinical_info || null,
          exams: data.exams || [],
        };
        setPatient(fullPatient);
        console.log("[✅] Datos del paciente cargados correctamente:", fullPatient);
      }
    } catch (error) {
      console.error("❌ Error al cargar los datos del paciente:", error);
      setPatient(null);
    } finally {
      setLoading(false);
    }
  };

  fetchPatient();
}, [codigo]);


  if (loading) {
    return (
      <div className="page-body container-xl mt-4">
        <div className="alert alert-info">[🔄] Cargando datos del paciente...</div>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="page-body container-xl mt-4">
        <div className="alert alert-danger">[❌] No se encontró el paciente.</div>
      </div>
    );
  }

  return (
    <div className="page-body container-xl mt-4">
      <div className="alert alert-success mb-3">
        [📄] Mostrando ficha de <strong>{patient.first_name} {patient.last_name}</strong> ({patient.record_code})
      </div>

      <PatientInfoGrid
        firstName={patient.first_name}
        lastName={patient.last_name}
        birthdate={patient.birth_date}
        phone={patient.phone}
        dni={patient.dni}
        address={patient.address}
        weight={patient.weight}
        height={patient.height}
        bloodGroup={patient.blood_type}
        maritalStatus={patient.marital_status}
        hasChildren={patient.has_children}
        earlyDetection={patient.early_detection}
        educationLevel={patient.education_level}
        recordCode={patient.record_code}
      />

      <PatientDetailsAccordion
        gynecologicInfo={{
          menarcheAge: patient.clinical_info?.menarche_age,
          menstrualCycleDays: patient.clinical_info?.cycle_days,
          pregnancies: patient.clinical_info?.pregnancies,
          births: patient.clinical_info?.births,
          abortions: patient.clinical_info?.abortions,
          usesContraceptives: patient.clinical_info?.uses_contraceptives,
          contraceptiveType: patient.clinical_info?.contraceptive_type,
          fur: patient.clinical_info?.fur,
          lastPap: patient.clinical_info?.last_exam,
          numPap: patient.clinical_info?.num_pap,
        }}
        lifestyleInfo={{
          smoking: patient.clinical_info?.smoking,
          alcohol: patient.clinical_info?.alcohol,
          sexualActivity: patient.clinical_info?.sexual_activity,
          sexualPartners: patient.clinical_info?.sexual_partners,
          activeLife: patient.clinical_info?.active_life,
          ageSexStart: patient.clinical_info?.age_sex_start,
          ets: patient.clinical_info?.ets,
        }}
        observations={patient.clinical_info?.clinical_notes}
      />

      <PatientExamsTable
        exams={patient.exams || []}
        patientId={patient.id}
        patientInfo={{
          name: patient.first_name,
          lastName: patient.last_name,
          id: patient.dni,
          dob: patient.birth_date,
        }}
      />
    </div>
  );
};

export default PatientMedicalRecord;
