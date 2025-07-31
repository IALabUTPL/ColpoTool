import React from "react";

interface ExamImage {
  id: string;
  url: string;
  label: string;
}

interface ExamImageGalleryProps {
  images: ExamImage[];
  onClickImage?: (id: string) => void;
}

const ExamImageGallery: React.FC<ExamImageGalleryProps> = ({ images, onClickImage }) => {
  if (images.length === 0) {
    return <p className="text-muted">No se han agregado imágenes.</p>;
  }

  return (
    <div
      className="d-flex flex-wrap gap-3"
      style={{ justifyContent: "flex-start" }}
    >
      {images.map((image) => (
        <div
          key={image.id}
          className="card"
          style={{ width: "160px", cursor: "pointer" }}
          onClick={() => onClickImage?.(image.id)}
        >
          <img
            src={image.url}
            alt={image.label}
            className="card-img-top"
            style={{ objectFit: "cover", height: "120px" }}
          />
          <div className="card-body p-2 text-center">
            <small className="text-muted">{image.label}</small>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ExamImageGallery;
