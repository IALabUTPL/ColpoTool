import {
  LayoutDashboard,
  Users,
  UserPlus,
  FolderOpenDot,
  FlaskConical,
  ScanLine,
  Brain,
  Database,
  FileBarChart2,
  FlaskRound,
  Settings,
  HelpCircle,
  LogOut,
  ChevronDown,
  ChevronRight,
  Menu,
  ChevronLeft
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import './Sidebar.css';

const Sidebar = () => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname.startsWith(path);

  const [openModelos, setOpenModelos] = useState(false);
  const [openConfiguracion, setOpenConfiguracion] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const showFichaMedica = /\/patients\/view\//.test(location.pathname);
  const showDetalleExamen = /\/exams\/details\//.test(location.pathname);

  return (
    <div className={`sidebar ${collapsed ? "collapsed" : ""}`}>
      <div className="sidebar-logo">
        {!collapsed ? (
          <img src="/colpotoolLogo.png" alt="ColpoTool" />
        ) : (
          <img src="/colpo.png" alt="ColpoTool Icon" className="sidebar-logo-icon" />
        )}
        <button
          className="sidebar-toggle-btn"
          onClick={() => setCollapsed(!collapsed)}
          aria-label="Toggle sidebar"
        >
          {collapsed ? <Menu size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      <ul className="sidebar-menu">
        <span className="sidebar-section-label">MENÚ</span>
        <li className={isActive("/dashboard") ? "active" : ""}>
          <Link to="/dashboard" className="sidebar-link">
            <LayoutDashboard size={18} />
            <span>Dashboard</span>
          </Link>
        </li>

        <span className="sidebar-section-label">GESTIÓN</span>
        <li className={isActive("/patients/manage") ? "active" : ""}>
          <Link to="/patients/manage" className="sidebar-link">
            <Users size={18} />
            <span>Registro de Pacientes</span>
          </Link>
        </li>

        <li className={isActive("/patients/view") ? "active" : ""}>
          <Link to="/patients/view" className="sidebar-link">
            <FolderOpenDot size={18} />
            <span>Ficha médica</span>
          </Link>
        </li>

        <li className={isActive("/exams/register") ? "active" : ""}>
          <Link to="/exams/register" className="sidebar-link">
            <FlaskConical size={18} />
            <span>Registrar examen</span>
          </Link>
        </li>
        <li className={isActive("/exams/details") ? "active" : ""}>
          <Link to="/exams/details" className="sidebar-link">
            <ScanLine size={18} />
            <span>Detalle del examen</span>
          </Link>
        </li>

        {/* Resultados y Modelos IA deshabilitados */}
        

        <li onClick={() => setOpenModelos(!openModelos)} className="submenu-toggle sidebar-disabled">
          <div className="submenu-header">
            <Database size={18} />
            <span>Modelos IA</span>
            <div className="submenu-icon-right">
              {openModelos ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </div>
          </div>
        </li>
        {openModelos && (
          <ul className={`submenu ${collapsed ? "submenu-floating" : ""}`}>
            <li className="sidebar-disabled">
              <div className="sidebar-link disabled">
                <Database size={16} />
                <span>Modelos disponibles</span>
              </div>
            </li>
            <li className="sidebar-disabled">
              <div className="sidebar-link disabled">
                <FileBarChart2 size={16} />
                <span>Subir modelos</span>
              </div>
            </li>
            <li className="sidebar-disabled">
              <div className="sidebar-link disabled">
                <FlaskRound size={16} />
                <span>Reentrenamiento</span>
              </div>
            </li>
          </ul>
        )}

        <span className="sidebar-section-label">CONFIGURACIÓN</span>
        <li onClick={() => setOpenConfiguracion(!openConfiguracion)} className="submenu-toggle">
          <div className="submenu-header">
            <Settings size={18} />
            <span>Configuración</span>
            <div className="submenu-icon-right">
              {openConfiguracion ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </div>
          </div>
        </li>
        {openConfiguracion && (
          <ul className={`submenu ${collapsed ? "submenu-floating" : ""}`}>
            <li className={isActive("/settings/preferences") ? "active" : ""}>
              <Link to="/settings/preferences">
                <Settings size={16} />
                <span>Preferencias del sistema</span>
              </Link>
            </li>
            <li className={isActive("/settings/help") ? "active" : ""}>
              <Link to="/settings/help">
                <HelpCircle size={16} />
                <span>Ayuda / Soporte</span>
              </Link>
            </li>
            <li>
              <Link to="/logout">
                <LogOut size={16} />
                <span>Cerrar sesión</span>
              </Link>
            </li>
          </ul>
        )}
      </ul>
    </div>
  );
};

export default Sidebar;
