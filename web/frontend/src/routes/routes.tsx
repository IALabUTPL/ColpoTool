// src/routes/routes.tsx
import React from 'react';
import { Navigate, RouteObject } from 'react-router-dom';

// Layouts
import DashboardLayout from '../layouts/DashboardLayout';

// Páginas públicas
import Login from '../pages/Login';
import RegisterUser from '../pages/RegisterUser';

// Dashboard
import DashboardHome from '../pages/dashboard/DashboardHome';

// Gestión de pacientes y exámenes
import ManagePatients from '../pages/patients/ManagePatients';
import ViewPatient from '../pages/patients/ViewPatient';
import RegisterExam from '../pages/exams/RegisterExam';
import ExamDetails from '../pages/exams/ExamDetails';
import ExamSelector from '../pages/exams/ExamDetailsSelector';

// Resultados IA y Reportes
import IAResults from '../pages/results/IAResults';
import SwedeEvaluation from '../pages/results/SwedeEvaluation';
import PDFReport from '../pages/results/PDFReport';

// Modelos IA
import ModelList from '../pages/models/ModelList';
import UploadModel from '../pages/models/UploadModel';
import ModelMetrics from '../pages/models/ModelMetrics';


import SettingsPage from '../pages/settings/SettingsPage';
import HelpSupport from '../pages/settings/HelpSupport';

const routes: RouteObject[] = [
  // Rutas públicas
  { path: '/login', element: <Login /> },
  { path: '/register', element: <RegisterUser /> },
  { path: '/', element: <Navigate to="/login" replace /> },

  // Rutas protegidas bajo el layout del dashboard
  {
    path: '*',
    element: <DashboardLayout />,
    children: [
      { path: 'dashboard', element: <DashboardHome /> },
      { path: 'patients/manage', element: <ManagePatients /> },
      { path: 'patients/:id/exams/register', element: <RegisterExam /> },
      { path: 'exams/register/:patientId', element: <RegisterExam /> },
      { path: 'patients/view/:codigo?', element: <ViewPatient /> },
      { path: 'exams/register', element: <RegisterExam /> },
      { path: 'exams/details', element: <ExamSelector /> },
      { path: 'exams/details/:id', element: <ExamDetails /> },

      // Resultados y Reportes
      { path: 'results/ia', element: <IAResults /> },
      { path: 'results/swede', element: <SwedeEvaluation /> },
      { path: 'results/report', element: <PDFReport /> },

      // Modelos IA
      { path: 'models/list', element: <ModelList /> },
      { path: 'models/upload', element: <UploadModel /> },
      { path: 'models/metrics', element: <ModelMetrics /> },

      // Página unificada de configuración y perfil
      { path: 'settings', element: <SettingsPage /> },
      { path: 'user', element: <Navigate to="/settings" replace /> },
      { path: 'settings/preferences', element: <Navigate to="/settings" replace /> },
      { path: 'settings/help', element: <HelpSupport /> },

    ]
  },

  // Catch-all para redirigir a login si no se encuentra ruta
  { path: '*', element: <Navigate to="/login" /> }
];

export default routes;
