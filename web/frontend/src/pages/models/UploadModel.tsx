/* File: D:\\Users\\Isra\\Documents\\COLPOTOOL\\ColpoTool\\web\\frontend\\src\\pages\\models\\UploadModel.tsx */

import React, { useState } from "react";

const UploadModel: React.FC = () => {
  const [modelName, setModelName] = useState("");
  const [modelType, setModelType] = useState("machine");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return alert("Debes seleccionar un archivo .pkl o .pt");
    console.log({ modelName, modelType, description, file });
  };

  return (
    <div className="page-body">
      <div className="container-xl">
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Subir nuevo modelo IA</h3>
          </div>
          <form onSubmit={handleSubmit} className="card-body">
            <div className="mb-3">
              <label className="form-label">Nombre del modelo</label>
              <input
                type="text"
                className="form-control"
                value={modelName}
                onChange={(e) => setModelName(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Tipo de modelo</label>
              <select
                className="form-select"
                value={modelType}
                onChange={(e) => setModelType(e.target.value)}
              >
                <option value="machine">Machine Learning</option>
                <option value="deep">Deep Learning</option>
              </select>
            </div>
            <div className="mb-3">
              <label className="form-label">Descripción</label>
              <textarea
                className="form-control"
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              ></textarea>
            </div>
            <div className="mb-3">
              <label className="form-label">Archivo del modelo (.pkl / .pt)</label>
              <input
                type="file"
                className="form-control"
                accept=".pkl,.pt"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                required
              />
            </div>
            <div className="card-footer text-end">
              <button type="submit" className="btn btn-primary">
                Subir modelo
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UploadModel;