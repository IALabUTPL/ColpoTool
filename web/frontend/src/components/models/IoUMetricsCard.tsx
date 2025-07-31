import React from "react";

interface IoUMetricsProps {
  modelName: string;
  iou: number;
  dice: number;
}

const IoUMetricsCard: React.FC<IoUMetricsProps> = ({ modelName, iou, dice }) => {
  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">Métricas de Segmentación - {modelName}</h3>
      </div>
      <div className="card-body">
        <div className="row g-2">
          <div className="col-6">
            <div className="text-muted">IoU (Intersección sobre Unión)</div>
            <div className="h2">{(iou * 100).toFixed(2)}%</div>
          </div>
          <div className="col-6">
            <div className="text-muted">DICE Coefficient</div>
            <div className="h2">{(dice * 100).toFixed(2)}%</div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Ejemplo de uso con valores ficticios
export default () => <IoUMetricsCard modelName="UNet Cervical" iou={0.842} dice={0.873} />;
