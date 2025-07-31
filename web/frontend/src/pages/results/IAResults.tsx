/* File: D:\\Users\\Isra\\Documents\\COLPOTOOL\\ColpoTool\\web\\frontend\\src\\pages\\results\\IAResults.tsx */

import React from "react";
import IAResultsSummary from "../../components/results/IAResults/IAResultsSummary";

const IAResultsPage: React.FC = () => {
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Resultados de Inteligencia Artificial</h1>
      <IAResultsSummary />
    </div>
  );
};

export default IAResultsPage;