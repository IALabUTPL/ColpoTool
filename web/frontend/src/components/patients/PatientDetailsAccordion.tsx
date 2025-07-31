import React from "react";
import AccordionCard from "../shared/AccordionCard";
import { PatientDetailsAccordionProps } from "../../types/types";

const PatientDetailsAccordion: React.FC<PatientDetailsAccordionProps> = ({
  gynecologicInfo,
  lifestyleInfo,
  observations,
}) => {
  const renderBooleanBadge = (value?: boolean) => (
    <span className={`badge ${value ? "bg-green-lt text-green" : "bg-red-lt text-red"}`}>
      {value ? "Sí" : "No"}
    </span>
  );

  const renderListItem = (label: string, value: any) => (
    <li className="list-group-item d-flex justify-content-between align-items-center">
      <span className="text-muted">{label}</span>
      <span className="fw-bold">
        {typeof value === "boolean" ? renderBooleanBadge(value) : value ?? "-"}
      </span>
    </li>
  );

  return (
    <AccordionCard title="Detalles Clínicos del Paciente">
      <div className="row g-3">
        {/* Información Ginecológica */}
        <div className="col-md-4">
          <div className="card">
            <div className="card-header">
              <h4 className="card-title">Información Ginecológica</h4>
            </div>
            <ul className="list-group list-group-flush">
              {renderListItem("Edad de menarquía", gynecologicInfo.menarcheAge)}
              {renderListItem("Duración del ciclo (días)", gynecologicInfo.menstrualCycleDays)}
              {renderListItem("Embarazos", gynecologicInfo.pregnancies)}
              {renderListItem("Partos", gynecologicInfo.births)}
              {renderListItem("Abortos", gynecologicInfo.abortions)}
              {renderListItem("Usa anticonceptivos", gynecologicInfo.usesContraceptives)}
              {renderListItem("Tipo de anticonceptivo", gynecologicInfo.contraceptiveType)}
              {renderListItem("Fecha de última menstruación", gynecologicInfo.fur)}
              {renderListItem("Fecha del último PAP", gynecologicInfo.lastPap)}
              {renderListItem("Número de PAP realizados", gynecologicInfo.numPap)}
            </ul>
          </div>
        </div>

        {/* Estilo de Vida y Riesgo */}
        <div className="col-md-4">
          <div className="card">
            <div className="card-header">
              <h4 className="card-title">Estilo de Vida y Factores de Riesgo</h4>
            </div>
            <ul className="list-group list-group-flush">
              {renderListItem("Fuma", lifestyleInfo.smoking)}
              {renderListItem("Consume alcohol", lifestyleInfo.alcohol)}
              {renderListItem("Vacunada contra VPH", lifestyleInfo.vaccinatedHpv)}
              {renderListItem("Vida sexual activa", lifestyleInfo.sexualActivity)}
              {renderListItem("Número de parejas sexuales", lifestyleInfo.sexualPartners)}
              {renderListItem("Edad inicio vida sexual", lifestyleInfo.ageSexStart)}
              {renderListItem("Actividad física regular", lifestyleInfo.activeLife)}
              {renderListItem("ETS previas", lifestyleInfo.ets)}
            </ul>
          </div>
        </div>

        {/* Observaciones médicas */}
        <div className="col-md-4">
          <div className="card">
            <div className="card-header">
              <h4 className="card-title">Observaciones Médicas</h4>
            </div>
            <div className="card-body">
              <div className="text-muted mb-2">Notas del profesional</div>
              <div className="fw-bold">
                {observations ?? "Sin observaciones registradas."}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AccordionCard>
  );
};

export default PatientDetailsAccordion;
