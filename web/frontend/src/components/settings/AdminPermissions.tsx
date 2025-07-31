import React from "react";

const AdminPermissions: React.FC = () => {
  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">Administración del sistema</h3>
      </div>
      <div className="card-body">

        {/* Rol del usuario */}
        <div className="mb-3">
          <label className="form-label">Rol asignado</label>
          <input type="text" className="form-control" value="Administrador" disabled />
        </div>

        {/* Límite de almacenamiento */}
        <div className="mb-3">
          <label className="form-label">Límite de almacenamiento por usuario (MB)</label>
          <input type="number" className="form-control" defaultValue={500} />
        </div>

        {/* Backup automático */}
        <div className="mb-3">
          <label className="form-label">Backup automático</label>
          <div className="form-check form-switch mb-2">
            <input className="form-check-input" type="checkbox" id="enableBackup" defaultChecked />
            <label className="form-check-label" htmlFor="enableBackup">
              Activar backup automático
            </label>
          </div>
          <select className="form-select">
            <option value="local">Almacenamiento local</option>
            <option value="nube">Almacenamiento en la nube</option>
          </select>
        </div>

        {/* Gestión de versiones */}
        <div className="mb-3">
          <label className="form-label">Versión del sistema</label>
          <div className="d-flex align-items-center justify-content-between">
            <span>Versión actual: 1.0.0</span>
            <button className="btn btn-sm btn-outline-secondary">Ver changelog</button>
          </div>
          <div className="form-check form-switch mt-2">
            <input className="form-check-input" type="checkbox" id="modoBeta" />
            <label className="form-check-label" htmlFor="modoBeta">
              Activar modo beta
            </label>
          </div>
        </div>

      </div>
      <div className="card-footer text-end">
        <button className="btn btn-primary">Guardar cambios</button>
      </div>
    </div>
  );
};

export default AdminPermissions;
