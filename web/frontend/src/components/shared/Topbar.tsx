import { Bell, User } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import './Topbar.css';

const Topbar = () => {
  const [openUserMenu, setOpenUserMenu] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');       // o 'access_token' según uses
    localStorage.removeItem('refresh_token'); // si usas refresh
    navigate('/login');
    // opcional: recarga para asegurar limpieza completa
    // window.location.reload();
  };

  return (
    <div className="topbar">
      <span className="title">ColpoTool</span>

      <div className="topbar-icons">
        <Bell size={20} className="icon" />

        <div className="user-menu-wrapper">
          <User size={20} className="icon" onClick={() => setOpenUserMenu(!openUserMenu)} />
          {openUserMenu && (
            <div className="user-dropdown">
                <ul>
                  <li><button onClick={() => navigate('/user')}>Perfil</button></li>
                  <li><button onClick={handleLogout} className="logout-button">Cerrar sesión</button></li>
                </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Topbar;