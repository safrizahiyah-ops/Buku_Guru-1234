// Types for Buku Kerja Guru Digital

export interface UserAccount {
  id: string; // e.g. 'guru-001'
  email: string;
  name: string;
  nip: string;
  role: 'guru' | 'admin';
  subject: string;
  schoolName: string;
  avatarUrl?: string;
  createdAt: string;
}

export type CurriculumType = 
  | 'Kurikulum Berbasis Cinta (KBC)' 
  | 'Kurikulum Merdeka Berbasis Cinta (KBC)' 
  | 'Kurikulum Merdeka' 
  | 'Kurikulum 2013 (Revisi)' 
  | 'Kurikulum Madrasah Kemenag';

export type PancaCintaPillar = 
  | 'Cinta kepada Tuhan (Allah & Rasul-Nya)' 
  | 'Cinta kepada Ilmu' 
  | 'Cinta kepada Diri Sendiri & Sesama Manusia' 
  | 'Cinta kepada Alam & Lingkungan' 
  | 'Cinta kepada Tanah Air & Bangsa';

export type SemesterType = 'Ganjil' | 'Genap';
export type EducationLevel = 'SD / MI' | 'SMP / MTs' | 'SMA / MA / SMK';
export type PhaseType = 'Fase A (Kelas 1-2)' | 'Fase B (Kelas 3-4)' | 'Fase C (Kelas 5-6)' | 'Fase D (Kelas 7-9)' | 'Fase E (Kelas 10)' | 'Fase F (Kelas 11-12)';

export interface TeacherProfile {
  id: string;
  userId: string;
  name: string;
  title: string;
  nip: string;
  nuptk: string;
  nik?: string;
  birthPlaceDate: string;
  gender: 'Laki-laki' | 'Perempuan';
  education: string;
  rankGrade: string; // Pangkat / Golongan e.g. Penata Muda Tk. I / III/b
  position: string; // Jabatan e.g. Guru Pertama / Guru Muda
  subject: string; // Mata Pelajaran
  schoolName: string;
  npsnNsm: string;
  schoolAddress: string;
  academicYear: string; // e.g. 2024/2025
  semester: SemesterType;
  curriculum?: CurriculumType;
  headmasterName: string;
  headmasterNip: string;
  schoolLogoUrl?: string;
  signaturePlace: string; // e.g. Jakarta, 15 Juli 2024
}

export interface Student {
  id: string;
  userId?: string;
  nis: string;
  nisn: string;
  name: string;
  gender: 'L' | 'P';
  className: string;
  kbcWellbeingStatus?: 'Sangat Bahagia & Antusias' | 'Cukup Tenang' | 'Perlu Pendampingan Kasih';
}

// BUKU 1 TYPES
export interface LearningOutcome {
  id: string;
  userId?: string;
  subject: string;
  phase: PhaseType;
  grade: string;
  element: string; // Elemen CP e.g. Pemahaman Konsep, Keterampilan Proses
  description: string;
  kbcPillar?: string; // Pilar Panca Cinta KBC
  createdAt: string;
}

export interface LearningObjective {
  id: string;
  userId?: string;
  cpId?: string;
  code: string; // e.g. TP 7.1
  competency: string; // Kata Kerja Operasional (KKO) e.g. Menganalisis
  scopeOfMaterial: string; // Lingkup Materi
  statement: string; // Rumusan Lengkap TP
  indicator: string; // Indikator Ketercapaian
  kbcCharacterGoal?: string; // Internalisasi Nilai Karakter Cinta KBC
  semester: SemesterType;
  allocatedHours: number; // JP
}

export interface ObjectiveFlowItem {
  id: string;
  userId?: string;
  tpId: string;
  orderNumber: number;
  semester: SemesterType;
  quarter: string; // e.g. Tengah Semester 1 / Akhir Semester 1
  allocatedHours: number;
  kbcPillarIntegration?: string;
  notes: string;
}

export interface TeachingModule {
  id: string;
  userId?: string;
  title: string;
  subject: string;
  phase: PhaseType;
  grade: string;
  allocatedHours: string;
  targetStudents: string;
  learningModel: string; // e.g. Problem Based Learning (PBL) Berbasis Cinta (KBC)
  priorCompetencies: string;
  pancasilaProfile: string[]; // e.g. ['Bernalar Kritis', 'Mandiri', 'Gotong Royong']
  pancaCintaDimensions?: string[]; // Pilar Panca Cinta KBC: Cinta Tuhan, Cinta Ilmu, Cinta Sesama, Cinta Alam, Cinta Tanah Air
  isKBC?: boolean; // Penanda Kurikulum Berbasis Cinta
  kbcLoveHabituation?: string; // Pembiasaan Cinta (Sapaan hangat, doa bersama, cek kondisi sosio-emosional)
  facilities: string;
  meaningfulUnderstanding: string;
  triggerQuestions: string;
  learningObjectives: string;
  introductoryActivities: string;
  coreActivities: string;
  closingActivities: string;
  assessmentPlan: string;
  remedialPlan: string;
  enrichmentPlan: string;
  teacherReflection: string;
  studentReflection: string;
  readingMaterials: string;
  glossary: string;
  createdAt: string;
  updatedAt: string;
}

export interface P5ProjectModule {
  id: string;
  title: string;
  theme: string; // e.g. Cinta Alam: Jejak Karbon & Lingkungan Asri, Cinta Sesama: Sekolah Ramah Anak
  isKBCProject?: boolean; // Projek Penguatan Karakter KBC
  pancaCintaFocus?: string[]; // Pilar Panca Cinta yang disasar
  dimensions: string[];
  elements: string;
  objectives: string;
  schedule: string;
  activities: string;
  assessmentRubric: string;
  documentationNotes: string;
}

export interface KKTPItem {
  id: string;
  tpCode: string;
  statement: string;
  indicator: string;
  kbcLoveIndicator?: string; // Indikator Karakter Panca Cinta KBC
  needsGuidanceCriteria: string; // 0 - 65
  sufficientCriteria: string; // 66 - 75
  goodCriteria: string; // 76 - 85
  veryGoodCriteria: string; // 86 - 100
  intervalNote: string;
}

// BUKU 2 TYPES
export interface AcademicCalendarEvent {
  id: string;
  dateStart: string;
  dateEnd: string;
  title: string;
  category: 'Hari Efektif' | 'Hari Libur Nasional' | 'Libur Semester' | 'Penilaian / Asesmen' | 'Kegiatan Madrasah';
  semester: SemesterType;
  notes?: string;
}

export interface TeachingScheduleItem {
  id: string;
  day: 'Senin' | 'Selasa' | 'Rabu' | 'Kamis' | 'Jumat' | 'Sabtu';
  periodTime: string; // e.g. 07.30 - 08.50
  periodHours: number; // e.g. 2 JP
  className: string;
  subject: string;
  room?: string;
}

export interface TimeAllocationRPE {
  semester: SemesterType;
  totalWeeks: number;
  ineffectiveWeeks: { reason: string; count: number }[];
  effectiveWeeks: number;
  hoursPerWeek: number;
  totalEffectiveHours: number;
  hourDistribution: {
    purpose: string;
    allocatedHours: number;
  }[];
}

export interface AnnualProgramItem {
  id: string;
  semester: SemesterType;
  materialUnit: string;
  learningObjectivesSummary: string;
  allocatedHours: number;
  timeframe: string; // e.g. Juli - Agustus
}

export interface SemesterProgramItem {
  id: string;
  no: number;
  material: string;
  allocatedHours: number;
  // Weekly check distribution across months e.g. month: [w1, w2, w3, w4, w5]
  distribution: {
    month: string;
    weeks: boolean[];
  }[];
}

export interface CodeOfEthicsDocument {
  title: string;
  preamble: string;
  articles: { number: number; text: string }[];
}

export interface TeacherHabituationItem {
  id: string;
  frequency: 'Harian' | 'Mingguan' | 'Bulanan' | 'Insidental';
  activityName: string;
  scheduleTime: string;
  targetValue: string; // Karakter / Budaya Sekolah
  kbcPillar?: 'Cinta kepada Tuhan' | 'Cinta kepada Ilmu' | 'Cinta kepada Diri & Sesama' | 'Cinta kepada Alam' | 'Cinta Tanah Air';
  implementationStatus: 'Terlaksana Baik' | 'Sebagian Terlaksana' | 'Perlu Optimalisasi';
  notes: string;
}

export interface StudentAttendanceRecord {
  id: string;
  date: string;
  className: string;
  studentId: string;
  status: 'H' | 'S' | 'I' | 'A'; // Hadir, Sakit, Izin, Alpa
  note?: string;
}

export interface TeachingJournalRecord {
  id: string;
  date: string;
  periodTime: string;
  className: string;
  subject: string;
  topicMaterial: string;
  learningObjective: string;
  methodUsed: string;
  kbcCharacterFocus?: string; // Internalisasi Nilai Panca Cinta KBC dalam KBM
  presentCount: number;
  absentCount: number;
  teachingNotes: string;
  challenges: string;
  followUp: string;
}

export interface ReferenceDocument {
  id: string;
  title: string;
  category: 'Buku Guru' | 'Buku Siswa' | 'Panduan Kurikulum' | 'Artikel Ilmiah' | 'Media Ajar';
  authorOrPublisher: string;
  year: string;
  fileUrlOrLink: string;
  description: string;
}

export interface TeacherConsultationRecord {
  id: string;
  date: string;
  consultantName: string; // Kepala Madrasah / Pengawas / Waka
  consultantRole: string;
  topic: string;
  results: string;
  recommendations: string;
  followUpPlan: string;
}

// BUKU 3 TYPES
export interface GradeRecord {
  id: string;
  studentId: string;
  className: string;
  subject: string;
  semester: SemesterType;
  tugasScores: number[]; // e.g. Tugas 1-4
  formatifScores: number[]; // e.g. Formatif 1-4
  stsScore: number; // Sumatif Tengah Semester
  sasScore: number; // Sumatif Akhir Semester
  finalGrade: number; // Calculated automatic
  predicate: 'A' | 'B' | 'C' | 'D';
  achievementDescription: string;
  kbcCharacterScore?: number; // Skor Afektif Panca Cinta KBC (0-100)
  kbcCharacterPredicate?: 'Sangat Berkarakter Kasih' | 'Membudaya Baik' | 'Mulai Berkembang';
}

export interface DiagnosticAssessmentRecord {
  id: string;
  type: 'Kognitif' | 'Non-Kognitif' | 'Sosio-Emosional KBC';
  className: string;
  subject: string;
  topic: string;
  questions: string[];
  findingsSummary: string;
  kbcWellbeingHighlight?: string; // Kesejahteraan Batin & Kesiapan Emosi Siswa
  learningStyleDistribution: {
    visual: number;
    auditory: number;
    kinesthetic: number;
  };
  differentiationRecommendations: string;
}

export interface AssessmentInstrument {
  id: string;
  subject: string;
  className: string;
  type: 'Pilihan Ganda' | 'Pilihan Ganda Kompleks' | 'Benar/Salah' | 'Menjodohkan' | 'Isian Singkat' | 'Uraian' | 'Praktik' | 'Proyek';
  cognitiveLevel: 'C1' | 'C2' | 'C3' | 'C4' | 'C5' | 'C6';
  tpCode: string;
  material: string;
  questionText: string;
  options?: string[];
  correctAnswer: string;
  scoringGuide: string;
}

export interface ItemAnalysisRecord {
  id: string;
  examTitle: string;
  className: string;
  subject: string;
  itemNumber: number;
  difficultyIndex: number; // Tingkat Kesukaran (P): 0.0 - 1.0 (Mudah, Sedang, Sukar)
  difficultyCategory: 'Sukar' | 'Sedang' | 'Mudah';
  discriminatingPower: number; // Daya Pembeda (D): -1.0 to 1.0
  distractorEfficiency: string; // Efektivitas Pengecoh
  recommendation: 'Diterima' | 'Direvisi' | 'Ditolak / Dibuang';
}

export interface BlueprintItem {
  id: string;
  examType: 'STS' | 'SAS' | 'Kuis Harian';
  subject: string;
  className: string;
  semester: SemesterType;
  tpCode: string;
  material: string;
  indicator: string;
  cognitiveLevel: string;
  questionForm: string;
  questionNumber: number;
}

export interface RemedialEnrichmentProgram {
  id: string;
  programType: 'Remedial' | 'Pengayaan';
  className: string;
  subject: string;
  tpCode: string;
  material: string;
  kktpStandard: number;
  studentNames: string[];
  activityPlan: string;
  executionDate: string;
  evaluationResult: string;
}

export interface AssignmentItem {
  id: string;
  title: string;
  type: 'Terstruktur' | 'Tidak Terstruktur';
  className: string;
  subject: string;
  description: string;
  givenDate: string;
  dueDate: string;
  submissionCount: number;
  totalStudents: number;
  status: 'Aktif' | 'Selesai' | 'Draf';
}

// BUKU 4 TYPES
export interface ReflectionJournal {
  id: string;
  date: string;
  className: string;
  subject: string;
  topic: string;
  whatWentWell: string;
  challenges: string;
  studentResponse: string;
  methodEvaluation: string;
  kbcEmpathyReflection?: string; // Refleksi Suasana Belajar Penuh Kasih Sayang & Relasi Ramah Anak
  pointsToImprove: string;
  actionPlan: string;
  aiPedagogicalSummary?: string;
}

export interface FollowUpProgramItem {
  id: string;
  sourceFinding: string; // e.g. Supervisi Kepala Sekolah / Refleksi Diri
  identifiedIssue: string;
  improvementPlan: string;
  strategy: string;
  kbcRestorativeApproach?: string; // Pendekatan Restoratif Berbasis Kasih Sayang
  targetSuccess: string;
  schedule: string;
  result: string;
  successEvaluation: 'Tercapai Sangat Baik' | 'Tercapai Cukup' | 'Perlu Tindak Lanjut Ulang';
}

// App Settings & State
export interface AppNotification {
  id: string;
  title: string;
  message: string;
  date: string;
  type: 'info' | 'warning' | 'success';
  read: boolean;
}
