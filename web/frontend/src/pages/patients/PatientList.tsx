import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
interface Patient {
  id: string;
  full_name: string;
  record_code: string;
  created_at: string;
}

const PatientList: React.FC = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const token = localStorage.getItem('access_token');
        const response = await axios.get('http://localhost:8000/api/patients/', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setPatients(response.data);
      } catch (error) {
        console.error('Error al obtener pacientes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, []);


  
  return (
    <div className="page">
      <div className="container-xl">
        <h2 className="page-title mb-3">Pacientes Registrados</h2>

        {loading ? (
          <div className="text-center">Cargando pacientes...</div>
        ) : (
          <div className="card">
            <div className="table-responsive">
              <table className="table card-table table-vcenter text-nowrap datatable">
                <thead>
                  <tr>
                    <th>Codigo</th>
                    <th>Nombre completo</th>
                    <th>Fecha de registro</th>
                    <th>Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {patients.map((patient) => {
                    console.log("Paciente en lista:", patient); // 👈 Aquí se imprime cada objeto
                    return (
                      <tr key={patient.id}>
                        <td>{patient.record_code}</td>
                        <td>{patient.full_name}</td>
                        <td>{new Date(patient.created_at).toLocaleDateString()}</td>
                        <td>
                          <Link
                            to={`/patients/view/${patient.id}`}
                            className="btn btn-outline-primary btn-sm"
                          >
                            Ver ficha médica
</Link>

                        </td>
                      </tr>
                    );
                  })}
                </tbody>

              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientList;
