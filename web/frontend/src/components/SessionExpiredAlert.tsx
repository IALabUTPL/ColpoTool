import React from 'react';

interface Props {
  visible: boolean;
  onAcknowledge: () => void;
}

const SessionExpiredAlert: React.FC<Props> = ({ visible, onAcknowledge }) => {
  if (!visible) return null;

  return (
    <div
      className="alert alert-danger d-flex justify-content-between align-items-center"
      style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        zIndex: 9999,
        width: '300px',
        boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
      }}
    >
      <div>
        <strong>⚠️ Sesión expirada</strong>
        <div>Por favor, inicia sesión nuevamente.</div>
      </div>
      <button className="btn btn-sm btn-primary ms-2" onClick={onAcknowledge}>
        Aceptar
      </button>
    </div>
  );
};

export default SessionExpiredAlert;
