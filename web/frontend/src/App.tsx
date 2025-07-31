// App.tsx
import React, { useState } from 'react';
import { BrowserRouter as Router, useRoutes, useNavigate } from 'react-router-dom';
import routes from './routes/routes'; // Aquí importamos las rutas definidas
import '@tabler/core/dist/css/tabler.min.css';
import SessionExpiredAlert from './components/SessionExpiredAlert'; // Componente para manejar la expiración de sesión
import useSessionWatcher from './hooks/useSessionWatcher'; // Hook que monitoriza la sesión

const AppRoutes = () => {
  const navigate = useNavigate(); // Permite redirigir cuando la sesión expire
  const [sessionExpired, setSessionExpired] = useState(false); // Estado de la expiración de la sesión

  useSessionWatcher(setSessionExpired); // Hook que se encarga de monitorear la sesión y actualiza el estado

  const handleAcknowledge = () => {
    localStorage.removeItem('token'); // Elimina el token del localStorage cuando la sesión ha expirado
    setSessionExpired(false);
    navigate('/login'); // Redirige al login
  };

  const element = useRoutes(routes); // Aquí cargamos las rutas que definimos

  return (
    <>
      {element} {/* Renderiza las rutas según lo definido en routes.tsx */}
      <SessionExpiredAlert visible={sessionExpired} onAcknowledge={handleAcknowledge} /> {/* Muestra el mensaje si la sesión ha expirado */}
    </>
  );
};

const App = () => (
  <Router> {/* Envolvemos las rutas en el Router para el enrutamiento de la app */}
    <AppRoutes />
  </Router>
);

export default App;
