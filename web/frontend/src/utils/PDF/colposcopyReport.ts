// src/utils/pdf/colposcopyReport.ts

import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";

// ✅ Asignar las fuentes correctamente
pdfMake.vfs = pdfFonts.vfs;


// Interfaces
interface Patient {
  name: string;
  lastName: string;
  id: string;
  dob: string;
}

interface ClinicalInfo {
  menarcheAge: number;
  cycleLength: number;
}

interface Exam {
  date: string;
  indication: string;
}

interface Image {
  id: string;
  label: string;
}

interface AIResults {
  label: string;
  confidence: number;
}

interface SwedeScore {
  acetowhite: number;
  margins: number;
  vessels: number;
  iodine: number;
  lesionSize: number;
  total: number;
}

interface RiskFactor {
  name: string;
  value: number;
}

interface RiskFactors {
  features: RiskFactor[];
}

interface ReportParams {
  patient: Patient;
  clinical: ClinicalInfo;
  exam: Exam;
  images: Image[];
  findings: string[];
  aiResults: AIResults;
  swede: SwedeScore;
  riskFactors: RiskFactors;
}

// Función generadora de PDF
export function generateColposcopyReport({
  patient,
  clinical,
  exam,
  images,
  findings,
  aiResults,
  swede,
  riskFactors,
}: ReportParams) {
  const docDefinition = {
    content: [
      { text: "Reporte Colposcópico", style: "header" },

      { text: `Paciente: ${patient.name} ${patient.lastName}` },
      { text: `Cédula: ${patient.id} | F. Nacimiento: ${patient.dob}` },

      { text: "Detalles clínicos", style: "subheader" },
      {
        columns: [
          `Edad menarquía: ${clinical.menarcheAge}`,
          `Duración ciclo: ${clinical.cycleLength} días`,
        ],
      },

      { text: `Examen: ${exam.date}`, style: "subheader" },
      { text: `Indicación: ${exam.indication}` },

      { text: "Imágenes del examen:", style: "subheader" },
      {
        ul: images.map((img) => `${img.label} (${img.id})`),
      },

      { text: "Hallazgos Colposcópicos:", style: "subheader" },
      {
        ul: findings.map((f) => `${f}`),
      },

      { text: "Resultados IA:", style: "subheader" },
      {
        text: `Clasificación: ${aiResults.label} (${aiResults.confidence}%)`,
      },

      { text: "Puntajes escala Swede:", style: "subheader" },
      {
        table: {
          body: [
            ["Variable", "Puntaje"],
            ["Acetoblanco", swede.acetowhite],
            ["Márgenes", swede.margins],
            ["Vasos", swede.vessels],
            ["Yodo", swede.iodine],
            ["Tamaño lesión", swede.lesionSize],
            ["Total", swede.total],
          ],
        },
      },

      { text: "Factores de riesgo:", style: "subheader" },
      {
        table: {
          widths: ["*", "*"],
          body: [
            ["Variable", "Importancia"],
            ...riskFactors.features.map((f) => [f.name, `${f.value}%`]),
          ],
        },
      },
    ],
    styles: {
      header: {
        fontSize: 18,
        bold: true,
        margin: [0, 0, 0, 10],
      },
      subheader: {
        fontSize: 14,
        bold: true,
        margin: [0, 10, 0, 5],
      },
    },
  };

  pdfMake.createPdf(docDefinition).open();
}
