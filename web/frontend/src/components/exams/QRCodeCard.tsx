import React, { useEffect, useState } from "react";
import { QRCodeCanvas } from "qrcode.react";

interface QRCodeCardProps {
  patientId: string;
}

const QRCodeCard: React.FC<QRCodeCardProps> = ({ patientId }) => {
  const [token, setToken] = useState("");
  const [expiresIn, setExpiresIn] = useState(300);
  const [connected, setConnected] = useState(false);

  const generateToken = () => {
    const newToken = Math.random().toString(36).substring(2, 10);
    setToken(newToken);
    setExpiresIn(300);
    setConnected(false);
  };

  useEffect(() => {
    if (patientId) {
      generateToken();
    }
  }, [patientId]);

  useEffect(() => {
    const interval = setInterval(() => {
      setExpiresIn((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const qrData = {
    token,
    patientId,
    uploadUrl: "https://example.com/api/upload", // reemplazar con URL real
    timestamp: new Date().toISOString(),
  };

  return (
    <div className="card h-100">
      <div className="card-body text-center">
        <h4 className="card-title mb-3">Conectar con dispositivo móvil</h4>
        {token ? (
          <>
            <QRCodeCanvas value={JSON.stringify(qrData)} size={180} />
            <p className="mt-3 mb-1">
              ⏱️ Tiempo restante: <strong>{formatTime(expiresIn)}</strong>
            </p>
            <p>
              Estado:{" "}
              <span className={`badge ${connected ? "bg-green" : "bg-yellow"}`}>
                {connected ? "Conectado" : "Esperando escaneo"}
              </span>
            </p>
            <button className="btn btn-outline-secondary btn-sm mt-2" onClick={generateToken}>
              🔁 Generar nuevo código
            </button>
          </>
        ) : (
          <p>Cargando código QR...</p>
        )}
      </div>
    </div>
  );
};

export default QRCodeCard;
