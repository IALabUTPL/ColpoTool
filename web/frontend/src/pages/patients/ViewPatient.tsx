// src/pages/patients/ViewPatient.tsx

import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import PatientMedicalRecord from "../../components/patients/PatientMedicalRecord";
import SelectAndConfirmPatient from "../../components/patients/SelectAndConfirmPatient";

const ViewPatient = () => {
  const { codigo } = useParams(); // UUID si viene por URL
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Si llega por URL (desde tabla), usamos ese UUID
  useEffect(() => {
    if (codigo) {
      console.log("[🟡] UUID recibido por URL:", codigo);
      setSelectedId(codigo);
    }
  }, [codigo]);

  // Handler para selección manual (desde sidebar)
  const handleManualSelection = (id: string) => {
    console.log("[🟣] Confirmado manualmente:", id);
    setSelectedId(id);
  };

  return (
    <div className="page-body container-xl mt-4">
      {!selectedId && (
        <>
          <div className="alert alert-info mb-3">
            Por favor, seleccione un paciente para ver su ficha médica.
          </div>
          <SelectAndConfirmPatient onConfirm={handleManualSelection} />
        </>
      )}

      {selectedId && (
        <>
          <div className="alert alert-success mb-3">
            [✅] Mostrando ficha de paciente seleccionado
          </div>
          <PatientMedicalRecord key={selectedId} codigo={selectedId} />
        </>
      )}
    </div>
  );
};

export default ViewPatient;
