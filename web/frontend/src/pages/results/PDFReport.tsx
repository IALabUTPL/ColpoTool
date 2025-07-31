import React from "react";
import PDFExportForm from "../../components/results/PDFReport/PDFExportForm";

const PDFReportPage: React.FC = () => {
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Exportación de Reporte en PDF</h1>
      <PDFExportForm />
    </div>
  );
};

export default PDFReportPage;
