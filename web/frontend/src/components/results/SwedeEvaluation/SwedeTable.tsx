import React, { useState } from "react";

interface Criterion {
  key: string;
  name: string;
  description: string;
  options: { label: string; value: number }[];
}

const criteria: Criterion[] = [
  {
    key: "acetowhite",
    name: "Acetoblanco",
    description: "Intensidad y delimitación del área acetoblanca",
    options: [
      { label: "Ninguna o débil", value: 0 },
      { label: "Moderada", value: 1 },
      { label: "Intensa y bien delimitada", value: 2 },
    ],
  },
  {
    key: "margins",
    name: "Márgenes",
    description: "Aspecto de los bordes de la lesión",
    options: [
      { label: "Difusos", value: 0 },
      { label: "Parcialmente definidos", value: 1 },
      { label: "Bien definidos y regulares", value: 2 },
    ],
  },
  {
    key: "vessels",
    name: "Vasos",
    description: "Presencia y patrón vascular anormal",
    options: [
      { label: "Ausentes", value: 0 },
      { label: "Punteado o mosaico fino", value: 1 },
      { label: "Mosaico grueso o vasos atípicos", value: 2 },
    ],
  },
  {
    key: "iodine",
    name: "Yodo",
    description: "Captación de yodo por epitelio",
    options: [
      { label: "Captación normal", value: 0 },
      { label: "Captación parcial", value: 1 },
      { label: "Captación ausente", value: 2 },
    ],
  },
  {
    key: "lesionSize",
    name: "Tamaño de la lesión",
    description: "Área aproximada de la lesión en relación con el cuello uterino",
    options: [
      { label: "< 5 mm", value: 0 },
      { label: "5-15 mm", value: 1 },
      { label: "> 15 mm o más de 2 cuadrantes", value: 2 },
    ],
  },
];

const SwedeTable: React.FC = () => {
  const [scores, setScores] = useState<{ [key: string]: number }>(() => {
    const initial: { [key: string]: number } = {};
    criteria.forEach((c) => (initial[c.key] = 0));
    return initial;
  });

  const handleChange = (key: string, value: number) => {
    setScores({ ...scores, [key]: value });
  };

  const totalScore = Object.values(scores).reduce((acc, v) => acc + v, 0);

  return (
    <div className="p-6 bg-white border rounded-xl shadow-md">
      <h3 className="text-xl font-bold text-gray-800 mb-6">Evaluación Escala Swede</h3>
      <table className="w-full text-sm border">
        <thead className="bg-gray-100 text-left">
          <tr>
            <th className="px-3 py-2">Criterio</th>
            <th className="px-3 py-2">Descripción</th>
            <th className="px-3 py-2">Puntuación</th>
          </tr>
        </thead>
        <tbody>
          {criteria.map((c) => (
            <tr key={c.key} className="border-t hover:bg-gray-50">
              <td className="px-3 py-2 font-semibold">{c.name}</td>
              <td className="px-3 py-2">{c.description}</td>
              <td className="px-3 py-2">
                <div className="flex flex-col gap-1">
                  {c.options.map((opt) => (
                    <label key={opt.value} className="inline-flex items-center gap-2">
                      <input
                        type="radio"
                        name={c.key}
                        checked={scores[c.key] === opt.value}
                        onChange={() => handleChange(c.key, opt.value)}
                        className="accent-blue-600"
                      />
                      {opt.label} ({opt.value} pt)
                    </label>
                  ))}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-6 text-right">
        <span className="text-lg font-semibold">Total: </span>
        <span className="text-xl font-bold text-blue-700">{totalScore} / 10</span>
      </div>
    </div>
  );
};

export default SwedeTable;
