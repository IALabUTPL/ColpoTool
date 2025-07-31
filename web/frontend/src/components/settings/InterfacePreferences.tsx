import React from "react";

const InterfacePreferences: React.FC = () => {
  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">Preferencias de Interfaz</h3>
      </div>
      <div className="card-body">

        {/* Tema */}
        <div className="mb-3">
          <label className="form-label">Tema del sistema</label>
          <select className="form-select" defaultValue="sistema">
            <option value="claro">Claro</option>
            <option value="oscuro">Oscuro</option>
            <option value="sistema">Automático (según sistema)</option>
          </select>
        </div>

        {/* Layout */}
        <div className="mb-3">
          <label className="form-label">Distribución del dashboard</label>
          <div className="form-selectgroup">
            <label className="form-selectgroup-item">
              <input type="radio" name="layout" value="vertical" defaultChecked className="form-selectgroup-input" />
              <span className="form-selectgroup-label">Vertical</span>
            </label>
            <label className="form-selectgroup-item">
              <input type="radio" name="layout" value="horizontal" className="form-selectgroup-input" />
              <span className="form-selectgroup-label">Horizontal</span>
            </label>
          </div>
        </div>

        {/* Tamaño de fuente */}
        <div className="mb-3">
          <label className="form-label">Tamaño de fuente</label>
          <select className="form-select" defaultValue="mediano">
            <option value="pequeno">Pequeño</option>
            <option value="mediano">Mediano</option>
            <option value="grande">Grande</option>
          </select>
        </div>

        {/* Idioma */}
        <div className="mb-3">
          <label className="form-label">Idioma</label>
          <select className="form-select" defaultValue="es">
            <option value="es">Español</option>
            <option value="en">English</option>
          </select>
        </div>

        {/* Animaciones */}
        <div className="mb-3">
          <label className="form-label">Animaciones</label>
          <div className="form-check form-switch">
            <input className="form-check-input" type="checkbox" id="animaciones" defaultChecked />
            <label className="form-check-label" htmlFor="animaciones">
              Activar animaciones suaves
            </label>
          </div>
        </div>

      </div>
      <div className="card-footer text-end">
        <button className="btn btn-primary">Guardar preferencias</button>
      </div>
    </div>
  );
};

export default InterfacePreferences;
