/* File: D:\\Users\\Isra\\Documents\\COLPOTOOL\\ColpoTool\\web\\frontend\\src\\pages\\models\\ModelMetrics.tsx */

import React from "react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

const iouDiceMetrics = [
  { name: "UNet", IoU: 0.87, DICE: 0.91 },
  { name: "UNet++", IoU: 0.89, DICE: 0.93 },
];

const mapMetrics = [
  { name: "Detectron2", mAP: 0.852 },
  { name: "YOLOv8", mAP: 0.874 },
];

const confusionMatrixData = [
  { label: "Verdadero Positivo", value: 62 },
  { label: "Falso Positivo", value: 8 },
  { label: "Falso Negativo", value: 6 },
  { label: "Verdadero Negativo", value: 24 },
];

const ModelMetrics: React.FC = () => {
  return (
    <div className="page-body">
      <div className="container-xl">
        <div className="row row-cards">
          <div className="col-md-6">
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">IoU / DICE - Modelos de Segmentación</h3>
              </div>
              <div className="card-body">
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={iouDiceMetrics} margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis domain={[0, 1]} />
                    <Tooltip />
                    <Bar dataKey="IoU" fill="#007B95" />
                    <Bar dataKey="DICE" fill="#8EA780" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="col-md-6">
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">mAP - Modelos de Detección</h3>
              </div>
              <div className="card-body">
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={mapMetrics} margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis domain={[0, 1]} />
                    <Tooltip />
                    <Bar dataKey="mAP" fill="#558B98" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="col-md-12">
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">Matriz de Confusión</h3>
              </div>
              <div className="card-body">
                <table className="table table-bordered text-center">
                  <thead>
                    <tr>
                      {confusionMatrixData.map((cell, idx) => (
                        <th key={idx}>{cell.label}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      {confusionMatrixData.map((cell, idx) => (
                        <td key={idx}><strong>{cell.value}</strong></td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ModelMetrics;