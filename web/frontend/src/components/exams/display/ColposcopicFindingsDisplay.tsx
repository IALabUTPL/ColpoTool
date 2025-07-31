import React from "react";

const badge = (label: string, color: string = "blue") => (
  <span className={`badge bg-${color}-lt text-${color}-lt-fg me-2 mb-2`}>
    {label}
  </span>
);

const ColposcopicFindingsDisplay = ({ data }: { data: any }) => {
  if (!data) return null;

  return (
    <div className="mt-4">
      <h5>Hallazgos colposcópicos</h5>
      <div className="mb-2">
        <strong>Hallazgos normales:</strong> {data.normales.map((n: string) => badge(n, "green"))}
      </div>
      <div className="mb-2">
        <strong>Zonas evaluadas:</strong> {data.zonasEvaluadas.map((z: string) => badge(z, "teal"))}
      </div>
      <div className="mb-2">
        <strong>Cambios menores:</strong> {data.anormalesMenores.map((m: string) => badge(m, "yellow"))}
      </div>
      <div className="mb-2">
        <strong>Cambios mayores:</strong> {data.anormalesMayores.map((m: string) => badge(m, "red"))}
      </div>
      <div className="mb-2">
        <strong>Yodo:</strong> {data.yodo ? badge(data.yodo, "purple") : "—"}
      </div>
      <div className="mb-2">
        <strong>Impresión diagnóstica:</strong> {data.impresion ? badge(data.impresion, "orange") : "—"}
      </div>
      <div className="mb-2">
        <strong>Calidad:</strong> {data.calidad ? badge(data.calidad, "cyan") : "—"}
      </div>
      {data.sospechaCancer && (
        <div className="mt-2">{badge("Sospecha de cáncer invasivo", "pink")}</div>
      )}
    </div>
  );
};

export default ColposcopicFindingsDisplay;
