import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

import ImageModal from "../../components/exams/ImageModal";
import DropzoneCard from "../../components/exams/DropzoneCard";
import QRCodeCard from "../../components/exams/QRCodeCard";
import ExamImageGallery from "../../components/exams/ExamImageGallery";
import AccordionCard from "../../components/shared/AccordionCard";

interface PatientShortInfo {
  id: string;
  name: string;
  cedula: string;
  record_code: string;
}

const RegisterExam: React.FC = () => {
  const navigate = useNavigate();
  const { patientId } = useParams<{ patientId?: string }>();

  const [examId, setExamId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<PatientShortInfo | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<PatientShortInfo[]>([]);
  const [uploadedImages, setUploadedImages] = useState<Array<{ id: string; url: string; label: string }>>([]);
  const [patientAccordionOpen, setPatientAccordionOpen] = useState(true);

  const [fur, setFur] = useState("");
  const [examIndication, setExamIndication] = useState(""); // motivo_referencia
  const [ccvHistory, setCcvHistory] = useState("");           // detalle_motivo
  const [hasEts, setHasEts] = useState(false);                // has_ets
  const [ets, setEts] = useState<string>("");                 // ets (solo si hasEts)
  const [recentSex, setRecentSex] = useState(false);         // recent_sexual_activity
  const [papDone, setPapDone] = useState(false);             // pap_done
  const [lastPap, setLastPap] = useState("");                // pap_date
  const [papResult, setPapResult] = useState("");            // pap_result

  const stepLabels = ["Datos generales del examen", "Carga de imágenes"];

  // --------- AQUÍ la lógica CORRECTA -----------
  useEffect(() => {
    if (!patientId) return;
    const isValidUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(patientId);

    if (isValidUUID) {
      axios.get(`/api/patients/id/${patientId}`)
        .then((res) => {
          const p = res.data;
          setSelectedPatient({
            id: patientId,
            name: `${p.first_name} ${p.last_name}`,
            cedula: p.dni,
            record_code: p.record_code
          });
          setSearchTerm(`${p.first_name} ${p.last_name} - ${p.dni}`);
        })
        .catch((err) => {
          console.error("❌ Error al cargar paciente desde ficha médica:", err);
        });
    }
  }, [patientId]);
  // ------------ FIN lógica --------------

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (!selectedPatient && searchTerm.length >= 1) {
        axios.get(`/api/patients/search?q=${encodeURIComponent(searchTerm)}`)
          .then((res) => {
            const results = res.data.map((p: any) => ({
              id: p.id,
              name: `${p.first_name} ${p.last_name}`,
              cedula: p.dni,
              record_code: p.record_code,
            }));
            setSearchResults(results);
          })
          .catch((err) => {
            console.error("❌ Error al buscar pacientes:", err);
          });
      } else {
        setSearchResults([]);
      }
    }, 300);
    return () => clearTimeout(delayDebounce);
  }, [searchTerm, selectedPatient]);

  const handleSelectPatient = (p: PatientShortInfo) => {
    setSelectedPatient(p);
    setSearchTerm(`${p.name} - ${p.cedula}`);
    setSearchResults([]);
  };

  // ...el resto igual que tenías...


  const handleSaveExam = async () => {
    if (!selectedPatient) {
      alert("Selecciona un paciente antes de guardar el examen.");
      return;
    }
    try {
      setLoading(true);
      const token = localStorage.getItem("access_token");

      const response = await axios.post(
        "http://localhost:8000/api/exams/create/",
        {
          patient_id: selectedPatient.id,
          fur: fur || null,
          has_ets: hasEts,
          ets: hasEts ? ets : null,
          detalle_motivo: ccvHistory || null,
          motivo_referencia: examIndication || null,
          recent_sexual_activity: recentSex,
          pap_done: papDone,
          pap_date: papDone ? lastPap : null,
          pap_result: papDone ? papResult : null,
          examiner_id: null,
          examiner_codigo: 1001
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const newExamId = response.data.exam_id;
      setExamId(newExamId);
      setPatientAccordionOpen(false);
      setStep(2);
    } catch (error) {
      alert("Ocurrió un error al guardar el examen.");
    } finally {
      setLoading(false);
    }
  };

  const handleImageClick = (id: string) => {
    setSelectedImage(id);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedImage(null);
  };

  const nextStep = () => {
    if (step === 1) setPatientAccordionOpen(false);
    setStep((prev) => Math.min(prev + 1, stepLabels.length));
  };

  const prevStep = () => {
    if (step === 2) setPatientAccordionOpen(true);
    setStep((prev) => Math.max(prev - 1, 1));
  };

  return (
    <div className="page-body container-xl mt-4">
      <h2 className="mb-4">Registrar Examen Colposcópico</h2>

      <AccordionCard
        title={selectedPatient ? `Paciente: ${selectedPatient.name}` : "Seleccionar paciente"}
        open={patientAccordionOpen}
        onToggle={() => setPatientAccordionOpen(!patientAccordionOpen)}
      >
        <input
          type="text"
          className="form-control mb-2"
          placeholder="Buscar por nombre o cédula"
          value={searchTerm}
          disabled={!!selectedPatient}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {searchResults.length > 0 && (
          <ul className="list-group mb-3">
            {searchResults.map((p) => (
              <li
                key={p.id}
                className="list-group-item list-group-item-action"
                style={{ cursor: "pointer" }}
                onClick={() => handleSelectPatient(p)}
              >
                {p.name} - {p.cedula}
              </li>
            ))}
          </ul>
        )}
        {selectedPatient && (
          <div className="alert alert-info">
            <p className="mb-1"><strong>Nombre:</strong> {selectedPatient.name}</p>
            <p className="mb-0"><strong>Cédula:</strong> {selectedPatient.cedula}</p>
          </div>
        )}
      </AccordionCard>

      <div className="steps steps-counter steps-lime mb-4">
        {stepLabels.map((label, index) => (
          <div
            key={index}
            className={`step-item ${step === index + 1 ? "active" : step > index + 1 ? "completed" : ""}`}
          >
            <div className="step-label text-center">{label}</div>
          </div>
        ))}
      </div>

      {step === 1 && (
        <div className="card mb-4">
          <div className="card-header">
            <h3 className="card-title">Datos generales del examen</h3>
            <p className="text-muted mb-0">Fecha del examen: {new Date().toLocaleDateString()}</p>
          </div>
          <div className="card-body">
            <div className="row g-3">
              {/* Motivo de referencia */}
              <div className="col-md-6">
                <label className="form-label">Motivo de referencia</label>
                <select
                  className="form-select"
                  value={examIndication}
                  onChange={(e) => setExamIndication(e.target.value)}
                >
                  <option value="">Seleccione</option>
                  <option value="Resultado anormal en PAP">Resultado anormal en PAP</option>
                  <option value="Seguimiento post-tratamiento">Seguimiento post-tratamiento</option>
                  <option value="Control programado">Control programado</option>
                </select>
              </div>
              {/* Detalles del motivo */}
              <div className="col-md-6">
                <label className="form-label">Detalles del motivo</label>
                <textarea
                  className="form-control"
                  rows={2}
                  value={ccvHistory}
                  onChange={(e) => setCcvHistory(e.target.value)}
                />
              </div>
              {/* FUR */}
              <div className="col-md-4">
                <label className="form-label">FUR (fecha de última menstruación)</label>
                <input
                  type="date"
                  className="form-control"
                  value={fur}
                  onChange={(e) => setFur(e.target.value)}
                />
              </div>
              {/* Switch: ¿Tiene ETS? */}
              <div className="col-md-4">
                <label className="form-check form-switch mt-4">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    checked={hasEts}
                    onChange={(e) => {
                      setHasEts(e.target.checked);
                      if (!e.target.checked) setEts("");
                    }}
                  />
                  <span className="form-check-label">¿Antecedentes de ETS?</span>
                </label>
              </div>
              {/* Campo ETS (si aplica) */}
              {hasEts && (
                <div className="col-md-4">
                  <label className="form-label">ETS (especificar)</label>
                  <input
                    type="text"
                    className="form-control"
                    value={ets}
                    onChange={(e) => setEts(e.target.value)}
                  />
                </div>
              )}
              {/* Relaciones sexuales recientes */}
              <div className="col-md-4">
                <label className="form-check form-switch mt-4">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    checked={recentSex}
                    onChange={(e) => setRecentSex(e.target.checked)}
                  />
                  <span className="form-check-label">¿Relaciones sexuales recientes?</span>
                </label>
              </div>
              {/* Switch: ¿Se realizó PAP? */}
              <div className="col-md-4">
                <label className="form-check form-switch mt-4">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    checked={papDone}
                    onChange={(e) => {
                      const checked = e.target.checked;
                      setPapDone(checked);
                      if (!checked) {
                        setLastPap("");
                        setPapResult("");
                      }
                    }}
                  />
                  <span className="form-check-label">¿Se ha realizado un PAP?</span>
                </label>
              </div>
              {/* Fecha del PAP */}
              {papDone && (
                <div className="col-md-4">
                  <label className="form-label">Fecha del último PAP</label>
                  <input
                    type="date"
                    className="form-control"
                    value={lastPap}
                    onChange={(e) => setLastPap(e.target.value)}
                  />
                </div>
              )}
              {/* Resultado del PAP */}
              {papDone && (
                <div className="col-md-4">
                  <label className="form-label">Resultado del PAP</label>
                  <select
                    className="form-select"
                    value={papResult}
                    onChange={(e) => setPapResult(e.target.value)}
                  >
                    <option value="">Seleccione</option>
                    <option value="Negativo para lesión">Negativo para lesión</option>
                    <option value="ASC-US">ASC-US</option>
                    <option value="LIE-BG">LIE-BG</option>
                    <option value="LIE-AG">LIE-AG</option>
                    <option value="Sospecha de CC">Sospecha de CC</option>
                    <option value="Diagnóstico confirmado de CC">Diagnóstico confirmado de CC</option>
                  </select>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {step === 2 && examId && selectedPatient && (
        <>
          <div className="card mb-4">
            <div className="card-header">
              <h3 className="card-title">Carga de imágenes</h3>
            </div>
            <div className="card-body">
              <div className="row g-4">
                <div className="col-md-6">
                  <DropzoneCard
                    onUpload={setUploadedImages}
                    examId={examId}
                    patientCode={selectedPatient.record_code}
                  />
                </div>
                <div className="col-md-6">
                  <QRCodeCard patientId={selectedPatient.id} />
                </div>
              </div>
            </div>
          </div>

          <div className="card mb-4">
            <div className="card-header">
              <h3 className="card-title">Imágenes colposcópicas registradas</h3>
            </div>
            <div className="card-body">
              <ExamImageGallery
                images={uploadedImages}
                onClickImage={handleImageClick}
              />
            </div>
          </div>
        </>
      )}

      <div className="d-flex justify-content-between mt-4">
        {step > 1 ? (
          <button className="btn btn-secondary" onClick={prevStep}>
            Anterior
          </button>
        ) : (
          <div />
        )}

        {step === 1 ? (
          <button
            className="btn btn-primary"
            onClick={handleSaveExam}
            disabled={loading}
          >
            {loading ? "Guardando..." : "Guardar y continuar"}
          </button>
        ) : (
          <button
            className="btn btn-success"
            onClick={() => navigate(`/exams/details/${examId || "temporal"}`)}
          >
            Finalizar
          </button>
        )}
      </div>

      {modalVisible && selectedImage && (
        <ImageModal imageId={selectedImage} onClose={handleCloseModal} />
      )}
    </div>
  );
};

export default RegisterExam;
