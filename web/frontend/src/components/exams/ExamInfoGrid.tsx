import React from "react";

interface ExamInfoProps {
  examDate: any;
  furDate: any;
  indication: any;
  ccvHistory: any;
  ets: any;
  planning: any;
  recentSexualIntercourse: any;
  priorDiagnosis: any;
  papDone: any;
  papDate: any;
  papResult: any;
}

const ExamInfoGrid: React.FC<ExamInfoProps> = ({
  examDate,
  furDate,
  indication,
  ccvHistory,
  ets,
  planning,
  recentSexualIntercourse,
  priorDiagnosis,
  papDone,
  papDate,
  papResult
}) => {
  const renderBadges = (data?: string) => {
    if (!data) return <span className="text-muted">No registrado</span>;
    return data.split(",").map((item, index) => (
      <span key={index} className="badge bg-blue-lt me-1 mb-1">
        {item.trim()}
      </span>
    ));
  };


  return (
    <div className="mb-4">
      <div className="row g-3">
        <div className="col-md-3">
          <strong>📅 Fecha del examen:</strong><br />
          <span>{examDate || <span className="text-muted">No registrada</span>}</span>
        </div>

        <div className="col-md-3">
          <strong>📅 FUR:</strong><br />
          <span>{furDate || <span className="text-muted">No registrada</span>}</span>
        </div>

        <div className="col-md-3">
          <strong>🩺 Indicación:</strong><br />
          <span>{indication || <span className="text-muted">No registrada</span>}</span>
        </div>

        <div className="col-md-3">
          <strong>❤️ Relaciones sexuales recientes:</strong><br />
          <span className={`badge ${recentSexualIntercourse ? "bg-green" : "bg-red"}`}>
            {recentSexualIntercourse ? "Sí" : "No"}
          </span>
        </div>
        <div className="col-md-6">
          <strong>🦠 ETS:</strong><br />
          {renderBadges(ets)}
        </div>

        <div className="col-md-6">
          <strong>🛡️ Métodos de planificación:</strong><br />
          {renderBadges(planning)}
        </div>

        <div className="col-md-12">
          <strong>📋 Historia CCV:</strong>
          <div className="alert alert-info mt-1" style={{ whiteSpace: "pre-wrap" }}>
            {ccvHistory || "No registrada"}
          </div>
        </div>

        

        
      </div>
    </div>
  );
};

export default ExamInfoGrid;
