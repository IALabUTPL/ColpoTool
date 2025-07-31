import React from 'react';
import Sidebar from '../components/shared/Sidebar';
import Topbar from '../components/shared/Topbar';
import '../styles/App.css';

interface Props {
  children: React.ReactNode;
}

const DashboardLayoutAdmin: React.FC<Props> = ({ children }) => {
  return (
    <div id="app-layout">
      <Sidebar />
      <div className="main-area">
        <Topbar />
        <div className="dashboard-scroll">
          {children}
        </div>
      </div>
    </div>
  );
};

export default DashboardLayoutAdmin;