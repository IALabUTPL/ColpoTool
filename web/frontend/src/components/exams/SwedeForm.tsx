import React from "react";

interface SwedeFormProps {
  values: {
    acetowhite: number;
    margins: number;
    vessels: number;
    iodine: number;
    lesionSize: number;
  };
  onChange: (name: string, value: number) => void;
}

const SwedeForm: React.FC<SwedeFormProps> = ({ values, onChange }) => {
  const renderSelect = (label: string, name: keyof SwedeFormProps["values"], options: { label: string; value: number }[]) => (
    <div className="col-md-6">
      <label className="form-label">{label}</label>
      <select
        className="form-select"
        value={values[name]}
        onChange={(e) => onChange(name, parseInt(e.target.value))}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  );

  return (
    <div className="card mb-4">
      <div className="card-header">
        <h3 className="card-title">Escala Swede</h3>
      </div>
      <div className="card-body">
        <div className="row g-3">
          {renderSelect("1. Acetoblanco", "acetowhite", [
            { label: "0 - No acetoblanco", value: 0 },
            { label: "1 - Leve (brillo tenue, retrasado)", value: 1 },
            { label: "2 - Intenso (brillo opaco inmediato)", value: 2 },
          ])}

          {renderSelect("2. Márgenes", "margins", [
            { label: "0 - Mal definidos", value: 0 },
            { label: "1 - Definidos en parte", value: 1 },
            { label: "2 - Bien definidos y abruptos", value: 2 },
          ])}

          {renderSelect("3. Vasos", "vessels", [
            { label: "0 - Ninguno", value: 0 },
            { label: "1 - Vasos finos y escasos", value: 1 },
            { label: "2 - Vasos gruesos, puntiformes o mosaico grueso", value: 2 },
          ])}

          {renderSelect("4. Test de Lugol (Yodo)", "iodine", [
            { label: "0 - Positivo (color caoba uniforme)", value: 0 },
            { label: "1 - Parcialmente positivo (moteado o mixto)", value: 1 },
            { label: "2 - Negativo (amarillo mostaza)", value: 2 },
          ])}

          {renderSelect("5. Tamaño de la lesión", "lesionSize", [
            { label: "0 - Menor a 5 mm", value: 0 },
            { label: "1 - Entre 5 mm y 15 mm", value: 1 },
            { label: "2 - Mayor a 15 mm o abarcando más del 75% del cuello", value: 2 },
          ])}
        </div>
        <p className="text-muted mt-3">
          <em>
            El puntaje total de la escala Swede varía entre 0 y 10. Una puntuación mayor o igual a 5 sugiere la necesidad de biopsia.
          </em>
        </p>
      </div>
    </div>
  );
};

export default SwedeForm;