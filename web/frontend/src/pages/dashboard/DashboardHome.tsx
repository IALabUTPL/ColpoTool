import React, { useEffect, useState } from "react";
import {
  IconShoppingCart,
  IconUsers,
  IconBrandFacebook,
  IconShare3,
  IconCalendarEvent,
  IconCheck,
  IconMessage,
} from "@tabler/icons-react";
import axios from "axios";
import PageLoader from "../../components/PageLoader"; // Verifica esta ruta

interface ClinicalStat {
  label: string;
  value: number;
  percentage: number;
}

interface RecentExam {
  patientName: string;
  date: string;
  status: string;
  notes: string;
  avatar: string;
}

const DashboardHome = () => {
  const [metrics, setMetrics] = useState<{
    totalPatients: number;
    totalExams: number;
    totalPredictions: number;
    totalModels: number;
    recentExams: RecentExam[];
    clinicalStats: ClinicalStat[];
  }>({
    totalPatients: 0,
    totalExams: 0,
    totalPredictions: 0,
    totalModels: 0,
    recentExams: [],
    clinicalStats: [],
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await axios.get("http://localhost:8000/api/dashboard/summary", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setMetrics(response.data);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <PageLoader />;
  }

  return (
    <div className="page-body">
      <div className="container-xl">
        <div className="page-header d-print-none">
          <div className="row align-items-center">
            <div className="col">
              <h2 className="page-title">ColpoTool Dashboard</h2>
            </div>
          </div>
        </div>

        <div className="row row-deck row-cards mb-4">
          <div className="col-sm-6 col-lg-3">
            <div className="card">
              <div className="card-body">
                <h3 className="card-title">Pacientes registrados</h3>
                <div className="text-muted">Total</div>
                <div className="h1 mt-3 mb-0">{metrics.totalPatients}</div>
              </div>
            </div>
          </div>

          <div className="col-sm-6 col-lg-3">
            <div className="card">
              <div className="card-body">
                <h3 className="card-title">Exámenes realizados</h3>
                <div className="text-muted">Últimos 7 días</div>
                <div className="h1 mt-3 mb-0">{metrics.totalExams}</div>
              </div>
            </div>
          </div>

          <div className="col-sm-6 col-lg-3">
            <div className="card">
              <div className="card-body">
                <h3 className="card-title">Predicciones IA</h3>
                <div className="text-muted">Total generadas</div>
                <div className="h1 mt-3 mb-0">{metrics.totalPredictions}</div>
              </div>
            </div>
          </div>

          <div className="col-sm-6 col-lg-3">
            <div className="card">
              <div className="card-body">
                <h3 className="card-title">Modelos entrenados</h3>
                <div className="text-muted">Totales</div>
                <div className="h1 mt-3 mb-0">{metrics.totalModels}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="row row-cards mb-4">
          <div className="col-sm-6 col-lg-3">
            <div className="card card-sm">
              <div className="card-body d-flex align-items-center">
                <IconUsers size={24} className="text-primary me-3" />
                <div>
                  <div className="font-weight-medium">Pacientes</div>
                  <div className="text-muted">Acceder a lista</div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-sm-6 col-lg-3">
            <div className="card card-sm">
              <div className="card-body d-flex align-items-center">
                <IconShoppingCart size={24} className="text-green me-3" />
                <div>
                  <div className="font-weight-medium">Exámenes</div>
                  <div className="text-muted">Ver todos</div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-sm-6 col-lg-3">
            <div className="card card-sm">
              <div className="card-body d-flex align-items-center">
                <IconShare3 size={24} className="text-dark me-3" />
                <div>
                  <div className="font-weight-medium">Predicciones</div>
                  <div className="text-muted">Últimos análisis</div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-sm-6 col-lg-3">
            <div className="card card-sm">
              <div className="card-body d-flex align-items-center">
                <IconBrandFacebook size={24} className="text-blue me-3" />
                <div>
                  <div className="font-weight-medium">Modelos IA</div>
                  <div className="text-muted">Entrenados</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="row row-cards mt-4">
          <div className="col-md-6">
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">Distribución de factores clínicos</h3>
              </div>
              <div className="card-body">
                {metrics.clinicalStats.map((item, index) => (
                  <div className="mb-2" key={index}>
                    <div className="d-flex justify-content-between">
                      <span>{item.label}</span>
                      <span>{item.value}</span>
                    </div>
                    <div className="progress progress-sm">
                      <div
                        className="progress-bar"
                        role="progressbar"
                        style={{ width: `${item.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="col-md-6">
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">Últimos Pacientes Registrados</h3>
              </div>
              <div className="card-body p-0">
                <ul className="list-group list-group-flush">
                  {metrics.recentExams.map((item, idx) => (
                    <li className="list-group-item" key={idx}>
                      <div className="row align-items-center">
                        <div className="col">
                          <div>{item.patientName}</div>
                          <div className="text-muted small mt-1">
                            <IconCalendarEvent size={14} className="me-1" /> {item.date}
                            <span className="ms-3">
                              <IconCheck size={14} className="me-1" /> {item.status}
                            </span>
                            <span className="ms-3">
                              <IconMessage size={14} className="me-1" /> {item.notes}
                            </span>
                          </div>
                        </div>
                        <div className="col-auto">
                          <span
                            className="avatar avatar-sm"
                            style={{ backgroundImage: `url(${item.avatar})` }}
                          ></span>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;