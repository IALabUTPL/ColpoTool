// src/components/patients/PatientInfoGrid.tsx

import React from "react";

interface PatientInfoGridProps {
  firstName: string;
  lastName: string;
  birthdate: string;
  phone: string;
  dni: string;
  recordCode: string;
  address: string;
  weight?: number;
  height?: number;
  bloodGroup?: string;
  maritalStatus?: string;
  hasChildren?: boolean;
  earlyDetection?: boolean;
  educationLevel?: string;
}

const PatientInfoGrid: React.FC<PatientInfoGridProps> = ({
  firstName,
  lastName,
  birthdate,
  phone,
  dni,
  recordCode,
  address,
  weight,
  height,
  bloodGroup,
  maritalStatus,
  hasChildren,
  earlyDetection,
  educationLevel,
}) => {
  return (
    <div className="card mb-4">
      <div className="card-header">
        <h3 className="card-title">Información Básica del Paciente</h3>
      </div>
      <div className="card-body">
        <div className="row g-3">
          <div className="col-md-3">
            <div className="text-muted">Nombre</div>
            <div className="fw-bold">{firstName}</div>
          </div>
          <div className="col-md-3">
            <div className="text-muted">Apellido</div>
            <div className="fw-bold">{lastName}</div>
          </div>
          <div className="col-md-3">
            <div className="text-muted">Fecha de nacimiento</div>
            <div className="fw-bold">{birthdate}</div>
          </div>
          <div className="col-md-3">
            <div className="text-muted">Teléfono</div>
            <div className="fw-bold">{phone}</div>
          </div>
          <div className="col-md-3">
            <div className="text-muted">Cédula</div>
            <div className="fw-bold">{dni}</div>
          </div>
          <div className="col-md-6">
            <div className="text-muted">Dirección</div>
            <div className="fw-bold">{address}</div>
          </div>
          <div className="col-md-3">
            <div className="text-muted">Código de Historia Clínica</div>
            <div className="fw-bold">{recordCode}</div>
          </div>
          {weight !== undefined && (
            <div className="col-md-2">
              <div className="text-muted">Peso</div>
              <div className="fw-bold">{weight} kg</div>
            </div>
          )}
          {height !== undefined && (
            <div className="col-md-2">
              <div className="text-muted">Talla</div>
              <div className="fw-bold">{height} cm</div>
            </div>
          )}
          {bloodGroup && (
            <div className="col-md-2">
              <div className="text-muted">Grupo sanguíneo</div>
              <div className="badge bg-blue-lt text-blue fw-bold">{bloodGroup}</div>
            </div>
          )}
          {maritalStatus && (
            <div className="col-md-3">
              <div className="text-muted">Estado civil</div>
              <div className="fw-bold">{maritalStatus}</div>
            </div>
          )}
          {educationLevel && (
            <div className="col-md-3">
              <div className="text-muted">Nivel de educación</div>
              <div className="fw-bold">{educationLevel}</div>
            </div>
          )}
          <div className="col-md-2">
            <div className="text-muted">¿Tiene hijos?</div>
            <div className={`badge ${hasChildren ? 'bg-green-lt text-green' : 'bg-red-lt text-red'}`}>
              {hasChildren ? 'Sí' : 'No'}
            </div>
          </div>
          <div className="col-md-3">
            <div className="text-muted">Participa en detección temprana</div>
            <div className={`badge ${earlyDetection ? 'bg-green-lt text-green' : 'bg-yellow-lt text-yellow'}`}>
              {earlyDetection ? 'Sí' : 'No'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientInfoGrid;
