import React from "react";

const models = [
  {
    name: "CancerRisk-RF",
    type: "Machine Learning",
    algorithm: "Random Forest",
    accuracy: "92.4%",
    updated: "2025-06-10",
  },
  {
    name: "CancerRisk-CNN",
    type: "Deep Learning",
    algorithm: "CNN",
    accuracy: "89.6%",
    updated: "2025-06-12",
  },
  {
    name: "Segmentation-UNet",
    type: "Deep Learning",
    algorithm: "U-Net",
    accuracy: "IoU: 0.87 / DICE: 0.91",
    updated: "2025-06-14",
  },
  {
    name: "Detection-Detectron2",
    type: "Deep Learning",
    algorithm: "Detectron2",
    accuracy: "mAP: 85.2%",
    updated: "2025-06-15",
  },
];

const ModelList: React.FC = () => {
  return (
    <div className="page-body">
      <div className="container-xl">
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Modelos IA registrados</h3>
          </div>
          <div className="table-responsive">
            <table className="table table-vcenter card-table table-hover">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Tipo</th>
                  <th>Algoritmo</th>
                  <th>Métricas</th>
                  <th>Última actualización</th>
                </tr>
              </thead>
              <tbody>
                {models.map((model, idx) => (
                  <tr key={idx}>
                    <td>{model.name}</td>
                    <td>
                      <span
                        className={`badge ${
                          model.type === "Deep Learning"
                            ? "bg-blue"
                            : "bg-green"
                        }`}
                      >
                        {model.type}
                      </span>
                    </td>
                    <td>{model.algorithm}</td>
                    <td>{model.accuracy}</td>
                    <td>{model.updated}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModelList;
