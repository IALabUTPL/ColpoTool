import React, { useState } from "react";

interface SwedeFormProps {
  imageId: string;
  onSave?: (data: any) => void;
}

const criteria = [
  {
    label: "Reacción acetoblanca",
    key: "acetowhite",
    descriptions: [
      "Ninguna o translúcida",
      "Ligera, lechosa (ni translúcida ni opaca)",
      "Definida, blanca opaca"
    ]
  },
  {
    label: "Márgenes / superficie",
    key: "margins",
    descriptions: [
      "Difusas o sin márgenes",
      "Irregulares, satélites",
      "Nítidas, con relieves"
    ]
  },
  {
    label: "Vasos sanguíneos",
    key: "vessels",
    descriptions: [
      "Finos, regulares",
      "Ausentes",
      "Gruesos o atípicos"
    ]
  },
  {
    label: "Tamaño de la lesión",
    key: "lesionSize",
    descriptions: [
      "< 5 mm",
      "5–15 mm o 2 cuadrantes",
      "> 15 mm o ≥ 3 cuadrantes"
    ]
  },
  {
    label: "Tinción con yodo de Lugol",
    key: "iodine",
    descriptions: [
      "Yodopositivo (Color marrón)",
      "Amarilla heterogénea",
      "Amarillo bien definido"
    ]
  }
];

const calculateDiagnosis = (score: number) => {
  if (score <= 4) return "Normal / NIC1";
  if (score <= 6) return "NIC2 / NIC3";
  return "NIC3 / Cáncer";
};

const SwedeForm: React.FC<SwedeFormProps> = ({ imageId, onSave }) => {
  const [values, setValues] = useState<number[]>(Array(5).fill(0));

  const handleClick = (criterionIndex: number, score: number) => {
    const updated = [...values];
    updated[criterionIndex] = score;
    setValues(updated);
  };

  const totalScore = values.reduce((sum, val) => sum + val, 0);
  const diagnosis = calculateDiagnosis(totalScore);

  const handleSave = () => {
    const result = {
      imageId,
      acetowhite: values[0],
      margins: values[1],
      vessels: values[2],
      lesionSize: values[3],
      lugol: values[4],
      total: totalScore,
      suggestedDiagnosis: diagnosis
    };

    console.log("✅ SwedeForm evaluado:", result);
    onSave?.(result);
  };

  return (
    <div>
      <div className="table-responsive">
        <table className="table table-bordered text-center align-middle">
          <thead className="bg-light">
            <tr>
              <th className="text-start">Criterio</th>
              <th>0</th>
              <th>1</th>
              <th>2</th>
            </tr>
          </thead>
          <tbody>
            {criteria.map((criterion, i) => (
              <tr key={criterion.key}>
                <td className="text-start fw-bold">{criterion.label}</td>
                {[0, 1, 2].map((score) => (
                  <td key={score}>
                    <button
                      className={`btn btn-sm w-100 ${
                        values[i] === score
                          ? "btn-lime"
                          : "btn-outline-secondary"
                      }`}
                      onClick={() => handleClick(i, score)}
                      title={criterion.descriptions[score]}
                    >
                      {score}
                    </button>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="alert alert-info d-flex justify-content-between align-items-center">
        <strong>Puntaje total:</strong>
        <span>{totalScore} / 10</span>
      </div>

      <div className="alert alert-secondary">
        <strong>Diagnóstico sugerido:</strong> {diagnosis}
      </div>

      <div className="text-end mt-3">
        <button className="btn btn-primary" onClick={handleSave}>
          Guardar evaluación
        </button>
      </div>
    </div>
  );
};

export default SwedeForm;
