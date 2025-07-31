import React from "react";

const ConfusionMatrix: React.FC = () => {
  const labels = ["Normal", "Anormal"];
  const matrix = [
    [45, 5],
    [3, 47],
  ];

  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">Matriz de Confusión</h3>
      </div>
      <div className="card-body">
        <table className="table table-bordered text-center">
          <thead>
            <tr>
              <th></th>
              {labels.map((label, i) => (
                <th key={i}>Predicho: {label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {matrix.map((row, i) => (
              <tr key={i}>
                <th>Real: {labels[i]}</th>
                {row.map((val, j) => (
                  <td key={j} className="fw-bold">
                    {val}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        <div className="text-muted mt-2">
          TP: {matrix[1][1]}, TN: {matrix[0][0]}, FP: {matrix[0][1]}, FN: {matrix[1][0]}
        </div>
      </div>
    </div>
  );
};

export default ConfusionMatrix;
