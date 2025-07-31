import React from "react";

interface ColpoFindingsFormProps {
  values: {
    zonaTransformacion: string;
    epitelioAcetoblanco: string;
    mosaico: string;
    punteado: string;
    vasosAtipicos: string;
    testDeSchiller: string;
  };
  onChange: (name: string, value: string) => void;
}

const ColpoFindingsForm: React.FC<ColpoFindingsFormProps> = ({ values, onChange }) => {
  const renderSelect = (
    label: string,
    name: keyof ColpoFindingsFormProps["values"],
    options: string[]
  ) => (
    <div className="col-md-6 mb-3">
      <label className="form-label">{label}</label>
      <select
        className="form-select"
        value={values[name]}
        onChange={(e) => onChange(name, e.target.value)}
      >
        {options.map((opt, idx) => (
          <option key={idx} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );

  return (
    <div className="card mt-4">
      <div className="card-header">
        <h3 className="card-title">Hallazgos Colposcópicos</h3>
      </div>
      <div className="card-body">
        <div className="row g-3">
          {renderSelect("Zona de Transformación", "zonaTransformacion", [
            "Tipo 1",
            "Tipo 2",
            "Tipo 3",
          ])}

          {renderSelect("Epitelio Acetoblanco", "epitelioAcetoblanco", [
            "Ausente",
            "Leve",
            "Presente",
            "Muy intenso",
          ])}

          {renderSelect("Mosaico", "mosaico", [
            "Ausente",
            "Fino",
            "Grueso",
          ])}

          {renderSelect("Punteado", "punteado", [
            "Ausente",
            "Fino",
            "Grueso",
          ])}

          {renderSelect("Vasos Atípicos", "vasosAtipicos", [
            "Ausentes",
            "Presentes",
            "Muy visibles",
          ])}

          {renderSelect("Test de Schiller (Lugol)", "testDeSchiller", [
            "Negativo",
            "Parcial",
            "Positivo",
          ])}
        </div>
        <p className="text-muted mt-3">
          <em>Estos hallazgos ayudan a interpretar visualmente la extensión y agresividad de la lesión observada.</em>
        </p>
      </div>
    </div>
  );
};

export default ColpoFindingsForm;
