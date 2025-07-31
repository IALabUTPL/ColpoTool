// src/types/types.ts

// Exámenes colposcópicos asociados al paciente
export interface ExamRecord {
  id: number;
  date: string;
  lesionsDetected: number;
  riskFactors: number;
  cancerRiskPrediction: boolean;
}

// Estructura principal del paciente
export interface Patient {
  // Identificadores
  id?: number;
  codigo: string; // ID interno UUID o similar
  created_by_codigo: number; // Código incremental usado para navegación

  // Información personal
  first_name: string;
  last_name: string;
  full_name: string;
  birthdate: string;
  phone: string;
  national_doc: string;
  address: string;

  // Información clínica general
  weight?: number;
  height?: number;
  pressure_level?: string;
  blood_group?: string;
  marital_status?: string;
  has_children?: boolean;
  early_detection?: boolean;
  education_level?: string;

  // Información ginecológica
  menarche_age?: number;
  cycle_days?: number;
  g?: number;
  p?: number;
  a?: number;
  uses_contraceptives?: boolean;
  contraceptive_type?: string;
  fur?: string;
  num_pap?: number;
  last_exam?: string;

  // Estilo de vida y factores de riesgo
  smoking?: boolean;
  alcohol?: boolean;
  sexual_activity?: boolean;
  sexual_partners?: number;
  active_life?: boolean;
  ets?: boolean;
  vaccinated_hpv?: boolean;
  age_sex_start?: number;

  // Observaciones
  clinical_notes?: string;

  // Exámenes colposcópicos asociados
  exams?: ExamRecord[];
}

// Props para accordion clínico
export interface PatientDetailsAccordionProps {
  gynecologicInfo: {
    menarcheAge?: number;
    menstrualCycleDays?: number;
    pregnancies?: number;
    births?: number;
    abortions?: number;
    usesContraceptives?: boolean;
    contraceptiveType?: string;
    fur?: string;
    numPap?: number;
    lastPap?: string;
  };
  lifestyleInfo: {
    smoking?: boolean;
    alcohol?: boolean;
    sexualActivity?: boolean;
    sexualPartners?: number;
    activeLife?: boolean;
    ets?: boolean;
    vaccinatedHpv?: boolean;
    ageSexStart?: number;
  };
  observations?: string;
}

// Props para la tabla de exámenes
export interface PatientExamsTableProps {
  exams: ExamRecord[];
  onRegisterExam: () => void;
}

// (Opcional) Props para pantalla de registro de examen
export interface ExamInfoProps {
  examDate: string;
  furDate?: string;
  indication?: string;
  ccvHistory?: string;
  ets?: string;
  planning?: string;
  recentSexualIntercourse?: boolean;
}
export interface BasicPatient {
  codigo: string;
  created_by_codigo: number;
  full_name: string;
  record_code: string;
  created_at: string;
}