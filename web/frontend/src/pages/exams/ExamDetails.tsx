// ✅ ARCHIVO: frontend/src/pages/exams/ExamDetails.tsx

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import ExamInfoGrid from "../../components/exams/ExamInfoGrid";
import ExamImageWorkspace from "../../components/exams/ExamImageWorkspace";
import AccordionCard from "../../components/shared/AccordionCard";

const ExamDetails: React.FC = () => {
  const { id } = useParams();
  const [examData, setExamData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExamData = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/exams/id/${id}/`);
        setExamData(response.data);
      } catch (error) {
        console.error("Error al cargar los datos del examen:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchExamData();
  }, [id]);

  if (loading) return <div className="text-center">Cargando examen...</div>;
  if (!examData) return <div className="text-danger text-center">No se encontraron datos del examen.</div>;

  return (
    <div className="page-body container-xl mt-4">

      {/* 🧾 Detalle del Examen dentro de acordeón */}
      <AccordionCard title={`🧾 Detalle del Examen - ${examData.exam_code}`} open={false}>
        <ExamInfoGrid
          examDate={examData.exam_date}
          furDate={examData.fur}
          indication={examData.exam_indication}
          ccvHistory={examData.ccv_history}
          ets={examData.ets}
          planning={examData.planning_method}
          recentSexualIntercourse={examData.recent_sex}
          priorDiagnosis={examData.prior_diagnosis}
          papDone={examData.pap_done}
          papDate={examData.pap_date}
          papResult={examData.pap_result}
        />
      </AccordionCard>

      {/* 🖼️ Módulo visual interactivo de imágenes */}
      <div className="card mt-4">
        <div className="card-header">
          <h3 className="card-title">🖼️ Análisis de imágenes del examen</h3>
        </div>
        <div className="card-body">
          <ExamImageWorkspace examId={examData.id} />
        </div>
      </div>
    </div>
  );
};

export default ExamDetails;