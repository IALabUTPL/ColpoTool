/* File: D:\\Users\\Isra\\Documents\\COLPOTOOL\\ColpoTool\\web\\frontend\\src\\components\\models\\ModelUploadForm.tsx */

import React, { useState } from "react";

interface FormState {
  name: string;
  type: "Machine Learning" | "Deep Learning";
  description: string;
  file: File | null;
}

const ModelUploadForm: React.FC = () => {
  const [formData, setFormData] = useState<FormState>({
    name: "",
    type: "Machine Learning",
    description: "",
    file: null,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFormData((prev) => ({ ...prev, file: e.target.files![0] }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Subiendo modelo:", formData);
  };

  return (
    <form onSubmit={handleSubmit} className="card">
      <div className="card-header">
        <h3 className="card-title">Subir nuevo modelo IA</h3>
      </div>
      <div className="card-body">
        <div className="mb-3">
          <label className="form-label">Nombre del modelo</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} className="form-control" required />
        </div>
        <div className="mb-3">
          <label className="form-label">Tipo de modelo</label>
          <select name="type" value={formData.type} onChange={handleChange} className="form-select">
            <option value="Machine Learning">Machine Learning</option>
            <option value="Deep Learning">Deep Learning</option>
          </select>
        </div>
        <div className="mb-3">
          <label className="form-label">Descripción</label>
          <textarea name="description" value={formData.description} onChange={handleChange} className="form-control" rows={3} />
        </div>
        <div className="mb-3">
          <label className="form-label">Archivo del modelo (.pkl o .pt)</label>
          <input type="file" accept=".pkl,.pt" onChange={handleFileChange} className="form-control" required />
        </div>
      </div>
      <div className="card-footer text-end">
        <button type="submit" className="btn btn-primary">Subir modelo</button>
      </div>
    </form>
  );
};

export default ModelUploadForm;
