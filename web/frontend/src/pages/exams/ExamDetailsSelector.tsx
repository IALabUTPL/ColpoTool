import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface Patient {
  id: string;
  first_name: string;
  last_name: string;
  dni: string;
  record_code: string;
}

interface Exam {
  id: string;
  exam_code: string;
  exam_date: string;
}

const ExamDetailsSelector: React.FC = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Patient[]>([]);
  const [selected, setSelected] = useState<Patient | null>(null);
  const [exams, setExams] = useState<Exam[]>([]);
  const [loadingExams, setLoadingExams] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const navigate = useNavigate();

  // 🔍 Buscar pacientes por nombre o cédula
  useEffect(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    if (query.trim() === "") {
      console.log("⚠️ Campo de búsqueda vacío");
      setResults([]);
      return;
    }

    timeoutRef.current = setTimeout(async () => {
      try {
        console.log("🔍 Enviando búsqueda con query:", query);
        const res = await axios.get(`/api/patients/search/?q=${query}`);
        console.log("✅ Resultados recibidos:", res.data);
        setResults(res.data);
      } catch (error) {
        console.error("❌ Error en búsqueda de pacientes:", error);
        setResults([]);
      }
    }, 300);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [query]);

  // 🧬 Seleccionar paciente y cargar sus exámenes
  const handleSelectPatient = async (patient: Patient) => {
    console.log("👆 Paciente seleccionado:", patient);
    setSelected(patient);
    setExams([]);
    setLoadingExams(true);

    try {
      const response = await axios.get(`/api/patients/${patient.id}/exams/`);
      console.log("📋 Exámenes recibidos:", response.data);

      const mappedExams: Exam[] = response.data.map((exam: any) => ({
        id: exam.id,
        exam_code: exam.exam_code || exam.examiner_codigo || "—",
        exam_date: exam.exam_date || exam.date || "—",
      }));

      setExams(mappedExams);
    } catch (error) {
      console.error("❌ Error al cargar exámenes:", error);
      setExams([]);
    } finally {
      setLoadingExams(false);
    }
  };

  return (
    <div className="page-body container-xl mt-4">
      <div className="card shadow-sm">
        <div className="card-body">
          <h3 className="card-title mb-4">🧬 Buscar Detalle de Examen</h3>

          {/* 🔍 Input de búsqueda */}
          <input
            type="text"
            className="form-control mb-3"
            placeholder="Nombre o cédula del paciente"
            value={query}
            onChange={(e) => {
              console.log("⌨️ Escribiendo:", e.target.value);
              setQuery(e.target.value);
            }}
          />

          {/* 📄 Resultados de pacientes */}
          {results.length > 0 && (
            <ul className="list-group mb-3">
              {results.map((patient) => (
                <li
                  key={patient.id}
                  className={`list-group-item list-group-item-action ${
                    selected?.id === patient.id ? "active" : ""
                  }`}
                  style={{ cursor: "pointer" }}
                  onClick={() => handleSelectPatient(patient)}
                >
                  {patient.first_name} {patient.last_name} ({patient.dni}) —{" "}
                  <strong>{patient.record_code}</strong>
                </li>
              ))}
            </ul>
          )}

          {/* 📋 Lista de exámenes */}
          {selected && (
            <>
              <h4 className="mb-3">🧪 Exámenes registrados</h4>
              {loadingExams ? (
                <p className="text-muted">Cargando exámenes...</p>
              ) : exams.length === 0 ? (
                <p className="text-danger">No se encontraron exámenes.</p>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th scope="col">#</th>
                        <th scope="col">Código del Examen</th>
                        <th scope="col">Fecha</th>
                        <th scope="col">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {exams.map((exam, index) => (
                        <tr key={exam.id}>
                          <th scope="row">{index + 1}</th>
                          <td>{exam.exam_code}</td>
                          <td>{exam.exam_date}</td>
                          <td>
                            <button
                              className="btn btn-sm btn-outline-primary"
                              onClick={() => navigate(`/exams/details/${exam.id}`)}
                            >
                              Ver detalle
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExamDetailsSelector;
