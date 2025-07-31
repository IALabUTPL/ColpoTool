// src/components/patients/SelectAndConfirmPatient.tsx

import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

interface Patient {
  id: string; // UUID
  first_name: string;
  last_name: string;
  dni: string;
  record_code: string; // Solo visualización
}

const SelectAndConfirmPatient = ({
  onConfirm,
}: {
  onConfirm: (id: string) => void;
}) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Patient[]>([]);
  const [selected, setSelected] = useState<Patient | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    if (query.trim() === "") {
      setResults([]);
      return;
    }

    timeoutRef.current = setTimeout(async () => {
      try {
        const res = await axios.get(`/api/patients/search/?q=${query}`);
        setResults(res.data);
      } catch (error) {
        console.error("[🔴] Error en búsqueda:", error);
        setResults([]);
      }
    }, 300); // Espera 300ms antes de hacer la búsqueda

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [query]);

  return (
    <div className="card card-md">
      <div className="card-body">
        <h3 className="card-title">Buscar paciente</h3>
        <input
          type="text"
          className="form-control mb-2"
          placeholder="Nombre o cédula"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        {results.length > 0 && (
          <ul className="list-group mb-3">
            {results.map((patient) => (
              <li
                key={patient.id}
                className={`list-group-item list-group-item-action ${
                  selected?.id === patient.id ? "active" : ""
                }`}
                onClick={() => setSelected(patient)}
                style={{ cursor: "pointer" }}
              >
                {patient.first_name} {patient.last_name} ({patient.dni}) —{" "}
                <strong>{patient.record_code}</strong>
              </li>
            ))}
          </ul>
        )}

        {selected && (
          <button
            className="btn btn-primary w-100"
            onClick={() => onConfirm(selected.id)}
          >
            Mostrar ficha médica
          </button>
        )}
      </div>
    </div>
  );
};

export default SelectAndConfirmPatient;
