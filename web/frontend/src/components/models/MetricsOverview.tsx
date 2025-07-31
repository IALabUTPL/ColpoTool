import React from "react";

interface MetricsOverviewProps {
  precision: number;
  recall: number;
  f1Score: number;
  auc: number;
}

const MetricsOverview: React.FC<MetricsOverviewProps> = ({ precision, recall, f1Score, auc }) => {
  return (
    <div className="row">
      <div className="col-md-3">
        <div className="card">
          <div className="card-body text-center">
            <div className="text-muted">Precisión</div>
            <div className="h2">{(precision * 100).toFixed(2)}%</div>
          </div>
        </div>
      </div>
      <div className="col-md-3">
        <div className="card">
          <div className="card-body text-center">
            <div className="text-muted">Recall</div>
            <div className="h2">{(recall * 100).toFixed(2)}%</div>
          </div>
        </div>
      </div>
      <div className="col-md-3">
        <div className="card">
          <div className="card-body text-center">
            <div className="text-muted">F1 Score</div>
            <div className="h2">{(f1Score * 100).toFixed(2)}%</div>
          </div>
        </div>
      </div>
      <div className="col-md-3">
        <div className="card">
          <div className="card-body text-center">
            <div className="text-muted">AUC</div>
            <div className="h2">{(auc * 100).toFixed(2)}%</div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Ejemplo de uso con valores simulados
export default () => <MetricsOverview precision={0.92} recall={0.89} f1Score={0.90} auc={0.94} />;