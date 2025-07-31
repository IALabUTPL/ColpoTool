import React, { useState } from "react";
import ColpoFindingsForm from "./ColpoFindingsForm";
import SwedeForm from "./SwedeForm";
import IAResultsPreview from "./IAResultsPreview";

interface ImageModalProps {
  imageId: string;
  onClose: () => void;
}

const ImageModal: React.FC<ImageModalProps> = ({ imageId, onClose }) => {
  const [swedeValues, setSwedeValues] = useState({
    acetowhite: 2,
    margins: 1,
    vessels: 2,
    iodine: 1,
    lesionSize: 2,
  });

  const [colpoFindings, setColpoFindings] = useState({
    zonaTransformacion: "Tipo 2",
    epitelioAcetoblanco: "Presente",
    mosaico: "Grueso",
    punteado: "Grueso",
    vasosAtipicos: "Presentes",
    testDeSchiller: "Parcial",
  });

  const imageData = {
    original: `/assets/samples/${imageId}.png`,
    segmented: `/assets/samples/${imageId}-s.png`,
    annotated: `/assets/samples/${imageId}-d.png`,
    grayscale: `/assets/predictions/${imageId}-bw.png`,
    colorized: `/assets/predictions/${imageId}-c.png`,
    stage: "Etapa I",
    segment: "Zona de transformación completa",
    confidence: "93%",
    model: "UNet + Detectron2",
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <div style={styles.header}>
          <h5 style={styles.title}>Análisis de Imagen: {imageId}</h5>
          <button onClick={onClose} style={styles.closeBtn}>×</button>
        </div>

        <div style={styles.body}>
          {/* Imágenes IA */}
          <div style={styles.imageRow}>
            <div style={styles.imageCol}>
              <img src={imageData.original} alt="Original" style={styles.img} />
              <p style={styles.caption}>Imagen original</p>
            </div>
            <div style={styles.imageCol}>
              <img src={imageData.segmented} alt="Segmentada" style={styles.img} />
              <p style={styles.caption}>Segmentación IA</p>
            </div>
            <div style={styles.imageCol}>
              <img src={imageData.annotated} alt="Detección" style={styles.img} />
              <p style={styles.caption}>Detección de lesiones</p>
            </div>
          </div>

          {/* Formularios */}
          <div style={styles.formRow}>
            <div style={{ flex: 1, marginRight: "1rem" }}>
              <ColpoFindingsForm values={colpoFindings} onChange={() => {}} />
            </div>
            <div style={{ flex: 1 }}>
              <SwedeForm values={swedeValues} onChange={() => {}} />
            </div>
          </div>

          {/* Resultados IA */}
          <div style={{ marginTop: "2rem" }}>
            <IAResultsPreview
              stage={imageData.stage}
              segment={imageData.segment}
              confidence={imageData.confidence}
              model={imageData.model}
              grayscale={imageData.grayscale}
              colorized={imageData.colorized}
              segmented={imageData.segmented}
            />
          </div>
        </div>

        <div style={styles.footer}>
          <button onClick={onClose} style={styles.button}>Cerrar</button>
        </div>
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  overlay: {
    position: "fixed",
    inset: 0,
    backgroundColor: "rgba(0,0,0,0.6)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
    padding: "2rem",
  },
  modal: {
    backgroundColor: "#fff",
    borderRadius: "8px",
    width: "100%",
    maxWidth: "1200px",
    maxHeight: "95vh",
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
  },
  header: {
    padding: "1rem",
    borderBottom: "1px solid #ccc",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    margin: 0,
  },
  closeBtn: {
    background: "none",
    border: "none",
    fontSize: "1.5rem",
    cursor: "pointer",
  },
  body: {
    padding: "1rem",
  },
  imageRow: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "2rem",
    gap: "1rem",
  },
  imageCol: {
    flex: 1,
    textAlign: "center",
  },
  img: {
    maxWidth: "100%",
    borderRadius: "6px",
    border: "1px solid #ccc",
  },
  caption: {
    marginTop: "0.5rem",
    fontSize: "0.9rem",
    color: "#666",
  },
  formRow: {
    display: "flex",
    gap: "1rem",
  },
  footer: {
    padding: "1rem",
    borderTop: "1px solid #ccc",
    textAlign: "right",
  },
  button: {
    padding: "0.5rem 1rem",
    backgroundColor: "#007B95",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
};

export default ImageModal;
