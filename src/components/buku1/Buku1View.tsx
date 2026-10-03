import React, { useState, useEffect } from 'react';
import {
  Target,
  CheckCircle,
  GitBranch,
  BookOpen,
  Sparkles,
  BarChart3,
  Plus,
  Trash2,
  Edit3,
  Printer,
  FileSpreadsheet,
  Search,
  Filter,
  Eye,
  Save,
  Download,
  Check,
  RefreshCw,
  HelpCircle,
  FileText
} from 'lucide-react';
import { DataStore } from '../../services/storage';
import {
  LearningOutcome,
  LearningObjective,
  ObjectiveFlowItem,
  TeachingModule,
  P5ProjectModule,
  KKTPItem,
  PhaseType,
  SemesterType
} from '../../types';
import { PrintModal } from '../common/PrintModal';
import { generateEducationalContent } from '../../services/ai';

interface Buku1ViewProps {
  initialSubTab?: string;
  onOpenAIWithPrompt?: (prompt: string, type: any) => void;
}

export const Buku1View: React.FC<Buku1ViewProps> = ({ initialSubTab = 'cp', onOpenAIWithPrompt }) => {
  const [activeSubTab, setActiveSubTab] = useState(initialSubTab);
  const [searchQuery, setSearchQuery] = useState('');

  // Data states
  const [cpList, setCpList] = useState<LearningOutcome[]>(DataStore.getCP());
  const [tpList, setTpList] = useState<LearningObjective[]>(DataStore.getTP());
  const [atpList, setAtpList] = useState<ObjectiveFlowItem[]>(DataStore.getATP());
  const [modulList, setModulList] = useState<TeachingModule[]>(DataStore.getModulAjar());
  const [p5List, setP5List] = useState<P5ProjectModule[]>(DataStore.getP5Modules());
  const [kktpList, setKktpList] = useState<KKTPItem[]>(DataStore.getKKTP());

  // Modals & Form states
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<string>('');
  const [editingItem, setEditingItem] = useState<any>(null);

  // Print Preview state
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [printDoc, setPrintDoc] = useState<{ title: string; subTitle?: string; content: React.ReactNode }>({
    title: '',
    content: null,
  });

  // AI Loading state
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);

  useEffect(() => {
    setActiveSubTab(initialSubTab);
  }, [initialSubTab]);

  useEffect(() => {
    const handleUpdate = () => {
      setCpList(DataStore.getCP());
      setTpList(DataStore.getTP());
      setAtpList(DataStore.getATP());
      setModulList(DataStore.getModulAjar());
      setP5List(DataStore.getP5Modules());
      setKktpList(DataStore.getKKTP());
    };
    window.addEventListener('bkgd-store-update', handleUpdate);
    return () => window.removeEventListener('bkgd-store-update', handleUpdate);
  }, []);

  // SUBMENU TABS
  // SUBMENU TABS
  const subTabs = [
    { id: 'cp', label: '1. Capaian Pembelajaran (CP)', icon: Target },
    { id: 'tp', label: '2. Tujuan Pembelajaran (TP)', icon: CheckCircle },
    { id: 'atp', label: '3. Alur Tujuan Pembelajaran (ATP)', icon: GitBranch },
    { id: 'modul', label: '4. Modul Ajar Berbasis KBC', icon: BookOpen },
    { id: 'p5', label: '5. Modul Projek Penguatan KBC', icon: Sparkles },
    { id: 'kktp', label: '6. Kriteria KKTP', icon: BarChart3 },
  ];

  // ===========================
  // AI Assist Handlers
  // ===========================
  const handleAIGenerateTP = async () => {
    setIsGeneratingAI(true);
    const res = await generateEducationalContent({
      type: 'tp',
      prompt: `Rumuskan 3 Tujuan Pembelajaran (TP) terukur untuk mata pelajaran ${DataStore.getProfile().subject} sesuai Capaian Pembelajaran Kurikulum Berbasis Cinta (KBC) Fase D lengkap dengan target internalisasi pilar Panca Cinta, indikator ketercapaian, dan KKO Taksonomi Bloom.`,
    });
    setIsGeneratingAI(false);
    if (res.success) {
      alert(`Hasil Perumusan AI:\n\n${res.content.slice(0, 400)}...\n\n(Anda dapat menyalin hasil lengkap pada menu AI Asisten Guru)`);
    } else {
      alert(res.error || 'Gagal generate AI');
    }
  };

  const handleAIGenerateModul = async () => {
    setIsGeneratingAI(true);
    const profile = DataStore.getProfile();
    const res = await generateEducationalContent({
      type: 'modul',
      prompt: `Buat modul ajar lengkap 2 JP model Problem Based Learning berbasis Kurikulum Berbasis Cinta (KBC) untuk materi ${profile.subject} kelas VII dengan mengintegrasikan pilar Panca Cinta dan pembiasaan cinta di kelas ramah anak.`,
    });
    setIsGeneratingAI(false);
    if (res.success) {
      const newMod: TeachingModule = {
        id: `modul-${Date.now()}`,
        title: `Modul Ajar KBC (AI): Pembelajaran Penuh Kasih ${new Date().toLocaleDateString('id-ID')}`,
        subject: profile.subject,
        phase: 'Fase D (Kelas 7-9)',
        grade: 'Kelas VII',
        allocatedHours: '2 x 40 Menit',
        targetStudents: 'Reguler (32 Siswa) dengan lingkungan ramah anak',
        learningModel: 'Problem-Based Learning (PBL) Berbasis Cinta (KBC)',
        priorCompetencies: 'Memahami dasar materi dan siap berkolaborasi secara empati',
        pancasilaProfile: ['Beriman & Bertakwa kepada Tuhan YME', 'Bernalar Kritis', 'Gotong Royong'],
        pancaCintaDimensions: ['Cinta kepada Tuhan', 'Cinta kepada Ilmu', 'Cinta kepada Diri Sendiri & Sesama'],
        isKBC: true,
        kbcLoveHabituation: 'Morning Check-In Empati: Sapaan hangat dan senyum guru, doa bersama khusyuk, menanyakan kondisi emosional murid, dan peneguhan budaya kelas ramah anak bebas perundungan.',
        facilities: 'LCD Proyektor, LKPD Ramah Anak, Bahan Ajar Kontekstual',
        meaningfulUnderstanding: 'Peserta didik memahami penerapan ilmu dengan nalar kritis dan rasa syukur mendalam kepada Tuhan serta cinta sesama.',
        triggerQuestions: 'Bagaimana ilmu ini dapat membantu kita bersikap lebih peduli dan saling menolong sesama teman?',
        learningObjectives: 'Peserta didik mampu menganalisis konsep inti dan menyajikan laporan dengan runut dalam suasana saling mengapresiasi.',
        introductoryActivities: '1. Sapaan kasih, doa bersama, dan cek kondisi emosional siswa (10 Menit).\n2. Ice breaking riang gembira dan peneguhan kelas ramah anak.\n3. Apersepsi kontekstual dan penyampaian tujuan KBC.',
        coreActivities: 'Fase 1-5 PBL Berbasis Cinta: Orientasi masalah kontekstual, diskusi kelompok inklusif tanpa celaan, pendampingan empati sabar (scaffolding bagi yang butuh bantuan), dan presentasi saling mengapresiasi (60 Menit).',
        closingActivities: 'Refleksi batin kasih, ungkapan terima kasih antarteman sekelompok, apresiasi guru, dan doa syukur penutup (10 Menit).',
        assessmentPlan: 'Asesmen Sikap Panca Cinta (Observasi gotong royong & empati), Asesmen Formatif LKPD ramah anak, dan Asesmen Sumatif autentik tanpa stigma.',
        remedialPlan: 'Bimbingan personal berakar kasih dan tutor sebaya suportif bagi siswa belum tuntas.',
        enrichmentPlan: 'Proyek literasi eksplorasi mandiri bagi siswa tuntas.',
        teacherReflection: 'Keterlibatan aktif siswa meningkat pesat berkat suasana kelas yang aman dan hangat.',
        studentReflection: 'Siswa antusias belajar secara kolaboratif tanpa rasa takut disalahkan.',
        readingMaterials: 'Buku Siswa & Guru Kemendikbudristek dan Panduan Kurikulum Berbasis Cinta (KBC).',
        glossary: 'Kurikulum Berbasis Cinta (KBC), Panca Cinta, Empati, Kolaboratif, Refleksi.',
        createdAt: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0],
      };
      const updated = [newMod, ...modulList];
      DataStore.saveModulAjar(updated);
      setModulList(updated);
      alert('Modul Ajar Berbasis Kurikulum Cinta (KBC) berhasil dibuat dengan AI dan ditambahkan ke daftar!');
    }
  };

  const handleAIGenerateProjekKBC = async () => {
    setIsGeneratingAI(true);
    const res = await generateEducationalContent({
      type: 'projek_kbc',
      prompt: `Rancang Modul Projek Penguatan Karakter Kurikulum Berbasis Cinta (KBC) bertema Cinta Sesama dan Sekolah Ramah Anak (Pencegahan Bullying) untuk Fase D dengan alur aksi kasih 4 tahap.`,
    });
    setIsGeneratingAI(false);
    if (res.success) {
      const generatedProj = DataStore.autoGenerateProjekKBC('Cinta Sesama, Kebinekaan & Anti-Bullying', 'Projek Karakter KBC (AI): Gerakan Madrasah Ramah Anak & Tebar Senyum');
      setP5List(DataStore.getP5Modules());
      alert('Modul Projek Penguatan Karakter KBC berhasil dibuat oleh AI dan ditambahkan ke daftar!');
    } else {
      alert(res.error || 'Gagal generate AI projek KBC');
    }
  };

  // ===========================
  // CP (Capaian Pembelajaran)
  // ===========================
  const handleSaveCP = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    const newCP: LearningOutcome = {
      id: editingItem ? editingItem.id : `cp-${Date.now()}`,
      subject: formData.get('subject') as string,
      phase: formData.get('phase') as PhaseType,
      grade: formData.get('grade') as string,
      element: formData.get('element') as string,
      description: formData.get('description') as string,
      kbcPillar: formData.get('kbcPillar') as string || 'Cinta kepada Ilmu & Cinta Sesama',
      createdAt: editingItem?.createdAt || new Date().toISOString().split('T')[0],
    };

    let updated: LearningOutcome[];
    if (editingItem) {
      updated = cpList.map(item => item.id === editingItem.id ? newCP : item);
    } else {
      updated = [...cpList, newCP];
    }

    DataStore.saveCP(updated);
    setCpList(updated);

    if (!editingItem && formData.get('autoCascade') === 'on') {
      const newTP = DataStore.autoGenerateTPFromCP(newCP);
      setTpList(DataStore.getTP());
      setAtpList(DataStore.getATP());
      alert(`Sistem Satu Kali Input: Capaian Pembelajaran berhasil disimpan, serta otomatis diturunkan menjadi Tujuan Pembelajaran (${newTP.code}) dan Alur Tujuan Pembelajaran (ATP) Berbasis KBC!`);
    }

    setShowModal(false);
    setEditingItem(null);
  };

  const handleDeleteCP = (id: string) => {
    if (confirm('Hapus Capaian Pembelajaran ini?')) {
      const updated = cpList.filter(item => item.id !== id);
      DataStore.saveCP(updated);
      setCpList(updated);
    }
  };

  // ===========================
  // TP (Tujuan Pembelajaran)
  // ===========================
  const handleSaveTP = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    const newTP: LearningObjective = {
      id: editingItem ? editingItem.id : `tp-${Date.now()}`,
      code: formData.get('code') as string,
      competency: formData.get('competency') as string,
      scopeOfMaterial: formData.get('scopeOfMaterial') as string,
      statement: formData.get('statement') as string,
      indicator: formData.get('indicator') as string,
      kbcCharacterGoal: formData.get('kbcCharacterGoal') as string || 'Cinta kepada Ilmu & Cinta Sesama',
      semester: formData.get('semester') as SemesterType,
      allocatedHours: Number(formData.get('allocatedHours')) || 6,
    };

    let updated: LearningObjective[];
    if (editingItem) {
      updated = tpList.map(item => item.id === editingItem.id ? newTP : item);
    } else {
      updated = [...tpList, newTP];
    }

    DataStore.saveTP(updated);
    setTpList(updated);
    setShowModal(false);
    setEditingItem(null);
  };

  const handleDeleteTP = (id: string) => {
    if (confirm('Hapus Tujuan Pembelajaran ini?')) {
      const updated = tpList.filter(item => item.id !== id);
      DataStore.saveTP(updated);
      setTpList(updated);
    }
  };

  // ===========================
  // MODUL AJAR ACTIONS
  // ===========================
  const handleSaveModul = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    const pancaCinta: string[] = [];
    ['Tuhan', 'Ilmu', 'Sesama', 'Alam', 'TanahAir'].forEach(key => {
      const val = formData.get(`panca_${key}`);
      if (val) pancaCinta.push(val.toString());
    });

    const newModul: TeachingModule = {
      id: editingItem ? editingItem.id : `modul-${Date.now()}`,
      title: formData.get('title') as string,
      subject: DataStore.getProfile().subject,
      phase: formData.get('phase') as PhaseType || 'Fase D (Kelas 7-9)',
      grade: formData.get('grade') as string || 'Kelas VII',
      allocatedHours: formData.get('allocatedHours') as string || '2 x 40 Menit',
      targetStudents: formData.get('targetStudents') as string || 'Reguler (32 Siswa)',
      learningModel: formData.get('learningModel') as string || 'Problem-Based Learning (PBL) Berbasis Cinta (KBC)',
      priorCompetencies: formData.get('priorCompetencies') as string || 'Memahami materi pengantar dasar',
      pancasilaProfile: ['Beriman & Bertakwa kepada Tuhan YME', 'Bernalar Kritis', 'Gotong Royong'],
      pancaCintaDimensions: pancaCinta.length > 0 ? pancaCinta : ['Cinta kepada Tuhan', 'Cinta kepada Ilmu', 'Cinta kepada Sesama'],
      isKBC: true,
      kbcLoveHabituation: formData.get('kbcLoveHabituation') as string || 'Morning Check-In Empati: Sapaan hangat dan doa khusyuk bersama serta peneguhan kelas ramah anak.',
      facilities: formData.get('facilities') as string || 'LCD Proyektor, LKPD Ramah Anak, Bahan Ajar',
      meaningfulUnderstanding: formData.get('meaningfulUnderstanding') as string || 'Mempelajari ilmu dengan rasa syukur dan kasih sayang menjadikan hidup berkah.',
      triggerQuestions: formData.get('triggerQuestions') as string || 'Bagaimana ilmu ini dapat kita terapkan untuk saling menolong?',
      learningObjectives: formData.get('learningObjectives') as string,
      introductoryActivities: formData.get('introductoryActivities') as string || 'Sapaan hangat, doa bersama, dan cek kondisi emosional murid (10 Menit).',
      coreActivities: formData.get('coreActivities') as string || 'Diskusi kelompok inklusif, bimbingan empati sabar dari guru, dan presentasi saling mengapresiasi (60 Menit).',
      closingActivities: formData.get('closingActivities') as string || 'Refleksi batin kasih, apresiasi antarteman, doa syukur penutup (10 Menit).',
      assessmentPlan: formData.get('assessmentPlan') as string || 'Asesmen Sikap Panca Cinta, Asesmen Formatif LKPD, dan Asesmen Sumatif tanpa labeling.',
      remedialPlan: formData.get('remedialPlan') as string || 'Bimbingan personal berakar kasih dan tutor sebaya.',
      enrichmentPlan: formData.get('enrichmentPlan') as string || 'Proyek literasi mandiri.',
      teacherReflection: formData.get('teacherReflection') as string || 'Suasana belajar ramah anak berlangsung kondusif.',
      studentReflection: formData.get('studentReflection') as string || 'Siswa senang dan saling menghargai.',
      readingMaterials: 'Buku Siswa & Guru Kemendikbudristek dan Panduan Kurikulum Berbasis Cinta (KBC)',
      glossary: 'Kurikulum Berbasis Cinta, Panca Cinta, Empati, Kasih Sayang',
      createdAt: editingItem?.createdAt || new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
    };

    let updated: TeachingModule[];
    if (editingItem) {
      updated = modulList.map(item => item.id === editingItem.id ? newModul : item);
    } else {
      updated = [newModul, ...modulList];
    }
    DataStore.saveModulAjar(updated);
    setModulList(updated);
    setShowModal(false);
    setEditingItem(null);
    alert('Modul Ajar Berbasis Kurikulum Cinta (KBC) berhasil disimpan!');
  };

  const handleDeleteModul = (id: string) => {
    if (confirm('Hapus Modul Ajar ini?')) {
      const updated = modulList.filter(m => m.id !== id);
      DataStore.saveModulAjar(updated);
      setModulList(updated);
    }
  };

  // ===========================
  // PROJEK KBC ACTIONS
  // ===========================
  const handleSaveP5 = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    const pancaCinta: string[] = [];
    ['Tuhan', 'Ilmu', 'Sesama', 'Alam', 'TanahAir'].forEach(key => {
      const val = formData.get(`panca_proj_${key}`);
      if (val) pancaCinta.push(val.toString());
    });

    const newP5: P5ProjectModule = {
      id: editingItem ? editingItem.id : `p5-${Date.now()}`,
      title: formData.get('title') as string,
      theme: formData.get('theme') as string,
      isKBCProject: true,
      pancaCintaFocus: pancaCinta.length > 0 ? pancaCinta : ['Cinta kepada Diri Sendiri & Sesama Manusia', 'Cinta kepada Tuhan'],
      dimensions: ['Beriman & Bertakwa kepada Tuhan YME', 'Gotong Royong', 'Bernalar Kritis', 'Berkebinekaan Global'],
      elements: formData.get('elements') as string || 'Akhlak mulia kepada sesama dan alam semesta, empati sosial, gotong royong.',
      objectives: formData.get('objectives') as string,
      schedule: formData.get('schedule') as string || 'Sistem Blok 3 Pekan',
      activities: formData.get('activities') as string,
      assessmentRubric: formData.get('assessmentRubric') as string || 'Rubrik Karakter Cinta KBC: Mulai Berkembang (MB), Sedang Berkembang (SB), Berkembang Sesuai Harapan (BSH), Sangat Berkembang (SAB).',
      documentationNotes: formData.get('documentationNotes') as string || 'Laporan portofolio aksi nyata dan display festival kasih.',
    };

    let updated: P5ProjectModule[];
    if (editingItem) {
      updated = p5List.map(item => item.id === editingItem.id ? newP5 : item);
    } else {
      updated = [newP5, ...p5List];
    }
    DataStore.saveP5Modules(updated);
    setP5List(updated);
    setShowModal(false);
    setEditingItem(null);
    alert('Modul Projek Penguatan Karakter KBC berhasil disimpan!');
  };

  const handleDeleteP5 = (id: string) => {
    if (confirm('Hapus Modul Projek KBC ini?')) {
      const updated = p5List.filter(p => p.id !== id);
      DataStore.saveP5Modules(updated);
      setP5List(updated);
    }
  };

  const handlePrintModul = (modul: TeachingModule) => {
    setPrintDoc({
      title: 'MODUL AJAR BERBASIS KURIKULUM CINTA (KBC)',
      subTitle: `${modul.title.toUpperCase()} — ${modul.grade}`,
      content: (
        <div className="space-y-6 text-xs text-slate-800 leading-relaxed">
          {/* BANNER KBC */}
          <div className="border border-rose-300 rounded-lg p-3 bg-rose-50 flex items-center justify-between">
            <div>
              <span className="font-bold text-rose-900 text-xs">KERANGKA KURIKULUM: KURIKULUM BERBASIS CINTA (KBC)</span>
              <p className="text-[11px] text-rose-700 mt-0.5">Pendidikan Memanusiakan Manusia Berlandaskan Rahmatan Lil Alamin</p>
            </div>
            <div className="text-right text-[11px] font-bold text-rose-800">
              Pilar Terintegrasi: {modul.pancaCintaDimensions?.join(', ') || 'Panca Cinta'}
            </div>
          </div>

          {/* PEMBIASAAN CINTA */}
          {modul.kbcLoveHabituation && (
            <div className="border border-amber-300 rounded-lg p-3 bg-amber-50">
              <strong className="text-amber-900 font-bold block mb-1">PEMBIASAAN CINTA (LOVE HABITUATION):</strong>
              <p className="text-amber-800 leading-relaxed">{modul.kbcLoveHabituation}</p>
            </div>
          )}
          {/* I. INFORMASI UMUM */}
          <div className="border border-slate-300 rounded-lg p-4 bg-slate-50">
            <h3 className="font-bold text-sm text-blue-950 uppercase border-b border-slate-300 pb-1 mb-2">
              I. INFORMASI UMUM
            </h3>
            <div className="grid grid-cols-2 gap-2">
              <div><strong>Alokasi Waktu:</strong> {modul.allocatedHours}</div>
              <div><strong>Fase / Kelas:</strong> {modul.phase} / {modul.grade}</div>
              <div><strong>Target Siswa:</strong> {modul.targetStudents}</div>
              <div><strong>Model Belajar:</strong> {modul.learningModel}</div>
            </div>
            <div className="mt-2">
              <strong>Kompetensi Awal:</strong> {modul.priorCompetencies}
            </div>
            <div className="mt-2">
              <strong>Profil Pelajar Pancasila:</strong> {modul.pancasilaProfile.join(', ')}
            </div>
            <div className="mt-2">
              <strong>Sarana & Prasarana:</strong> {modul.facilities}
            </div>
          </div>

          {/* II. KOMPONEN INTI */}
          <div className="border border-slate-300 rounded-lg p-4">
            <h3 className="font-bold text-sm text-blue-950 uppercase border-b border-slate-300 pb-1 mb-2">
              II. KOMPONEN INTI
            </h3>
            <div className="space-y-3">
              <div>
                <strong className="text-slate-900">A. Tujuan Pembelajaran:</strong>
                <p className="mt-0.5">{modul.learningObjectives}</p>
              </div>
              <div>
                <strong className="text-slate-900">B. Pemahaman Bermakna:</strong>
                <p className="mt-0.5">{modul.meaningfulUnderstanding}</p>
              </div>
              <div>
                <strong className="text-slate-900">C. Pertanyaan Pemantik:</strong>
                <p className="mt-0.5 whitespace-pre-line">{modul.triggerQuestions}</p>
              </div>
            </div>
          </div>

          {/* III. KEGIATAN PEMBELAJARAN */}
          <div className="border border-slate-300 rounded-lg p-4">
            <h3 className="font-bold text-sm text-blue-950 uppercase border-b border-slate-300 pb-1 mb-2">
              III. LANGKAH-LANGKAH PEMBELAJARAN
            </h3>
            <div className="space-y-3">
              <div>
                <strong className="text-blue-900">1. Pendahuluan:</strong>
                <p className="mt-0.5 whitespace-pre-line">{modul.introductoryActivities}</p>
              </div>
              <div>
                <strong className="text-blue-900">2. Kegiatan Inti (Berdiferensiasi):</strong>
                <p className="mt-0.5 whitespace-pre-line">{modul.coreActivities}</p>
              </div>
              <div>
                <strong className="text-blue-900">3. Penutup:</strong>
                <p className="mt-0.5 whitespace-pre-line">{modul.closingActivities}</p>
              </div>
            </div>
          </div>

          {/* IV. ASESMEN & REFLEKSI */}
          <div className="border border-slate-300 rounded-lg p-4 bg-slate-50">
            <h3 className="font-bold text-sm text-blue-950 uppercase border-b border-slate-300 pb-1 mb-2">
              IV. ASESMEN, REMEDIAL & REFLEKSI
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <strong>Rencana Asesmen:</strong>
                <p className="mt-0.5 whitespace-pre-line">{modul.assessmentPlan}</p>
              </div>
              <div>
                <strong>Remedial & Pengayaan:</strong>
                <p className="mt-0.5">{modul.remedialPlan}</p>
                <p className="mt-1">{modul.enrichmentPlan}</p>
              </div>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-200">
              <strong>Refleksi Guru:</strong>
              <p className="mt-0.5">{modul.teacherReflection}</p>
            </div>
          </div>
        </div>
      ),
    });
    setShowPrintModal(true);
  };

  // EXPORT EXCEL HELPERS
  const exportCPExcel = () => {
    const data = cpList.map((cp, idx) => ({
      No: idx + 1,
      Mata_Pelajaran: cp.subject,
      Fase: cp.phase,
      Kelas: cp.grade,
      Elemen: cp.element,
      Deskripsi_Capaian_Pembelajaran: cp.description,
    }));
    DataStore.exportToExcel(data, 'Capaian_Pembelajaran', 'Capaian_Pembelajaran_Fase_D');
  };

  const exportTPExcel = () => {
    const data = tpList.map((tp, idx) => ({
      No: idx + 1,
      Kode_TP: tp.code,
      Kompetensi: tp.competency,
      Lingkup_Materi: tp.scopeOfMaterial,
      Rumusan_Tujuan_Pembelajaran: tp.statement,
      Indikator_Ketercapaian: tp.indicator,
      Semester: tp.semester,
      Alokasi_JP: tp.allocatedHours,
    }));
    DataStore.exportToExcel(data, 'Tujuan_Pembelajaran', 'Tujuan_Pembelajaran_Kurikulum_Merdeka');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* HEADER SECTION */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black text-lg shadow-md shadow-blue-500/20">
              B1
            </div>
            <div>
              <span className="text-[11px] font-extrabold text-blue-600 uppercase tracking-wider bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                BUKU KERJA 1
              </span>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-0.5">
                Perencanaan Pembelajaran
              </h1>
              <p className="text-xs text-slate-500">
                Penyusunan Capaian Pembelajaran, TP, ATP, Modul Ajar, P5, dan KKTP Kurikulum Merdeka
              </p>
            </div>
          </div>

          {/* Global Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleAIGenerateTP}
              disabled={isGeneratingAI}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-bold shadow hover:from-blue-500 hover:to-indigo-500 transition disabled:opacity-50"
            >
              <Sparkles className="w-3.5 h-3.5 text-sky-200" />
              <span>{isGeneratingAI ? 'AI Sedang Merumuskan...' : 'AI Rumuskan TP'}</span>
            </button>

            <button
              onClick={handleAIGenerateModul}
              disabled={isGeneratingAI}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-purple-600 text-white text-xs font-bold shadow hover:bg-purple-500 transition disabled:opacity-50"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Buat Modul dengan AI</span>
            </button>
          </div>
        </div>

        {/* SUBTABS HORIZONTAL NAVIGATION */}
        <div className="flex items-center gap-2 mt-6 overflow-x-auto pb-1 border-b border-slate-100">
          {subTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeSubTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSubTab(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ========================================================= */}
      {/* SUBTAB 1: CAPAIAN PEMBELAJARAN (CP) */}
      {/* ========================================================= */}
      {activeSubTab === 'cp' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200">
            <div className="flex items-center gap-2 flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Cari elemen atau deskripsi CP..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={exportCPExcel}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-emerald-500/30 bg-emerald-50 text-emerald-700 text-xs font-semibold hover:bg-emerald-100 transition"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
                <span>Ekspor Excel</span>
              </button>
              <button
                onClick={() => {
                  setEditingItem(null);
                  setModalType('cp');
                  setShowModal(true);
                }}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-bold hover:bg-blue-500 transition shadow"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Tambah CP</span>
              </button>
            </div>
          </div>

          {/* CP Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {cpList
              .filter(cp =>
                cp.element.toLowerCase().includes(searchQuery.toLowerCase()) ||
                cp.description.toLowerCase().includes(searchQuery.toLowerCase())
              )
              .map((cp) => (
                <div key={cp.id} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow transition flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-[10px] font-bold uppercase bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded">
                          {cp.phase}
                        </span>
                        <h3 className="text-sm font-bold text-slate-900 mt-1.5">
                          Elemen: {cp.element}
                        </h3>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => {
                            setEditingItem(cp);
                            setModalType('cp');
                            setShowModal(true);
                          }}
                          className="p-1.5 text-slate-400 hover:text-blue-600 rounded-lg hover:bg-slate-100"
                          title="Edit CP"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteCP(cp.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-slate-100"
                          title="Hapus CP"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <p className="mt-3 text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100">
                      {cp.description}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                    <span className="text-[11px] text-slate-500 font-medium">Mapel: <strong>{cp.subject}</strong></span>
                    <button
                      onClick={() => {
                        const newTP = DataStore.autoGenerateTPFromCP(cp);
                        alert(`Sistem Otomatis: Tujuan Pembelajaran (${newTP.code}) dan alur ATP berhasil dibuat dari CP Elemen "${cp.element}"!`);
                        setActiveSubTab('tp');
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-700 text-xs font-bold transition shadow-sm"
                      title="Otomatis susun TP dan ATP dari Capaian Pembelajaran ini"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                      <span>Otomatis Susun TP & ATP &rarr;</span>
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* SUBTAB 2: TUJUAN PEMBELAJARAN (TP) */}
      {/* ========================================================= */}
      {activeSubTab === 'tp' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200">
            <div className="flex items-center gap-2 flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Cari kode TP, materi, atau kompetensi..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={exportTPExcel}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-emerald-500/30 bg-emerald-50 text-emerald-700 text-xs font-semibold hover:bg-emerald-100 transition"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
                <span>Ekspor Excel</span>
              </button>
              <button
                onClick={() => {
                  setEditingItem(null);
                  setModalType('tp');
                  setShowModal(true);
                }}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-bold hover:bg-blue-500 transition shadow"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Tambah TP</span>
              </button>
            </div>
          </div>

          {/* TP Table */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-800 font-bold uppercase text-[11px]">
                  <tr>
                    <th className="px-4 py-3 w-16">Kode</th>
                    <th className="px-4 py-3">Kompetensi & Lingkup Materi</th>
                    <th className="px-4 py-3">Rumusan Tujuan Pembelajaran (TP)</th>
                    <th className="px-4 py-3">Indikator Ketercapaian</th>
                    <th className="px-4 py-3 w-20 text-center">Alokasi</th>
                    <th className="px-4 py-3 w-24 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {tpList
                    .filter(tp =>
                      tp.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      tp.scopeOfMaterial.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      tp.statement.toLowerCase().includes(searchQuery.toLowerCase())
                    )
                    .map((tp) => (
                      <tr key={tp.id} className="hover:bg-slate-50 transition">
                        <td className="px-4 py-3 font-mono font-bold text-blue-600">
                          {tp.code}
                        </td>
                        <td className="px-4 py-3">
                          <div className="font-semibold text-slate-900">{tp.scopeOfMaterial}</div>
                          <div className="text-[11px] text-slate-500 mt-0.5">KKO: {tp.competency}</div>
                          <span className="inline-block mt-1 text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded">
                            Sem. {tp.semester}
                          </span>
                        </td>
                        <td className="px-4 py-3 leading-relaxed text-slate-800 font-medium">
                          {tp.statement}
                        </td>
                        <td className="px-4 py-3 whitespace-pre-line text-slate-600 leading-normal">
                          {tp.indicator}
                        </td>
                        <td className="px-4 py-3 text-center font-bold text-slate-700">
                          {tp.allocatedHours} JP
                        </td>
                        <td className="px-4 py-3 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <button
                              onClick={() => {
                                const newModul = DataStore.autoGenerateModulFromTP(tp);
                                alert(`Sistem Satu Kali Input: Modul Ajar dan Rubrik KKTP berhasil dibuat otomatis dari ${tp.code} (${tp.scopeOfMaterial})!`);
                                setActiveSubTab('modul');
                              }}
                              className="inline-flex items-center gap-1 px-2.5 py-1 text-blue-700 hover:text-white hover:bg-blue-600 rounded-lg bg-blue-50 border border-blue-200 text-[11px] font-bold transition shadow-sm"
                              title="Otomatis susun Modul Ajar & Rubrik KKTP dari TP ini"
                            >
                              <Sparkles className="w-3 h-3 text-blue-600" />
                              <span className="hidden sm:inline">Modul & KKTP</span>
                            </button>
                            <button
                              onClick={() => {
                                setEditingItem(tp);
                                setModalType('tp');
                                setShowModal(true);
                              }}
                              className="p-1.5 text-slate-400 hover:text-blue-600 rounded-lg hover:bg-slate-100"
                              title="Edit TP"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteTP(tp.id)}
                              className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-slate-100"
                              title="Hapus TP"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* SUBTAB 3: ALUR TUJUAN PEMBELAJARAN (ATP) */}
      {/* ========================================================= */}
      {activeSubTab === 'atp' && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <GitBranch className="w-4 h-4 text-blue-600" />
                  <span>Struktur Urutan Alur Tujuan Pembelajaran (ATP)</span>
                </h3>
                <p className="text-xs text-slate-500">Urutan kronologis pencapaian kompetensi dalam semester ganjil dan genap</p>
              </div>

              <button
                onClick={() => {
                  DataStore.generateFormalPdf({
                    title: 'ALUR TUJUAN PEMBELAJARAN (ATP)',
                    subTitle: `FASE D — MATA PELAJARAN ${DataStore.getProfile().subject.toUpperCase()}`,
                    columns: ['Urutan', 'Kode TP', 'Tujuan Pembelajaran', 'Alokasi', 'Target Waktu / Periode'],
                    rows: atpList.map(a => {
                      const matchedTP = tpList.find(t => t.id === a.tpId);
                      return [
                        `No. ${a.orderNumber}`,
                        matchedTP ? matchedTP.code : '-',
                        matchedTP ? matchedTP.statement : '-',
                        `${a.allocatedHours} JP`,
                        a.quarter,
                      ];
                    }),
                  });
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-500 transition shadow"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Cetak Dokumen ATP</span>
              </button>
            </div>

            <div className="space-y-3">
              {atpList.map((atp) => {
                const linkedTP = tpList.find(t => t.id === atp.tpId);
                return (
                  <div key={atp.id} className="flex items-start gap-4 p-4 rounded-xl border border-slate-200 hover:border-blue-300 bg-slate-50/50 hover:bg-white transition">
                    <div className="w-9 h-9 rounded-xl bg-blue-600 text-white font-black text-sm flex items-center justify-center shrink-0 shadow-sm">
                      {atp.orderNumber}
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-xs text-blue-600">
                            {linkedTP?.code || 'TP 7.x'}
                          </span>
                          <span className="text-xs font-bold text-slate-900">
                            {linkedTP?.scopeOfMaterial || 'Lingkup Materi Utama'}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-xs">
                          <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded font-semibold text-[11px]">
                            {atp.allocatedHours} JP
                          </span>
                          <span className="bg-slate-200 text-slate-700 px-2 py-0.5 rounded font-medium text-[11px]">
                            {atp.quarter}
                          </span>
                        </div>
                      </div>

                      <p className="mt-2 text-xs text-slate-700 leading-relaxed font-medium">
                        {linkedTP?.statement || 'Tujuan Pembelajaran belum terhubung.'}
                      </p>

                      <div className="mt-2 text-[11px] text-slate-500 italic">
                        Catatan Alur: {atp.notes}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* SUBTAB 4: MODUL AJAR BERBASIS KURIKULUM CINTA (KBC) */}
      {/* ========================================================= */}
      {activeSubTab === 'modul' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-slate-900">Daftar Modul Ajar Berbasis Kurikulum Cinta (KBC)</h3>
                <span className="text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200 px-2 py-0.5 rounded-full">
                  Panca Cinta Terintegrasi
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">Perangkat pembelajaran lengkap terpadu pembiasaan kasih sayang, pilar Panca Cinta, dan diferensiasi ramah anak</p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setEditingItem(null);
                  setModalType('modul');
                  setShowModal(true);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-bold hover:bg-blue-500 transition shadow"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Buat Modul Ajar KBC</span>
              </button>
              <button
                onClick={handleAIGenerateModul}
                disabled={isGeneratingAI}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-bold shadow hover:from-blue-500 hover:to-indigo-500 transition"
              >
                <Sparkles className="w-3.5 h-3.5 text-sky-200" />
                <span>AI Generate Modul KBC</span>
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {modulList.map((m) => (
              <div key={m.id} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow transition">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[10px] font-bold uppercase bg-rose-50 text-rose-700 px-2.5 py-0.5 rounded-full border border-rose-200">
                        Kurikulum Berbasis Cinta (KBC)
                      </span>
                      <span className="text-[10px] font-bold uppercase bg-blue-50 text-blue-700 px-2 py-0.5 rounded border border-blue-200">
                        {m.phase}
                      </span>
                      <span className="text-xs font-semibold text-slate-500">
                        Alokasi: {m.allocatedHours}
                      </span>
                    </div>
                    <h2 className="text-base font-bold text-slate-900 mt-2">
                      {m.title}
                    </h2>
                    <p className="text-xs text-slate-600 mt-1">
                      Model Pembelajaran: <strong>{m.learningModel}</strong> | Sasaran: {m.targetStudents}
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handlePrintModul(m)}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-bold hover:bg-blue-500 transition shadow"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Lihat & Cetak PDF</span>
                    </button>
                    <button
                      onClick={() => {
                        setEditingItem(m);
                        setModalType('modul');
                        setShowModal(true);
                      }}
                      className="p-1.5 text-slate-400 hover:text-blue-600 rounded-lg hover:bg-slate-100"
                      title="Edit Modul Ajar"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteModul(m.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-slate-100"
                      title="Hapus Modul"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Pilar Panca Cinta Tags */}
                {m.pancaCintaDimensions && m.pancaCintaDimensions.length > 0 && (
                  <div className="mt-3 flex flex-wrap items-center gap-1.5">
                    <span className="text-[11px] font-bold text-slate-500">Pilar Panca Cinta:</span>
                    {m.pancaCintaDimensions.map((p, idx) => (
                      <span key={idx} className="text-[10px] font-semibold bg-rose-50 text-rose-700 px-2 py-0.5 rounded-full border border-rose-200">
                        ❤️ {p}
                      </span>
                    ))}
                  </div>
                )}

                {/* Pembiasaan Cinta (Love Habituation) Callout */}
                {m.kbcLoveHabituation && (
                  <div className="mt-3.5 p-3 rounded-xl bg-amber-50/70 border border-amber-200/70 text-xs">
                    <strong className="text-amber-900 font-bold block mb-0.5">Pembiasaan Cinta (Love Habituation) di Kelas:</strong>
                    <p className="text-amber-800 leading-relaxed">{m.kbcLoveHabituation}</p>
                  </div>
                )}

                {/* Modul Details Preview */}
                <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <span className="font-bold text-slate-800 block mb-1">Tujuan Pembelajaran:</span>
                    <p className="text-slate-600 leading-relaxed">{m.learningObjectives}</p>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <span className="font-bold text-slate-800 block mb-1">Pertanyaan Pemantik:</span>
                    <p className="text-slate-600 whitespace-pre-line leading-relaxed">{m.triggerQuestions}</p>
                  </div>
                </div>

                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <span className="text-[11px] font-semibold text-slate-500">Profil Pelajar:</span>
                  {m.pancasilaProfile.map((p, i) => (
                    <span key={i} className="text-[10px] font-medium bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full">
                      {p}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* SUBTAB 5: MODUL PROJEK PENGUATAN KBC (PANCA CINTA & P5) */}
      {/* ========================================================= */}
      {activeSubTab === 'p5' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-slate-900">Modul Projek Penguatan KBC (P5 & Karakter Cinta)</h3>
                <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full">
                  Karakter Panca Cinta
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">Perencanaan projek lintas disiplin ilmu untuk menginternalisasikan pilar Panca Cinta dalam aksi nyata peserta didik</p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setEditingItem(null);
                  setModalType('p5');
                  setShowModal(true);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-bold hover:bg-blue-500 transition shadow"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Tambah Modul Projek KBC</span>
              </button>
              <button
                onClick={handleAIGenerateProjekKBC}
                disabled={isGeneratingAI}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-xs font-bold shadow hover:from-emerald-500 hover:to-teal-500 transition"
              >
                <Sparkles className="w-3.5 h-3.5 text-emerald-200" />
                <span>AI Generate Projek KBC</span>
              </button>
            </div>
          </div>

          {/* Quick Preset Buttons for Panca Cinta Themes */}
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex flex-wrap items-center justify-between gap-2 text-xs">
            <span className="font-bold text-slate-700">Pilihan Cepat Tema Panca Cinta:</span>
            <div className="flex flex-wrap gap-1.5">
              <button
                onClick={() => {
                  DataStore.autoGenerateProjekKBC('Cinta Alam & Gaya Hidup Berkelanjutan');
                  setP5List(DataStore.getP5Modules());
                  alert('Projek KBC tema Cinta Alam berhasil ditambahkan!');
                }}
                className="px-2.5 py-1 bg-white hover:bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg text-[11px] font-semibold transition"
              >
                🌱 + Tema Cinta Alam
              </button>
              <button
                onClick={() => {
                  DataStore.autoGenerateProjekKBC('Cinta Sesama, Kebinekaan & Anti-Bullying');
                  setP5List(DataStore.getP5Modules());
                  alert('Projek KBC tema Cinta Sesama (Anti-Bullying) berhasil ditambahkan!');
                }}
                className="px-2.5 py-1 bg-white hover:bg-rose-50 text-rose-800 border border-rose-200 rounded-lg text-[11px] font-semibold transition"
              >
                🤝 + Tema Cinta Sesama (Sekolah Ramah Anak)
              </button>
              <button
                onClick={() => {
                  DataStore.autoGenerateProjekKBC('Cinta kepada Ilmu & Riset');
                  setP5List(DataStore.getP5Modules());
                  alert('Projek KBC tema Cinta Ilmu & Festival Sains berhasil ditambahkan!');
                }}
                className="px-2.5 py-1 bg-white hover:bg-blue-50 text-blue-800 border border-blue-200 rounded-lg text-[11px] font-semibold transition"
              >
                🔬 + Tema Cinta Ilmu
              </button>
              <button
                onClick={() => {
                  DataStore.autoGenerateProjekKBC('Cinta Tanah Air & Harmoni Kebinekaan');
                  setP5List(DataStore.getP5Modules());
                  alert('Projek KBC tema Cinta Tanah Air & Kebinekaan berhasil ditambahkan!');
                }}
                className="px-2.5 py-1 bg-white hover:bg-amber-50 text-amber-800 border border-amber-200 rounded-lg text-[11px] font-semibold transition"
              >
                🇮🇩 + Tema Cinta Tanah Air
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {p5List.map((p5) => (
              <div key={p5.id} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow transition">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded border border-emerald-200">
                        Tema: {p5.theme}
                      </span>
                      <span className="text-[10px] font-bold uppercase bg-rose-50 text-rose-700 px-2 py-0.5 rounded-full border border-rose-200">
                        Projek Karakter KBC
                      </span>
                    </div>
                    <h2 className="text-base font-bold text-slate-900 mt-1">
                      {p5.title}
                    </h2>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        DataStore.generateFormalPdf({
                          title: 'MODUL PROJEK PENGUATAN KARAKTER KBC (PANCA CINTA)',
                          subTitle: `TEMA: ${p5.theme.toUpperCase()} — PENGUATAN PROFIL PELAJAR PANCASILA & RAHMATAN LIL ALAMIN`,
                          columns: ['Komponen Projek', 'Uraian & Rencana Aksi Kasih'],
                          rows: [
                            ['Judul Projek', p5.title],
                            ['Fokus Panca Cinta', p5.pancaCintaFocus?.join(', ') || 'Cinta kepada Tuhan & Sesama'],
                            ['Dimensi Terkait', p5.dimensions.join(', ')],
                            ['Elemen & Sub-Elemen', p5.elements],
                            ['Tujuan Pembelajaran Projek', p5.objectives],
                            ['Jadwal & Pola Pelaksanaan', p5.schedule],
                            ['Alur Aktivitas Projek Kasih', p5.activities],
                            ['Rubrik Asesmen Karakter', p5.assessmentRubric],
                          ],
                        });
                      }}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-bold hover:bg-blue-600 transition shadow"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>Cetak PDF Modul Projek KBC</span>
                    </button>
                    <button
                      onClick={() => handleDeleteP5(p5.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-slate-100"
                      title="Hapus Projek"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Pilar Panca Cinta Focus */}
                {p5.pancaCintaFocus && p5.pancaCintaFocus.length > 0 && (
                  <div className="mt-3 flex flex-wrap items-center gap-1.5">
                    <span className="text-[11px] font-bold text-slate-500">Fokus Pilar Cinta:</span>
                    {p5.pancaCintaFocus.map((f, i) => (
                      <span key={i} className="text-[10px] font-semibold bg-rose-50 text-rose-700 px-2 py-0.5 rounded-full border border-rose-200">
                        ❤️ {f}
                      </span>
                    ))}
                  </div>
                )}

                <div className="mt-3 space-y-3 text-xs text-slate-700 leading-relaxed">
                  <div>
                    <strong className="text-slate-900">Dimensi Profil Kelulusan:</strong>
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {p5.dimensions.map((d, i) => (
                        <span key={i} className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded font-semibold text-[11px]">
                          {d}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <strong className="text-slate-900">Tujuan & Sasaran Projek Kasih:</strong>
                    <p className="mt-0.5">{p5.objectives}</p>
                  </div>
                  <div>
                    <strong className="text-slate-900">Alur Tahapan Kegiatan Aksi Kasih:</strong>
                    <p className="mt-0.5 whitespace-pre-line bg-slate-50 p-3 rounded-xl border border-slate-200">
                      {p5.activities}
                    </p>
                  </div>
                  <div className="bg-emerald-50/50 p-3 rounded-xl border border-emerald-100">
                    <strong className="text-emerald-900 font-bold block mb-0.5">Rubrik Asesmen Karakter Cinta KBC:</strong>
                    <p className="text-emerald-800 text-[11px]">{p5.assessmentRubric}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* SUBTAB 6: KKTP (KRITERIA KETERCAPAIAN TUJUAN PEMBELAJARAN) */}
      {/* ========================================================= */}
      {activeSubTab === 'kktp' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Kriteria Ketercapaian Tujuan Pembelajaran (KKTP)</h3>
              <p className="text-xs text-slate-500">Rubrik interval nilai dan deskripsi ketuntasan kompetensi peserta didik</p>
            </div>

            <button
              onClick={() => {
                DataStore.generateFormalPdf({
                  title: 'KRITERIA KETERCAPAIAN TUJUAN PEMBELAJARAN (KKTP)',
                  subTitle: `MATA PELAJARAN ${DataStore.getProfile().subject.toUpperCase()}`,
                  columns: ['Kode TP', 'Tujuan Pembelajaran', 'Perlu Bimbingan (0-65)', 'Cukup (66-75)', 'Baik (76-85)', 'Sangat Baik (86-100)'],
                  rows: kktpList.map(k => [
                    k.tpCode,
                    k.statement,
                    k.needsGuidanceCriteria,
                    k.sufficientCriteria,
                    k.goodCriteria,
                    k.veryGoodCriteria,
                  ]),
                  orientation: 'l',
                });
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-bold hover:bg-blue-500 transition shadow"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Cetak Tabel KKTP</span>
            </button>
          </div>

          <div className="space-y-4">
            {kktpList.map((k) => (
              <div key={k.id} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-xs text-blue-600">{k.tpCode}</span>
                    <h3 className="text-xs font-bold text-slate-900">{k.statement}</h3>
                  </div>
                  <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    {k.intervalNote}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-rose-50/50 border border-rose-200">
                    <span className="font-bold text-rose-700 block mb-1">Perlu Bimbingan (0-65)</span>
                    <p className="text-slate-700 leading-relaxed text-[11px]">{k.needsGuidanceCriteria}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-amber-50/50 border border-amber-200">
                    <span className="font-bold text-amber-700 block mb-1">Cukup (66-75)</span>
                    <p className="text-slate-700 leading-relaxed text-[11px]">{k.sufficientCriteria}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-blue-50/50 border border-blue-200">
                    <span className="font-bold text-blue-700 block mb-1">Baik (76-85)</span>
                    <p className="text-slate-700 leading-relaxed text-[11px]">{k.goodCriteria}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-emerald-50/50 border border-emerald-200">
                    <span className="font-bold text-emerald-700 block mb-1">Sangat Baik (86-100)</span>
                    <p className="text-slate-700 leading-relaxed text-[11px]">{k.veryGoodCriteria}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL EDIT / TAMBAH CP / TP / MODUL / PROJEK KBC */}
      {/* ========================================================= */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4 overflow-y-auto">
          <div className={`bg-white rounded-2xl ${modalType === 'modul' || modalType === 'p5' ? 'max-w-2xl' : 'max-w-lg'} w-full p-6 shadow-2xl border border-slate-200 my-8 max-h-[90vh] overflow-y-auto`}>
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                {modalType === 'cp' && (editingItem ? 'Edit Capaian Pembelajaran (CP)' : 'Tambah Capaian Pembelajaran (CP)')}
                {modalType === 'tp' && (editingItem ? 'Edit Tujuan Pembelajaran (TP)' : 'Tambah Tujuan Pembelajaran (TP)')}
                {modalType === 'modul' && (editingItem ? 'Edit Modul Ajar Berbasis Cinta (KBC)' : 'Buat Modul Ajar Berbasis Kurikulum Cinta (KBC)')}
                {modalType === 'p5' && (editingItem ? 'Edit Modul Projek Karakter KBC' : 'Tambah Modul Projek Karakter KBC (Panca Cinta)')}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-slate-700 text-sm font-bold p-1 rounded-lg hover:bg-slate-100"
              >
                ✕
              </button>
            </div>

            {/* FORM CP */}
            {modalType === 'cp' && (
              <form onSubmit={handleSaveCP} className="space-y-3 text-xs">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Mata Pelajaran</label>
                  <input
                    name="subject"
                    defaultValue={editingItem?.subject || DataStore.getProfile().subject}
                    required
                    className="w-full border border-slate-200 rounded-lg p-2 focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Fase</label>
                    <select
                      name="phase"
                      defaultValue={editingItem?.phase || 'Fase D (Kelas 7-9)'}
                      className="w-full border border-slate-200 rounded-lg p-2"
                    >
                      <option value="Fase A (Kelas 1-2)">Fase A (Kelas 1-2)</option>
                      <option value="Fase B (Kelas 3-4)">Fase B (Kelas 3-4)</option>
                      <option value="Fase C (Kelas 5-6)">Fase C (Kelas 5-6)</option>
                      <option value="Fase D (Kelas 7-9)">Fase D (Kelas 7-9)</option>
                      <option value="Fase E (Kelas 10)">Fase E (Kelas 10)</option>
                      <option value="Fase F (Kelas 11-12)">Fase F (Kelas 11-12)</option>
                    </select>
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Tingkat Kelas</label>
                    <input
                      name="grade"
                      defaultValue={editingItem?.grade || 'Kelas VII'}
                      required
                      className="w-full border border-slate-200 rounded-lg p-2"
                    />
                  </div>
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Pilar Panca Cinta KBC Relevan</label>
                  <select
                    name="kbcPillar"
                    defaultValue={editingItem?.kbcPillar || 'Cinta kepada Ilmu & Cinta Sesama'}
                    className="w-full border border-rose-200 bg-rose-50/40 rounded-lg p-2 text-rose-900 font-semibold"
                  >
                    <option value="Cinta kepada Tuhan & Cinta Alam">Cinta kepada Tuhan & Cinta Alam</option>
                    <option value="Cinta kepada Ilmu & Cinta Sesama">Cinta kepada Ilmu & Cinta Sesama</option>
                    <option value="Cinta kepada Diri Sendiri & Sesama Manusia">Cinta kepada Diri Sendiri & Sesama Manusia</option>
                    <option value="Cinta kepada Tanah Air & Bangsa">Cinta kepada Tanah Air & Bangsa</option>
                    <option value="Integrasi Panca Cinta Holistik">Integrasi Panca Cinta Holistik</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Elemen CP</label>
                  <input
                    name="element"
                    placeholder="misal: Menyimak / Membaca dan Memirsa"
                    defaultValue={editingItem?.element || ''}
                    required
                    className="w-full border border-slate-200 rounded-lg p-2"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Deskripsi Capaian Pembelajaran</label>
                  <textarea
                    name="description"
                    rows={4}
                    defaultValue={editingItem?.description || ''}
                    required
                    className="w-full border border-slate-200 rounded-lg p-2"
                  />
                </div>

                {!editingItem && (
                  <div className="flex items-center gap-2 p-2.5 rounded-lg bg-blue-50 border border-blue-200">
                    <input type="checkbox" id="autoCascade" name="autoCascade" defaultChecked className="rounded text-blue-600 focus:ring-blue-500" />
                    <label htmlFor="autoCascade" className="text-[11px] font-bold text-blue-900 cursor-pointer">
                      Sistem Otomatis: Sekaligus turunkan menjadi Tujuan Pembelajaran (TP) & Alur (ATP) Berbasis KBC
                    </label>
                  </div>
                )}

                <div className="flex justify-end gap-2 pt-3">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 border rounded-lg hover:bg-slate-50"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-500 shadow"
                  >
                    Simpan CP
                  </button>
                </div>
              </form>
            )}

            {/* FORM TP */}
            {modalType === 'tp' && (
              <form onSubmit={handleSaveTP} className="space-y-3 text-xs">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Kode TP</label>
                    <input
                      name="code"
                      placeholder="e.g. TP 7.1"
                      defaultValue={editingItem?.code || `TP 7.${tpList.length + 1}`}
                      required
                      className="w-full border border-slate-200 rounded-lg p-2 font-mono"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Alokasi Waktu (JP)</label>
                    <input
                      name="allocatedHours"
                      type="number"
                      defaultValue={editingItem?.allocatedHours || 6}
                      required
                      className="w-full border border-slate-200 rounded-lg p-2"
                    />
                  </div>
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Target Internalisasi Karakter Cinta KBC</label>
                  <input
                    name="kbcCharacterGoal"
                    placeholder="misal: Cinta kepada Tuhan (Syukur) & Cinta kepada Alam"
                    defaultValue={editingItem?.kbcCharacterGoal || 'Cinta kepada Ilmu & Cinta Sesama'}
                    required
                    className="w-full border border-rose-200 bg-rose-50/40 rounded-lg p-2 text-rose-900 font-semibold"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Lingkup Materi</label>
                  <input
                    name="scopeOfMaterial"
                    placeholder="misal: Teks Deskripsi Keindahan Alam Nusantara"
                    defaultValue={editingItem?.scopeOfMaterial || ''}
                    required
                    className="w-full border border-slate-200 rounded-lg p-2"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Kompetensi (KKO)</label>
                  <input
                    name="competency"
                    placeholder="misal: Mengidentifikasi & Menganalisis"
                    defaultValue={editingItem?.competency || ''}
                    required
                    className="w-full border border-slate-200 rounded-lg p-2"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Rumusan Tujuan Pembelajaran (TP)</label>
                  <textarea
                    name="statement"
                    rows={3}
                    defaultValue={editingItem?.statement || ''}
                    required
                    className="w-full border border-slate-200 rounded-lg p-2"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Indikator Ketercapaian</label>
                  <textarea
                    name="indicator"
                    rows={2}
                    defaultValue={editingItem?.indicator || ''}
                    placeholder="1. Menyebutkan objek... 2. Menemukan..."
                    required
                    className="w-full border border-slate-200 rounded-lg p-2"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Semester</label>
                  <select
                    name="semester"
                    defaultValue={editingItem?.semester || 'Ganjil'}
                    className="w-full border border-slate-200 rounded-lg p-2"
                  >
                    <option value="Ganjil">Semester Ganjil</option>
                    <option value="Genap">Semester Genap</option>
                  </select>
                </div>

                <div className="flex justify-end gap-2 pt-3">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 border rounded-lg hover:bg-slate-50"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-500 shadow"
                  >
                    Simpan TP
                  </button>
                </div>
              </form>
            )}

            {/* FORM MODUL AJAR KBC */}
            {modalType === 'modul' && (
              <form onSubmit={handleSaveModul} className="space-y-3.5 text-xs">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Judul Modul Ajar KBC</label>
                  <input
                    name="title"
                    defaultValue={editingItem?.title || `Modul Ajar Berbasis Kurikulum Cinta (KBC): Bab Pembelajaran Baru`}
                    required
                    className="w-full border border-slate-200 rounded-lg p-2 text-sm font-semibold"
                  />
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Fase / Kelas</label>
                    <input
                      name="grade"
                      defaultValue={editingItem?.grade || 'Kelas VII'}
                      required
                      className="w-full border border-slate-200 rounded-lg p-2"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Alokasi Waktu</label>
                    <input
                      name="allocatedHours"
                      defaultValue={editingItem?.allocatedHours || '2 x 40 Menit'}
                      required
                      className="w-full border border-slate-200 rounded-lg p-2"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Target Siswa</label>
                    <input
                      name="targetStudents"
                      defaultValue={editingItem?.targetStudents || 'Reguler (32 Siswa)'}
                      required
                      className="w-full border border-slate-200 rounded-lg p-2"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Model Pembelajaran</label>
                  <select
                    name="learningModel"
                    defaultValue={editingItem?.learningModel || 'Problem-Based Learning (PBL) Berbasis Cinta (KBC)'}
                    className="w-full border border-slate-200 rounded-lg p-2 font-medium"
                  >
                    <option value="Problem-Based Learning (PBL) Berbasis Cinta (KBC)">Problem-Based Learning (PBL) Berbasis Cinta (KBC)</option>
                    <option value="Inquiry Learning Berbasis Cinta Kasih">Inquiry Learning Berbasis Cinta Kasih</option>
                    <option value="Discovery Learning Berakar Karakter Kasih">Discovery Learning Berakar Karakter Kasih</option>
                    <option value="Project-Based Learning (PjBL) Kolaborasi Kasih">Project-Based Learning (PjBL) Kolaborasi Kasih</option>
                    <option value="Cooperative Learning Inklusif & Ramah Anak">Cooperative Learning Inklusif & Ramah Anak</option>
                  </select>
                </div>

                {/* PILAR PANCA CINTA CHECKBOXES */}
                <div className="p-3 rounded-xl bg-rose-50/70 border border-rose-200">
                  <span className="font-bold text-rose-900 block mb-1.5">Pilar Panca Cinta KBC yang Diintegrasikan:</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-slate-700">
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input type="checkbox" name="panca_Tuhan" value="Cinta kepada Tuhan" defaultChecked className="rounded text-rose-600 focus:ring-rose-500" />
                      <span>Cinta kepada Tuhan (Allah & Rasul)</span>
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input type="checkbox" name="panca_Ilmu" value="Cinta kepada Ilmu" defaultChecked className="rounded text-rose-600 focus:ring-rose-500" />
                      <span>Cinta kepada Ilmu & Kebenaran</span>
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input type="checkbox" name="panca_Sesama" value="Cinta kepada Diri Sendiri & Sesama" defaultChecked className="rounded text-rose-600 focus:ring-rose-500" />
                      <span>Cinta kepada Diri Sendiri & Sesama</span>
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input type="checkbox" name="panca_Alam" value="Cinta kepada Alam & Lingkungan" defaultChecked className="rounded text-rose-600 focus:ring-rose-500" />
                      <span>Cinta kepada Alam & Lingkungan</span>
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer sm:col-span-2">
                      <input type="checkbox" name="panca_TanahAir" value="Cinta kepada Tanah Air & Bangsa" defaultChecked className="rounded text-rose-600 focus:ring-rose-500" />
                      <span>Cinta kepada Tanah Air & Harmoni Bangsa</span>
                    </label>
                  </div>
                </div>

                {/* PEMBIASAAN CINTA (LOVE HABITUATION) */}
                <div>
                  <label className="font-semibold text-amber-900 block mb-1">Pembiasaan Cinta (Love Habituation) di Kelas</label>
                  <textarea
                    name="kbcLoveHabituation"
                    rows={2}
                    defaultValue={editingItem?.kbcLoveHabituation || 'Morning Check-In Empati: Sapaan hangat dan salam kasih guru di depan pintu kelas, doa bersama khusyuk, menanyakan kondisi emosional murid (mood meter), dan komitmen ruang kelas ramah anak tanpa ejekan.'}
                    required
                    className="w-full border border-amber-300 bg-amber-50/40 rounded-lg p-2 text-slate-800"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Tujuan Pembelajaran</label>
                  <textarea
                    name="learningObjectives"
                    rows={2}
                    defaultValue={editingItem?.learningObjectives || 'Peserta didik mampu memahami konsep inti dan menyajikan laporan dengan nalar kritis serta sikap saling mengapresiasi antarteman.'}
                    required
                    className="w-full border border-slate-200 rounded-lg p-2"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Pertanyaan Pemantik</label>
                  <textarea
                    name="triggerQuestions"
                    rows={2}
                    defaultValue={editingItem?.triggerQuestions || '1. Bagaimana fenomena ini dapat kita maknai sebagai salah satu tanda kebesaran Sang Pencipta?\n2. Bagaimana cara kita saling bekerja sama dalam kelompok dengan penuh kasih tanpa meremehkan teman?'}
                    required
                    className="w-full border border-slate-200 rounded-lg p-2"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Pendahuluan Kasih (10 Menit)</label>
                    <textarea
                      name="introductoryActivities"
                      rows={3}
                      defaultValue={editingItem?.introductoryActivities || 'Sapaan hangat guru, doa bersama penuh khidmat, cek kesiapan emosional siswa, ice breaking gembira, dan apersepsi kontekstual.'}
                      required
                      className="w-full border border-slate-200 rounded-lg p-2 text-[11px]"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Kegiatan Inti Inklusif (60 Menit)</label>
                    <textarea
                      name="coreActivities"
                      rows={3}
                      defaultValue={editingItem?.coreActivities || 'Fase 1-5 PBL Berbasis Cinta: Eksplorasi masalah nyata, diskusi kelompok inklusif, bimbingan empati sabar bagi yang lambat memahami, dan presentasi saling mengapresiasi.'}
                      required
                      className="w-full border border-slate-200 rounded-lg p-2 text-[11px]"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Penutup Apresiatif (10 Menit)</label>
                    <textarea
                      name="closingActivities"
                      rows={3}
                      defaultValue={editingItem?.closingActivities || 'Rangkuman simpulan, refleksi batin kasih, ucapan terima kasih antarteman sekelompok, apresiasi guru, dan doa syukur penutup.'}
                      required
                      className="w-full border border-slate-200 rounded-lg p-2 text-[11px]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Rencana Asesmen Sikap & Formatif</label>
                    <textarea
                      name="assessmentPlan"
                      rows={2}
                      defaultValue={editingItem?.assessmentPlan || 'Asesmen Sikap Panca Cinta (Observasi empati & gotong royong), LKPD ramah anak, dan Asesmen Sumatif autentik tanpa vonis/labeling.'}
                      required
                      className="w-full border border-slate-200 rounded-lg p-2 text-[11px]"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Remedial Personal Berakar Kasih</label>
                    <textarea
                      name="remedialPlan"
                      rows={2}
                      defaultValue={editingItem?.remedialPlan || 'Bimbingan personal berakar kasih: Pendampingan bertahap dengan sabar dan tutor sebaya bersahabat bagi peserta didik belum tuntas KKTP.'}
                      required
                      className="w-full border border-slate-200 rounded-lg p-2 text-[11px]"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 border rounded-lg hover:bg-slate-50"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-rose-600 text-white rounded-lg font-bold hover:bg-rose-500 shadow"
                  >
                    Simpan Modul Ajar KBC
                  </button>
                </div>
              </form>
            )}

            {/* FORM PROJEK KBC */}
            {modalType === 'p5' && (
              <form onSubmit={handleSaveP5} className="space-y-3.5 text-xs">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Tema Utama Projek KBC</label>
                  <select
                    name="theme"
                    defaultValue={editingItem?.theme || 'Cinta Sesama, Kebinekaan & Anti-Bullying'}
                    className="w-full border border-slate-200 rounded-lg p-2 font-medium"
                  >
                    <option value="Cinta Alam & Gaya Hidup Berkelanjutan">Cinta Alam & Gaya Hidup Berkelanjutan (Sahabat Bumi & Jejak Karbon)</option>
                    <option value="Cinta Sesama, Kebinekaan & Anti-Bullying">Cinta Sesama, Kebinekaan & Anti-Bullying (Sekolah Ramah Anak)</option>
                    <option value="Cinta kepada Ilmu & Riset">Cinta kepada Ilmu & Riset (Festival Sains & Literasi Menggembirakan)</option>
                    <option value="Cinta Tanah Air & Harmoni Kebinekaan">Cinta Tanah Air & Harmoni Kebinekaan (Kearifan Lokal Nusantara)</option>
                    <option value="Cinta kepada Tuhan & Kebajikan Ibadah">Cinta kepada Tuhan & Kebajikan Ibadah (Indahnya Berbagi Kasih)</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Judul Projek Karakter KBC</label>
                  <input
                    name="title"
                    defaultValue={editingItem?.title || 'Projek Karakter KBC: Gerakan Madrasah Ramah Anak & Tebar Senyum'}
                    required
                    className="w-full border border-slate-200 rounded-lg p-2 text-sm font-semibold"
                  />
                </div>

                {/* PILAR PANCA CINTA CHECKBOXES */}
                <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200">
                  <span className="font-bold text-emerald-900 block mb-1.5">Fokus Pilar Panca Cinta yang Ditumbuhkan:</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-slate-700">
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input type="checkbox" name="panca_proj_Tuhan" value="Cinta kepada Tuhan" defaultChecked className="rounded text-emerald-600 focus:ring-emerald-500" />
                      <span>Cinta kepada Tuhan</span>
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input type="checkbox" name="panca_proj_Sesama" value="Cinta kepada Diri Sendiri & Sesama Manusia" defaultChecked className="rounded text-emerald-600 focus:ring-emerald-500" />
                      <span>Cinta kepada Diri Sendiri & Sesama</span>
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input type="checkbox" name="panca_proj_Alam" value="Cinta kepada Alam & Lingkungan" className="rounded text-emerald-600 focus:ring-emerald-500" />
                      <span>Cinta kepada Alam & Lingkungan</span>
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input type="checkbox" name="panca_proj_Ilmu" value="Cinta kepada Ilmu" className="rounded text-emerald-600 focus:ring-emerald-500" />
                      <span>Cinta kepada Ilmu & Riset</span>
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer sm:col-span-2">
                      <input type="checkbox" name="panca_proj_TanahAir" value="Cinta kepada Tanah Air & Bangsa" defaultChecked className="rounded text-emerald-600 focus:ring-emerald-500" />
                      <span>Cinta kepada Tanah Air & Harmoni Bangsa</span>
                    </label>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Jadwal & Pola Pelaksanaan</label>
                    <input
                      name="schedule"
                      defaultValue={editingItem?.schedule || 'Sistem Blok 3 Pekan Terpadu'}
                      required
                      className="w-full border border-slate-200 rounded-lg p-2"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Elemen & Sub-Elemen</label>
                    <input
                      name="elements"
                      defaultValue={editingItem?.elements || 'Akhlak mulia kepada sesama, empati sosial, gotong royong.'}
                      required
                      className="w-full border border-slate-200 rounded-lg p-2"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Tujuan & Sasaran Projek Kasih</label>
                  <textarea
                    name="objectives"
                    rows={2}
                    defaultValue={editingItem?.objectives || 'Mewujudkan ekosistem belajar yang aman, inklusif, saling menghargai keragaman latar belakang, dan melatih peserta didik menjadi Duta Sahabat Damai.'}
                    required
                    className="w-full border border-slate-200 rounded-lg p-2"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Alur Tahapan Kegiatan Aksi Kasih (4 Tahap)</label>
                  <textarea
                    name="activities"
                    rows={4}
                    defaultValue={editingItem?.activities || '1. Tahap Temu Kasih (Pekan 1): Menonton film pendek tentang empati dan luka batin perundungan.\n2. Tahap Curahan Hati (Pekan 2): Mengisi Kotak Kasih Sayang anonim dan refleksi pertemanan sehat.\n3. Tahap Aksi Bersama (Pekan 3): Pembuatan Pohon Kebaikan dan drama simulasi resolusi damai tanpa amarah.\n4. Tahap Selebrasi Damai: Deklarasi Piagam Madrasah Ramah Anak dan penobatan Sahabat Damai Kelas.'}
                    required
                    className="w-full border border-slate-200 rounded-lg p-2 text-[11px] leading-relaxed"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Rubrik Asesmen Karakter Cinta KBC</label>
                  <textarea
                    name="assessmentRubric"
                    rows={2}
                    defaultValue={editingItem?.assessmentRubric || 'Rubrik Karakter Kasih KBC: Mulai Berkembang (MB), Sedang Berkembang (SB), Berkembang Sesuai Harapan (BSH), Sangat Berkembang (SAB).'}
                    required
                    className="w-full border border-slate-200 rounded-lg p-2 text-[11px]"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 border rounded-lg hover:bg-slate-50"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-emerald-600 text-white rounded-lg font-bold hover:bg-emerald-500 shadow"
                  >
                    Simpan Modul Projek KBC
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* PRINT PREVIEW MODAL */}
      <PrintModal
        isOpen={showPrintModal}
        onClose={() => setShowPrintModal(false)}
        title={printDoc.title}
        subTitle={printDoc.subTitle}
      >
        {printDoc.content}
      </PrintModal>
    </div>
  );
};
