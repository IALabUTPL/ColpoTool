import React from "react";

interface PatientInfoCardProps {
  name?: string;
  age?: number;
  idNumber?: string;
  examDate?: string;
  clinicalHistory?: string;
}

const PatientInfoCard: React.FC<PatientInfoCardProps> = ({
  name = "María Fernanda López",
  age = 34,
  idNumber = "0912345678",
  examDate = "2025-06-10",
  clinicalHistory = "Paciente con antecedentes de VPH positivo. Examen físico con presencia de lesiones acetoblancas en zona de transformación tipo 2.",
}) => {
  return (
    <div className="card shadow-sm border rounded-xl p-4 mb-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-700 mb-1">Nombre del Paciente:</h2>
          <p className="text-base text-gray-900">{name}</p>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-gray-700 mb-1">Edad:</h2>
          <p className="text-base text-gray-900">{age} años</p>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-gray-700 mb-1">Número de Identificación:</h2>
          <p className="text-base text-gray-900">{idNumber}</p>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-gray-700 mb-1">Fecha del Examen:</h2>
          <p className="text-base text-gray-900">{examDate}</p>
        </div>

        <div className="sm:col-span-2">
          <h2 className="text-lg font-semibold text-gray-700 mb-1">Resumen Clínico:</h2>
          <p className="text-base text-gray-900 text-justify">{clinicalHistory}</p>
        </div>
      </div>
    </div>
  );
};

export default PatientInfoCard;