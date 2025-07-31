import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

const RegisterUser: React.FC = () => {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
  e.preventDefault();
  setErrorMsg('');
  setSuccessMsg('');

  try {
    const response = await fetch('http://localhost:8000/api/register/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        full_name: fullName,
        email: email,
        username: username, // ← agregado
        password: password
      })
    });

    const data = await response.json();

    if (response.ok) {
      setSuccessMsg('Cuenta creada exitosamente. Redirigiendo...');
      setTimeout(() => navigate('/login'), 2000);
    } else {
      setErrorMsg(data.error || 'Error al crear la cuenta.');
    }
  } catch (err) {
    setErrorMsg('Error al conectar con el servidor.');
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

        <form className="card card-md" onSubmit={handleRegister}>
  <div className="card-body">
    <h2 className="card-title text-center mb-4">Crear nueva cuenta</h2>

    {errorMsg && <div className="alert alert-danger text-center">{errorMsg}</div>}
    {successMsg && <div className="alert alert-success text-center">{successMsg}</div>}

    {/* Nombre completo */}
    <div className="mb-3">
      <label className="form-label">Nombre completo</label>
      <input
        type="text"
        className="form-control"
        placeholder="Ingrese su nombre completo"
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
        required
        autoComplete="off"
      />
    </div>

    {/* Correo electrónico */}
    <div className="mb-3">
      <label className="form-label">Correo electrónico</label>
      <input
        type="email"
        className="form-control"
        placeholder="Ingrese su correo"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        autoComplete="off"
      />
    </div>

    {/* Nombre de usuario */}
    <div className="mb-3">
      <label className="form-label">Nombre de usuario</label>
      <input
        type="text"
        className="form-control"
        placeholder="Ingrese su nombre de usuario"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
        autoComplete="off"
      />
    </div>

    {/* Contraseña */}
    <div className="mb-2">
      <label className="form-label">Contraseña</label>
      <input
        type="password"
        className="form-control"
        placeholder="********"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        autoComplete="new-password"
      />
    </div>

    <div className="form-footer">
      <button type="submit" className="btn btn-primary w-100">
        Crear cuenta
      </button>
    </div>
  </div>
</form>


        <div className="text-center text-muted mt-3">
          ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterUser;
