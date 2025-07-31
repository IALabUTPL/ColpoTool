import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Button, Card, Alert } from "tabler-react"; // Si estás usando Tabler

interface Props {
  onSuccess?: () => void;
}

function RegisterPatientWizard({ onSuccess }: Props) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    birthdate: '',
    phone: '',
    address: '',
    national_doc: '',
    weight: '',
    occupation: "",
    family_income: "",
    prior_cc_diagnosis: false,
    height: '',
    blood_pressure: '',
    blood_group: '',
    early_detection: false,
    marital_status: '',
    menarche_age: '',
    cycle_days: '',
    pregnancies: '',
    births: '',
    abortions: '',
    contraceptive_use: false,
    contraceptive_type: '',
    smoking: false,
    alcohol: false,
    sexual_activity: false,
    sexual_partners: '',
    active_life: false,
    clinical_notes: '',
    age_sex_start: '',
    vaccinated_hpv: false,
    education_level: '',
  });

  const navigate = useNavigate();

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    const finalValue =
      type === "checkbox" && "checked" in e.target
        ? (e.target as HTMLInputElement).checked
        : value;

    if (name === "sexual_activity" && type === "checkbox") {
      const isChecked = (e.target as HTMLInputElement).checked;
      setFormData((prevData) => ({
        ...prevData,
        [name]: isChecked,
        sexual_partners: isChecked ? prevData.sexual_partners : "0",
      }));
    } else if (name === "contraceptive_use" && type === "checkbox") {
      const isChecked = (e.target as HTMLInputElement).checked;
      setFormData((prevData) => ({
        ...prevData,
        [name]: isChecked,
        contraceptive_type: isChecked ? prevData.contraceptive_type : "",
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: finalValue,
      }));
    }
  };

  const nextStep = () => setStep((prev) => Math.min(prev + 1, 5));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));
  const resetSteps = () => setStep(1);

  const stepLabels = [
    "Información personal",
    "Clínica general",
    "Ginecológica",
    "Estilo de vida",
    "Observaciones",
  ];

  const handleSave = async () => {
    try {
      setLoading(true);
      setShowSuccess(false);

      const token = localStorage.getItem("access_token");

      const response = await axios.post(
        "http://localhost:8000/api/patients/create/",
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const newPatientId = response.data?.id;

      if (!newPatientId) {
        console.warn("No se obtuvo el ID del paciente.");
      }

      setShowSuccess(true);
    } catch (error) {
      console.error("Error al guardar el paciente:", error);
      alert("Error al guardar el paciente. Intente nuevamente.");
    } finally {
      setLoading(false);
      if (onSuccess) onSuccess();
      resetSteps();
    }
  };

  return (
    <div>
      {/* Stepper visual */}
      <div className="mb-5">
        <div className="steps steps-counter steps-lime">
          {stepLabels.map((label, index) => (
            <div
              key={index}
              className={`step-item ${
                step === index + 1
                  ? "active"
                  : step > index + 1
                  ? "completed"
                  : ""
              }`}
              title={label}
            >
              <div className="step-label text-center">{label}</div>
            </div>
          ))}
        </div>
      </div>
      {/* AQUI VAN LOS FORMULARIOS */}

       {/* Paso 1 - Información personal */}
{step === 1 && (
  <div className="row g-3">
    <div className="col-md-6">
      <label className="form-label">Nombre</label>
      <input
        type="text"
        className="form-control"
        name="first_name"
        value={formData.first_name}
        onChange={handleChange}
      />
    </div>
    <div className="col-md-6">
      <label className="form-label">Apellido</label>
      <input
        type="text"
        className="form-control"
        name="last_name"
        value={formData.last_name}
        onChange={handleChange}
      />
    </div>
    <div className="col-md-4">
      <label className="form-label">Fecha de nacimiento</label>
      <input
        type="date"
        className="form-control"
        name="birthdate"
        value={formData.birthdate}
        onChange={handleChange}
      />
    </div>
    <div className="col-md-4">
      <label className="form-label">Teléfono</label>
      <input
        type="text"
        className="form-control"
        name="phone"
        value={formData.phone}
        onChange={handleChange}
      />
    </div>
    <div className="col-md-4">
      <label className="form-label">Cédula / DNI</label>
      <input
        type="text"
        className="form-control"
        name="national_doc"
        value={formData.national_doc}
        onChange={handleChange}
      />
    </div>
    
    <div className="col-md-3">
      <label className="form-label">Ocupación</label>
      <input
        type="text"
        className="form-control"
        name="occupation"
        value={formData.occupation}
        onChange={handleChange}
      />
    </div>
    <div className="col-md-3">
                <label className="form-label">Estado civil</label>
                <select className="form-select" name="marital_status" value={formData.marital_status} onChange={handleChange}>
                  <option value="">Seleccione</option>
                  <option>Soltero/a</option>
                  <option>Casado/a</option>
                  <option>Unión libre</option>
                  <option>Divorciado/a</option>
                  <option>Viudo/a</option>
                </select>
              </div>
              <div className="col-md-3">
  <label className="form-label">Nivel educativo</label>
  <select
    className="form-select"
    name="education_level"
    value={formData.education_level}
    onChange={handleChange}
  >
    <option value="">Seleccione</option>
    <option value="Primaria incompleta">Primaria incompleta</option>
    <option value="Primaria completa">Primaria completa</option>
    <option value="Secundaria incompleta">Secundaria incompleta</option>
    <option value="Secundaria completa">Secundaria completa</option>
    <option value="Técnico">Técnico</option>
    <option value="Tecnológico">Tecnológico</option>
    <option value="Universitario">Universitario</option>
    <option value="Postgrado">Postgrado</option>
    <option value="Otro">Otro</option>
  </select>
</div>
    <div className="col-md-3">
  <label className="form-label">Ingreso familiar (USD)</label>
  <div className="input-group">
    <span className="input-group-text">$</span>
    <input
      type="number"
      min="0"
      className="form-control"
      name="family_income"
      value={formData.family_income}
      onChange={handleChange}
    />
  </div>
</div>

    <div className="col-12">
      <label className="form-label">Dirección</label>
      <textarea
        className="form-control"
        rows={2}
        name="address"
        value={formData.address}
        onChange={handleChange}
      ></textarea>
    </div>
  </div>
)}


        {/* Paso 2 - Información clínica general */}
        {step === 2 && (
          <div className="mt-5">
            <h4 className="mb-3">Información clínica general</h4>
            <div className="row g-3">
              <div className="col-md-4">
                <label className="form-label">Peso (kg)</label>
                <input type="number" className="form-control" name="weight" value={formData.weight} onChange={handleChange} />
              </div>
              <div className="col-md-4">
                <label className="form-label">Talla (cm)</label>
                <input type="number" className="form-control" name="height" value={formData.height} onChange={handleChange} />
              </div>
              <div className="col-md-4">
                <label className="form-label">Presión arterial</label>
                <input
                  type="number"
                  className="form-control"
                  name="blood_pressure"
                  value={formData.blood_pressure}
                  onChange={handleChange}
                />

              </div>
              <div className="col-md-4">
                <label className="form-label">Grupo sanguíneo</label>
                <select className="form-select" name="blood_group" value={formData.blood_group} onChange={handleChange}>
                  <option value="">Seleccione</option>
                  <option>A+</option>
                  <option>A-</option>
                  <option>B+</option>
                  <option>B-</option>
                  <option>AB+</option>
                  <option>AB-</option>
                  <option>O+</option>
                  <option>O-</option>
                </select>
              </div>
              
              <div className="col-md-4">
                <label className="form-check form-switch">
                  <input className="form-check-input" type="checkbox" name="early_detection" checked={formData.early_detection} onChange={handleChange} />
                  <span className="form-check-label">Participa en detección temprana</span>
                </label>
              </div>
              <div className="col-md-4">
                <label className="form-check form-switch">
                  <input className="form-check-input" type="checkbox" name="prior_cc_diagnosis" checked={formData.prior_cc_diagnosis} onChange={handleChange} />
                  <span className="form-check-label">¿Diagnóstico previo de cáncer de cuello uterino?</span>
                </label>
              </div>
            </div>
          </div>
        )}
{/* Paso 3 - Antecedentes ginecológicos */}
{step === 3 && (
  <div className="mt-5">
    <h4 className="mb-3">Antecedentes ginecológicos</h4>
    <div className="row g-3">
      <div className="col-md-4">
        <label className="form-label">Edad de inicio de vida sexual</label>
        <input
          type="number"
          className="form-control"
          name="age_sex_start"
          value={formData.age_sex_start}
          onChange={handleChange}
        />
      </div>

      <div className="col-md-4">
        <label className="form-label">Edad de menarquia</label>
        <input
          type="number"
          className="form-control"
          name="menarche_age"
          value={formData.menarche_age}
          onChange={handleChange}
        />
      </div>

      <div className="col-md-4">
        <label className="form-label">Duración del ciclo (días)</label>
        <input
          type="number"
          className="form-control"
          name="cycle_days"
          value={formData.cycle_days}
          onChange={handleChange}
        />
      </div>

      <div className="col-md-4">
        <label className="form-label">Embarazos (G)</label>
        <input
          type="number"
          className="form-control"
          name="pregnancies"
          value={formData.pregnancies}
          onChange={handleChange}
        />
      </div>

      <div className="col-md-4">
        <label className="form-label">Partos (P)</label>
        <input
          type="number"
          className="form-control"
          name="births"
          value={formData.births}
          onChange={handleChange}
        />
      </div>

      <div className="col-md-4">
        <label className="form-label">Abortos (A)</label>
        <input
          type="number"
          className="form-control"
          name="abortions"
          value={formData.abortions}
          onChange={handleChange}
        />
      </div>

      <div className="col-md-6">
        <label className="form-check form-switch">
          <input
            className="form-check-input"
            type="checkbox"
            name="contraceptive_use"
            checked={formData.contraceptive_use}
            onChange={handleChange}
          />
          <span className="form-check-label">¿Usa anticonceptivos?</span>
        </label>
      </div>

      <div className="col-md-6">
        <label className="form-label">Tipo de anticonceptivo</label>
        <input
          type="text"
          className={`form-control ${
            !formData.contraceptive_use ? "cursor-not-allowed" : ""
          }`}
          name="contraceptive_type"
          value={formData.contraceptive_type}
          onChange={handleChange}
          disabled={!formData.contraceptive_use}
        />
      </div>
    </div>
  </div>
)}



{step === 4 && (
  <div className="mt-5">
    <h4 className="mb-3">Estilo de vida y factores de riesgo</h4>
    <div className="row g-3">
      <div className="col-md-4">
        <label className="form-check form-switch">
          <input
            className="form-check-input"
            type="checkbox"
            name="smoking"
            checked={formData.smoking}
            onChange={handleChange}
          />
          <span className="form-check-label">¿Fuma?</span>
        </label>
      </div>

      <div className="col-md-4">
        <label className="form-check form-switch">
          <input
            className="form-check-input"
            type="checkbox"
            name="alcohol"
            checked={formData.alcohol}
            onChange={handleChange}
          />
          <span className="form-check-label">¿Consume alcohol?</span>
        </label>
      </div>

      <div className="col-md-4">
        <label className="form-check form-switch">
          <input
            className="form-check-input"
            type="checkbox"
            name="active_life"
            checked={formData.active_life}
            onChange={handleChange}
          />
          <span className="form-check-label">¿Actividad física regular?</span>
        </label>
      </div>

      <div className="col-md-4">
        <label className="form-check form-switch">
          <input
            className="form-check-input"
            type="checkbox"
            name="sexual_activity"
            checked={formData.sexual_activity}
            onChange={handleChange}
          />
          <span className="form-check-label">¿Vida sexual activa?</span>
        </label>
      </div>

      <div className="col-md-4">
        <label className="form-label">Número de parejas sexuales</label>
        <input
          type="number"
          className={`form-control ${!formData.sexual_activity ? 'cursor-not-allowed bg-gray-100' : ''}`}
          name="sexual_partners"
          value={formData.sexual_partners}
          onChange={handleChange}
          disabled={!formData.sexual_activity}
        />
      </div>
    </div>
  </div>
)}

          {/* Paso 5 - Observaciones clínicas */}
          {step === 5 && (
            <div className="mt-5">
              <h4 className="mb-3">Observaciones clínicas</h4>
              <div className="row g-3">
                <div className="col-12">
                  <label className="form-label">Notas del médico</label>
                  <textarea
                    className="form-control"
                    rows={5}
                    name="clinical_notes"
                    placeholder="Ingrese observaciones clínicas relevantes..."
                    value={formData.clinical_notes}
                    onChange={handleChange}
                  ></textarea>
                </div>
              </div>
            </div>
          )}
      {/* Indicadores y botones */}
      {loading && (
        <div className="alert alert-info mt-3" role="alert">
          Guardando información del paciente...
        </div>
      )}
      {showSuccess && (
        <div className="alert alert-success mt-3" role="alert">
          Paciente registrado exitosamente.
        </div>
      )}
      <div className="mt-4 d-flex justify-content-between">
        {step > 1 ? (
          <button
            className="btn btn-secondary"
            onClick={prevStep}
            disabled={loading}
          >
            Anterior
          </button>
        ) : (
          <div />
        )}

        {step < 5 ? (
          <button
            className="btn btn-primary"
            onClick={nextStep}
            disabled={loading}
          >
            Siguiente
          </button>
        ) : (
          <button
            className="btn btn-success"
            onClick={handleSave}
            disabled={loading}
          >
            Guardar paciente
          </button>
        )}
      </div>
    </div>
  );
}

export default RegisterPatientWizard;
