import React from "react";

interface ModelEntry {
  id: number;
  name: string;
  type: "Machine Learning" | "Deep Learning";
  accuracy: number;
  date: string;
}

const mockModels: ModelEntry[] = [
  { id: 1, name: "Random Forest Risk Predictor", type: "Machine Learning", accuracy: 0.89, date: "2025-06-10" },
  { id: 2, name: "UNet Cervical Segmentation", type: "Deep Learning", accuracy: 0.91, date: "2025-06-12" },
  { id: 3, name: "YOLOv8 Lesion Detector", type: "Deep Learning", accuracy: 0.87, date: "2025-06-14" },
];

const ModelTable: React.FC = () => {
  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">Lista de Modelos Registrados</h3>
      </div>
      <div className="table-responsive">
        <table className="table table-hover table-vcenter">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Tipo</th>
              <th>Precisión</th>
              <th>Fecha de Registro</th>
              <th className="w-1"></th>
            </tr>
          </thead>
          <tbody>
            {mockModels.map((model) => (
              <tr key={model.id}>
                <td>{model.name}</td>
                <td>
                  <span className={`badge ${model.type === 'Machine Learning' ? 'bg-blue' : 'bg-green'}`}>{model.type}</span>
                </td>
                <td>{(model.accuracy * 100).toFixed(2)}%</td>
                <td>{model.date}</td>
                <td>
                  <a href="#" className="btn btn-sm btn-secondary">Detalles</a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ModelTable;
