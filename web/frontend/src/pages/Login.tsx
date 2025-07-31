// src/pages/Login.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '@tabler/core/dist/css/tabler.min.css';
import { Link } from 'react-router-dom';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:8000/api/login/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const data = await response.json();

      if (response.ok) {
        // Guardar el token y el rol en localStorage
        localStorage.setItem('token', data.token);
        localStorage.setItem('userRole', data.role); // Guardar el rol
        navigate('/dashboard'); // Redirigir al dashboard
      } else {
        setErrorMsg(data.error || 'Error al iniciar sesión');
      }
    } catch (error) {
      console.error('Error en login:', error);
      setErrorMsg('Error de conexión con el servidor');
    }
  };

  return (
    <div className="page page-center">
      <div className="container container-tight py-4">
        <div className="text-center mb-4">
          <span className="navbar-brand">
            <img src="/colpotoolLogo.png" height="48" alt="ColpoTool" className="mx-auto d-block" />
          </span>
        </div>

        <form className="card card-md" onSubmit={handleSubmit}>
          <div className="card-body">
            <h2 className="card-title text-center mb-4">Iniciar sesión</h2>

            {errorMsg && (
              <div className="alert alert-danger text-center" role="alert">
                {errorMsg}
              </div>
            )}

            <div className="mb-3">
              <label className="form-label">Usuario</label>
              <input
                type="text"
                className="form-control"
                placeholder="Ingrese su usuario"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div className="mb-2">
              <label className="form-label">Contraseña</label>
              <input
                type="password"
                className="form-control"
                placeholder="********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="form-footer">
              <button type="submit" className="btn btn-primary w-100">
                Ingresar
              </button>
            </div>

            <div className="text-center mt-3">
              <span>¿No tienes una cuenta?</span>{' '}
              <Link to="/register" className="text-primary">Regístrate aquí</Link>
            </div>

          </div>
        </form>

        <div className="text-center text-muted mt-3">
          &copy; 2025 ColpoTool. Todos los derechos reservados.
        </div>
      </div>
    </div>
  );
};

export default Login;
