import React from "react";

interface Props {
  totalScore: number;
}

const SwedeScoreSummary: React.FC<Props> = ({ totalScore }) => {
  const riskLevel =
    totalScore >= 8 ? "Alto" : totalScore >= 5 ? "Intermedio" : "Bajo";

  const style =
    totalScore >= 8
      ? "bg-red-100 text-red-800 border-red-400"
      : totalScore >= 5
      ? "bg-yellow-100 text-yellow-800 border-yellow-400"
      : "bg-green-100 text-green-800 border-green-400";

  return (
    <div className={`mt-6 p-4 border-l-4 rounded ${style}`}>
      <h4 className="text-lg font-bold mb-1">Resumen de Evaluación Swede</h4>
      <p>Puntuación total: <strong>{totalScore}</strong> / 10</p>
      <p>Nivel de riesgo estimado: <strong>{riskLevel}</strong></p>
    </div>
  );
};

export default SwedeScoreSummary;
