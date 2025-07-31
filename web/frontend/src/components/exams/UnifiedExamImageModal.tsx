 import React, { useEffect, useState } from "react";
import ManualFindingsSection from "./forms/ManualFindingsSection";
import AIPredictionSection from "./forms/AIPredictionSection";
import SwedeScoreForm from "./forms/SwedeeForm";

interface Region {
  label: string;
  confidence?: number;
  points: number[][];
}

interface UnifiedExamImageModalProps {
  imageData: any;
  examId: string;
  isOpen: boolean;
  onClose: () => void;
}

const UnifiedExamImageModal: React.FC<UnifiedExamImageModalProps> = ({
  imageData,
  examId,
  isOpen,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState("manual");
  const [segmentRegions, setSegmentRegions] = useState<Region[]>([]);
  const [lesionRegions, setLesionRegions] = useState<Region[]>([]);

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("modal-open");
      setActiveTab("manual");
      setSegmentRegions([]);
      setLesionRegions([]);
    } else {
      document.body.classList.remove("modal-open");
    }

    return () => {
      document.body.classList.remove("modal-open");
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const imageUrl = `http://localhost:8000/${imageData.url}`;

  const handleRegionsUpdate = (segments: Region[], lesions: Region[]) => {
    setSegmentRegions(segments);
    setLesionRegions(lesions);
  };

  return (
    <>
      {/* Backdrop */}
      <div className="modal-backdrop fade show" />

      {/* Modal */}
      <div className="modal fade show" tabIndex={-1} style={{ display: "block" }} role="dialog" aria-modal="true">
        <div className="modal-dialog modal-xl modal-dialog-centered" role="document">
          <div className="modal-content">
            {/* Header */}
            <div className="modal-header">
              <h5 className="modal-title">Imagen: {imageData.id}</h5>
              <button type="button" className="btn-close" onClick={onClose}></button>
            </div>

            {/* Body */}
            <div className="modal-body">
              <div className="row">
                <div className="col-md-4">
                  <div style={{ position: "relative", display: "inline-block" }}>
                    <img
                      src={imageUrl}
                      alt="Imagen colposcópica"
                      className="img-fluid rounded shadow-sm"
                    />
                    <svg
                      style={{ position: "absolute", top: 0, left: 0 }}
                      width="100%"
                      height="100%"
                      viewBox="0 0 600 400"
                      preserveAspectRatio="xMidYMid meet"
                    >
                      {/* Segmentos (zonas ignoradas) */}
                      {segmentRegions.map((region, index) => (
                        <polygon
                          key={`seg-${index}`}
                          points={region.points.map(p => p.join(",")).join(" ")}
                          fill="black"
                          fillOpacity={0.4}
                          stroke="black"
                          strokeWidth={1}
                        >
                          <title>{region.label}</title>
                        </polygon>
                      ))}

                      {/* Lesiones detectadas */}
                      {lesionRegions.map((region, index) => (
                        <polygon
                          key={`lesion-${index}`}
                          points={region.points.map(p => p.join(",")).join(" ")}
                          fill="red"
                          fillOpacity={0.3}
                          stroke="red"
                          strokeWidth={2}
                        >
                          <title>
                            {region.label}{" "}
                            {region.confidence ? `(${Math.round(region.confidence * 100)}%)` : ""}
                          </title>
                        </polygon>
                      ))}
                    </svg>
                  </div>
                </div>

                <div className="col-md-8">
                  {/* Tabs */}
                  <ul className="nav nav-tabs mb-3" role="tablist">
                    <li className="nav-item" role="presentation">
                      <button
                        className={`nav-link ${activeTab === "manual" ? "active" : ""}`}
                        onClick={() => setActiveTab("manual")}
                        type="button"
                        role="tab"
                      >
                        Registro Manual
                      </button>
                    </li>
                    <li className="nav-item" role="presentation">
                      <button
                        className={`nav-link ${activeTab === "ia" ? "active" : ""}`}
                        onClick={() => setActiveTab("ia")}
                        type="button"
                        role="tab"
                      >
                        Predicción IA
                      </button>
                    </li>
                    <li className="nav-item" role="presentation">
                      <button
                        className={`nav-link ${activeTab === "swede" ? "active" : ""}`}
                        onClick={() => setActiveTab("swede")}
                        type="button"
                        role="tab"
                      >
                        SWEEDE
                      </button>
                    </li>
                  </ul>

                  {/* Tab Content */}
                  <div className="tab-content">
                    {activeTab === "manual" && (
                      <div className="tab-pane fade show active" role="tabpanel">
                        <ManualFindingsSection imageId={imageData.id} />
                      </div>
                    )}
                    {activeTab === "ia" && (
                      <div className="tab-pane fade show active" role="tabpanel">
                        <AIPredictionSection
  examId={examId}
  imageId={imageData.id}
  onRegionsUpdate={handleRegionsUpdate}
  onNormalityPredict={() => {}} // ✅ función placeholder
/>

                      </div>
                    )}
                    {activeTab === "swede" && (
                      <div className="tab-pane fade show active" role="tabpanel">
                        <SwedeScoreForm imageId={imageData.id} />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={onClose}>
                Cerrar
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UnifiedExamImageModal;
