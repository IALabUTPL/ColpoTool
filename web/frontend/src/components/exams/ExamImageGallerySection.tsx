import React, { useEffect, useState } from "react";
import axios from "axios";
import { IconTrash } from "@tabler/icons-react";
import UnifiedExamImageModal from "./UnifiedExamImageModal";

interface ImageData {
  id: string;
  url: string;
  label: string;
  status: "cargado" | "subido" | "procesado" | "error";
  findings?: string[];
  iaLesion?: string;
}

interface ExamImageGallerySectionProps {
  examId: string;
}

const statusBadgeClass = {
  cargado: "bg-blue-lt text-blue",
  subido: "bg-lime-lt text-lime",
  procesado: "bg-indigo-lt text-indigo",
  error: "bg-red-lt text-red",
};

const ITEMS_PER_PAGE = 4;

const ExamImageGallerySection: React.FC<ExamImageGallerySectionProps> = ({ examId }) => {
  const [images, setImages] = useState<ImageData[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [selectMode, setSelectMode] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState<Set<string>>(new Set());
  const [selectedImage, setSelectedImage] = useState<ImageData | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Token no encontrado");

        const response = await axios.get(
          `http://localhost:8000/api/exams/${examId}/images`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setImages(response.data);
      } catch (error) {
        console.error("Error al cargar imágenes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, [examId]);

  const totalPages = Math.ceil(images.length / ITEMS_PER_PAGE);
  const paginated = images.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const handleDeleteImage = (imageId: string) => {
    alert(`Eliminar imagen ${imageId}`);
  };

  const toggleSelectImage = (id: string) => {
    const updated = new Set(selectedBatch);
    updated.has(id) ? updated.delete(id) : updated.add(id);
    setSelectedBatch(updated);
  };

  const handleBatchAction = () => {
    if (!selectMode) {
      setSelectMode(true);
      return;
    }

    const selected = images.filter(
      (img) => selectedBatch.has(img.id) && img.iaLesion === "No detectado"
    );

    if (selected.length === 0) {
      alert("No hay imágenes válidas para predecir.");
      return;
    }

    alert(`Predicción por lotes iniciada para: ${selected.map((i) => i.id).join(", ")}`);
    setSelectMode(false);
    setSelectedBatch(new Set());
  };

  const handleOpenModal = (image: ImageData) => {
    setSelectedImage(image);
    setModalOpen(true);
  };

  const handleClose = () => {
    setModalOpen(false);
  };

  const imagesWithPendingIA = images.filter((img) => img.iaLesion === "No detectado");
  const enableBatchButton = imagesWithPendingIA.length >= 2;

  if (loading) return <div>Cargando imágenes...</div>;
  if (images.length === 0) return <div>No hay imágenes disponibles para este examen.</div>;

  return (
    <div className="mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <button
          className="btn btn-outline-primary"
          onClick={handleBatchAction}
          disabled={!enableBatchButton}
        >
          {selectMode ? "Ejecutar predicción" : "Predicción por lotes"}
        </button>
      </div>

      <div className="row g-3">
        {paginated.map((image) => {
          const imageUrl = `http://localhost:8000/${image.url}`;
          return (
            <div key={image.id} className="col-sm-6 col-md-4 col-lg-3">
              <div
                className={`card position-relative image-card-hover ${
                  selectMode && image.iaLesion === "No detectado" ? "border-primary border" : ""
                }`}
                style={{ cursor: selectMode ? "pointer" : "default" }}
                onClick={
                  selectMode && image.iaLesion === "No detectado"
                    ? () => toggleSelectImage(image.id)
                    : undefined
                }
              >
                <div
                  className="delete-icon"
                  onClick={() => handleDeleteImage(image.id)}
                  title="Eliminar imagen"
                >
                  <IconTrash size={18} />
                </div>
                <img
                  src={imageUrl}
                  className="card-img-top"
                  alt={`Imagen ${image.label}`}
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.opacity = "0.3";
                    (e.target as HTMLImageElement).alt = "No disponible";
                  }}
                />

                <div className="card-body small">
                  <div className="d-flex justify-content-between mb-1">
                    <span className="text-muted small">
                      <strong>ID:</strong> {image.id}
                    </span>
                    <span className={`badge ${statusBadgeClass[image.status]}`}>{image.status}</span>
                  </div>

                  <div className="mb-2">
                    <strong>Hallazgos:</strong>
                    <div className="d-flex flex-wrap gap-1 mt-1">
                      {image.findings && image.findings.length > 0 ? (
                        image.findings.map((f) => (
                          <span key={f} className="badge bg-lime-lt text-dark">
                            {f}
                          </span>
                        ))
                      ) : (
                        <span className="text-muted">Ninguno</span>
                      )}
                    </div>
                  </div>

                  <div className="mb-2">
                    <strong>Lesión IA:</strong>{" "}
                    <span
                      className={`badge ${
                        image.iaLesion === "No detectado" ? "bg-red-lt" : "bg-green-lt"
                      }`}
                    >
                      {image.iaLesion}
                    </span>
                  </div>

                  {!selectMode && (
                    <div className="d-flex justify-content-between mt-3">
                      <button
                        className="btn btn-sm btn-outline-primary w-50 me-1"
                        onClick={() => handleOpenModal(image)}
                      >
                        Ver
                      </button>
                      <a
                        href={imageUrl}
                        download
                        className="btn btn-sm btn-outline-dark w-50"
                      >
                        Descargar
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {totalPages > 1 && (
        <div className="mt-4 d-flex justify-content-center">
          <ul className="pagination">
            {Array.from({ length: totalPages }, (_, i) => (
              <li key={i} className={`page-item ${i + 1 === page ? "active" : ""}`}>
                <button className="page-link" onClick={() => setPage(i + 1)}>
                  {i + 1}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {selectedImage && (
        <UnifiedExamImageModal
          imageData={selectedImage}
          examId={examId}
          isOpen={modalOpen}
          onClose={handleClose}
        />
      )}
    </div>
  );
};

export default ExamImageGallerySection;
