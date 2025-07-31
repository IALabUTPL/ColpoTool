import React from "react";
import PatientInfoCard from "./PatientInfoCard";
import LesionPreview from "./LesionPreview";
import PredictionChart from "./PredictionChart";

const IAResultsSummary: React.FC = () => {
  const mockImages = [
    {
      id: "img1",
      originalUrl: "/assets/samples/001/original1.jpg",
      segmentedUrl: "/assets/samples/001/original1-s.jpg",
    },
    {
      id: "img2",
      originalUrl: "/assets/samples/001/original2.jpg",
      segmentedUrl: "/assets/samples/001/original2-s.jpg",
    },
  ];

  const predictionData = [
    { label: "Normal", value: 40 },
    { label: "Lesión Leve", value: 30 },
    { label: "Lesión Grave", value: 20 },
    { label: "Inconcluso", value: 10 },
  ];

  return (
    <div className="p-6">
      <PatientInfoCard />
      <LesionPreview images={mockImages} />
      <PredictionChart data={predictionData} />
    </div>
  );
};

export default IAResultsSummary;
