import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import {
  UserAccount,
  TeacherProfile,
  Student,
  LearningOutcome,
  LearningObjective,
  ObjectiveFlowItem,
  TeachingModule,
  P5ProjectModule,
  KKTPItem,
  AcademicCalendarEvent,
  TeachingScheduleItem,
  TimeAllocationRPE,
  AnnualProgramItem,
  SemesterProgramItem,
  CodeOfEthicsDocument,
  TeacherHabituationItem,
  StudentAttendanceRecord,
  TeachingJournalRecord,
  ReferenceDocument,
  TeacherConsultationRecord,
  GradeRecord,
  DiagnosticAssessmentRecord,
  AssessmentInstrument,
  ItemAnalysisRecord,
  BlueprintItem,
  RemedialEnrichmentProgram,
  AssignmentItem,
  ReflectionJournal,
  FollowUpProgramItem,
  AppNotification,
} from '../types';

export const defaultAccounts: UserAccount[] = [
  {
    id: 'guru-001',
    email: 'siti.nurjanah@guru.belajar.id',
    name: 'Dra. Hj. Siti Nurjanah, M.Pd.',
    nip: '19780412 200501 2 008',
    role: 'guru',
    subject: 'Bahasa Indonesia',
    schoolName: 'SMP Negeri 1 Nusantara',
    createdAt: '2024-07-01',
  },
  {
    id: 'guru-002',
    email: 'budi.santoso@guru.belajar.id',
    name: 'Drs. Budi Santoso, M.Pd.',
    nip: '19820510 200801 1 012',
    role: 'guru',
    subject: 'Matematika',
    schoolName: 'SMP Negeri 1 Nusantara',
    createdAt: '2024-07-01',
  },
];

const STORAGE_KEYS = {
  CURRENT_USER_ID: 'bkgd_current_user_id',
  ACCOUNTS: 'bkgd_user_accounts',
  PROFILE: 'bkgd_profile',
  STUDENTS: 'bkgd_students',
  CP: 'bkgd_cp',
  TP: 'bkgd_tp',
  ATP: 'bkgd_atp',
  MODUL_AJAR: 'bkgd_modul_ajar',
  MODUL_P5: 'bkgd_modul_p5',
  KKTP: 'bkgd_kktp',
  KALDIK: 'bkgd_kaldik',
  JADWAL: 'bkgd_jadwal',
  RPE: 'bkgd_rpe',
  PROTA: 'bkgd_prota',
  PROMES: 'bkgd_promes',
  PEMBIASAAN: 'bkgd_pembiasaan',
  ABSENSI: 'bkgd_absensi',
  JURNAL: 'bkgd_jurnal',
  BUKU_PEGANGAN: 'bkgd_buku_pegangan',
  KONSULTASI: 'bkgd_konsultasi',
  NILAI: 'bkgd_nilai',
  DIAGNOSTIK: 'bkgd_diagnostik',
  INSTRUMEN: 'bkgd_instrumen',
  ANALISIS_SOAL: 'bkgd_analisis_soal',
  KISI_KISI: 'bkgd_kisi_kisi',
  REMEDIAL: 'bkgd_remedial',
  TUGAS: 'bkgd_tugas',
  REFLEKSI: 'bkgd_refleksi',
  TINDAK_LANJUT: 'bkgd_tindak_lanjut',
  NOTIFIKASI: 'bkgd_notifikasi',
  FIREBASE_CONFIG: 'bkgd_firebase_config',
};

// Default Realistic Profile for Indonesian Teacher 1 (Bahasa Indonesia)
export const defaultTeacherProfile: TeacherProfile = {
  id: 'teacher-001',
  userId: 'guru-001',
  name: 'Dra. Hj. Siti Nurjanah, M.Pd.',
  title: 'M.Pd.',
  nip: '19780412 200501 2 008',
  nuptk: '4538756658300022',
  nik: '3204125204780003',
  birthPlaceDate: 'Bandung, 12 April 1978',
  gender: 'Perempuan',
  education: 'S2 Pendidikan Bahasa Indonesia - Universitas Pendidikan Indonesia',
  rankGrade: 'Pembina / IV/a',
  position: 'Guru Madya',
  subject: 'Bahasa Indonesia',
  schoolName: 'SMP Negeri 1 Nusantara',
  npsnNsm: '20218945',
  schoolAddress: 'Jl. Ki Hajar Dewantara No. 45, Kompleks Pendidikan, Jakarta',
  academicYear: '2024/2025',
  semester: 'Ganjil',
  curriculum: 'Kurikulum Merdeka Berbasis Cinta (KBC)',
  headmasterName: 'Drs. H. Ahmad Fauzi, M.Pd.',
  headmasterNip: '19680515 199403 1 005',
  signaturePlace: 'Jakarta, 15 Juli 2024',
};

// Default Profile for Indonesian Teacher 2 (Matematika)
export const defaultTeacherProfile2: TeacherProfile = {
  id: 'teacher-002',
  userId: 'guru-002',
  name: 'Drs. Budi Santoso, M.Pd.',
  title: 'M.Pd.',
  nip: '19820510 200801 1 012',
  nuptk: '5649876649200031',
  nik: '3204121005820005',
  birthPlaceDate: 'Yogyakarta, 10 Mei 1982',
  gender: 'Laki-laki',
  education: 'S2 Pendidikan Matematika - Universitas Gadjah Mada',
  rankGrade: 'Penata Tk. I / III/d',
  position: 'Guru Muda',
  subject: 'Matematika',
  schoolName: 'SMP Negeri 1 Nusantara',
  npsnNsm: '20218945',
  schoolAddress: 'Jl. Ki Hajar Dewantara No. 45, Kompleks Pendidikan, Jakarta',
  academicYear: '2024/2025',
  semester: 'Ganjil',
  curriculum: 'Kurikulum Merdeka Berbasis Cinta (KBC)',
  headmasterName: 'Drs. H. Ahmad Fauzi, M.Pd.',
  headmasterNip: '19680515 199403 1 005',
  signaturePlace: 'Jakarta, 15 Juli 2024',
};

export const defaultStudents: Student[] = [
  { id: 'std-1', nis: '24001', nisn: '0098712341', name: 'Achmad Dani Pratama', gender: 'L', className: 'VII-A' },
  { id: 'std-2', nis: '24002', nisn: '0098712342', name: 'Aisyah Putri Rahmadani', gender: 'P', className: 'VII-A' },
  { id: 'std-3', nis: '24003', nisn: '0098712343', name: 'Bagas Aditya Nugraha', gender: 'L', className: 'VII-A' },
  { id: 'std-4', nis: '24004', nisn: '0098712344', name: 'Cantika Dewi Lestari', gender: 'P', className: 'VII-A' },
  { id: 'std-5', nis: '24005', nisn: '0098712345', name: 'Dimas Arya Pamungkas', gender: 'L', className: 'VII-A' },
  { id: 'std-6', nis: '24006', nisn: '0098712346', name: 'Fadhilah Nur Hasnah', gender: 'P', className: 'VII-A' },
  { id: 'std-7', nis: '24007', nisn: '0098712347', name: 'Gilang Ramadhan', gender: 'L', className: 'VII-A' },
  { id: 'std-8', nis: '24008', nisn: '0098712348', name: 'Hafizhah Khairun Nisa', gender: 'P', className: 'VII-A' },
  { id: 'std-9', nis: '24009', nisn: '0098712349', name: 'Irfan Maulana Malik', gender: 'L', className: 'VII-A' },
  { id: 'std-10', nis: '24010', nisn: '0098712350', name: 'Keysha Zahra Kirana', gender: 'P', className: 'VII-A' },
  { id: 'std-11', nis: '24011', nisn: '0098712351', name: 'Muhammad Rizky Ramadhan', gender: 'L', className: 'VII-A' },
  { id: 'std-12', nis: '24012', nisn: '0098712352', name: 'Nabila Syakira Azzahra', gender: 'P', className: 'VII-A' },
  { id: 'std-13', nis: '24013', nisn: '0098712353', name: 'Rafi Alamsyah', gender: 'L', className: 'VII-A' },
  { id: 'std-14', nis: '24014', nisn: '0098712354', name: 'Siti Sarah Nurhaliza', gender: 'P', className: 'VII-A' },
  { id: 'std-15', nis: '24015', nisn: '0098712355', name: 'Zahra Amelia Putri', gender: 'P', className: 'VII-A' },
];

// Isolated default student list for Guru 2 (Kelas VII-B Matematika)
export const defaultStudents_Matematika: Student[] = [
  { id: 'std-b-1', nis: '24021', nisn: '0098712361', name: 'Adelia Rahma Safitri', gender: 'P', className: 'VII-B' },
  { id: 'std-b-2', nis: '24022', nisn: '0098712362', name: 'Bayu Pratama Wijaya', gender: 'L', className: 'VII-B' },
  { id: 'std-b-3', nis: '24023', nisn: '0098712363', name: 'Citra Kirana Dewi', gender: 'P', className: 'VII-B' },
  { id: 'std-b-4', nis: '24024', nisn: '0098712364', name: 'Daffa Ardiansyah Putra', gender: 'L', className: 'VII-B' },
  { id: 'std-b-5', nis: '24025', nisn: '0098712365', name: 'Eka Nurul Hidayah', gender: 'P', className: 'VII-B' },
  { id: 'std-b-6', nis: '24026', nisn: '0098712366', name: 'Fikri Haikal Rahman', gender: 'L', className: 'VII-B' },
  { id: 'std-b-7', nis: '24027', nisn: '0098712367', name: 'Gita Maharani', gender: 'P', className: 'VII-B' },
  { id: 'std-b-8', nis: '24028', nisn: '0098712368', name: 'Hendra Saputra', gender: 'L', className: 'VII-B' },
  { id: 'std-b-9', nis: '24029', nisn: '0098712369', name: 'Indah Permata Sari', gender: 'P', className: 'VII-B' },
  { id: 'std-b-10', nis: '24030', nisn: '0098712370', name: 'Jovan Nathaniel', gender: 'L', className: 'VII-B' },
  { id: 'std-b-11', nis: '24031', nisn: '0098712371', name: 'Kania Putri Anindya', gender: 'P', className: 'VII-B' },
  { id: 'std-b-12', nis: '24032', nisn: '0098712372', name: 'Lukman Hakim', gender: 'L', className: 'VII-B' },
];

export const defaultCP_Matematika: LearningOutcome[] = [
  {
    id: 'cpm-1',
    subject: 'Matematika',
    phase: 'Fase D (Kelas 7-9)',
    grade: 'Kelas VII',
    element: 'Bilangan',
    description: 'Peserta didik mampu membaca, menulis, dan membandingkan bilangan bulat, bilangan rasional dan irasional, bilangan desimal, serta menerapkan operasi aritmetika pada bilangan real secara logis dan kritis.',
    createdAt: '2024-07-10',
  },
  {
    id: 'cpm-2',
    subject: 'Matematika',
    phase: 'Fase D (Kelas 7-9)',
    grade: 'Kelas VII',
    element: 'Aljabar',
    description: 'Peserta didik dapat mengenali, memprediksi dan menggeneralisasi pola dalam bentuk susunan benda dan bilangan serta menyelesaikan persamaan dan pertidaksamaan linear satu variabel.',
    createdAt: '2024-07-10',
  },
  {
    id: 'cpm-3',
    subject: 'Matematika',
    phase: 'Fase D (Kelas 7-9)',
    grade: 'Kelas VII',
    element: 'Pengukuran dan Geometri',
    description: 'Peserta didik mampu menggunakan hubungan antar-sudut yang terbentuk oleh dua garis yang berpotongan dan oleh dua garis sejajar yang dipotong sebuah garis transversal untuk menyelesaikan masalah kontekstual.',
    createdAt: '2024-07-10',
  },
];

export const defaultTP_Matematika: LearningObjective[] = [
  {
    id: 'tpm-1',
    cpId: 'cpm-1',
    code: 'TP 7.1',
    competency: 'Menjelaskan & Menghitung',
    scopeOfMaterial: 'Operasi Bilangan Bulat dan Garis Bilangan',
    statement: 'Peserta didik mampu menjelaskan konsep bilangan bulat negatif dan melakukan operasi hitung penjumlahan serta pengurangan dengan menggunakan model konkret garis bilangan.',
    indicator: '1. Menentukan posisi bilangan bulat pada garis bilangan\n2. Menghitung hasil operasi penjumlahan dan pengurangan\n3. Menyelesaikan soal cerita kontekstual suhu dan ketinggian',
    semester: 'Ganjil',
    allocatedHours: 6,
  },
  {
    id: 'tpm-2',
    cpId: 'cpm-1',
    code: 'TP 7.2',
    competency: 'Mengaplikasikan',
    scopeOfMaterial: 'Perkalian dan Pembagian Bilangan Bulat',
    statement: 'Peserta didik mampu menerapkan sifat-sifat operasi perkalian dan pembagian bilangan bulat dalam pemecahan masalah sehari-hari secara mandiri dan bernalar kritis.',
    indicator: '1. Menyelesaikan perkalian tanda sejenis dan berlawanan\n2. Menggunakan sifat distributif perkalian\n3. Memecahkan soal terapan keuangan sederhana',
    semester: 'Ganjil',
    allocatedHours: 6,
  },
  {
    id: 'tpm-3',
    cpId: 'cpm-2',
    code: 'TP 7.3',
    competency: 'Menyederhanakan & Menyelesaikan',
    scopeOfMaterial: 'Bentuk Aljabar dan Persamaan Linear Satu Variabel',
    statement: 'Peserta didik dapat mengidentifikasi unsur-unsur bentuk aljabar (variabel, koefisien, konstanta) dan menyelesaikan persamaan linear satu variabel sederhana.',
    indicator: '1. Mengelompokkan suku-suku sejenis\n2. Melakukan operasi penjumlahan dan pengurangan aljabar\n3. Menentukan himpunan penyelesaian persamaan linear',
    semester: 'Ganjil',
    allocatedHours: 8,
  },
];

export const defaultJurnal_Matematika: TeachingJournalRecord[] = [
  {
    id: 'jrn-m-1',
    date: '2024-07-22',
    periodTime: '07:30 - 09:30 (Jam Ke 1-2)',
    className: 'VII-B',
    subject: 'Matematika',
    topicMaterial: 'Operasi Penjumlahan dan Pengurangan Bilangan Bulat Negatif',
    learningObjective: 'Siswa dapat menentukan hasil penjumlahan bilangan bulat negatif menggunakan simulasi garis bilangan.',
    methodUsed: 'Problem Based Learning (PBL) & Model Kartu Koin Positif-Negatif',
    presentCount: 12,
    absentCount: 0,
    teachingNotes: 'Siswa sangat aktif saat menggunakan media kartu koin warna. Konsep pengurangan bilangan negatif mulai dipahami dengan baik.',
    challenges: 'Beberapa siswa masih ragu ketika mengurangkan bilangan negatif dengan bilangan positif.',
    followUp: 'Latihan terbimbing 5 soal variasi tanda pada pertemuan berikutnya.',
  },
];

export const defaultCP: LearningOutcome[] = [
  {
    id: 'cp-1',
    subject: 'Bahasa Indonesia',
    phase: 'Fase D (Kelas 7-9)',
    grade: 'Kelas VII',
    element: 'Menyimak',
    description: 'Peserta didik mampu menganalisis dan memaknai informasi berupa gagasan, pikiran, perasaan, pandangan, arahan atau pesan yang tepat dari berbagai jenis teks lisan (deskripsi, narasi, prosedur, dan eksposisi) dalam bentuk audio atau tayangan audio-visual dengan penuh empati dan nalar kritis.',
    kbcPillar: 'Cinta kepada Ilmu & Cinta Sesama',
    createdAt: '2024-07-10',
  },
  {
    id: 'cp-2',
    subject: 'Bahasa Indonesia',
    phase: 'Fase D (Kelas 7-9)',
    grade: 'Kelas VII',
    element: 'Membaca dan Memirsa',
    description: 'Peserta didik memahami informasi berupa gagasan, pikiran, pandangan, arahan atau pesan dari teks deskripsi, narasi, puisi, dan prosedur untuk menemukan makna yang tersurat dan tersirat serta menghayati nilai-nilai keindahan ciptaan Tuhan dan kearifan bangsa.',
    kbcPillar: 'Cinta kepada Tuhan & Cinta Alam',
    createdAt: '2024-07-10',
  },
  {
    id: 'cp-3',
    subject: 'Bahasa Indonesia',
    phase: 'Fase D (Kelas 7-9)',
    grade: 'Kelas VII',
    element: 'Berbicara dan Mempresentasikan',
    description: 'Peserta didik mampu menyampaikan gagasan, pikiran, pandangan, arahan atau pesan dengan santun, intonasi yang tepat, dan percaya diri dalam diskusi kelompok maupun presentasi karya secara runut dengan bahasa yang menyejukkan hati dan saling menghargai.',
    kbcPillar: 'Cinta kepada Diri Sendiri & Sesama Manusia',
    createdAt: '2024-07-10',
  },
  {
    id: 'cp-4',
    subject: 'Bahasa Indonesia',
    phase: 'Fase D (Kelas 7-9)',
    grade: 'Kelas VII',
    element: 'Menulis',
    description: 'Peserta didik mampu menulis gagasan, pikiran, pandangan, arahan atau pesan tertulis untuk berbagai tujuan secara logis, kritis, dan kreatif dalam bentuk teks deskripsi dan teks prosedur dengan memperhatikan kaidah kebahasaan serta menumbuhkan kecintaan terhadap tanah air.',
    kbcPillar: 'Cinta kepada Tanah Air & Bangsa',
    createdAt: '2024-07-10',
  },
];

export const defaultTP: LearningObjective[] = [
  {
    id: 'tp-1',
    cpId: 'cp-2',
    code: 'TP 7.1',
    competency: 'Mengidentifikasi & Menganalisis',
    scopeOfMaterial: 'Teks Deskripsi Keindahan Alam Nusantara',
    statement: 'Peserta didik mampu mengidentifikasi ide pokok, rincian informasi, dan struktur teks deskripsi yang disajikan dalam bentuk tulisan maupun visual dengan cermat serta menghayati rasa syukur atas ciptaan Tuhan.',
    indicator: '1. Menyebutkan objek keindahan alam yang dideskripsikan\n2. Menemukan kalimat perincian panca indra\n3. Menyimpulkan isi teks deskripsi dengan rasa kagum dan syukur',
    kbcCharacterGoal: 'Cinta kepada Tuhan (Rasa Syukur) & Cinta kepada Alam',
    semester: 'Ganjil',
    allocatedHours: 6,
  },
  {
    id: 'tp-2',
    cpId: 'cp-4',
    code: 'TP 7.2',
    competency: 'Menulis & Menyajikan',
    scopeOfMaterial: 'Menulis Teks Deskripsi Kreatif Ramah Lingkungan',
    statement: 'Peserta didik mampu merancang dan menulis teks deskripsi sederhana tentang lingkungan sekolah atau kearifan lokal menggunakan kaidah bahasa Indonesia yang baik, santun, dan menumbuhkan kepedulian bersama.',
    indicator: '1. Menyusun kerangka teks deskripsi dengan diksi positif\n2. Mengembangkan kalimat bermajas dan kata konkret\n3. Mempublikasikan tulisan di mading sekolah dengan saling mengapresiasi',
    kbcCharacterGoal: 'Cinta kepada Tanah Air & Cinta kepada Sesama',
    semester: 'Ganjil',
    allocatedHours: 6,
  },
  {
    id: 'tp-3',
    cpId: 'cp-2',
    code: 'TP 7.3',
    competency: 'Memahami & Mengevaluasi',
    scopeOfMaterial: 'Teks Prosedur dan Infografik Pola Hidup Sehat & Bersih',
    statement: 'Peserta didik mampu menganalisis struktur langkah-langkah, ciri kebahasaan (kalimat perintah santun, konjungsi urutan), dan tips pada teks prosedur secara kritis sebagai bentuk menyayangi diri sendiri.',
    indicator: '1. Mengurutkan langkah-langkah acak secara logis\n2. Mengidentifikasi kalimat imperatif santun\n3. Menilai kejelasan panduan hidup sehat',
    kbcCharacterGoal: 'Cinta kepada Diri Sendiri & Cinta kepada Ilmu',
    semester: 'Ganjil',
    allocatedHours: 6,
  },
  {
    id: 'tp-4',
    cpId: 'cp-4',
    code: 'TP 7.4',
    competency: 'Membuat & Mempraktikkan',
    scopeOfMaterial: 'Karya Teks Prosedur Kuliner Nusantara Kolaboratif',
    statement: 'Peserta didik mampu membuat dan mempraktikkan teks prosedur berupa petunjuk pembuatan kuliner sehat nusantara melalui kerja sama kelompok yang solid dan saling mendukung.',
    indicator: '1. Merumuskan alat, bahan, dan takaran\n2. Menulis tahapan kronologis kerja\n3. Melakukan demonstrasi langkah kerja secara gotong royong penuh keceriaan',
    kbcCharacterGoal: 'Cinta kepada Sesama & Cinta Tanah Air',
    semester: 'Ganjil',
    allocatedHours: 8,
  },
];

export const defaultATP: ObjectiveFlowItem[] = [
  { id: 'atp-1', tpId: 'tp-1', orderNumber: 1, semester: 'Ganjil', quarter: 'Awal Semester 1 (Juli)', allocatedHours: 6, kbcPillarIntegration: 'Cinta kepada Tuhan & Cinta Alam', notes: 'Fokus pada observasi keindahan ciptaan Tuhan dan kepekaan rasa indrawi' },
  { id: 'atp-2', tpId: 'tp-2', orderNumber: 2, semester: 'Ganjil', quarter: 'Tengah Semester 1 (Agustus)', allocatedHours: 6, kbcPillarIntegration: 'Cinta kepada Tanah Air & Cinta Sesama', notes: 'Praktik menulis mandiri dan saling memberi umpan balik apresiatif antarteman' },
  { id: 'atp-3', tpId: 'tp-3', orderNumber: 3, semester: 'Ganjil', quarter: 'Tengah Semester 1 (September)', allocatedHours: 6, kbcPillarIntegration: 'Cinta Diri & Cinta Ilmu', notes: 'Telaah struktur teks prosedur pola hidup bersih untuk kesehatan diri' },
  { id: 'atp-4', tpId: 'tp-4', orderNumber: 4, semester: 'Ganjil', quarter: 'Akhir Semester 1 (Oktober - November)', allocatedHours: 8, kbcPillarIntegration: 'Cinta Sesama & Gotong Royong', notes: 'Proyek unjuk kerja kuliner nusantara dengan festival kasih dan gelar karya kelas' },
];

export const defaultModulAjar: TeachingModule[] = [
  {
    id: 'modul-1',
    title: 'Modul Ajar Berbasis Kurikulum Cinta (KBC): Menjelajah Keindahan Ciptaan Tuhan Melalui Teks Deskripsi',
    subject: 'Bahasa Indonesia',
    phase: 'Fase D (Kelas 7-9)',
    grade: 'Kelas VII',
    allocatedHours: '3 x 40 Menit (1 Pertemuan)',
    targetStudents: 'Reguler / Heterogen (32 Siswa)',
    learningModel: 'Problem-Based Learning (PBL) Berbasis Cinta (KBC) Terpadu Pembelajaran Berdiferensiasi',
    priorCompetencies: 'Peserta didik telah mampu membaca lancar dan menceritakan pengalaman pribadi dengan santun.',
    pancasilaProfile: ['Beriman & Bertakwa kepada Tuhan YME', 'Bernalar Kritis', 'Gotong Royong', 'Mandiri'],
    pancaCintaDimensions: ['Cinta kepada Tuhan', 'Cinta kepada Ilmu', 'Cinta kepada Alam & Lingkungan', 'Cinta kepada Diri Sendiri & Sesama'],
    isKBC: true,
    kbcLoveHabituation: 'Morning Check-In Empati: Guru menyambut setiap murid di ambang pintu dengan senyum hangat, doa bersama penuh kekhidmatan, mengecek kondisi sosio-emosional murid (lingkaran rasa/mood check), serta meneguhkan ruang kelas aman dan ramah anak tanpa ejekan.',
    facilities: 'LCD Proyektor, Kartu Gambar Panorama Alam Nusantara, Lembar Kerja Berkasih (LKPD), Bahan Bacaan Digital',
    meaningfulUnderstanding: 'Keterampilan mendeskripsikan sesuatu menumbuhkan ketelitian pengamatan, rasa syukur tak terhingga kepada Sang Maha Pencipta, serta kepedulian menjaga kelestarian alam dan budaya nusantara.',
    triggerQuestions: '1. Pernahkah kalian memandang keindahan alam dan merasakan ketenangan batin yang mendalam? Bagaimana cara melukiskannya dengan kata-kata agar orang lain turut merasakan keagungan Tuhan tersebut?\n2. Bagaimana pilihan kata penuh kasih dan santun mampu mengubah suasana hati orang yang membacanya?',
    learningObjectives: 'Melalui model PBL Berbasis Cinta, peserta didik mampu mengidentifikasi ciri objek, tujuan, dan struktur teks deskripsi serta menemukan kalimat perincian panca indra dengan tepat, sembari menumbuhkan rasa syukur dan kerja sama yang harmonis.',
    introductoryActivities: '1. Sapaan Kasih & Doa: Guru menyapa hangat dan memimpin doa pembuka penuh rasa syukur (Cinta Tuhan).\n2. Empathy Emotion Check-In: Guru menanyakan kabar batin peserta didik dengan kartu ekspresi ("Bagaimana perasaanmu pagi ini?").\n3. Ice Breaking Penuh Keceriaan: Permainan tebak panca indra yang mengikis kecanggungan dan memupuk kebersamaan.\n4. Apersepsi Kasih: Mengaitkan materi teks deskripsi dengan rasa cinta pada alam dan keindahan kampung halaman.\n5. Menyampaikan tujuan belajar dan komitmen kelas ramah anak.',
    coreActivities: 'Fase 1 (Orientasi Masalah Kasih): Guru menayangkan video panorama Danau Toba dan Raja Ampat; peserta didik diajak merenungkan keindahan alam sebagai titipan Tuhan yang patut disyukuri dan dijaga.\nFase 2 (Organisasi Kelompok Berkasih): Peserta didik dibagi ke dalam kelompok heterogen dengan prinsip inklusif tanpa membeda-bedakan kemampuan akademis.\nFase 3 (Penyelidikan Terbimbing Penuh Empati): Guru mendampingi kelompok yang membutuhkan bantuan kosakata konkret dengan pendekatan sabar (scaffolding tanpa mencap atau memarahi).\nFase 4 (Penyajian Karya Penuh Percaya Diri): Setiap kelompok menyajikan peta konsep LKPD deskripsi indrawi dengan rasa bangga.\nFase 5 (Apresiasi Kasih & Umpan Balik Positif): Kelompok lain memberikan tanggapan apresiatif menggunakan teknik "Dua Bintang Kasih & Satu Harapan".',
    closingActivities: '1. Rangkuman Bermakna: Guru dan murid merangkum konsep kunci teks deskripsi dan mengaitkannya dengan nilai syukur kehidupan.\n2. Refleksi Batin: Peserta didik menuliskan pada sticky note: "Satu keindahan ciptaan Tuhan yang paling kusyukuri hari ini" dan ungkapan terima kasih untuk teman sekelompok.\n3. Apresiasi Tulus: Guru memberikan apresiasi hangat atas kerja keras seluruh siswa.\n4. Doa Syukur & Salam Kasih penutup.',
    assessmentPlan: '1. Asesmen Diagnostik Sosio-Emosional KBC: Cek kondisi batin awal KBM.\n2. Asesmen Formatif Autentik: Observasi keaktifan diskusi, sikap saling mengasihi antarteman, dan kelengkapan LKPD.\n3. Asesmen Sumatif: Kuis pemahaman mandiri dan rubrik menulis deskripsi tanpa labeling.',
    remedialPlan: 'Bimbingan Personal Berakar Kasih: Pendampingan penuh empati dengan flashcard interaktif dan tutor sebaya suportif bagi siswa yang belum mencapai KKTP.',
    enrichmentPlan: 'Proyek Cinta Literasi: Peserta didik yang tuntas membuat teks deskripsi pendek bertema "Keajaiban Alam Kotaku" untuk mading sekolah.',
    teacherReflection: 'Suasana kelas sangat kondusif dan hangat. Siswa saling membantu tanpa ada perundungan. Refleksi sosio-emosional di awal sangat membantu siswa yang sebelumnya tampak lesu menjadi bersemangat.',
    studentReflection: 'Siswa merasa sangat dihargai dan gembira karena guru mendengarkan cerita mereka dan teman sekelompok saling menolong.',
    readingMaterials: 'Buku Siswa Bahasa Indonesia SMP Kelas VII Kemendikbudristek; Panduan Kurikulum Berbasis Cinta (KBC); Majalah Sahabat Lingkungan.',
    glossary: 'Kurikulum Berbasis Cinta (KBC), Panca Cinta, Teks Deskripsi, Citraan Indra, Kata Konkret, Scaffolding, Empati.',
    createdAt: '2024-07-15',
    updatedAt: '2024-08-01',
  },
];

export const defaultP5Modules: P5ProjectModule[] = [
  {
    id: 'p5-1',
    title: 'Projek Karakter KBC: Sahabat Bumi & Jejak Cinta Lingkungan Bersih',
    theme: 'Cinta Alam & Gaya Hidup Berkelanjutan',
    isKBCProject: true,
    pancaCintaFocus: ['Cinta kepada Alam & Lingkungan', 'Cinta kepada Tuhan', 'Cinta kepada Diri & Sesama'],
    dimensions: ['Beriman & Bertakwa kepada Tuhan YME', 'Gotong Royong', 'Bernalar Kritis'],
    elements: 'Akhlak kepada alam semesta, rasa syukur atas amanah bumi, gotong royong menjaga kebersihan madrasah/sekolah.',
    objectives: 'Membangun keinsafan cinta alam sebagai wujud syukur kepada Tuhan dengan merawat lingkungan madrasah, memilah sampah plastik secara mandiri, dan menghasilkan karya ecobrick bernilai guna.',
    schedule: 'Sistem Blok 3 Pekan (Bulan Oktober 2024)',
    activities: '1. Tahap Pengenalan Kasih (Pekan 1): Menghayati keindahan alam ciptaan Tuhan, eksplorasi dampak sampah plastik terhadap makhluk hidup, dan nonton bareng film dokumenter lingkungan.\n2. Tahap Kontekstualisasi Kasih (Pekan 2): Audit sampah madrasah, wawancara apresiatif bersama petugas kebersihan madrasah sebagai pahlawan lingkungan.\n3. Tahap Aksi Nyata Cinta (Pekan 3): Gerakan gotong royong pilah sampah, pembuatan pot bunga ecobrick ramah lingkungan, dan penanaman pohon peneduh di halaman sekolah.\n4. Tahap Refleksi & Festival Cinta Bumi: Gelar pameran karya sahabat bumi, deklarasi ikrar menjaga alam, dan penobatan Duta Cinta Lingkungan.',
    assessmentRubric: 'Rubrik Karakter Cinta KBC: Mulai Berkembang (MB: Menyadari sampah harus dibuang pada tempatnya), Sedang Berkembang (SB: Ikut serta memilah sampah kelompok), Berkembang Sesuai Harapan (BSH: Menginisiasi aksi peduli lingkungan dan mengajak teman), Sangat Berkembang (SAB: Konsisten menjadi teladan pelestari alam dan memimpin aksi bersih madrasah).',
    documentationNotes: 'Terdokumentasi foto pemilahan sampah, laporan jurnal kelompok, portofolio ecobrick, dan display di mading sekolah.',
  },
  {
    id: 'p5-2',
    title: 'Projek Karakter KBC: Madrasah Ramah Anak & Gerakan Tebar Senyum (Cinta Sesama)',
    theme: 'Cinta Sesama, Kebinekaan & Anti-Bullying',
    isKBCProject: true,
    pancaCintaFocus: ['Cinta kepada Diri Sendiri & Sesama Manusia', 'Cinta kepada Tanah Air & Bangsa', 'Cinta kepada Tuhan'],
    dimensions: ['Berkebinekaan Global', 'Gotong Royong', 'Mandiri'],
    elements: 'Empati sosial mendalam, pencegahan segala bentuk perundungan (verbal/fisik/digital), merawat persaudaraan dan moderasi beragama.',
    objectives: 'Menciptakan ekosistem madrasah yang penuh kasih sayang, aman, inklusif, saling menghargai keragaman latar belakang, dan melatih peserta didik menjadi Duta Sahabat Damai Kelas.',
    schedule: 'Sistem Terjadwal (1 Hari per Pekan pada Semester Ganjil)',
    activities: '1. Tahap Temu Kasih (Pekan 1-2): Eksplorasi makna empati, diskusi studi kasus perundungan, dan menyaksikan pentas teater singkat mengenai pentingnya merangkul teman yang menyendiri.\n2. Tahap Curahan Hati & Pemetaan Kasih (Pekan 3-4): Menulis surat apresiasi anonim di "Kotak Kasih Sayang" dan menganalisis dinamika pertemanan kelas secara damai.\n3. Tahap Aksi Bersama (Pekan 5-6): Pembuatan Pohon Kebaikan (Tree of Kindness), lokakarya pembuatan poster kampanye anti-bullying, dan simulasi resolusi konflik tanpa amarah.\n4. Tahap Selebrasi & Deklarasi Damai: Penandatanganan Piagam Madrasah Ramah Anak Berbasis Cinta dan penobatan Duta Kasih Sayang antar-kelas.',
    assessmentRubric: 'Rubrik Afektif Cinta Sesama KBC: MB (Tidak melakukan ejekan), SB (Bersedia berteman dengan siapa saja), BSH (Aktif menolong dan membela teman yang kesulitan), SAB (Menjadi teladan cinta damai, mampu memediasi perselisihan dengan kepala dingin dan hati penuh kasih).',
    documentationNotes: 'Buku catatan Kotak Kasih Sayang, piagam komitmen kelas anti-bullying, foto kegiatan Pohon Kebaikan, dan video deklarasi.',
  },
];

export const defaultKKTP: KKTPItem[] = [
  {
    id: 'kktp-1',
    tpCode: 'TP 7.1',
    statement: 'Mengidentifikasi ide pokok, rincian informasi, dan struktur teks deskripsi keindahan alam',
    indicator: 'Ketepatan menentukan struktur (identifikasi umum, deskripsi bagian indrawi, simpulan kesan)',
    kbcLoveIndicator: 'Menunjukkan rasa kagum dan syukur atas keindahan alam ciptaan Tuhan (Cinta Tuhan & Cinta Alam)',
    needsGuidanceCriteria: '0 - 65: Belum mampu membedakan identifikasi umum dengan deskripsi bagian; membutuhkan bimbingan empati personal.',
    sufficientCriteria: '66 - 75: Mampu menentukan struktur teks dengan panduan ramah guru.',
    goodCriteria: '76 - 85: Mampu mengidentifikasi struktur teks deskripsi secara mandiri dan tepat.',
    veryGoodCriteria: '86 - 100: Mampu menganalisis struktur secara komprehensif serta mengaitkannya dengan nilai syukur kehidupan.',
    intervalNote: 'KKTP Minimal Ketuntasan: 75 (Dukungan Restoratif)',
  },
  {
    id: 'kktp-2',
    tpCode: 'TP 7.2',
    statement: 'Merancang dan menulis teks deskripsi sederhana bernuansa kearifan lokal',
    indicator: 'Kekayaan kosakata indrawi dan keutuhan paragraf deskriptif dengan ejaan santun',
    kbcLoveIndicator: 'Membudayakan sikap saling menghargai hasil karya teman tanpa meremehkan (Cinta Sesama)',
    needsGuidanceCriteria: '0 - 65: Tulisan sangat singkat, minim kata konkret; perlu pendampingan sabar.',
    sufficientCriteria: '66 - 75: Tulisan memuat minimal 2 citraan indra dengan struktur cukup runtut.',
    goodCriteria: '76 - 85: Tulisan kaya deskripsi panca indra, ejaan tepat, dan pesan mengalir positif.',
    veryGoodCriteria: '86 - 100: Penggunaan gaya bahasa sangat estetik, diksi variatif, dan menggugah rasa cinta tanah air.',
    intervalNote: 'KKTP Minimal Ketuntasan: 75 (Dukungan Restoratif)',
  },
];

export const defaultKaldik: AcademicCalendarEvent[] = [
  { id: 'kaldik-1', dateStart: '2024-07-15', dateEnd: '2024-07-17', title: 'Masa Pengenalan Lingkungan Sekolah (MPLS)', category: 'Kegiatan Madrasah', semester: 'Ganjil', notes: 'Penyambutan peserta didik baru kelas VII' },
  { id: 'kaldik-2', dateStart: '2024-07-18', dateEnd: '2024-07-18', title: 'Hari Pertama Pembelajaran Efektif Semester Ganjil', category: 'Hari Efektif', semester: 'Ganjil' },
  { id: 'kaldik-3', dateStart: '2024-08-17', dateEnd: '2024-08-17', title: 'Upacara HUT Kemerdekaan RI Ke-79', category: 'Hari Libur Nasional', semester: 'Ganjil' },
  { id: 'kaldik-4', dateStart: '2024-09-16', dateEnd: '2024-09-16', title: 'Maulid Nabi Muhammad SAW 1446 H', category: 'Hari Libur Nasional', semester: 'Ganjil' },
  { id: 'kaldik-5', dateStart: '2024-09-23', dateEnd: '2024-09-28', title: 'Sumatif Tengah Semester (STS) Ganjil', category: 'Penilaian / Asesmen', semester: 'Ganjil' },
  { id: 'kaldik-6', dateStart: '2024-12-02', dateEnd: '2024-12-09', title: 'Sumatif Akhir Semester (SAS) Ganjil', category: 'Penilaian / Asesmen', semester: 'Ganjil' },
  { id: 'kaldik-7', dateStart: '2024-12-20', dateEnd: '2024-12-20', title: 'Pembagian Buku Laporan Hasil Belajar (Rapor)', category: 'Kegiatan Madrasah', semester: 'Ganjil' },
  { id: 'kaldik-8', dateStart: '2024-12-23', dateEnd: '2025-01-04', title: 'Libur Akhir Semester Ganjil', category: 'Libur Semester', semester: 'Ganjil' },
];

export const defaultJadwal: TeachingScheduleItem[] = [
  { id: 'jdw-1', day: 'Senin', periodTime: '07.30 - 08.50', periodHours: 2, className: 'VII-A', subject: 'Bahasa Indonesia', room: 'R. 101' },
  { id: 'jdw-2', day: 'Senin', periodTime: '09.10 - 10.30', periodHours: 2, className: 'VII-B', subject: 'Bahasa Indonesia', room: 'R. 102' },
  { id: 'jdw-3', day: 'Selasa', periodTime: '08.50 - 10.10', periodHours: 2, className: 'VII-C', subject: 'Bahasa Indonesia', room: 'R. 103' },
  { id: 'jdw-4', day: 'Rabu', periodTime: '07.30 - 09.30', periodHours: 3, className: 'VII-A', subject: 'Bahasa Indonesia', room: 'R. 101' },
  { id: 'jdw-5', day: 'Kamis', periodTime: '09.10 - 11.10', periodHours: 3, className: 'VII-B', subject: 'Bahasa Indonesia', room: 'R. 102' },
  { id: 'jdw-6', day: 'Jumat', periodTime: '08.00 - 09.20', periodHours: 2, className: 'VII-C', subject: 'Bahasa Indonesia', room: 'R. 103' },
];

export const defaultRPE: TimeAllocationRPE = {
  semester: 'Ganjil',
  totalWeeks: 24,
  ineffectiveWeeks: [
    { reason: 'MPLS & Masa Taaruf Siswa Baru', count: 1 },
    { reason: 'Libur HUT RI & Hari Besar Nasional', count: 1 },
    { reason: 'Sumatif Tengah Semester (STS)', count: 1 },
    { reason: 'Sumatif Akhir Semester (SAS)', count: 1 },
    { reason: 'Pengolahan Nilai & Pembagian Rapor', count: 1 },
    { reason: 'Libur Akhir Semester', count: 2 },
  ],
  effectiveWeeks: 17,
  hoursPerWeek: 5,
  totalEffectiveHours: 85, // 17 x 5 JP
  hourDistribution: [
    { purpose: 'Bab 1: Menjelajah Nusantara (Teks Deskripsi)', allocatedHours: 18 },
    { purpose: 'Bab 2: Berkelana di Alam Imajinasi (Cerita Fantasi)', allocatedHours: 16 },
    { purpose: 'Bab 3: Hal yang Baik bagi Tubuh (Teks Prosedur)', allocatedHours: 18 },
    { purpose: 'Bab 4: Aksi Nyata Lindungi Bumi (Teks Berita)', allocatedHours: 15 },
    { purpose: 'Sumatif Lingkup Materi & Asesmen Terjadwal', allocatedHours: 10 },
    { purpose: 'Cadangan & Penguatan Asesmen', allocatedHours: 8 },
  ],
};

export const defaultProta: AnnualProgramItem[] = [
  { id: 'prota-1', semester: 'Ganjil', materialUnit: 'Bab 1: Teks Deskripsi (Menjelajah Nusantara)', learningObjectivesSummary: 'Menganalisis dan menulis teks deskripsi berorientasi objek budaya', allocatedHours: 18, timeframe: 'Juli - Agustus' },
  { id: 'prota-2', semester: 'Ganjil', materialUnit: 'Bab 2: Teks Fantasi (Keberanian & Imajinasi)', learningObjectivesSummary: 'Menganalisis unsur intrinsik dan menulis cerita imajinatif', allocatedHours: 16, timeframe: 'Agustus - September' },
  { id: 'prota-3', semester: 'Ganjil', materialUnit: 'Bab 3: Teks Prosedur (Kreativitas & Pola Hidup Sehat)', learningObjectivesSummary: 'Menelaah infografik dan menyusun teks prosedur petunjuk terperinci', allocatedHours: 18, timeframe: 'Oktober' },
  { id: 'prota-4', semester: 'Ganjil', materialUnit: 'Bab 4: Teks Berita (Eksplorasi Peristiwa Faktual)', learningObjectivesSummary: 'Menemukan unsur adiksimba dan menulis teks berita sederhana', allocatedHours: 15, timeframe: 'November' },
  { id: 'prota-5', semester: 'Ganjil', materialUnit: 'Cadangan & Asesmen Sumatif Akhir Semester', learningObjectivesSummary: 'Pelaksanaan asesmen akhir semester dan tindak lanjut remedial', allocatedHours: 18, timeframe: 'Desember' },
  { id: 'prota-6', semester: 'Genap', materialUnit: 'Bab 5: Membuka Gerbang Dunia (Buku Fiksi & Nonfiksi)', learningObjectivesSummary: 'Meresensi buku dan mengidentifikasi unsur literasi', allocatedHours: 18, timeframe: 'Januari - Februari' },
  { id: 'prota-7', semester: 'Genap', materialUnit: 'Bab 6: Sampaikan Melalui Surat (Resmi & Pribadi)', learningObjectivesSummary: 'Menulis surat dinas dan surel etis santun', allocatedHours: 18, timeframe: 'Maret - April' },
];

export const defaultPromes: SemesterProgramItem[] = [
  {
    id: 'prm-1',
    no: 1,
    material: 'Bab 1: Teks Deskripsi Objek Nusantara',
    allocatedHours: 18,
    distribution: [
      { month: 'Juli', weeks: [false, false, true, true, false] },
      { month: 'Agustus', weeks: [true, true, true, false, false] },
      { month: 'September', weeks: [false, false, false, false, false] },
      { month: 'Oktober', weeks: [false, false, false, false, false] },
      { month: 'November', weeks: [false, false, false, false, false] },
      { month: 'Desember', weeks: [false, false, false, false, false] },
    ],
  },
  {
    id: 'prm-2',
    no: 2,
    material: 'Bab 2: Teks Narasi & Cerita Fantasi',
    allocatedHours: 16,
    distribution: [
      { month: 'Juli', weeks: [false, false, false, false, false] },
      { month: 'Agustus', weeks: [false, false, false, true, true] },
      { month: 'September', weeks: [true, true, false, false, false] },
      { month: 'Oktober', weeks: [false, false, false, false, false] },
      { month: 'November', weeks: [false, false, false, false, false] },
      { month: 'Desember', weeks: [false, false, false, false, false] },
    ],
  },
  {
    id: 'prm-3',
    no: 3,
    material: 'Sumatif Tengah Semester (STS)',
    allocatedHours: 5,
    distribution: [
      { month: 'Juli', weeks: [false, false, false, false, false] },
      { month: 'Agustus', weeks: [false, false, false, false, false] },
      { month: 'September', weeks: [false, false, true, true, false] },
      { month: 'Oktober', weeks: [false, false, false, false, false] },
      { month: 'November', weeks: [false, false, false, false, false] },
      { month: 'Desember', weeks: [false, false, false, false, false] },
    ],
  },
  {
    id: 'prm-4',
    no: 4,
    material: 'Bab 3: Teks Prosedur & Langkah Kerja',
    allocatedHours: 18,
    distribution: [
      { month: 'Juli', weeks: [false, false, false, false, false] },
      { month: 'Agustus', weeks: [false, false, false, false, false] },
      { month: 'September', weeks: [false, false, false, false, true] },
      { month: 'Oktober', weeks: [true, true, true, true, false] },
      { month: 'November', weeks: [false, false, false, false, false] },
      { month: 'Desember', weeks: [false, false, false, false, false] },
    ],
  },
];

export const defaultKodeEtik: CodeOfEthicsDocument = {
  title: 'KODE ETIK GURU INDONESIA',
  preamble: 'Guru Indonesia menyadari bahwa pendidikan adalah bidang pengabdian terhadap Tuhan Yang Maha Esa, bangsa, dan negara serta kemanusiaan pada umumnya. Guru Indonesia terpanggil untuk menunaikan karyanya dengan berpedoman pada sembilan pasal Kode Etik Guru Indonesia.',
  articles: [
    { number: 1, text: 'Guru berbakti membimbing peserta didik untuk membentuk manusia Indonesia seutuhnya yang berjiwa Pancasila.' },
    { number: 2, text: 'Guru memiliki dan melaksanakan kejujuran profesional dalam menerapkan kurikulum sesuai dengan kebutuhan peserta didik masing-masing.' },
    { number: 3, text: 'Guru berusaha memperoleh informasi tentang peserta didik sebagai bahan melakukan bimbingan dan pembinaan.' },
    { number: 4, text: 'Guru menciptakan suasana sekolah sebaik-baiknya yang menunjang berhasilnya proses belajar-mengajar.' },
    { number: 5, text: 'Guru memelihara hubungan baik dengan orang tua murid dan masyarakat sekitarnya untuk membina peran serta dan rasa tanggung jawab bersama terhadap pendidikan.' },
    { number: 6, text: 'Guru secara pribadi dan bersama-sama mengembangkan dan meningkatkan mutu dan martabat profesinya.' },
    { number: 7, text: 'Guru memelihara hubungan seprofesi, semangat kekeluargaan, dan kesetiakawanan sosial.' },
    { number: 8, text: 'Guru secara bersama-sama memelihara dan meningkatkan mutu organisasi PGRI sebagai sarana perjuangan dan pengabdian.' },
    { number: 9, text: 'Guru melaksanakan segala kebijakan pemerintah dalam bidang pendidikan.' },
  ],
};

export const defaultIkrarGuru = `IKRAR GURU INDONESIA

1. Kami Guru Indonesia, adalah insan pendidik bangsa yang beriman dan bertakwa kepada Tuhan Yang Maha Esa.
2. Kami Guru Indonesia, adalah pengemban dan pelaksana cita-cita Proklamasi Kemerdekaan Republik Indonesia, pembela dan pengamal Pancasila yang setia pada Undang-Undang Dasar 1945.
3. Kami Guru Indonesia, bertekad bulat mewujudkan tujuan pendidikan nasional dalam mencerdaskan kehidupan bangsa.
4. Kami Guru Indonesia, bersatu padu dalam wadah organisasi perjuangan Persatuan Guru Republik Indonesia, membina persatuan dan kesatuan bangsa yang berwatak kekeluargaan.
5. Kami Guru Indonesia, menjunjung tinggi Kode Etik Guru Indonesia sebagai pedoman tingkah laku profesi dalam pengabdian terhadap bangsa, negara, dan kemanusiaan.`;

export const defaultTataTertibGuru = `TATA TERTIB GURU DAN TENAGA KEPENDIDIKAN

I. KETENTUAN WAKTU & KEHADIRAN
1. Guru hadir di sekolah sekurang-kurangnya 15 menit sebelum bel tanda masuk berbunyi (pukul 06.45 WIB).
2. Guru menandatangani presensi kehadiran (elektronik/manual) pada saat datang dan saat pulang.
3. Jam kerja guru memenuhi beban kerja 37,5 jam per minggu sesuai regulasi dinas.

II. TUGAS DAN KEWAJIBAN AKADEMIK
1. Menyiapkan kelengkapan administrasi dan Buku Kerja Guru sebelum KBM berlangsung.
2. Mengisi Jurnal Mengajar dan Daftar Hadir Peserta Didik setiap jam tatap muka.
3. Memberikan teladan sikap disiplin, santun berbahasa, dan berpakaian dinas rapi sesuai ketentuan hari.
4. Melaksanakan asesmen pembelajaran secara adil, objektif, dan transparan.

III. LARANGAN
1. Meninggalkan kelas saat pembelajaran tanpa instruksi atau tugas yang jelas.
2. Menggunakan gawai untuk kepentingan pribadi selama jam tatap muka di kelas.
3. Melakukan tindakan diskriminasi, kekerasan fisik, maupun verbal terhadap peserta didik.`;

export const defaultPembiasaan: TeacherHabituationItem[] = [
  { id: 'hab-1', frequency: 'Harian', activityName: 'Penyambutan Senyum, Sapa, Salam, Sopan, Santun (5S)', scheduleTime: '06.30 - 07.00 WIB di Gerbang Sekolah', targetValue: 'Karakter Ramah & Keteladanan Akhlak Mulia', implementationStatus: 'Terlaksana Baik', notes: 'Piket bergilir bersama tim kesiswaan' },
  { id: 'hab-2', frequency: 'Harian', activityName: 'Tadarus / Doa Pagi dan Gerakan Literasi 15 Menit', scheduleTime: '07.00 - 07.15 WIB di Ruang Kelas', targetValue: 'Religius dan Budaya Literasi Kritis', implementationStatus: 'Terlaksana Baik', notes: 'Didampingi guru jam pertama' },
  { id: 'hab-3', frequency: 'Mingguan', activityName: 'Upacara Bendera Hari Senin & Apel Pembiasaan', scheduleTime: 'Setiap Senin 07.00 - 07.45 WIB di Lapangan', targetValue: 'Nasionalisme dan Kedisiplinan', implementationStatus: 'Terlaksana Baik', notes: 'Petugas upacara bergilir per kelas' },
  { id: 'hab-4', frequency: 'Bulanan', activityName: 'Komunitas Belajar Guru (Kombel) & Telaah Praktik Baik', scheduleTime: 'Jumat Pekan ke-2 pukul 13.00 - 15.00 WIB', targetValue: 'Pengembangan Keprofesian Berkelanjutan (PKB)', implementationStatus: 'Terlaksana Baik', notes: 'Membahas diferensiasi pembelajaran & AI tools' },
];

export const defaultAbsensi: StudentAttendanceRecord[] = [
  { id: 'att-1', date: '2024-08-05', className: 'VII-A', studentId: 'std-1', status: 'H' },
  { id: 'att-2', date: '2024-08-05', className: 'VII-A', studentId: 'std-2', status: 'H' },
  { id: 'att-3', date: '2024-08-05', className: 'VII-A', studentId: 'std-3', status: 'S', note: 'Surat dokter flu' },
  { id: 'att-4', date: '2024-08-05', className: 'VII-A', studentId: 'std-4', status: 'H' },
  { id: 'att-5', date: '2024-08-05', className: 'VII-A', studentId: 'std-5', status: 'H' },
  { id: 'att-6', date: '2024-08-05', className: 'VII-A', studentId: 'std-6', status: 'I', note: 'Acara keluarga' },
  { id: 'att-7', date: '2024-08-05', className: 'VII-A', studentId: 'std-7', status: 'H' },
  { id: 'att-8', date: '2024-08-05', className: 'VII-A', studentId: 'std-8', status: 'H' },
  { id: 'att-9', date: '2024-08-05', className: 'VII-A', studentId: 'std-9', status: 'H' },
  { id: 'att-10', date: '2024-08-05', className: 'VII-A', studentId: 'std-10', status: 'H' },
];

export const defaultJurnal: TeachingJournalRecord[] = [
  {
    id: 'jrn-1',
    date: '2024-08-05',
    periodTime: '07.30 - 08.50 WIB (2 JP)',
    className: 'VII-A',
    subject: 'Bahasa Indonesia',
    topicMaterial: 'Teks Deskripsi: Menemukan Citraan Indra dalam Objek Wisata',
    learningObjective: 'TP 7.1: Mengidentifikasi kalimat bermajas dan citraan panca indra',
    methodUsed: 'Problem-Based Learning dengan Media Audio Visual',
    presentCount: 13,
    absentCount: 2,
    teachingNotes: 'Pembelajaran berlangsung dinamis. 5 kelompok mempresentasikan hasil diskusi secara tepat waktu.',
    challenges: 'Kelompok 3 masih tertukar antara kata konkret dengan majas personifikasi.',
    followUp: 'Diberikan penguatan konsep kata konkret di awal pertemuan Rabu lusa.',
  },
  {
    id: 'jrn-2',
    date: '2024-08-07',
    periodTime: '07.30 - 09.30 WIB (3 JP)',
    className: 'VII-A',
    subject: 'Bahasa Indonesia',
    topicMaterial: 'Teks Deskripsi: Menyusun Kerangka Tulisan Deskripsi Sekolah',
    learningObjective: 'TP 7.2: Menyusun kerangka teks deskripsi lingkungan sekolah',
    methodUsed: 'Outdoor Learning (Observasi Lapangan Selasar Sekolah)',
    presentCount: 15,
    absentCount: 0,
    teachingNotes: 'Siswa sangat aktif saat melakukan eksplorasi langsung di taman dan perpustakaan sekolah.',
    challenges: 'Pengkondisian waktu kembali ke kelas butuh 5 menit ekstra.',
    followUp: 'Memberikan tanda lonceng waktu agar siswa disiplin waktu batas observasi.',
  },
];

export const defaultBukuPegangan: ReferenceDocument[] = [
  {
    id: 'ref-1',
    title: 'Buku Panduan Guru Bahasa Indonesia SMP Kelas VII',
    category: 'Buku Guru',
    authorOrPublisher: 'Kemendikbudristek RI (Pusat Kurikulum dan Perbukuan)',
    year: '2021',
    fileUrlOrLink: 'https://buku.kemdikbud.go.id',
    description: 'Panduan utama strategi pembelajaran berdiferensiasi dan instrumen asesmen Kurikulum Merdeka.',
  },
  {
    id: 'ref-2',
    title: 'Buku Siswa Bahasa Indonesia SMP Kelas VII',
    category: 'Buku Siswa',
    authorOrPublisher: 'Rakhma Subarna, dkk. / Kemendikbudristek',
    year: '2021',
    fileUrlOrLink: 'https://buku.kemdikbud.go.id',
    description: 'Buku teks utama bacaan dan penugasan peserta didik.',
  },
  {
    id: 'ref-3',
    title: 'Panduan Pembelajaran dan Asesmen (PPA) Edisi Revisi',
    category: 'Panduan Kurikulum',
    authorOrPublisher: 'BSKAP Kemendikbudristek RI',
    year: '2024',
    fileUrlOrLink: 'https://kurikulum.kemdikbud.go.id',
    description: 'Regulasi resmi penyusunan KKTP, pelaporan rapor, dan kriteria kenaikan kelas.',
  },
];

export const defaultKonsultasi: TeacherConsultationRecord[] = [
  {
    id: 'kon-1',
    date: '2024-07-22',
    consultantName: 'Drs. H. Ahmad Fauzi, M.Pd.',
    consultantRole: 'Kepala Sekolah',
    topic: 'Penyelarasan Alur Tujuan Pembelajaran (ATP) dan Perencanaan P5 Semester Ganjil',
    results: 'Rancangan ATP mapel Bahasa Indonesia disetujui. Tema P5 diselaraskan dengan program Adiwiyata sekolah.',
    recommendations: 'Gunakan asesmen formatif berkala berbasis rubrik deskriptif agar perkembangan siswa terpetakan detail.',
    followUpPlan: 'Mengunggah modul ajar final ke sistem Buku Kerja Guru Digital sebelum minggu ke-2 Agustus.',
  },
];

// Helper to calculate Indonesian grading scale
export function calculateGradeMetrics(tugas: number[], formatif: number[], sts: number, sas: number) {
  const avgTugas = tugas.length > 0 ? tugas.reduce((a, b) => a + b, 0) / tugas.length : 0;
  const avgFormatif = formatif.length > 0 ? formatif.reduce((a, b) => a + b, 0) / formatif.length : 0;

  // Weight standard: 20% Tugas, 30% Formatif, 25% STS, 25% SAS
  const final = Math.round(avgTugas * 0.2 + avgFormatif * 0.3 + sts * 0.25 + sas * 0.25);

  let predicate: 'A' | 'B' | 'C' | 'D' = 'C';
  let achievement = '';

  if (final >= 88) {
    predicate = 'A';
    achievement = 'Sangat menguasai seluruh capaian pembelajaran, mampu menyajikan analisis teks deskripsi dan prosedur secara kritis dan orisinal.';
  } else if (final >= 78) {
    predicate = 'B';
    achievement = 'Menguasai capaian pembelajaran dengan baik, mampu mengidentifikasi struktur teks dan menyusun langkah kerja secara runtut.';
  } else if (final >= 68) {
    predicate = 'C';
    achievement = 'Cukup menguasai capaian pembelajaran, memerlukan pendampingan lanjutan dalam penggunaan kalimat konkret dan ejaan.';
  } else {
    predicate = 'D';
    achievement = 'Perlu bimbingan intensif dalam memahami ide pokok teks dan penyusunan kalimat sederhana.';
  }

  return { finalGrade: final, predicate, achievementDescription: achievement };
}

export const defaultNilai: GradeRecord[] = defaultStudents.map((std, idx) => {
  const baseTugas = [80 + (idx % 12), 82 + (idx % 10), 85 - (idx % 8), 84 + (idx % 7)];
  const baseFormatif = [82 + (idx % 8), 80 + (idx % 9), 86 - (idx % 6), 85 + (idx % 6)];
  const sts = 78 + (idx * 3) % 20;
  const sas = 80 + (idx * 2) % 18;
  const { finalGrade, predicate, achievementDescription } = calculateGradeMetrics(baseTugas, baseFormatif, sts, sas);

  return {
    id: `grd-${std.id}`,
    studentId: std.id,
    className: std.className,
    subject: 'Bahasa Indonesia',
    semester: 'Ganjil',
    tugasScores: baseTugas,
    formatifScores: baseFormatif,
    stsScore: sts,
    sasScore: sas,
    finalGrade,
    predicate,
    achievementDescription,
  };
});

export const defaultDiagnostik: DiagnosticAssessmentRecord[] = [
  {
    id: 'diag-1',
    type: 'Non-Kognitif',
    className: 'VII-A',
    subject: 'Bahasa Indonesia',
    topic: 'Pemetaan Gaya Belajar & Profil Sosio-Emosional Awal Tahun',
    questions: [
      'Ketika mempelajari materi baru, media apa yang paling memudahkan Anda memahami isi pelajaran?',
      'Apakah Anda lebih suka berdiskusi kelompok atau membaca hening secara mandiri?',
      'Fasilitas gawai apa yang tersedia di rumah untuk mendukung tugas belajar?',
    ],
    findingsSummary: 'Dari 15 siswa yang dipetakan, 47% memiliki kecenderungan gaya belajar visual, 33% auditori, dan 20% kinestetik. Mayoritas memiliki akses smartphone mandiri.',
    learningStyleDistribution: { visual: 7, auditory: 5, kinesthetic: 3 },
    differentiationRecommendations: '1. Sediakan variasi bahan ajar (video grafis untuk visual, rekaman narasi untuk auditori, simulasi untuk kinestetik).\n2. Bentuk kelompok heterogen agar saling melengkapi.',
  },
  {
    id: 'diag-2',
    type: 'Kognitif',
    className: 'VII-A',
    subject: 'Bahasa Indonesia',
    topic: 'Pemahaman Awal Kosakata dan Pemahaman Bacaan Dasar',
    questions: [
      'Jelaskan perbedaan antara fakta dengan opini dalam sebuah kalimat!',
      'Sebutkan 3 kata yang menggambarkan suasana sejuk di pegunungan!',
    ],
    findingsSummary: '70% siswa sudah mampu membedakan fakta dan opini. 30% siswa masih memerlukan penguatan dalam membedakan kata sifat dan kata benda.',
    learningStyleDistribution: { visual: 0, auditory: 0, kinesthetic: 0 },
    differentiationRecommendations: 'Lakukan penguatan kosa kata dan bank kata (word bank) di sudut dinding kelas.',
  },
];

export const defaultInstrumen: AssessmentInstrument[] = [
  {
    id: 'inst-1',
    subject: 'Bahasa Indonesia',
    className: 'VII-A',
    type: 'Pilihan Ganda',
    cognitiveLevel: 'C2',
    tpCode: 'TP 7.1',
    material: 'Teks Deskripsi',
    questionText: 'Bacalah kutipan berikut: "Angin semilir berhembus lembut membelai dedaunan cemara di tepi pantai. Bau harum khas pasir basah bercampur segarnya air laut menyeruak memenuhi rongga dada."\n\nCitraan indra yang paling menonjol pada kutipan di atas adalah...',
    options: ['Penglihatan dan pendengaran', 'Perabaan dan penciuman', 'Pengecapan dan penglihatan', 'Pendengaran dan gerak'],
    correctAnswer: 'B. Perabaan dan penciuman',
    scoringGuide: 'Skor 10 untuk jawaban tepat B, 0 untuk opsi lain.',
  },
  {
    id: 'inst-2',
    subject: 'Bahasa Indonesia',
    className: 'VII-A',
    type: 'Pilihan Ganda Kompleks',
    cognitiveLevel: 'C4',
    tpCode: 'TP 7.1',
    material: 'Teks Deskripsi',
    questionText: 'Berdasarkan kaidah teks deskripsi, berikan tanda centang (✓) pada setiap pernyataan yang BENAR mengenai ciri kebahasaannya!',
    options: [
      '[✓] Menggunakan kata-kata khusus (misal: merah merona, kuning keemasan)',
      '[✓] Mengandung kata kerja aksi untuk menggambarkan proses pembuatan',
      '[✓] Memakai kalimat bermajas untuk mengkonkretkan objek',
      '[ ] Menggunakan kata hubung syarat seperti "jika" dan "apabila"',
    ],
    correctAnswer: 'Pernyataan 1 dan 3 benar',
    scoringGuide: 'Skor 20 jika memilih kedua opsi benar secara utuh.',
  },
  {
    id: 'inst-3',
    subject: 'Bahasa Indonesia',
    className: 'VII-A',
    type: 'Uraian',
    cognitiveLevel: 'C5',
    tpCode: 'TP 7.2',
    material: 'Menulis Deskripsi',
    questionText: 'Susunlah satu paragraf teks deskripsi (minimal 4 kalimat) yang melukiskan suasana perpustakaan sekolah pada jam istirahat dengan memadukan citraan penglihatan dan pendengaran!',
    correctAnswer: 'Rubrik: Kejelasan objek (10), pemakaian 2 citraan indra (15), ketepatan ejaan PUEBI (15).',
    scoringGuide: 'Skor maksimal 40 poin.',
  },
];

export const defaultAnalisisSoal: ItemAnalysisRecord[] = [
  { id: 'anl-1', examTitle: 'Sumatif Tengah Semester Ganjil', className: 'VII-A', subject: 'Bahasa Indonesia', itemNumber: 1, difficultyIndex: 0.73, difficultyCategory: 'Mudah', discriminatingPower: 0.42, distractorEfficiency: 'Berfungsi Baik', recommendation: 'Diterima' },
  { id: 'anl-2', examTitle: 'Sumatif Tengah Semester Ganjil', className: 'VII-A', subject: 'Bahasa Indonesia', itemNumber: 2, difficultyIndex: 0.55, difficultyCategory: 'Sedang', discriminatingPower: 0.48, distractorEfficiency: 'Berfungsi Sangat Baik', recommendation: 'Diterima' },
  { id: 'anl-3', examTitle: 'Sumatif Tengah Semester Ganjil', className: 'VII-A', subject: 'Bahasa Indonesia', itemNumber: 3, difficultyIndex: 0.28, difficultyCategory: 'Sukar', discriminatingPower: 0.18, distractorEfficiency: 'Pengecoh D tidak dipilih', recommendation: 'Direvisi' },
  { id: 'anl-4', examTitle: 'Sumatif Tengah Semester Ganjil', className: 'VII-A', subject: 'Bahasa Indonesia', itemNumber: 4, difficultyIndex: 0.60, difficultyCategory: 'Sedang', discriminatingPower: 0.52, distractorEfficiency: 'Berfungsi Baik', recommendation: 'Diterima' },
  { id: 'anl-5', examTitle: 'Sumatif Tengah Semester Ganjil', className: 'VII-A', subject: 'Bahasa Indonesia', itemNumber: 5, difficultyIndex: 0.45, difficultyCategory: 'Sedang', discriminatingPower: 0.38, distractorEfficiency: 'Berfungsi Baik', recommendation: 'Diterima' },
];

export const defaultKisiKisi: BlueprintItem[] = [
  { id: 'ks-1', examType: 'STS', subject: 'Bahasa Indonesia', className: 'VII-A', semester: 'Ganjil', tpCode: 'TP 7.1', material: 'Ciri dan Struktur Teks Deskripsi', indicator: 'Disajikan kutipan teks, siswa dapat menentukan bagian struktur teks dengan tepat.', cognitiveLevel: 'L2 (C3)', questionForm: 'Pilihan Ganda', questionNumber: 1 },
  { id: 'ks-2', examType: 'STS', subject: 'Bahasa Indonesia', className: 'VII-A', semester: 'Ganjil', tpCode: 'TP 7.1', material: 'Citraan Panca Indra', indicator: 'Disajikan kalimat deskripsi, siswa dapat menganalisis jenis panca indra yang digunakan.', cognitiveLevel: 'L3 (C4)', questionForm: 'Pilihan Ganda', questionNumber: 2 },
  { id: 'ks-3', examType: 'STS', subject: 'Bahasa Indonesia', className: 'VII-A', semester: 'Ganjil', tpCode: 'TP 7.2', material: 'Kaidah Kebahasaan Majas', indicator: 'Disajikan kalimat, siswa dapat mengidentifikasi majas personifikasi.', cognitiveLevel: 'L2 (C3)', questionForm: 'Pilihan Ganda Kompleks', questionNumber: 3 },
  { id: 'ks-4', examType: 'STS', subject: 'Bahasa Indonesia', className: 'VII-A', semester: 'Ganjil', tpCode: 'TP 7.2', material: 'Paragraf Deskripsi Kreatif', indicator: 'Siswa dapat menulis paragraf deskripsi lingkungan dengan citraan indra lengkap.', cognitiveLevel: 'L3 (C5)', questionForm: 'Uraian', questionNumber: 4 },
];

export const defaultRemedial: RemedialEnrichmentProgram[] = [
  {
    id: 'rem-1',
    programType: 'Remedial',
    className: 'VII-A',
    subject: 'Bahasa Indonesia',
    tpCode: 'TP 7.1',
    material: 'Menganalisis Citraan Indra & Struktur Teks Deskripsi',
    kktpStandard: 75,
    studentNames: ['Bagas Aditya Nugraha', 'Dimas Arya Pamungkas', 'Irfan Maulana Malik'],
    activityPlan: 'Bimbingan ulang intensif dengan tabel kata kunci indrawi dan tes ulang soal setara.',
    executionDate: '2024-09-30',
    evaluationResult: 'Seluruh peserta telah mencapai nilai di atas KKTP (rerata nilai remedial: 80).',
  },
  {
    id: 'rem-2',
    programType: 'Pengayaan',
    className: 'VII-A',
    subject: 'Bahasa Indonesia',
    tpCode: 'TP 7.2',
    material: 'Penulisan Deskripsi Naratif Lanjutan',
    kktpStandard: 75,
    studentNames: ['Aisyah Putri Rahmadani', 'Cantika Dewi Lestari', 'Hafizhah Khairun Nisa'],
    activityPlan: 'Menulis artikel deskripsi objek wisata nusantara untuk diterbitkan pada majalah dinding sekolah.',
    executionDate: '2024-10-02',
    evaluationResult: 'Menghasilkan 3 karya artikel deskriptif berkualitas tinggi yang dipajang di mading sekolah.',
  },
];

export const defaultTugas: AssignmentItem[] = [
  {
    id: 'tgs-1',
    title: 'LKPD Mandiri: Menjelajah Objek Wisata Sekitar Tempat Tinggal',
    type: 'Terstruktur',
    className: 'VII-A',
    subject: 'Bahasa Indonesia',
    description: 'Amati satu tempat bersejarah/taman di dekat rumah Anda, lalu catat minimal 5 kalimat deskripsi menggunakan indra penglihatan, pendengaran, dan penciuman.',
    givenDate: '2024-08-12',
    dueDate: '2024-08-19',
    submissionCount: 15,
    totalStudents: 15,
    status: 'Selesai',
  },
  {
    id: 'tgs-2',
    title: 'Proyek Poster Infografik Teks Prosedur Cuci Tangan Sehat',
    type: 'Tidak Terstruktur',
    className: 'VII-A',
    subject: 'Bahasa Indonesia',
    description: 'Buatlah poster panduan teks prosedur kreatif yang memuat langkah sistematis, kalimat imperatif santun, dan visual pendukung.',
    givenDate: '2024-10-07',
    dueDate: '2024-10-21',
    submissionCount: 14,
    totalStudents: 15,
    status: 'Aktif',
  },
];

export const defaultRefleksi: ReflectionJournal[] = [
  {
    id: 'ref-1',
    date: '2024-08-09',
    className: 'VII-A',
    subject: 'Bahasa Indonesia',
    topic: 'Teks Deskripsi dan Pemanfaatan Lingkungan Luar Kelas (Outdoor)',
    whatWentWell: 'Peserta didik sangat antusias saat diajak mengamati selasar taman sekolah. Terjadi peningkatan perbendaharaan kata konkret hingga 40% dibandingkan pembelajaran di dalam kelas.',
    challenges: 'Dibutuhkan instruksi yang lebih tegas mengenai batasan area observasi agar tidak mengganggu kelas tetangga yang sedang belajar.',
    studentResponse: '90% peserta didik menyatakan lebih mudah menulis setelah melihat dan menyentuh langsung dedaunan dan bunga di taman.',
    methodEvaluation: 'Pendekatan outdoor learning sangat efektif untuk materi deskripsi namun membutuhkan manajemen waktu yang presisi.',
    pointsToImprove: 'Menyiapkan kartu kerja terbagi per pos dan menetapkan pemimpin kelompok kecil yang bertanggung jawab atas ketertiban.',
    actionPlan: 'Pada pembelajaran teks prosedur berikutnya, demonstrasi pembuatan produk akan disiapkan dengan lembar pembagian kerja pos interaktif.',
    aiPedagogicalSummary: 'Strategi pembelajaran kontekstual berbasis lingkungan terbukti meningkatkan keterlibatan kognitif dan afektif siswa. Direkomendasikan penguatan rubrik penilaian unjuk kerja agar diferensiasi proses lebih terstruktur.',
  },
];

export const defaultTindakLanjut: FollowUpProgramItem[] = [
  {
    id: 'tl-1',
    sourceFinding: 'Hasil Supervisi Klinis Kepala Sekolah Semester Ganjil',
    identifiedIssue: 'Pemanfaatan media teknologi interaktif dalam pembelajaran masih perlu dioptimalkan agar tidak didominasi ceramah satu arah.',
    improvementPlan: 'Mengintegrasikan asesmen interaktif berbasis Quizizz / LKPD Digital Canva ke dalam minimal 2 pertemuan modul ajar per bulan.',
    strategy: 'Mengikuti workshop pemanfaatan AI untuk asesmen di Komunitas Belajar (Kombel) sekolah dan melakukan simulasi peer teaching.',
    targetSuccess: '100% siswa terlibat aktif menggunakan gawai kelas dengan skor ketuntasan formatif minimal 85%.',
    schedule: 'September - Oktober 2024',
    result: 'LKPD digital berhasil diterapkan di kelas VII-A dan VII-B, tingkat ketuntasan asesmen formatif meningkat menjadi 92%.',
    successEvaluation: 'Tercapai Sangat Baik',
  },
];

export const defaultNotifikasi: AppNotification[] = [
  {
    id: 'notif-1',
    title: 'Selamat Datang di Buku Kerja Guru Digital!',
    message: 'Aplikasi siap digunakan untuk seluruh administrasi pembelajaran Buku 1, Buku 2, Buku 3, dan Buku 4.',
    date: '2024-07-15 08:00',
    type: 'info',
    read: false,
  },
  {
    id: 'notif-2',
    title: 'Pengingat Administrasi Semester Ganjil',
    message: 'Periksa kelengkapan Alur Tujuan Pembelajaran (ATP) dan Alokasi Pekan Efektif (RPE) sebelum supervisi madrasah.',
    date: '2024-08-01 09:30',
    type: 'warning',
    read: false,
  },
];

// Reactive Data Store with Event Dispatch & Multi-User Isolation
export class DataStore {
  // User Management
  static getCurrentUserId(): string {
    return localStorage.getItem(STORAGE_KEYS.CURRENT_USER_ID) || 'guru-001';
  }

  static setCurrentUserId(userId: string): void {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER_ID, userId);
    window.dispatchEvent(new CustomEvent('bkgd-user-changed', { detail: { userId } }));
    window.dispatchEvent(new CustomEvent('bkgd-store-update', { detail: { key: 'user' } }));
  }

  static getAccounts(): UserAccount[] {
    const val = localStorage.getItem(STORAGE_KEYS.ACCOUNTS);
    if (!val) {
      localStorage.setItem(STORAGE_KEYS.ACCOUNTS, JSON.stringify(defaultAccounts));
      return defaultAccounts;
    }
    try {
      return JSON.parse(val);
    } catch {
      return defaultAccounts;
    }
  }

  static saveAccount(account: UserAccount): void {
    const accounts = this.getAccounts();
    const idx = accounts.findIndex(a => a.id === account.id);
    let updated: UserAccount[];
    if (idx >= 0) {
      updated = [...accounts];
      updated[idx] = account;
    } else {
      updated = [...accounts, account];
    }
    localStorage.setItem(STORAGE_KEYS.ACCOUNTS, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('bkgd-store-update', { detail: { key: 'accounts' } }));
  }

  static getCurrentUser(): UserAccount {
    const accounts = this.getAccounts();
    const currentId = this.getCurrentUserId();
    const found = accounts.find(a => a.id === currentId);
    return found || accounts[0] || defaultAccounts[0];
  }

  // Multi-user isolated storage getter/setter
  private static get<T>(baseKey: string, defaultValue: T): T {
    try {
      const userId = this.getCurrentUserId();
      const scopedKey = `${baseKey}_${userId}`;
      const val = localStorage.getItem(scopedKey);
      if (!val) {
        let userDefault = defaultValue;
        if (baseKey === STORAGE_KEYS.PROFILE) {
          userDefault = (userId === 'guru-002' ? defaultTeacherProfile2 : defaultTeacherProfile) as unknown as T;
        } else if (userId === 'guru-002') {
          if (baseKey === STORAGE_KEYS.CP) userDefault = defaultCP_Matematika as unknown as T;
          else if (baseKey === STORAGE_KEYS.TP) userDefault = defaultTP_Matematika as unknown as T;
          else if (baseKey === STORAGE_KEYS.STUDENTS) userDefault = defaultStudents_Matematika as unknown as T;
          else if (baseKey === STORAGE_KEYS.JURNAL) userDefault = defaultJurnal_Matematika as unknown as T;
        }
        localStorage.setItem(scopedKey, JSON.stringify(userDefault));
        return userDefault;
      }
      return JSON.parse(val);
    } catch {
      return defaultValue;
    }
  }

  private static set<T>(baseKey: string, value: T): void {
    try {
      const userId = this.getCurrentUserId();
      const scopedKey = `${baseKey}_${userId}`;
      localStorage.setItem(scopedKey, JSON.stringify(value));
      window.dispatchEvent(new CustomEvent('bkgd-store-update', { detail: { key: baseKey, userId } }));
    } catch (e) {
      console.error('Storage write error', e);
    }
  }

  // Profile
  static getProfile(): TeacherProfile {
    const userId = this.getCurrentUserId();
    const defaultProf = userId === 'guru-002' ? defaultTeacherProfile2 : defaultTeacherProfile;
    return this.get(STORAGE_KEYS.PROFILE, defaultProf);
  }
  static saveProfile(data: TeacherProfile): void {
    this.set(STORAGE_KEYS.PROFILE, data);
  }

  // ============================================================
  // PIPELINE 2: SINGLE-SOURCE OF TRUTH MASTER SISWA -> ABSENSI & NILAI
  // ============================================================
  static getStudents(): Student[] {
    return this.get(STORAGE_KEYS.STUDENTS, defaultStudents);
  }

  static saveStudents(data: Student[]): void {
    this.set(STORAGE_KEYS.STUDENTS, data);
    // Automatically synchronize GradeRecords and Attendance with the latest students list!
    this.syncStudentsToGradesAndAttendance(data);
  }

  // Automatically keeps Nilai and Absensi rows synchronized with Master Siswa
  static syncStudentsToGradesAndAttendance(studentList: Student[] = this.getStudents()): void {
    const profile = this.getProfile();
    const currentNilai = this.getNilai();

    // Rebuild or update GradeRecords so every student exists with valid calculations
    const updatedNilai: GradeRecord[] = studentList.map((std, idx) => {
      const existing = currentNilai.find(g => g.studentId === std.id);
      if (existing) {
        return {
          ...existing,
          className: std.className,
          subject: profile.subject,
        };
      }
      // New student added: generate clean initial grade record
      const defaultTugas = [80, 82, 85, 84];
      const defaultFormatif = [80, 82, 84, 85];
      const defaultSTS = 80;
      const defaultSAS = 82;
      const { finalGrade, predicate, achievementDescription } = calculateGradeMetrics(
        defaultTugas,
        defaultFormatif,
        defaultSTS,
        defaultSAS
      );

      return {
        id: `grd-${std.id}`,
        studentId: std.id,
        className: std.className,
        subject: profile.subject,
        semester: profile.semester,
        tugasScores: defaultTugas,
        formatifScores: defaultFormatif,
        stsScore: defaultSTS,
        sasScore: defaultSAS,
        finalGrade,
        predicate,
        achievementDescription,
      };
    });

    this.saveNilai(updatedNilai);
  }

  // Buku 1: CP, TP, ATP, Modul Ajar, P5, KKTP
  static getCP(): LearningOutcome[] {
    return this.get(STORAGE_KEYS.CP, defaultCP);
  }
  static saveCP(data: LearningOutcome[]): void {
    this.set(STORAGE_KEYS.CP, data);
  }

  static getTP(): LearningObjective[] {
    return this.get(STORAGE_KEYS.TP, defaultTP);
  }
  static saveTP(data: LearningObjective[]): void {
    this.set(STORAGE_KEYS.TP, data);
  }

  // ============================================================
  // PIPELINE 1: AUTO CASCADE CP -> TP -> ATP -> MODUL AJAR -> KKTP (BERBASIS KBC)
  // ============================================================
  static autoGenerateTPFromCP(cp: LearningOutcome): LearningObjective {
    const tpList = this.getTP();
    const newCode = `TP 7.${tpList.length + 1}`;
    const newTP: LearningObjective = {
      id: `tp-${Date.now()}`,
      cpId: cp.id,
      code: newCode,
      competency: 'Menganalisis & Mengaplikasikan',
      scopeOfMaterial: `Materi ${cp.element} Kontekstual`,
      statement: `Peserta didik mampu memahami dan menganalisis ${cp.description.slice(0, 90)}... secara kritis dengan sikap santun dan saling menghargai.`,
      indicator: `1. Mengidentifikasi konsep kunci pada elemen ${cp.element}\n2. Menyajikan telaah kontekstual secara kritis dan berempati\n3. Bekerja sama secara gotong royong dengan teman sekelas`,
      kbcCharacterGoal: cp.kbcPillar ? `Mengembangkan pilar ${cp.kbcPillar}` : 'Cinta kepada Ilmu & Cinta Sesama (Kolaboratif Berkasih)',
      semester: 'Ganjil',
      allocatedHours: 6,
    };
    const updated = [...tpList, newTP];
    this.saveTP(updated);

    // Otomatis tambahkan juga ke ATP!
    this.autoAddTPToATP(newTP);
    return newTP;
  }

  static autoAddTPToATP(tp: LearningObjective): ObjectiveFlowItem {
    const atpList = this.getATP();
    const newATP: ObjectiveFlowItem = {
      id: `atp-${Date.now()}`,
      tpId: tp.id,
      orderNumber: atpList.length + 1,
      semester: tp.semester,
      quarter: `Pertemuan Pekan Ke-${(atpList.length + 1) * 2}`,
      allocatedHours: tp.allocatedHours,
      kbcPillarIntegration: tp.kbcCharacterGoal || 'Pilar Cinta kepada Ilmu & Cinta Sesama',
      notes: `Disusun otomatis berbasis Kurikulum KBC untuk ${tp.code} (${tp.scopeOfMaterial})`,
    };
    const updated = [...atpList, newATP];
    this.saveATP(updated);
    return newATP;
  }

  static autoGenerateModulFromTP(tp: LearningObjective): TeachingModule {
    const profile = this.getProfile();
    const modulList = this.getModulAjar();
    const newModul: TeachingModule = {
      id: `modul-${Date.now()}`,
      title: `Modul Ajar Berbasis Kurikulum Cinta (KBC): ${tp.scopeOfMaterial}`,
      subject: profile.subject,
      phase: 'Fase D (Kelas 7-9)',
      grade: 'Kelas VII',
      allocatedHours: `${tp.allocatedHours} JP (${Math.ceil(tp.allocatedHours / 2)} Pertemuan)`,
      targetStudents: 'Reguler (32 Siswa) dengan lingkungan ramah anak',
      learningModel: 'Problem-Based Learning (PBL) Berbasis Cinta (KBC)',
      priorCompetencies: `Peserta didik telah memahami pengantar dasar ${tp.scopeOfMaterial} dan siap berkolaborasi secara empati.`,
      pancasilaProfile: ['Beriman & Bertakwa kepada Tuhan YME', 'Bernalar Kritis', 'Gotong Royong', 'Mandiri'],
      pancaCintaDimensions: ['Cinta kepada Tuhan', 'Cinta kepada Ilmu', 'Cinta kepada Diri Sendiri & Sesama', 'Cinta kepada Alam & Lingkungan'],
      isKBC: true,
      kbcLoveHabituation: 'Morning Check-In Empati: Sapaan hangat dan salam kasih guru di pintu kelas, doa bersama penuh khusyuk, menanyakan kondisi batin murid (apakah ada yang bersedih), dan peneguhan ruang kelas ramah anak bebas perundungan (bullying).',
      facilities: 'LCD Proyektor, LKPD Berdiferensiasi Ramah Anak, Buku Teks Siswa, Sudut Baca Inspirasi',
      meaningfulUnderstanding: `Pemahaman mendalam tentang ${tp.scopeOfMaterial} melatih nalar kritis, menumbuhkan rasa syukur kepada Tuhan, serta menanamkan kepedulian tulus kepada sesama dan lingkungan.`,
      triggerQuestions: `1. Bagaimana fenomena ${tp.scopeOfMaterial} dapat kita maknai sebagai salah satu nikmat ciptaan Tuhan?\n2. Bagaimana ilmu ini dapat membantu kita bersikap lebih peduli dan saling menolong sesama teman?`,
      learningObjectives: tp.statement,
      introductoryActivities: '1. Sapaan Kasih & Doa bersama penuh kekhidmatan (Cinta Tuhan).\n2. Empathy Emotion Check-In menanyakan kabar batin dan suasana hati siswa.\n3. Ice breaking riang gembira penumbuh kebersamaan.\n4. Apersepsi kontekstual dan penyampaian tujuan pembelajaran (Cinta Ilmu).',
      coreActivities: `Fase 1-5 PBL Berbasis Cinta: Orientasi masalah kontekstual ${tp.scopeOfMaterial}, eksplorasi kelompok inklusif tanpa membeda-bedakan kemampuan, bimbingan diferensiasi sabar dari guru (scaffolding penuh empati), presentasi karya santun, dan umpan balik apresiatif antarkelompok (60 Menit).`,
      closingActivities: '1. Rangkuman simpulan poin esensial bersama siswa.\n2. Refleksi Batin: Menuliskan rasa syukur atas ilmu baru dan ungkapan terima kasih pada teman sekelompok.\n3. Apresiasi tulus dari guru atas keaktifan semua murid.\n4. Doa syukur dan salam penutup penuh kehangatan.',
      assessmentPlan: `Asesmen Sikap Panca Cinta (Observasi Empati & Gotong Royong), Asesmen Formatif LKPD Ramah Anak materi ${tp.scopeOfMaterial}, dan Asesmen Sumatif Autentik tanpa labeling.`,
      remedialPlan: 'Bimbingan Restoratif Berakar Kasih: Pendampingan personal dengan penuh kesabaran dan tutor sebaya suportif bagi siswa belum tuntas KKTP.',
      enrichmentPlan: 'Proyek eksplorasi literasi mandiri yang memperkaya wawasan bagi siswa tuntas.',
      teacherReflection: 'Keterlibatan aktif peserta didik meningkat signifikan dengan suasana kelas yang aman dan saling menyayangi.',
      studentReflection: 'Siswa merasa dihargai, nyaman bertanya tanpa takut disalahkan, dan antusias berkolaborasi.',
      readingMaterials: 'Buku Siswa & Guru Kemendikbudristek RI serta Panduan Kurikulum Berbasis Cinta (KBC)',
      glossary: `${tp.competency}, ${tp.scopeOfMaterial}, Kurikulum Berbasis Cinta, Panca Cinta, Empati, Refleksi`,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
    };
    const updated = [newModul, ...modulList];
    this.saveModulAjar(updated);

    // Otomatis juga buatkan KKTP untuk TP ini!
    this.autoGenerateKKTPFromTP(tp);

    return newModul;
  }

  static autoGenerateKKTPFromTP(tp: LearningObjective): KKTPItem {
    const kktpList = this.getKKTP();
    const newKKTP: KKTPItem = {
      id: `kktp-${Date.now()}`,
      tpCode: tp.code,
      statement: tp.statement,
      indicator: tp.indicator,
      kbcLoveIndicator: `Membudayakan sikap saling menghargai teman (Cinta Sesama) dan ketekunan belajar (Cinta Ilmu) pada materi ${tp.scopeOfMaterial}.`,
      needsGuidanceCriteria: `0 - 65: Belum mampu menguasai kompetensi dasar ${tp.scopeOfMaterial}; membutuhkan bimbingan empati personal.`,
      sufficientCriteria: `66 - 75: Mampu mengidentifikasi ${tp.scopeOfMaterial} dengan panduan bimbingan ramah guru.`,
      goodCriteria: `76 - 85: Menguasai indikator ketercapaian ${tp.scopeOfMaterial} secara mandiri dan tepat.`,
      veryGoodCriteria: `86 - 100: Sangat mahir menganalisis dan mengaplikasikan ${tp.scopeOfMaterial} dengan nalar kritis dan sikap santun.`,
      intervalNote: 'KKTP Minimal Ketuntasan: 75 (Dukungan Restoratif)',
    };
    const updated = [...kktpList, newKKTP];
    this.saveKKTP(updated);
    return newKKTP;
  }

  static autoGenerateProjekKBC(theme: string, customTitle?: string): P5ProjectModule {
    const currentList = this.getP5Modules();
    const isAlam = theme.toLowerCase().includes('alam') || theme.toLowerCase().includes('lingkungan');
    const isSesama = theme.toLowerCase().includes('sesama') || theme.toLowerCase().includes('ramah') || theme.toLowerCase().includes('bullying');
    const isIlmu = theme.toLowerCase().includes('ilmu') || theme.toLowerCase().includes('sains') || theme.toLowerCase().includes('literasi');
    const isBangsa = theme.toLowerCase().includes('tanah air') || theme.toLowerCase().includes('kebinekaan') || theme.toLowerCase().includes('kearifan');

    let title = customTitle || `Projek Penguatan Karakter KBC: ${theme}`;
    let pancaCintaFocus = ['Cinta kepada Tuhan', 'Cinta kepada Diri Sendiri & Sesama Manusia'];
    let objectives = 'Membangun karakter mulia berlandaskan pilar Panca Cinta KBC dalam kehidupan nyata.';
    let activities = '1. Tahap Pengenalan Kasih\n2. Tahap Kontekstualisasi\n3. Tahap Aksi Nyata Cinta\n4. Tahap Refleksi & Festival Kasih';

    if (isAlam) {
      title = customTitle || 'Projek Karakter KBC: Gerakan Sahabat Bumi & Pilah Sampah Berkah';
      pancaCintaFocus = ['Cinta kepada Alam & Lingkungan', 'Cinta kepada Tuhan', 'Cinta kepada Sesama'];
      objectives = 'Membangun keinsafan cinta alam sebagai perwujudan syukur kepada Sang Pencipta melalui pemilahan sampah mandiri, penghijauan madrasah, dan kreasi ecobrick.';
      activities = '1. Tahap Pengenalan Kasih: Tadabur alam dan menyadari dampak sampah plastik.\n2. Tahap Kontekstualisasi: Menghitung volume sampah kelas dan wawancara petugas kebersihan sekolah.\n3. Tahap Aksi Nyata Cinta: Kerja bakti gotong royong memilah sampah dan membuat kompos taman sekolah.\n4. Tahap Refleksi & Festival Kasih: Gelar pameran karya daur ulang dan ikrar sahabat bumi.';
    } else if (isSesama) {
      title = customTitle || 'Projek Karakter KBC: Madrasah Ramah Anak & Duta Sahabat Damai (Anti-Bullying)';
      pancaCintaFocus = ['Cinta kepada Diri Sendiri & Sesama Manusia', 'Cinta kepada Tanah Air', 'Cinta kepada Tuhan'];
      objectives = 'Mewujudkan lingkungan belajar madrasah yang aman, inklusif, saling menghargai antarsiswa, dan bebas dari perundungan fisik maupun verbal.';
      activities = '1. Tahap Temu Kasih: Menonton film pendek tentang empati dan luka batin perundungan.\n2. Tahap Curahan Hati: Mengisi Kotak Kasih Sayang anonim dan refleksi pertemanan sehat.\n3. Tahap Aksi Bersama: Pembuatan Pohon Kebaikan, pentas drama resolusi konflik tanpa amarah, dan deklarasi kelas damai.\n4. Tahap Selebrasi Damai: Penobatan Duta Sahabat Damai dan ikrar persaudaraan.';
    } else if (isIlmu) {
      title = customTitle || 'Projek Karakter KBC: Festival Sains Kreatif & Literasi Menggembirakan';
      pancaCintaFocus = ['Cinta kepada Ilmu', 'Cinta kepada Tuhan', 'Cinta kepada Sesama'];
      objectives = 'Menumbuhkan kecintaan belajar sepanjang hayat, rasa ingin tahu ilmiah, dan budaya berbagi ilmu dengan teman sebaya.';
      activities = '1. Tahap Eksplorasi: Membaca buku sains inspiratif dan memilih eksperimen sederhana.\n2. Tahap Riset Kasih: Melakukan eksperimen kolaboratif kelompok.\n3. Tahap Gelar Sains: Pameran stan eksperimen interaktif untuk adik kelas.\n4. Tahap Refleksi: Menulis jurnal kebermanfaatan ilmu bagi masyarakat.';
    } else if (isBangsa) {
      title = customTitle || 'Projek Karakter KBC: Harmoni Kebinekaan & Merajut Kasih Nusantara';
      pancaCintaFocus = ['Cinta kepada Tanah Air & Bangsa', 'Cinta kepada Sesama', 'Cinta kepada Tuhan'];
      objectives = 'Menumbuhkan rasa bangga pada kebudayaan nusantara, toleransi antarkeragaman, dan moderasi beragama.';
      activities = '1. Tahap Identifikasi: Menelusuri kearifan lokal dan tradisi gotong royong daerah.\n2. Tahap Dialog Budaya: Diskusi keberagaman pakaian adat, makanan tradisional, dan bahasa daerah.\n3. Tahap Festival Budaya: Menampilkan kuliner dan kesenian nusantara di kelas.\n4. Tahap Refleksi: Penulisan esai "Indahnya Negeriku Penuh Cinta Kasih".';
    }

    const newProject: P5ProjectModule = {
      id: `p5-${Date.now()}`,
      title,
      theme,
      isKBCProject: true,
      pancaCintaFocus,
      dimensions: ['Beriman & Bertakwa kepada Tuhan YME', 'Gotong Royong', 'Bernalar Kritis', 'Berkebinekaan Global'],
      elements: 'Akhlak mulia, kolaborasi inklusif, empati sosial, dan kepedulian lingkungan.',
      objectives,
      schedule: 'Sistem Blok 3 Pekan Terpadu',
      activities,
      assessmentRubric: 'Rubrik Karakter Cinta KBC: Mulai Berkembang (MB), Sedang Berkembang (SB), Berkembang Sesuai Harapan (BSH), Sangat Berkembang (SAB).',
      documentationNotes: 'Laporan portofolio aksi nyata, foto dokumentasi festival kasih, dan piagam komitmen.',
    };

    const updated = [newProject, ...currentList];
    this.saveP5Modules(updated);
    return newProject;
  }

  static getATP(): ObjectiveFlowItem[] {
    return this.get(STORAGE_KEYS.ATP, defaultATP);
  }
  static saveATP(data: ObjectiveFlowItem[]): void {
    this.set(STORAGE_KEYS.ATP, data);
  }

  static getModulAjar(): TeachingModule[] {
    return this.get(STORAGE_KEYS.MODUL_AJAR, defaultModulAjar);
  }
  static saveModulAjar(data: TeachingModule[]): void {
    this.set(STORAGE_KEYS.MODUL_AJAR, data);
  }

  static getP5Modules(): P5ProjectModule[] {
    return this.get(STORAGE_KEYS.MODUL_P5, defaultP5Modules);
  }
  static saveP5Modules(data: P5ProjectModule[]): void {
    this.set(STORAGE_KEYS.MODUL_P5, data);
  }

  static getKKTP(): KKTPItem[] {
    return this.get(STORAGE_KEYS.KKTP, defaultKKTP);
  }
  static saveKKTP(data: KKTPItem[]): void {
    this.set(STORAGE_KEYS.KKTP, data);
  }

  // Buku 2: Kaldik, Jadwal, RPE, Prota, Promes, Pembiasaan, Absensi, Jurnal, Pegangan, Konsultasi
  static getKaldik(): AcademicCalendarEvent[] {
    return this.get(STORAGE_KEYS.KALDIK, defaultKaldik);
  }
  static saveKaldik(data: AcademicCalendarEvent[]): void {
    this.set(STORAGE_KEYS.KALDIK, data);
  }

  static getJadwal(): TeachingScheduleItem[] {
    return this.get(STORAGE_KEYS.JADWAL, defaultJadwal);
  }
  static saveJadwal(data: TeachingScheduleItem[]): void {
    this.set(STORAGE_KEYS.JADWAL, data);
  }

  static getRPE(): TimeAllocationRPE {
    return this.get(STORAGE_KEYS.RPE, defaultRPE);
  }
  static saveRPE(data: TimeAllocationRPE): void {
    this.set(STORAGE_KEYS.RPE, data);
  }

  static getProta(): AnnualProgramItem[] {
    return this.get(STORAGE_KEYS.PROTA, defaultProta);
  }
  static saveProta(data: AnnualProgramItem[]): void {
    this.set(STORAGE_KEYS.PROTA, data);
  }

  static getPromes(): SemesterProgramItem[] {
    return this.get(STORAGE_KEYS.PROMES, defaultPromes);
  }
  static savePromes(data: SemesterProgramItem[]): void {
    this.set(STORAGE_KEYS.PROMES, data);
  }

  static getPembiasaan(): TeacherHabituationItem[] {
    return this.get(STORAGE_KEYS.PEMBIASAAN, defaultPembiasaan);
  }
  static savePembiasaan(data: TeacherHabituationItem[]): void {
    this.set(STORAGE_KEYS.PEMBIASAAN, data);
  }

  static getAbsensi(): StudentAttendanceRecord[] {
    return this.get(STORAGE_KEYS.ABSENSI, defaultAbsensi);
  }
  static saveAbsensi(data: StudentAttendanceRecord[]): void {
    this.set(STORAGE_KEYS.ABSENSI, data);
  }

  static getJurnal(): TeachingJournalRecord[] {
    return this.get(STORAGE_KEYS.JURNAL, defaultJurnal);
  }
  static saveJurnal(data: TeachingJournalRecord[]): void {
    this.set(STORAGE_KEYS.JURNAL, data);
  }

  static getBukuPegangan(): ReferenceDocument[] {
    return this.get(STORAGE_KEYS.BUKU_PEGANGAN, defaultBukuPegangan);
  }
  static saveBukuPegangan(data: ReferenceDocument[]): void {
    this.set(STORAGE_KEYS.BUKU_PEGANGAN, data);
  }

  static getKonsultasi(): TeacherConsultationRecord[] {
    return this.get(STORAGE_KEYS.KONSULTASI, defaultKonsultasi);
  }
  static saveKonsultasi(data: TeacherConsultationRecord[]): void {
    this.set(STORAGE_KEYS.KONSULTASI, data);
  }

  // Buku 3: Nilai, Diagnostik, Instrumen, Analisis Soal, Kisi-Kisi, Remedial, Tugas
  static getNilai(): GradeRecord[] {
    return this.get(STORAGE_KEYS.NILAI, defaultNilai);
  }
  static saveNilai(data: GradeRecord[]): void {
    this.set(STORAGE_KEYS.NILAI, data);
  }

  static getDiagnostik(): DiagnosticAssessmentRecord[] {
    return this.get(STORAGE_KEYS.DIAGNOSTIK, defaultDiagnostik);
  }
  static saveDiagnostik(data: DiagnosticAssessmentRecord[]): void {
    this.set(STORAGE_KEYS.DIAGNOSTIK, data);
  }

  static getInstrumen(): AssessmentInstrument[] {
    return this.get(STORAGE_KEYS.INSTRUMEN, defaultInstrumen);
  }
  static saveInstrumen(data: AssessmentInstrument[]): void {
    this.set(STORAGE_KEYS.INSTRUMEN, data);
  }

  static getAnalisisSoal(): ItemAnalysisRecord[] {
    return this.get(STORAGE_KEYS.ANALISIS_SOAL, defaultAnalisisSoal);
  }
  static saveAnalisisSoal(data: ItemAnalysisRecord[]): void {
    this.set(STORAGE_KEYS.ANALISIS_SOAL, data);
  }

  static getKisiKisi(): BlueprintItem[] {
    return this.get(STORAGE_KEYS.KISI_KISI, defaultKisiKisi);
  }
  static saveKisiKisi(data: BlueprintItem[]): void {
    this.set(STORAGE_KEYS.KISI_KISI, data);
  }

  static getRemedial(): RemedialEnrichmentProgram[] {
    return this.get(STORAGE_KEYS.REMEDIAL, defaultRemedial);
  }
  static saveRemedial(data: RemedialEnrichmentProgram[]): void {
    this.set(STORAGE_KEYS.REMEDIAL, data);
  }

  // ============================================================
  // PIPELINE 3: NILAI ASESMEN -> REMEDIAL & PENGAYAAN OTOMATIS
  // ============================================================
  static autoGenerateRemedialAndEnrichment(kktpThreshold: number = 75): { remedialCount: number; enrichmentCount: number } {
    const nilaiList = this.getNilai();
    const students = this.getStudents();
    const profile = this.getProfile();

    const belowKKTP = nilaiList.filter(n => n.finalGrade < kktpThreshold);
    const aboveKKTP = nilaiList.filter(n => n.finalGrade >= kktpThreshold);

    const belowStudentNames = belowKKTP.map(n => {
      const s = students.find(std => std.id === n.studentId);
      return s ? `${s.name} (${n.finalGrade})` : `Siswa (${n.finalGrade})`;
    });

    const aboveStudentNames = aboveKKTP.map(n => {
      const s = students.find(std => std.id === n.studentId);
      return s ? `${s.name} (${n.finalGrade})` : `Siswa (${n.finalGrade})`;
    });

    const currentRemedialList = this.getRemedial();
    const today = new Date().toISOString().split('T')[0];

    const newPrograms: RemedialEnrichmentProgram[] = [];

    if (belowStudentNames.length > 0) {
      newPrograms.push({
        id: `rem-${Date.now()}`,
        programType: 'Remedial',
        className: 'VII-A',
        subject: profile.subject,
        tpCode: 'TP 7.x (Otomatis dari Nilai)',
        material: `Bimbingan Ulang Pembelajaran (Peserta Didik Nilai < ${kktpThreshold})`,
        kktpStandard: kktpThreshold,
        studentNames: belowStudentNames,
        activityPlan: `Pemberian penjelasan ulang materi esensial secara terpandu dan tes ulang setara untuk ${belowStudentNames.length} peserta didik.`,
        executionDate: today,
        evaluationResult: 'Dijadwalkan pelaksanaan tindak lanjut pekan ini.',
      });
    }

    if (aboveStudentNames.length > 0) {
      newPrograms.push({
        id: `eng-${Date.now()}`,
        programType: 'Pengayaan',
        className: 'VII-A',
        subject: profile.subject,
        tpCode: 'TP 7.x (Otomatis dari Nilai)',
        material: `Eksplorasi Proyek Literasi Mandiri (Peserta Didik Nilai >= ${kktpThreshold})`,
        kktpStandard: kktpThreshold,
        studentNames: aboveStudentNames,
        activityPlan: `Tugas proyek mandiri analisis artikel dan pembuatan produk kreatif untuk ${aboveStudentNames.length} peserta didik yang telah tuntas.`,
        executionDate: today,
        evaluationResult: 'Karya siswa siap didokumentasikan.',
      });
    }

    const updatedRemedial = [...newPrograms, ...currentRemedialList];
    this.saveRemedial(updatedRemedial);

    // Otomatis buatkan juga Program Tindak Lanjut di Buku 4!
    const currentTL = this.getTindakLanjut();
    const newTL: FollowUpProgramItem = {
      id: `tl-${Date.now()}`,
      sourceFinding: `Evaluasi Asesmen Nilai Rapor / Sumatif (${profile.subject})`,
      identifiedIssue: `${belowStudentNames.length} peserta didik memperoleh nilai di bawah KKTP (< ${kktpThreshold}), sedangkan ${aboveStudentNames.length} peserta didik telah tuntas.`,
      improvementPlan: `Pelaksanaan Program Remedial terstruktur untuk ${belowStudentNames.length} siswa dan Program Pengayaan bagi ${aboveStudentNames.length} siswa tuntas.`,
      strategy: 'Diferensiasi proses pembelajaran, bimbingan kelompok kecil dan modul latihan bertahap (scaffolding).',
      targetSuccess: '100% siswa mencapai batas ketuntasan minimal (KKTP 75) pada evaluasi remidi.',
      schedule: `Pekan Ke-3 ${profile.semester} T.P. ${profile.academicYear}`,
      result: `Tersusun otomatis: ${belowStudentNames.length} siswa program remedial, ${aboveStudentNames.length} siswa program pengayaan.`,
      successEvaluation: 'Tercapai Sangat Baik',
    };
    this.saveTindakLanjut([newTL, ...currentTL]);

    return {
      remedialCount: belowStudentNames.length,
      enrichmentCount: aboveStudentNames.length,
    };
  }

  static getTugas(): AssignmentItem[] {
    return this.get(STORAGE_KEYS.TUGAS, defaultTugas);
  }
  static saveTugas(data: AssignmentItem[]): void {
    this.set(STORAGE_KEYS.TUGAS, data);
  }

  // Buku 4: Refleksi, Tindak Lanjut
  static getRefleksi(): ReflectionJournal[] {
    return this.get(STORAGE_KEYS.REFLEKSI, defaultRefleksi);
  }
  static saveRefleksi(data: ReflectionJournal[]): void {
    this.set(STORAGE_KEYS.REFLEKSI, data);
  }

  // ============================================================
  // PIPELINE 4: JURNAL MENGAJAR -> JURNAL REFLEKSI OTOMATIS
  // ============================================================
  static createReflectionFromJournal(journal: TeachingJournalRecord): ReflectionJournal {
    const currentRefleksi = this.getRefleksi();
    const newRefleksi: ReflectionJournal = {
      id: `ref-${Date.now()}`,
      date: journal.date,
      className: journal.className,
      subject: journal.subject,
      topic: journal.topicMaterial,
      whatWentWell: journal.teachingNotes || 'Pembelajaran berlangsung interaktif dan seluruh kelompok berpartisipasi aktif.',
      challenges: journal.challenges || 'Manajemen waktu presentasi kelompok.',
      studentResponse: `${journal.presentCount} siswa hadir antusias, respon positif terhadap metode ${journal.methodUsed}.`,
      methodEvaluation: `Metode ${journal.methodUsed} efektif memfasilitasi pencapaian ${journal.learningObjective}.`,
      pointsToImprove: journal.challenges ? `Fokus perbaikan: ${journal.challenges}` : 'Optimalisasi scaffolding kelompok.',
      actionPlan: journal.followUp || 'Penguatan konsep kunci pada pertemuan berikutnya.',
      aiPedagogicalSummary: `Refleksi otomatis dari Jurnal KBM: Pembelajaran materi "${journal.topicMaterial}" berhasil dilaksanakan dengan metode ${journal.methodUsed}. Tindak lanjut difokuskan pada: ${journal.followUp}.`,
    };

    const updated = [newRefleksi, ...currentRefleksi];
    this.saveRefleksi(updated);
    return newRefleksi;
  }

  static getTindakLanjut(): FollowUpProgramItem[] {
    return this.get(STORAGE_KEYS.TINDAK_LANJUT, defaultTindakLanjut);
  }
  static saveTindakLanjut(data: FollowUpProgramItem[]): void {
    this.set(STORAGE_KEYS.TINDAK_LANJUT, data);
  }

  // Notifications
  static getNotifikasi(): AppNotification[] {
    return this.get(STORAGE_KEYS.NOTIFIKASI, defaultNotifikasi);
  }
  static saveNotifikasi(data: AppNotification[]): void {
    this.set(STORAGE_KEYS.NOTIFIKASI, data);
  }

  // Reset to Defaults
  static resetToDefault(): void {
    localStorage.clear();
    this.saveProfile(defaultTeacherProfile);
    this.saveStudents(defaultStudents);
    this.saveCP(defaultCP);
    this.saveTP(defaultTP);
    this.saveATP(defaultATP);
    this.saveModulAjar(defaultModulAjar);
    this.saveP5Modules(defaultP5Modules);
    this.saveKKTP(defaultKKTP);
    this.saveKaldik(defaultKaldik);
    this.saveJadwal(defaultJadwal);
    this.saveRPE(defaultRPE);
    this.saveProta(defaultProta);
    this.savePromes(defaultPromes);
    this.savePembiasaan(defaultPembiasaan);
    this.saveAbsensi(defaultAbsensi);
    this.saveJurnal(defaultJurnal);
    this.saveBukuPegangan(defaultBukuPegangan);
    this.saveKonsultasi(defaultKonsultasi);
    this.saveNilai(defaultNilai);
    this.saveDiagnostik(defaultDiagnostik);
    this.saveInstrumen(defaultInstrumen);
    this.saveAnalisisSoal(defaultAnalisisSoal);
    this.saveKisiKisi(defaultKisiKisi);
    this.saveRemedial(defaultRemedial);
    this.saveTugas(defaultTugas);
    this.saveRefleksi(defaultRefleksi);
    this.saveTindakLanjut(defaultTindakLanjut);
    this.saveNotifikasi(defaultNotifikasi);
    window.location.reload();
  }

  // Full Database Backup Export to JSON
  static exportAllToJson(): string {
    const backupObj = {
      version: '1.0.0',
      exportedAt: new Date().toISOString(),
      profile: this.getProfile(),
      students: this.getStudents(),
      cp: this.getCP(),
      tp: this.getTP(),
      atp: this.getATP(),
      modulAjar: this.getModulAjar(),
      p5: this.getP5Modules(),
      kktp: this.getKKTP(),
      kaldik: this.getKaldik(),
      jadwal: this.getJadwal(),
      rpe: this.getRPE(),
      prota: this.getProta(),
      promes: this.getPromes(),
      pembiasaan: this.getPembiasaan(),
      absensi: this.getAbsensi(),
      jurnal: this.getJurnal(),
      bukuPegangan: this.getBukuPegangan(),
      konsultasi: this.getKonsultasi(),
      nilai: this.getNilai(),
      diagnostik: this.getDiagnostik(),
      instrumen: this.getInstrumen(),
      analisisSoal: this.getAnalisisSoal(),
      kisiKisi: this.getKisiKisi(),
      remedial: this.getRemedial(),
      tugas: this.getTugas(),
      refleksi: this.getRefleksi(),
      tindakLanjut: this.getTindakLanjut(),
    };
    return JSON.stringify(backupObj, null, 2);
  }

  // Restore Database from JSON
  static importFromJson(jsonStr: string): boolean {
    try {
      const data = JSON.parse(jsonStr);
      if (data.profile) this.saveProfile(data.profile);
      if (data.students) this.saveStudents(data.students);
      if (data.cp) this.saveCP(data.cp);
      if (data.tp) this.saveTP(data.tp);
      if (data.atp) this.saveATP(data.atp);
      if (data.modulAjar) this.saveModulAjar(data.modulAjar);
      if (data.p5) this.saveP5Modules(data.p5);
      if (data.kktp) this.saveKKTP(data.kktp);
      if (data.kaldik) this.saveKaldik(data.kaldik);
      if (data.jadwal) this.saveJadwal(data.jadwal);
      if (data.rpe) this.saveRPE(data.rpe);
      if (data.prota) this.saveProta(data.prota);
      if (data.promes) this.savePromes(data.promes);
      if (data.pembiasaan) this.savePembiasaan(data.pembiasaan);
      if (data.absensi) this.saveAbsensi(data.absensi);
      if (data.jurnal) this.saveJurnal(data.jurnal);
      if (data.bukuPegangan) this.saveBukuPegangan(data.bukuPegangan);
      if (data.konsultasi) this.saveKonsultasi(data.konsultasi);
      if (data.nilai) this.saveNilai(data.nilai);
      if (data.diagnostik) this.saveDiagnostik(data.diagnostik);
      if (data.instrumen) this.saveInstrumen(data.instrumen);
      if (data.analisisSoal) this.saveAnalisisSoal(data.analisisSoal);
      if (data.kisiKisi) this.saveKisiKisi(data.kisiKisi);
      if (data.remedial) this.saveRemedial(data.remedial);
      if (data.tugas) this.saveTugas(data.tugas);
      if (data.refleksi) this.saveRefleksi(data.refleksi);
      if (data.tindakLanjut) this.saveTindakLanjut(data.tindakLanjut);
      window.location.reload();
      return true;
    } catch (err) {
      console.error('Import error:', err);
      return false;
    }
  }

  // Export to Excel Helper
  static exportToExcel(data: Record<string, any>[], sheetName: string, fileName: string): void {
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, sheetName);
    XLSX.writeFile(wb, `${fileName}.xlsx`);
  }

  // PDF Export Helper with Formal Indonesian School Header
  static generateFormalPdf(options: {
    title: string;
    subTitle?: string;
    columns: string[];
    rows: (string | number)[][];
    orientation?: 'p' | 'l';
  }): void {
    const profile = this.getProfile();
    const doc = new jsPDF({
      orientation: options.orientation || 'p',
      unit: 'mm',
      format: 'a4',
    });

    // Formal Header
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.text(profile.schoolName.toUpperCase(), doc.internal.pageSize.getWidth() / 2, 16, { align: 'center' });

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.text(`NPSN/NSM: ${profile.npsnNsm} | Alamat: ${profile.schoolAddress}`, doc.internal.pageSize.getWidth() / 2, 22, { align: 'center' });

    // Header divider line
    const pageWidth = doc.internal.pageSize.getWidth();
    doc.setLineWidth(0.8);
    doc.line(14, 25, pageWidth - 14, 25);
    doc.setLineWidth(0.2);
    doc.line(14, 26, pageWidth - 14, 26);

    // Document Title
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text(options.title.toUpperCase(), pageWidth / 2, 34, { align: 'center' });

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    const sub = options.subTitle || `Tahun Pelajaran ${profile.academicYear} - Semester ${profile.semester}`;
    doc.text(sub, pageWidth / 2, 40, { align: 'center' });

    // Identity Meta Info
    doc.setFontSize(9);
    doc.text(`Mata Pelajaran : ${profile.subject}`, 14, 47);
    doc.text(`Guru Pengampu  : ${profile.name}`, 14, 52);
    doc.text(`NIP            : ${profile.nip}`, 14, 57);

    // Auto Table
    autoTable(doc, {
      startY: 62,
      head: [options.columns],
      body: options.rows,
      theme: 'grid',
      styles: {
        fontSize: 8.5,
        cellPadding: 2.5,
        textColor: [30, 41, 59],
      },
      headStyles: {
        fillColor: [30, 58, 138], // Navy blue
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        halign: 'center',
      },
      alternateRowStyles: {
        fillColor: [248, 250, 252],
      },
    });

    // Formal Signatures Footer
    const finalY = (doc as any).lastAutoTable ? (doc as any).lastAutoTable.finalY + 14 : 120;
    const pageHeight = doc.internal.pageSize.getHeight();
    const signY = finalY > pageHeight - 45 ? 40 : finalY;
    if (finalY > pageHeight - 45) {
      doc.addPage();
    }

    doc.setFontSize(9);
    doc.text('Mengetahui,', 25, signY);
    doc.text('Kepala Sekolah', 25, signY + 5);
    doc.text(profile.signaturePlace, pageWidth - 75, signY);
    doc.text('Guru Mata Pelajaran,', pageWidth - 75, signY + 5);

    doc.setFont('helvetica', 'bold');
    doc.text(profile.headmasterName, 25, signY + 28);
    doc.setFont('helvetica', 'normal');
    doc.text(`NIP. ${profile.headmasterNip}`, 25, signY + 33);

    doc.setFont('helvetica', 'bold');
    doc.text(profile.name, pageWidth - 75, signY + 28);
    doc.setFont('helvetica', 'normal');
    doc.text(`NIP. ${profile.nip}`, pageWidth - 75, signY + 33);

    doc.save(`${options.title.toLowerCase().replace(/\s+/g, '_')}_${Date.now()}.pdf`);
  }
}
