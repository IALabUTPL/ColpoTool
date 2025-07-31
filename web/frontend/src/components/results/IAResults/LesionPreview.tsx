import React, { useState } from "react";

interface LesionPreviewProps {
  images: {
    id: string;
    originalUrl: string;
    segmentedUrl: string;
  }[];
}

const LesionPreview: React.FC<LesionPreviewProps> = ({ images }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  return (
    <div className="mb-8">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Imágenes Colposcópicas Procesadas</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {images.map((img) => (
          <div key={img.id} className="border rounded-lg shadow-sm overflow-hidden">
            <img
              src={img.originalUrl}
              alt="Imagen original"
              className="w-full h-48 object-cover cursor-pointer"
              onClick={() => setSelectedImage(img.originalUrl)}
            />
            <img
              src={img.segmentedUrl}
              alt="Imagen segmentada"
              className="w-full h-48 object-cover cursor-pointer border-t"
              onClick={() => setSelectedImage(img.segmentedUrl)}
            />
          </div>
        ))}
      </div>

      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center" onClick={() => setSelectedImage(null)}>
          <img src={selectedImage} alt="Vista ampliada" className="max-w-4xl max-h-[90vh] rounded-lg shadow-lg" />
        </div>
      )}
    </div>
  );
};

export default LesionPreview;