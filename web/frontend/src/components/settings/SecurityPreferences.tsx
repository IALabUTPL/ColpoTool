import React from "react";

const SecurityPreferences: React.FC = () => {
  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">Seguridad y Sesión</h3>
      </div>
      <div className="card-body">

        {/* Duración de la sesión */}
        <div className="mb-3">
          <label className="form-label">Duración de sesión</label>
          <select className="form-select" defaultValue="30">
            <option value="15">15 minutos</option>
            <option value="30">30 minutos</option>
            <option value="60">1 hora</option>
          </select>
        </div>

        {/* Recordar dispositivo */}
        <div className="mb-3">
          <label className="form-label">Recordar sesión</label>
          <div className="form-check form-switch">
            <input className="form-check-input" type="checkbox" id="recordarDispositivo" defaultChecked />
            <label className="form-check-label" htmlFor="recordarDispositivo">
              Recordar sesión en este dispositivo
            </label>
          </div>
        </div>

        {/* Cambio de contraseña */}
        <div className="mb-3">
          <label className="form-label">Cambiar contraseña</label>
          <input type="password" className="form-control mb-2" placeholder="Contraseña actual" />
          <input type="password" className="form-control mb-2" placeholder="Nueva contraseña" />
          <input type="password" className="form-control" placeholder="Repetir nueva contraseña" />
        </div>

      </div>
      <div className="card-footer text-end">
        <button className="btn btn-primary">Guardar cambios</button>
      </div>
    </div>
  );
};

export default SecurityPreferences;
