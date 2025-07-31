import React, { useState } from "react";

const PDFExportForm: React.FC = () => {
  const [patientId, setPatientId] = useState("");
  const [examId, setExamId] = useState("");
  const [includeIA, setIncludeIA] = useState(true);
  const [includeSwede, setIncludeSwede] = useState(true);
  const [includeImages, setIncludeImages] = useState(true);

  const handleGeneratePDF = () => {
    console.log({
      patientId,
      examId,
      includeIA,
      includeSwede,
      includeImages,
    });
  };

  return (
    <div className="p-6 bg-white border rounded-xl shadow-md max-w-xl">
      <h3 className="text-xl font-bold mb-4">Generar Reporte PDF</h3>

      <div className="mb-4">
        <label className="block font-medium">ID del Paciente</label>
        <input
          type="text"
          value={patientId}
          onChange={(e) => setPatientId(e.target.value)}
          className="w-full border px-3 py-2 rounded shadow-sm"
          placeholder="Ej. 0912345678"
        />
      </div>

      <div className="mb-4">
        <label className="block font-medium">ID del Examen</label>
        <input
          type="text"
          value={examId}
          onChange={(e) => setExamId(e.target.value)}
          className="w-full border px-3 py-2 rounded shadow-sm"
          placeholder="Ej. 2025-EXM-001"
        />
      </div>

      <div className="mb-4">
        <label className="font-medium">Incluir en el reporte:</label>
        <div className="mt-2 space-y-1">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={includeIA}
              onChange={() => setIncludeIA(!includeIA)}
              className="accent-blue-600"
            />
            Resultados de IA
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={includeSwede}
              onChange={() => setIncludeSwede(!includeSwede)}
              className="accent-blue-600"
            />
            Evaluación Swede
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={includeImages}
              onChange={() => setIncludeImages(!includeImages)}
              className="accent-blue-600"
            />
            Imágenes colposcópicas
          </label>
        </div>
      </div>

      <button
        onClick={handleGeneratePDF}
        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
      >
        Generar PDF
      </button>
    </div>
  );
};

export default PDFExportForm;
