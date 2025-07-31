import React from "react";

interface IAResultsPreviewProps {
  stage: string;
  segment: string;
  confidence: string;
  model: string;
  grayscale: string;
  colorized: string;
  segmented: string;
}

const IAResultsPreview: React.FC<IAResultsPreviewProps> = ({
  stage,
  segment,
  confidence,
  model,
  grayscale,
  colorized,
  segmented,
}) => {
  return (
    <div className="card mb-4">
      <div className="card-header">
        <h3 className="card-title">Resultados de IA</h3>
      </div>
      <div className="card-body">
        <p><strong>Etapa detectada:</strong> <span className="badge bg-danger">{stage}</span></p>
        <p><strong>Segmento afectado:</strong> {segment}</p>
        <p><strong>Confianza del modelo:</strong> {confidence}</p>
        <p><strong>Modelo utilizado:</strong> {model}</p>

        <div className="row g-3 mt-3">
          <div className="col-md-4 text-center">
            <img
              src={grayscale}
              alt="Visualización B/N"
              className="img-fluid rounded border"
            />
            <small className="text-muted d-block mt-1">Predicción en blanco y negro</small>
          </div>

          <div className="col-md-4 text-center">
            <img
              src={colorized}
              alt="Visualización a color"
              className="img-fluid rounded border"
            />
            <small className="text-muted d-block mt-1">Predicción a color</small>
          </div>

          <div className="col-md-4 text-center">
            <img
              src={segmented}
              alt="Segmentación IA"
              className="img-fluid rounded border"
            />
            <small className="text-muted d-block mt-1">Segmentación de lesiones</small>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IAResultsPreview;
