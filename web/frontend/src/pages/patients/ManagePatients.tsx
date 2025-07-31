import React, { useEffect, useState } from "react";
import axios from "axios";
import RegisterPatientWizard from "../../components/patients/RegisterPatientWizard";
import AccordionCard from "../../components/shared/AccordionCard";
import PatientDataTable from "../../components/patients/PatientDataTable";
import { BasicPatient } from "../../types/types";

const ManagePatients: React.FC = () => {
  const [patients, setPatients] = useState<BasicPatient[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const fetchPatients = async () => {
    try {
      const token = localStorage.getItem("access_token");
      const response = await axios.get("http://localhost:8000/api/patients/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPatients(response.data);
    } catch (error) {
      console.error("Error al obtener pacientes:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const handlePatientRegistered = () => {
    fetchPatients();
    setShowForm(false);
  };

  const handleDeletePatient = async (id: string) => {
    if (!window.confirm("¿Deseas eliminar este paciente?")) return;
    try {
      const token = localStorage.getItem("access_token");
      await axios.delete(`http://localhost:8000/api/patients/delete/${id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchPatients();
    } catch (error) {
      console.error("Error al eliminar paciente:", error);
      alert("No se pudo eliminar el paciente.");
    }
  };

  return (
    <div className="page">
      <div className="container-xl">
        <h2 className="page-title mb-4">Gestión de Pacientes</h2>

        {/* Acordeón: Formulario de nuevo paciente */}
        <AccordionCard
          title="Nuevo Registro de Paciente"
          open={showForm}
          onToggle={() => setShowForm(!showForm)}
        >
          <RegisterPatientWizard onSuccess={handlePatientRegistered} />
        </AccordionCard>

        {loading ? (
          <div className="text-center">Cargando pacientes...</div>
        ) : (
          <PatientDataTable data={patients} onDelete={handleDeletePatient} />
        )}
      </div>
    </div>
  );
};

export default ManagePatients;