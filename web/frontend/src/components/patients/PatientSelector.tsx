import React from "react";

interface Patient {
  id: string;
  name: string;
  cedula: string;
}

interface PatientSelectorProps {
  onSelect: (patient: Patient) => void;
}

const mockPatients: Patient[] = [
  { id: "1", name: "María Fernanda López", cedula: "1102345678" },
  { id: "2", name: "Carlos Pérez", cedula: "1108765432" },
];

const PatientSelector: React.FC<PatientSelectorProps> = ({ onSelect }) => {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = e.target.value;
    const patient = mockPatients.find((p) => p.id === selectedId);
    if (patient) {
      onSelect(patient);
    }
  };

  return (
    <div>
      <label className="form-label">Seleccionar paciente</label>
      <select className="form-select" onChange={handleChange} defaultValue="">
        <option value="" disabled>-- Selecciona un paciente --</option>
        {mockPatients.map((patient) => (
          <option key={patient.id} value={patient.id}>
            {patient.name} — {patient.cedula}
          </option>
        ))}
      </select>
    </div>
  );
};

export default PatientSelector;
