import React from "react";

const HelpSupport: React.FC = () => {
  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">Ayuda y Soporte</h3>
      </div>
      <div className="card-body">

        {/* Video embebido */}
        <div className="mb-4">
          <label className="form-label">Video introductorio</label>
          <div className="ratio ratio-16x9">
            <iframe
              src="https://www.youtube.com/embed/jq05V_U6zgM?si=BO16iu5dcp_60Dyj"
              title="Guía Rápida para Usar ColpoTool"
              allowFullScreen
            ></iframe>
          </div>
        </div>

        {/* Manual en PDF */}
        <div className="mb-2">
          <label className="form-label">Manual de usuario</label>
          <p>Puedes descargar el manual completo aquí:</p>
          <a
            href="/docs/Guia_ColpoTool.pdf"
            download="Guia_ColpoTool.pdf"
            className="btn btn-outline-primary"
          >
            Descargar Manual PDF
          </a>
        </div>

      </div>
    </div>
  );
};

export default HelpSupport;
