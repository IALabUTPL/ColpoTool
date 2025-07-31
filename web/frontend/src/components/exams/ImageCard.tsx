import React from "react";

interface ImageCardProps {
  imageUrl: string;
  label: string;
  onClick: () => void;
}

const ImageCard: React.FC<ImageCardProps> = ({ imageUrl, label, onClick }) => {
  return (
    <div
      className="card shadow-sm cursor-pointer"
      style={{ width: "200px", cursor: "pointer" }}
      onClick={onClick}
    >
      <img
        src={imageUrl}
        alt={label}
        className="card-img-top"
        style={{ height: "150px", objectFit: "cover" }}
      />
      <div className="card-body p-2 text-center">
        <p className="card-text mb-0">{label}</p>
      </div>
    </div>
  );
};

export default ImageCard;
