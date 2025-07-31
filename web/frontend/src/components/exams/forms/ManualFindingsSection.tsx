import React, { useState } from "react";

interface ManualFindingsSectionProps {
  imageId: string;
  onSaveFindings?: (data: any) => void;
}



const ManualFindingsSection: React.FC<ManualFindingsSectionProps> = ({ imageId, onSaveFindings }) => {

  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    normales: [] as string[],
    anormalesMenores: [] as string[],
    anormalesMayores: [] as string[],
    yodo: "" as string,
    sospechaCancer: false,
    calidad: "" as "satisfactoria" | "insatisfactoria" | "",
    impresion: "" as string,
    zonasEvaluadas: [] as string[],
  });

  const stepTitles = [
    "Información normal y zonas evaluadas",
    "Cambios menores y mayores",
    "Evaluación final"
  ];

  const toggleCheckbox = (field: keyof typeof formData, value: string) => {
    const current = formData[field];
    if (Array.isArray(current)) {
      setFormData((prev) => ({
        ...prev,
        [field]: current.includes(value)
          ? current.filter((v) => v !== value)
          : [...current, value],
      }));
    }
  };

  const setSingleChoice = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="card p-4">
      {/* ✅ Título stepper personalizado tipo Tabler */}
      <div className="text-center mb-4">
  <div className="d-inline-flex flex-column align-items-center">
    <span className="badge bg-lime rounded-circle mb-2" style={{ width: "28px", height: "28px", lineHeight: "28px" }}>
      {currentStep + 1}
    </span>
    <strong>{stepTitles[currentStep]}</strong>
  </div>
</div>


      {/* Paso 1 */}
      {currentStep === 0 && (
        <>
          <div className="mb-3">
            <label className="form-label">Hallazgos normales:</label>
            <div className="d-flex flex-wrap gap-2">
              {["Epitelio escamoso original", "Epitelio columnar", "Zona de transformación normal"].map((item) => (
                <div key={item} className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id={item}
                    checked={formData.normales.includes(item)}
                    onChange={() => toggleCheckbox("normales", item)}
                  />
                  <label className="form-check-label" htmlFor={item}>{item}</label>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label">Zonas evaluadas:</label>
            <div className="d-flex flex-wrap gap-2">
              {["Exocérvix", "Endocérvix", "Citología", "Crioterapia"].map((item) => (
                <div key={item} className="form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id={item}
                    checked={formData.zonasEvaluadas.includes(item)}
                    onChange={() => toggleCheckbox("zonasEvaluadas", item)}
                  />
                  <label className="form-check-label" htmlFor={item}>{item}</label>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Paso 2 */}
      {currentStep === 1 && (
        <>
          <div className="mb-3">
            <label className="form-label">Cambios menores:</label>
            <div className="d-flex flex-wrap gap-2">
              {["Epitelio acetoblanco plano", "Mosaico regular", "Punteado regular"].map((item) => (
                <div key={item} className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id={item}
                    checked={formData.anormalesMenores.includes(item)}
                    onChange={() => toggleCheckbox("anormalesMenores", item)}
                  />
                  <label className="form-check-label" htmlFor={item}>{item}</label>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label">Cambios mayores:</label>
            <div className="d-flex flex-wrap gap-2">
              {["Epitelio acetoblanco denso", "Mosaico irregular", "Punteado irregular", "Vasos atípicos"].map((item) => (
                <div key={item} className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id={item}
                    checked={formData.anormalesMayores.includes(item)}
                    onChange={() => toggleCheckbox("anormalesMayores", item)}
                  />
                  <label className="form-check-label" htmlFor={item}>{item}</label>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Paso 3 */}
      {currentStep === 2 && (
        <>
          <div className="mb-3 form-check">
            <input
              type="checkbox"
              className="form-check-input"
              id="sospechaCancer"
              checked={formData.sospechaCancer}
              onChange={() =>
                setFormData((prev) => ({ ...prev, sospechaCancer: !prev.sospechaCancer }))
              }
            />
            <label className="form-check-label" htmlFor="sospechaCancer">
              Colposcopia sugestiva de cáncer invasivo
            </label>
          </div>

          <div className="mb-3">
            <label className="form-label">Calidad del examen:</label>
            <div className="d-flex gap-3">
              {["satisfactoria", "insatisfactoria"].map((item) => (
                <div className="form-check" key={item}>
                  <input
                    type="radio"
                    className="form-check-input"
                    id={item}
                    name="calidad"
                    checked={formData.calidad === item}
                    onChange={() => setSingleChoice("calidad", item)}
                  />
                  <label className="form-check-label" htmlFor={item}>
                    {item.charAt(0).toUpperCase() + item.slice(1)}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label">Impresión diagnóstica:</label>
            <select
              className="form-select"
              value={formData.impresion}
              onChange={(e) => setSingleChoice("impresion", e.target.value)}
            >
              <option value="">Seleccione</option>
              <option>LIE Bajo Grado</option>
              <option>LIE Alto Grado</option>
              <option>Ca invasor</option>
              <option>Inflamatorio</option>
              <option>Distrófico</option>
            </select>
          </div>

          <div className="mb-3">
            <label className="form-label">Yodo:</label>
            <select
              className="form-select"
              value={formData.yodo}
              onChange={(e) => setSingleChoice("yodo", e.target.value)}
            >
              <option value="">Seleccione</option>
              <option>Epitelio yodo positivo</option>
              <option>Epitelio parcialmente yodo negativo</option>
              <option>Epitelio yodo negativo</option>
            </select>
          </div>
        </>
      )}

      {/* Navegación */}
      <div className="d-flex justify-content-between mt-4">
        {currentStep > 0 && (
          <button className="btn btn-outline-secondary" onClick={() => setCurrentStep(currentStep - 1)}>
            ← Anterior
          </button>
        )}
        {currentStep < 2 ? (
          <button className="btn btn-primary ms-auto" onClick={() => setCurrentStep(currentStep + 1)}>
            Siguiente →
          </button>
        ) : (
          <button
  className="btn btn-success ms-auto"
  onClick={() => {
    console.log("Guardado:", formData);
    onSaveFindings?.(formData); // 🔁 Envía los datos al padre
  }}
>
  Guardar
</button>


        )}
      </div>
    </div>
  );
};

export default ManualFindingsSection;
