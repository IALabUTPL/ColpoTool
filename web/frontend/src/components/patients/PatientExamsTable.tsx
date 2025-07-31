// src/components/patients/PatientExamsTable.tsx

import React from "react";
import { Link, useNavigate } from "react-router-dom";


interface ExamRecord {
  id: number;
  date: string;
  lesionsDetected: number;
  riskFactors: number;
  cancerRiskPrediction: boolean;
  indication?: string;
}

interface PatientInfo {
  name: string;
  lastName: string;
  id: string;
  dob: string;
}

interface PatientExamsTableProps {
  exams: ExamRecord[];
  patientId: string;
  patientInfo: PatientInfo;
}

const PatientExamsTable: React.FC<PatientExamsTableProps> = ({
  exams,
  patientId,
  patientInfo,
}) => {
  const navigate = useNavigate();

  const handleDownloadReport = async (exam: ExamRecord) => {
  try {
    const response = await fetch(`/api/exams/${exam.id}/pdf/`, {

      method: "GET",
    });

    if (!response.ok) {
      throw new Error("No se pudo generar el PDF");
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);

    // Abre el PDF en una nueva pestaña
    window.open(url, "_blank");
  } catch (error) {
    console.error("Error al generar el reporte PDF:", error);
    alert("Ocurrió un error al generar el PDF.");
  }
};


  const handleRegisterExam = () => {
  if (patientId) {
    navigate(`/exams/register/${patientId}`);
  } else {
    console.warn("⚠️ No se pudo registrar examen: patientId no disponible.");
    navigate("/exams/register");
  }
};
const handleDeleteExam = async (examId: number) => {
  const confirmDelete = window.confirm("¿Seguro que deseas eliminar este examen?");
  if (!confirmDelete) return;

  try {
    const response = await fetch(`/api/exams/delete/${examId}/`, {
      method: "DELETE",
    });

    if (response.ok) {
      window.location.reload(); // Recarga para actualizar tabla
    } else {
      console.error("❌ Error al eliminar examen.");
    }
  } catch (error) {
    console.error("❌ Error:", error);
  }
};

  return (
    <div className="card">
      <div className="card-header d-flex justify-content-between align-items-center">
        <h3 className="card-title mb-0">Exámenes Colposcópicos Realizados</h3>
        <button onClick={handleRegisterExam} className="btn btn-primary">
          Registrar Examen
        </button>
      </div>
      <div className="table-responsive">
        <table className="table table-vcenter card-table table-striped">
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Lesiones encontradas</th>
              <th>Factores de riesgo</th>
              <th>Riesgo de cáncer</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {exams.length > 0 ? (
              exams.map((exam) => (
                <tr key={exam.id}>
                  <td>{exam.date}</td>
                  <td>{exam.lesionsDetected}</td>
                  <td>{exam.riskFactors}</td>
                  <td>
                    <span
                      className={`badge ${
                        exam.cancerRiskPrediction
                          ? "bg-red-lt text-red"
                          : "bg-green-lt text-green"
                      }`}
                    >
                      {exam.cancerRiskPrediction ? "Sí" : "No"}
                    </span>
                  </td>
                  <td className="d-flex gap-2 flex-wrap">
                    <Link
                      to={`/exams/details/${exam.id}`}
                      className="btn btn-sm btn-outline-primary"
                    >
                      Ver
                    </Link>
                    <Link
                      to={`/results/view/${exam.id}`}
                      className="btn btn-sm btn-outline-success"
                    >
                      Resultados
                    </Link>
                    <button
                      onClick={() => handleDownloadReport(exam)}
                      className="btn btn-sm btn-outline-secondary"
                    >
                      PDF
                    </button>
                    <button
                      onClick={() => handleDeleteExam(exam.id)}
                      className="btn btn-sm btn-outline-danger"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="text-center text-muted">
                  No hay exámenes registrados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PatientExamsTable;
