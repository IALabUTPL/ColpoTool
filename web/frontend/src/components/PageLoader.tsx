import React, { useEffect, useState } from 'react';

const messages = [
  "Cargando datos clínicos…",
  "Conectando con el servidor de ColpoTool…",
  "Iniciando panel de control…",
  "Estamos preparando tu panel de trabajo.",
];

const PageLoader: React.FC = () => {
  const [currentMsgIndex, setCurrentMsgIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMsgIndex(prev => (prev + 1) % messages.length);
    }, 3000); // cambia cada 3 segundos

    return () => clearInterval(interval); // limpieza al desmontar
  }, []);

  return (
    <div
      className="page page-center"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: '#ffffff',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        transition: 'opacity 0.3s ease-in-out',
      }}
    >
      <div className="spinner-border text-primary" role="status" />
      <div className="mt-3 text-muted text-center">
        <strong>{messages[currentMsgIndex]}</strong>
      </div>
    </div>
  );
};

export default PageLoader;
