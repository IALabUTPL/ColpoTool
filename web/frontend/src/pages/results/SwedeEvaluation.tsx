import React, { useState } from "react";
import SwedeTable from "../../components/results/SwedeEvaluation/SwedeTable";
import SwedeScoreSummary from "../../components/results/SwedeEvaluation/SwedeScoreSummary";

const SwedeEvaluationPage: React.FC = () => {
  const [totalScore, setTotalScore] = useState(6); // se puede conectar a la tabla dinámicamente luego

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Evaluación Clínica - Escala Swede</h1>
      <SwedeTable />
      <SwedeScoreSummary totalScore={totalScore} />
    </div>
  );
};

export default SwedeEvaluationPage;