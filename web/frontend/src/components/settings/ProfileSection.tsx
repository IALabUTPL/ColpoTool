import React from "react";

const ProfileSection: React.FC = () => {
  // Simulación temporal. Reemplazar luego por datos reales desde backend.
  const user = {
    name: "Administrador",
    email: "administrador@colpotool.ai",
    avatar: "https://i.pravatar.cc/100?img=3",
    showName: true,
  };

  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">Mi cuenta</h3>
      </div>
      <div className="card-body">
        {/* Avatar */}
        <div className="mb-4 text-center">
          <img
            src={user.avatar}
            alt="avatar"
            className="avatar avatar-xl rounded mb-2"
          />
          <div>
            <button className="btn btn-sm btn-outline-primary me-2">Cambiar avatar</button>
            <button className="btn btn-sm btn-outline-danger">Eliminar avatar</button>
          </div>
        </div>

        {/* Nombre visible */}
        <div className="mb-3">
          <label className="form-label">Nombre completo</label>
          <input
            type="text"
            className="form-control"
            defaultValue={user.name}
            disabled={!user.showName}
          />
          <div className="form-check mt-2">
            <input
              className="form-check-input"
              type="checkbox"
              id="showNameCheck"
              defaultChecked={user.showName}
            />
            <label className="form-check-label" htmlFor="showNameCheck">
              Mostrar mi nombre en la interfaz
            </label>
          </div>
        </div>

        {/* Email */}
        <div className="mb-3">
          <label className="form-label">Correo electrónico</label>
          <input
            type="email"
            className="form-control"
            defaultValue={user.email}
            disabled
          />
        </div>

        {/* Notificaciones */}
        <div className="mb-3">
          <label className="form-label">Notificaciones</label>
          <div className="form-check">
            <input className="form-check-input" type="checkbox" id="noti1" defaultChecked />
            <label className="form-check-label" htmlFor="noti1">
              Activar notificaciones emergentes
            </label>
          </div>
          <div className="form-check mt-1">
            <input className="form-check-input" type="checkbox" id="noti2" />
            <label className="form-check-label" htmlFor="noti2">
              Enviar resumen semanal al correo
            </label>
          </div>
        </div>

        {/* Pantalla de inicio preferida */}
        <div className="mb-3">
          <label className="form-label">Pantalla al iniciar sesión</label>
          <select className="form-select">
            <option value="dashboard">Dashboard</option>
            <option value="patients">Gestión de pacientes</option>
            <option value="exams">Registrar examen</option>
          </select>
        </div>
      </div>

      <div className="card-footer text-end">
        <button className="btn btn-primary">Guardar cambios</button>
      </div>
    </div>
  );
};

export default ProfileSection;
