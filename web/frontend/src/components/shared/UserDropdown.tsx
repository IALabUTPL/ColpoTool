import React, { useState, useRef, useEffect } from 'react';

const UserDropdown: React.FC = () => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Aquí puedes mostrar info real del usuario si la extraes del token/JWT
  const username = "admin";

  return (
    <div className="user-dropdown" ref={ref} style={{ position: "relative", display: "inline-block" }}>
      <div
        className="avatar-circle"
        style={{
          width: 36,
          height: 36,
          borderRadius: "50%",
          background: "#e2e2e2",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer"
        }}
        onClick={() => setOpen(!open)}
      >
        <span role="img" aria-label="user">👤</span>
      </div>
      {open && (
        <div
          className="dropdown-menu"
          style={{
            position: "absolute",
            right: 0,
            top: 42,
            background: "#fff",
            boxShadow: "0 4px 12px rgba(0,0,0,0.12)",
            borderRadius: 10,
            minWidth: 140,
            zIndex: 100,
            padding: 8
          }}
        >
          <div style={{ padding: "8px 12px", borderBottom: "1px solid #eee" }}>
            <b>{username}</b>
            <br />
            <small>Administrador</small>
          </div>
          <div style={{ padding: "8px 12px", cursor: "pointer", color: "#e33" }}
               onClick={() => {
                 localStorage.clear();
                 window.location.href = "/login";
               }}>
            Cerrar sesión
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDropdown;
