import React, { useState } from "react";
import UserPreferences from "../../components/settings/ProfileSection";
import InterfacePreferences from "../../components/settings/InterfacePreferences";
import SecurityPreferences from "../../components/settings/SecurityPreferences";
import AdminPreferences from "../../components/settings/AdminPermissions";

const SettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState("user");

  // Simulación temporal, luego reemplaza con datos reales del usuario logueado
  const user = {
    isAdmin: true,
  };

  const menuItems = [
    { key: "user", label: "Mi cuenta" },
    { key: "interface", label: "Interfaz" },
    { key: "security", label: "Seguridad" },
    { key: "admin", label: "Administración", adminOnly: true },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "user":
        return <UserPreferences />;
      case "interface":
        return <InterfacePreferences />;
      case "security":
        return <SecurityPreferences />;
      case "admin":
        return user.isAdmin ? <AdminPreferences /> : null;
      default:
        return <UserPreferences />;
    }
  };

  return (
    <div className="page-body">
      <div className="container-xl">
        <div className="row">
          {/* Menú lateral */}
          <div className="col-md-3 mb-3">
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">Configuración</h3>
              </div>
              <div className="list-group list-group-flush">
                {menuItems.map((item) => {
                  if (item.adminOnly && !user.isAdmin) return null;
                  return (
                    <button
                      key={item.key}
                      className={`list-group-item list-group-item-action ${
                        activeTab === item.key ? "active" : ""
                      }`}
                      onClick={() => setActiveTab(item.key)}
                    >
                      {item.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Contenido dinámico */}
          <div className="col-md-9">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
