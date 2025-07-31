import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from '../components/shared/Sidebar';
import Topbar from '../components/shared/Topbar';
import DashboardHome from '../pages/dashboard/DashboardHome';
import UsersPage from '../pages/settings/SettingsPage';
import ManagePatients from '../pages/patients/ManagePatients';
import RegisterExam from '../pages/exams/RegisterExam'; // Importa la página de registro de exámenes
import ModelsPage from '../pages/ModelsPage';
import '../styles/App.css';

import { Outlet } from 'react-router-dom';

const DashboardLayout: React.FC = () => {
  return (
    <div className="dashboard-layout">
      <div className="layout-wrapper">
        <Sidebar />
        <div className="content-wrapper">
          <Topbar />
          <div className="content-area">
            <Outlet /> {/* Aquí se cargarán las vistas hijas */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
