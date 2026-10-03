import React, { useState, useEffect } from 'react';
import {
  Award,
  FileSpreadsheet,
  HelpCircle,
  CheckCircle,
  FileText,
  RefreshCw,
  BarChart3,
  ClipboardList,
  TrendingUp,
  BookMarked,
  Printer,
  Plus,
  Trash2,
  Edit3,
  Search,
  Filter,
  Check,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { DataStore, calculateGradeMetrics } from '../../services/storage';
import {
  GradeRecord,
  DiagnosticAssessmentRecord,
  AssessmentInstrument,
  ItemAnalysisRecord,
  BlueprintItem,
  RemedialEnrichmentProgram,
  AssignmentItem,
  Student
} from '../../types';
import { PrintModal } from '../common/PrintModal';

interface Buku3ViewProps {
  initialSubTab?: string;
}

export const Buku3View: React.FC<Buku3ViewProps> = ({ initialSubTab = 'nilai' }) => {
  const [activeSubTab, setActiveSubTab] = useState(initialSubTab);

  // States
  const [students, setStudents] = useState<Student[]>(DataStore.getStudents());
  const [gradeRecords, setGradeRecords] = useState<GradeRecord[]>(DataStore.getNilai());
  const [diagnostikList, setDiagnostikList] = useState<DiagnosticAssessmentRecord[]>(DataStore.getDiagnostik());
  const [instrumenList, setInstrumenList] = useState<AssessmentInstrument[]>(DataStore.getInstrumen());
  const [analisisSoalList, setAnalisisSoalList] = useState<ItemAnalysisRecord[]>(DataStore.getAnalisisSoal());
  const [kisiKisiList, setKisiKisiList] = useState<BlueprintItem[]>(DataStore.getKisiKisi());
  const [remedialList, setRemedialList] = useState<RemedialEnrichmentProgram[]>(DataStore.getRemedial());
  const [tugasList, setTugasList] = useState<AssignmentItem[]>(DataStore.getTugas());

  // Print modal
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [printDoc, setPrintDoc] = useState<{ title: string; subTitle?: string; content: React.ReactNode }>({
    title: '',
    content: null,
  });

  // Modal edit grade
  const [editingGrade, setEditingGrade] = useState<GradeRecord | null>(null);
  const [showStudentModal, setShowStudentModal] = useState(false);

  // Auto Remedial & Pengayaan Generator from Gradebook
  const handleAutoGenerateRemedial = () => {
    const res = DataStore.autoGenerateRemedialAndEnrichment(75);
    alert(
      `Sistem Satu Kali Input: Hasil Belajar & Tindak Lanjut Berhasil Dibuat!\n\n` +
      `• Peserta Didik Masuk Program Remedial (< 75): ${res.remedialCount} orang\n` +
      `• Peserta Didik Masuk Program Pengayaan (>= 75): ${res.enrichmentCount} orang\n\n` +
      `Data telah langsung disinkronkan ke Buku 3 (Sub-menu 6. Remedial & Pengayaan) dan Buku 4 (Program Tindak Lanjut Guru) tanpa perlu input ulang.`
    );
    setActiveSubTab('remedial');
  };

  const handleAddStudent = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const newStudent: Student = {
      id: `std-${Date.now()}`,
      nis: fd.get('nis') as string,
      nisn: fd.get('nisn') as string || `00${Math.floor(10000000 + Math.random() * 90000000)}`,
      name: fd.get('name') as string,
      gender: fd.get('gender') as 'L' | 'P',
      className: fd.get('className') as string || 'VII-A',
    };

    const updated = [...students, newStudent];
    DataStore.saveStudents(updated);
    setStudents(updated);
    setShowStudentModal(false);
    alert(`Siswa "${newStudent.name}" berhasil ditambahkan! Data langsung sinkron di Daftar Hadir (Buku 2) dan Daftar Nilai (Buku 3).`);
  };

  useEffect(() => {
    setActiveSubTab(initialSubTab);
  }, [initialSubTab]);

  useEffect(() => {
    const handleUpdate = () => {
      setStudents(DataStore.getStudents());
      setGradeRecords(DataStore.getNilai());
      setDiagnostikList(DataStore.getDiagnostik());
      setInstrumenList(DataStore.getInstrumen());
      setAnalisisSoalList(DataStore.getAnalisisSoal());
      setKisiKisiList(DataStore.getKisiKisi());
      setRemedialList(DataStore.getRemedial());
      setTugasList(DataStore.getTugas());
    };
    window.addEventListener('bkgd-store-update', handleUpdate);
    return () => window.removeEventListener('bkgd-store-update', handleUpdate);
  }, []);

  const subTabs = [
    { id: 'nilai', label: '1. Daftar Nilai & Rapor', icon: FileSpreadsheet },
    { id: 'diagnostik', label: '2. Asesmen Diagnostik', icon: HelpCircle },
    { id: 'formatif', label: '3. Asesmen Formatif', icon: CheckCircle },
    { id: 'sumatif', label: '4. Asesmen Sumatif (STS/SAS)', icon: Award },
    { id: 'instrumen', label: '5. Bank Instrumen Soal', icon: FileText },
    { id: 'remedial', label: '6. Remedial & Pengayaan', icon: RefreshCw },
    { id: 'analisis_soal', label: '7. Analisis Butir Soal', icon: BarChart3 },
    { id: 'kisi_kisi', label: '8. Kisi-Kisi Soal Ujian', icon: ClipboardList },
    { id: 'analisis_belajar', label: '9. Analisis Hasil Belajar', icon: TrendingUp },
    { id: 'tugas', label: '10. Penugasan Siswa', icon: BookMarked },
  ];

  // ============================
  // GRADE UPDATE HANDLER
  // ============================
  const handleSaveGradeModal = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingGrade) return;

    const fd = new FormData(e.currentTarget);
    const t1 = Number(fd.get('t1')) || 0;
    const t2 = Number(fd.get('t2')) || 0;
    const t3 = Number(fd.get('t3')) || 0;
    const t4 = Number(fd.get('t4')) || 0;
    const f1 = Number(fd.get('f1')) || 0;
    const f2 = Number(fd.get('f2')) || 0;
    const f3 = Number(fd.get('f3')) || 0;
    const f4 = Number(fd.get('f4')) || 0;
    const sts = Number(fd.get('sts')) || 0;
    const sas = Number(fd.get('sas')) || 0;

    const tugasScores = [t1, t2, t3, t4];
    const formatifScores = [f1, f2, f3, f4];
    const { finalGrade, predicate, achievementDescription } = calculateGradeMetrics(tugasScores, formatifScores, sts, sas);

    const updatedGrade: GradeRecord = {
      ...editingGrade,
      tugasScores,
      formatifScores,
      stsScore: sts,
      sasScore: sas,
      finalGrade,
      predicate,
      achievementDescription,
    };

    const updatedList = gradeRecords.map(g => g.id === editingGrade.id ? updatedGrade : g);
    DataStore.saveNilai(updatedList);
    setGradeRecords(updatedList);
    setEditingGrade(null);
  };

  // EXPORT EXCEL NILAI
  const exportNilaiExcel = () => {
    const data = gradeRecords.map((g, idx) => {
      const std = students.find(s => s.id === g.studentId);
      return {
        No: idx + 1,
        NIS: std?.nis || '-',
        Nama_Siswa: std?.name || '-',
        Kelas: g.className,
        Rerata_Tugas: Math.round(g.tugasScores.reduce((a, b) => a + b, 0) / g.tugasScores.length),
        Rerata_Formatif: Math.round(g.formatifScores.reduce((a, b) => a + b, 0) / g.formatifScores.length),
        STS: g.stsScore,
        SAS: g.sasScore,
        Nilai_Akhir: g.finalGrade,
        Predikat: g.predicate,
        Deskripsi_Capaian: g.achievementDescription,
      };
    });
    DataStore.exportToExcel(data, 'Daftar_Nilai', 'Daftar_Nilai_Rapor_Kelas_VIIA');
  };

  // EXPORT EXCEL ANALISIS BUTIR SOAL
  const exportAnalisisSoalExcel = () => {
    const data = analisisSoalList.map((a) => ({
      No_Soal: a.itemNumber,
      Judul_Ujian: a.examTitle,
      Kelas: a.className,
      Tingkat_Kesukaran_P: a.difficultyIndex,
      Kategori_Kesukaran: a.difficultyCategory,
      Daya_Pembeda_D: a.discriminatingPower,
      Efektivitas_Pengecoh: a.distractorEfficiency,
      Rekomendasi_Soal: a.recommendation,
    }));
    DataStore.exportToExcel(data, 'Analisis_Butir_Soal', 'Analisis_Butir_Soal_STS');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* HEADER SECTION */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-amber-600 text-white flex items-center justify-center font-black text-lg shadow-md shadow-amber-500/20">
              B3
            </div>
            <div>
              <span className="text-[11px] font-extrabold text-amber-600 uppercase tracking-wider bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                BUKU KERJA 3
              </span>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-0.5">
                Administrasi Penilaian
              </h1>
              <p className="text-xs text-slate-500">
                Daftar Nilai, Rapor, Asesmen Diagnostik, Formatif, Sumatif, Butir Soal, dan Program Remedial
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={exportNilaiExcel}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-50 border border-emerald-500/30 text-emerald-700 text-xs font-bold hover:bg-emerald-100 transition"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
              <span>Ekspor Nilai Excel</span>
            </button>
            <button
              onClick={() => {
                DataStore.generateFormalPdf({
                  title: 'LEMBAR PENILAIAN HASIL BELAJAR SISWA',
                  subTitle: `MATA PELAJARAN ${DataStore.getProfile().subject.toUpperCase()} — SEMESTER ${DataStore.getProfile().semester.toUpperCase()}`,
                  columns: ['No', 'NIS', 'Nama Siswa', 'Tugas', 'Formatif', 'STS', 'SAS', 'Nilai Akhir', 'Predikat'],
                  rows: gradeRecords.map((g, idx) => {
                    const std = students.find(s => s.id === g.studentId);
                    return [
                      idx + 1,
                      std?.nis || '-',
                      std?.name || '-',
                      Math.round(g.tugasScores.reduce((a, b) => a + b, 0) / g.tugasScores.length),
                      Math.round(g.formatifScores.reduce((a, b) => a + b, 0) / g.formatifScores.length),
                      g.stsScore,
                      g.sasScore,
                      g.finalGrade,
                      g.predicate,
                    ];
                  }),
                });
              }}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-600 text-white text-xs font-bold shadow hover:bg-amber-500 transition"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Cetak Rapor Nilai PDF</span>
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
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                  isActive
                    ? 'bg-amber-600 text-white shadow-md shadow-amber-500/20'
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
      {/* 1. DAFTAR NILAI & RAPOR */}
      {/* ========================================================= */}
      {activeSubTab === 'nilai' && (
        <div className="space-y-4">
          {/* Automatic pipeline callout */}
          <div className="p-3.5 rounded-xl bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-amber-500/10 border border-amber-300 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5">
              <Sparkles className="w-5 h-5 text-amber-600 shrink-0" />
              <div>
                <span className="font-bold text-slate-900 block">
                  Sistem Satu Kali Input, Banyak Dokumen Otomatis:
                </span>
                <span className="text-slate-600">
                  Data nilai otomatis menghitung Nilai Akhir (NA), predikat, dan menyusun program Remedial (&lt; 75) & Pengayaan (&ge; 75).
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => setShowStudentModal(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 font-bold shadow-sm transition"
              >
                <Plus className="w-3.5 h-3.5 text-blue-600" />
                <span>+ Siswa Baru (Master)</span>
              </button>
              <button
                onClick={handleAutoGenerateRemedial}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-bold shadow transition"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Susun Remedial & Pengayaan Otomatis</span>
              </button>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Daftar Nilai Peserta Didik (Kelas VII-A)</h3>
              <p className="text-xs text-slate-500">Bobot Nilai: Tugas (20%), Formatif (30%), STS (25%), SAS (25%) — Perhitungan Otomatis</p>
            </div>
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              KKTP Minimal: 75
            </span>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-800 font-bold uppercase text-[11px]">
                  <tr>
                    <th className="px-3 py-3 w-10 text-center">No</th>
                    <th className="px-3 py-3 w-20">NIS</th>
                    <th className="px-4 py-3">Nama Lengkap Siswa</th>
                    <th className="px-2 py-3 text-center">Tugas (Rerata)</th>
                    <th className="px-2 py-3 text-center">Formatif (Rerata)</th>
                    <th className="px-2 py-3 text-center">STS</th>
                    <th className="px-2 py-3 text-center">SAS</th>
                    <th className="px-3 py-3 text-center font-black text-amber-700 bg-amber-50/60">Nilai Akhir</th>
                    <th className="px-2 py-3 text-center">Predikat</th>
                    <th className="px-4 py-3">Deskripsi Capaian Kompetensi</th>
                    <th className="px-2 py-3 text-center w-16">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {gradeRecords.map((g, idx) => {
                    const std = students.find(s => s.id === g.studentId);
                    const avgT = Math.round(g.tugasScores.reduce((a, b) => a + b, 0) / g.tugasScores.length);
                    const avgF = Math.round(g.formatifScores.reduce((a, b) => a + b, 0) / g.formatifScores.length);

                    return (
                      <tr key={g.id} className="hover:bg-slate-50 transition">
                        <td className="px-3 py-3 text-center font-bold text-slate-500">{idx + 1}</td>
                        <td className="px-3 py-3 font-mono text-slate-600">{std?.nis || '-'}</td>
                        <td className="px-4 py-3 font-bold text-slate-900">{std?.name || '-'}</td>
                        <td className="px-2 py-3 text-center font-mono">{avgT}</td>
                        <td className="px-2 py-3 text-center font-mono">{avgF}</td>
                        <td className="px-2 py-3 text-center font-mono">{g.stsScore}</td>
                        <td className="px-2 py-3 text-center font-mono">{g.sasScore}</td>
                        <td className="px-3 py-3 text-center font-mono font-black text-sm text-amber-800 bg-amber-50/40">
                          {g.finalGrade}
                        </td>
                        <td className="px-2 py-3 text-center">
                          <span className={`px-2 py-0.5 rounded font-black text-xs ${
                            g.predicate === 'A' ? 'bg-emerald-100 text-emerald-800' :
                            g.predicate === 'B' ? 'bg-blue-100 text-blue-800' :
                            'bg-amber-100 text-amber-800'
                          }`}>
                            {g.predicate}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-[11px] text-slate-600 leading-snug max-w-xs">
                          {g.achievementDescription}
                        </td>
                        <td className="px-2 py-3 text-center">
                          <button
                            onClick={() => setEditingGrade(g)}
                            className="p-1.5 text-slate-400 hover:text-amber-600 rounded-lg hover:bg-slate-100"
                            title="Edit Skor Nilai"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 2. ASESMEN DIAGNOSTIK */}
      {/* ========================================================= */}
      {activeSubTab === 'diagnostik' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Hasil Pemetaan Asesmen Diagnostik Awal</h3>
              <p className="text-xs text-slate-500">Diagnostik kognitif dan non-kognitif (gaya belajar, kesiapan awal)</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {diagnostikList.map((d) => (
              <div key={d.id} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-3">
                    <span className="text-[10px] font-bold uppercase bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded">
                      Tipe: {d.type}
                    </span>
                    <span className="text-xs text-slate-500">Kelas: {d.className}</span>
                  </div>

                  <h4 className="text-sm font-bold text-slate-900">{d.topic}</h4>

                  {/* Gaya Belajar Distribution */}
                  {d.type === 'Non-Kognitif' && (
                    <div className="my-4 p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs">
                      <strong className="block mb-2 text-slate-800">Distribusi Profil Gaya Belajar:</strong>
                      <div className="grid grid-cols-3 gap-2 text-center">
                        <div className="p-2 bg-white rounded-lg border">
                          <span className="text-[10px] text-slate-500 block">Visual</span>
                          <span className="font-black text-blue-600 text-base">{d.learningStyleDistribution.visual} Siswa</span>
                        </div>
                        <div className="p-2 bg-white rounded-lg border">
                          <span className="text-[10px] text-slate-500 block">Auditori</span>
                          <span className="font-black text-emerald-600 text-base">{d.learningStyleDistribution.auditory} Siswa</span>
                        </div>
                        <div className="p-2 bg-white rounded-lg border">
                          <span className="text-[10px] text-slate-500 block">Kinestetik</span>
                          <span className="font-black text-amber-600 text-base">{d.learningStyleDistribution.kinesthetic} Siswa</span>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="mt-3 text-xs space-y-2">
                    <div>
                      <strong className="text-slate-900">Temuan Analisis:</strong>
                      <p className="text-slate-600 mt-0.5">{d.findingsSummary}</p>
                    </div>
                    <div className="p-3 bg-amber-50/50 rounded-lg border border-amber-100">
                      <strong className="text-amber-900">Rekomendasi Pembelajaran Berdiferensiasi:</strong>
                      <p className="text-slate-700 mt-0.5 whitespace-pre-line">{d.differentiationRecommendations}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 5. BANK INSTRUMEN ASESMEN */}
      {/* ========================================================= */}
      {activeSubTab === 'instrumen' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Bank Instrumen Soal & Asesmen</h3>
              <p className="text-xs text-slate-500">Pilihan Ganda, PG Kompleks, Benar/Salah, Menjodohkan, Uraian, dan Praktik</p>
            </div>
            <button
              onClick={() => alert('Fitur tambah butir instrumen soal baru')}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-amber-600 text-white text-xs font-bold hover:bg-amber-500 transition shadow"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Tambah Butir Soal</span>
            </button>
          </div>

          <div className="space-y-4">
            {instrumenList.map((inst, idx) => (
              <div key={inst.id} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs bg-slate-900 text-white px-2 py-0.5 rounded">
                      Soal No. {idx + 1}
                    </span>
                    <span className="text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                      {inst.type}
                    </span>
                    <span className="text-[11px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                      Level: {inst.cognitiveLevel}
                    </span>
                  </div>
                  <span className="text-xs text-slate-500 font-mono">{inst.tpCode}</span>
                </div>

                <div className="text-xs text-slate-800 leading-relaxed whitespace-pre-line mb-3 font-medium">
                  {inst.questionText}
                </div>

                {inst.options && (
                  <div className="space-y-1.5 pl-4 mb-3 text-xs text-slate-700">
                    {inst.options.map((opt, i) => (
                      <div key={i} className="p-1.5 rounded bg-slate-50 border border-slate-100">
                        {opt}
                      </div>
                    ))}
                  </div>
                )}

                <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-100 text-xs">
                  <strong className="text-emerald-900">Kunci Jawaban:</strong> {inst.correctAnswer}
                  <div className="text-emerald-800 mt-1">Pedoman Penskoran: {inst.scoringGuide}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 6. REMEDIAL & PENGAYAAN */}
      {/* ========================================================= */}
      {activeSubTab === 'remedial' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Program Remedial & Pengayaan Hasil Asesmen</h3>
              <p className="text-xs text-slate-500">Tindak lanjut bagi peserta didik belum tuntas (&lt; 75) dan pengayaan siswa tuntas</p>
            </div>
            <button
              onClick={() => {
                DataStore.generateFormalPdf({
                  title: 'LAPORAN PROGRAM REMEDIAL DAN PENGAYAAN',
                  columns: ['Program', 'Materi / TP', 'Daftar Siswa', 'Bentuk Pelaksanaan', 'Hasil Evaluasi'],
                  rows: remedialList.map(r => [
                    r.programType,
                    `${r.tpCode} - ${r.material}`,
                    r.studentNames.join(', '),
                    r.activityPlan,
                    r.evaluationResult,
                  ]),
                });
              }}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-amber-600 text-white text-xs font-bold hover:bg-amber-500 transition shadow"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Cetak Program Remedial</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {remedialList.map((r) => (
              <div key={r.id} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-3">
                    <span className={`text-xs font-bold px-2.5 py-0.5 rounded ${
                      r.programType === 'Remedial' ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      Program {r.programType}
                    </span>
                    <span className="text-xs text-slate-500">{r.executionDate}</span>
                  </div>

                  <h4 className="text-sm font-bold text-slate-900">{r.material}</h4>
                  <div className="text-xs text-slate-500 font-mono mt-0.5">{r.tpCode} (Standar KKTP: {r.kktpStandard})</div>

                  <div className="mt-3 text-xs space-y-2">
                    <div>
                      <strong className="text-slate-900">Daftar Peserta Didik:</strong>
                      <div className="flex flex-wrap gap-1.5 mt-1">
                        {r.studentNames.map((name, i) => (
                          <span key={i} className="bg-slate-100 text-slate-800 px-2 py-0.5 rounded-md text-[11px] font-medium">
                            {name}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                      <strong>Rencana Kegiatan:</strong>
                      <p className="text-slate-600 mt-0.5">{r.activityPlan}</p>
                    </div>

                    <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-100">
                      <strong className="text-emerald-900">Hasil Evaluasi:</strong>
                      <p className="text-emerald-800 mt-0.5">{r.evaluationResult}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 7. ANALISIS BUTIR SOAL */}
      {/* ========================================================= */}
      {activeSubTab === 'analisis_soal' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Analisis Kualitas Butir Soal Asesmen</h3>
              <p className="text-xs text-slate-500">Tingkat Kesukaran (P), Daya Pembeda (D), Efektivitas Distraktor berdasarkan respon riil</p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={exportAnalisisSoalExcel}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-emerald-500/30 bg-emerald-50 text-emerald-700 text-xs font-semibold hover:bg-emerald-100 transition"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
                <span>Ekspor Excel</span>
              </button>
              <button
                onClick={() => {
                  DataStore.generateFormalPdf({
                    title: 'ANALISIS KUALITAS BUTIR SOAL ASESMEN',
                    subTitle: `SUMATIF TENGAH SEMESTER — KELAS VII-A`,
                    columns: ['No Soal', 'Indeks Kesukaran (P)', 'Kategori', 'Daya Pembeda (D)', 'Fungsi Pengecoh', 'Rekomendasi'],
                    rows: analisisSoalList.map(a => [
                      `Butir ${a.itemNumber}`,
                      a.difficultyIndex,
                      a.difficultyCategory,
                      a.discriminatingPower,
                      a.distractorEfficiency,
                      a.recommendation,
                    ]),
                  });
                }}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-amber-600 text-white text-xs font-bold hover:bg-amber-500 transition shadow"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Cetak Hasil Analisis</span>
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-800 font-bold uppercase text-[11px]">
                <tr>
                  <th className="px-4 py-3 w-16 text-center">No Soal</th>
                  <th className="px-4 py-3 text-center">Tingkat Kesukaran (P)</th>
                  <th className="px-4 py-3 text-center">Kategori</th>
                  <th className="px-4 py-3 text-center">Daya Pembeda (D)</th>
                  <th className="px-4 py-3">Efektivitas Distraktor</th>
                  <th className="px-4 py-3 text-center">Rekomendasi Soal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {analisisSoalList.map((a) => (
                  <tr key={a.id} className="hover:bg-slate-50 transition">
                    <td className="px-4 py-3 text-center font-bold text-slate-900">Butir {a.itemNumber}</td>
                    <td className="px-4 py-3 text-center font-mono font-bold">{a.difficultyIndex}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                        a.difficultyCategory === 'Sedang' ? 'bg-blue-50 text-blue-700' :
                        a.difficultyCategory === 'Mudah' ? 'bg-emerald-50 text-emerald-700' :
                        'bg-amber-50 text-amber-700'
                      }`}>
                        {a.difficultyCategory}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center font-mono font-bold text-emerald-700">
                      {a.discriminatingPower}
                    </td>
                    <td className="px-4 py-3 text-slate-600">{a.distractorEfficiency}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`px-2.5 py-1 rounded text-xs font-bold ${
                        a.recommendation === 'Diterima' ? 'bg-emerald-100 text-emerald-800' :
                        a.recommendation === 'Direvisi' ? 'bg-amber-100 text-amber-800' :
                        'bg-rose-100 text-rose-800'
                      }`}>
                        {a.recommendation}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 8. KISI-KISI SOAL UJIAN */}
      {/* ========================================================= */}
      {activeSubTab === 'kisi_kisi' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Kisi-Kisi Soal Asesmen Sumatif (STS)</h3>
              <p className="text-xs text-slate-500">Pemetaan indikator soal, materi pokok, level kognitif, dan bentuk soal</p>
            </div>
            <button
              onClick={() => {
                DataStore.generateFormalPdf({
                  title: 'KISI-KISI SOAL SUMATIF TENGAH SEMESTER (STS)',
                  columns: ['No', 'Tujuan Pembelajaran', 'Materi Pokok', 'Indikator Soal', 'Level', 'Bentuk Soal'],
                  rows: kisiKisiList.map((k, idx) => [
                    idx + 1,
                    k.tpCode,
                    k.material,
                    k.indicator,
                    k.cognitiveLevel,
                    k.questionForm,
                  ]),
                });
              }}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-amber-600 text-white text-xs font-bold hover:bg-amber-500 transition shadow"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Cetak Kisi-Kisi PDF</span>
            </button>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-800 font-bold uppercase text-[11px]">
                <tr>
                  <th className="px-4 py-3 w-12 text-center">No</th>
                  <th className="px-4 py-3 w-20">Kode TP</th>
                  <th className="px-4 py-3">Materi Pembelajaran</th>
                  <th className="px-4 py-3">Indikator Soal</th>
                  <th className="px-4 py-3 w-28 text-center">Level Kognitif</th>
                  <th className="px-4 py-3 w-32 text-center">Bentuk Soal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {kisiKisiList.map((k, idx) => (
                  <tr key={k.id} className="hover:bg-slate-50 transition">
                    <td className="px-4 py-3 text-center font-bold text-slate-500">{idx + 1}</td>
                    <td className="px-4 py-3 font-mono font-bold text-blue-600">{k.tpCode}</td>
                    <td className="px-4 py-3 font-semibold text-slate-900">{k.material}</td>
                    <td className="px-4 py-3 text-slate-700 leading-relaxed">{k.indicator}</td>
                    <td className="px-4 py-3 text-center font-semibold text-slate-800">{k.cognitiveLevel}</td>
                    <td className="px-4 py-3 text-center">
                      <span className="bg-slate-100 px-2 py-0.5 rounded text-[11px] font-medium text-slate-700">
                        {k.questionForm}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 9. ANALISIS HASIL BELAJAR SISWA */}
      {/* ========================================================= */}
      {activeSubTab === 'analisis_belajar' && (
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 mb-1">Rekapitulasi Ketuntasan Belajar Klasikal</h3>
            <p className="text-xs text-slate-500 mb-4">Analisis statistik hasil belajar seluruh peserta didik kelas VII-A</p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
              <div className="p-4 rounded-xl bg-blue-50 border border-blue-200">
                <span className="text-[11px] font-semibold text-blue-700 block">Jumlah Siswa</span>
                <span className="text-2xl font-black text-blue-900">{students.length} Orang</span>
              </div>
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200">
                <span className="text-[11px] font-semibold text-emerald-700 block">Tuntas KKTP (&gt;= 75)</span>
                <span className="text-2xl font-black text-emerald-900">
                  {gradeRecords.filter(g => g.finalGrade >= 75).length} Siswa (
                  {Math.round((gradeRecords.filter(g => g.finalGrade >= 75).length / students.length) * 100)}%)
                </span>
              </div>
              <div className="p-4 rounded-xl bg-rose-50 border border-rose-200">
                <span className="text-[11px] font-semibold text-rose-700 block">Belum Tuntas (&lt; 75)</span>
                <span className="text-2xl font-black text-rose-900">
                  {gradeRecords.filter(g => g.finalGrade < 75).length} Siswa
                </span>
              </div>
              <div className="p-4 rounded-xl bg-purple-50 border border-purple-200">
                <span className="text-[11px] font-semibold text-purple-700 block">Rata-rata Kelas</span>
                <span className="text-2xl font-black text-purple-900">
                  {Math.round(gradeRecords.reduce((a, b) => a + b.finalGrade, 0) / gradeRecords.length)}
                </span>
              </div>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs">
              <strong className="text-slate-900 block mb-1">Simpulan Pedagogis & Rekomendasi Guru:</strong>
              <p className="text-slate-700 leading-relaxed">
                Ketuntasan klasikal telah mencapai 87% (di atas batas minimal standar 85%). Siswa yang memerlukan bimbingan remidi terpusat pada aspek penulisan ejaan bermajas dan penggunaan kata konkret pada teks deskripsi. Pembelajaran berikutnya disarankan menambahkan latihan studi kasus kelompok kecil dengan lembar kerja bertingkat (scaffolding).
              </p>
            </div>

            <div className="mt-4 pt-4 border-t flex flex-col sm:flex-row items-center justify-between gap-3">
              <span className="text-xs text-slate-500 font-medium">
                Tindak Lanjut Otomatis: Hubungkan hasil analisis ini langsung ke program remedial & pengayaan.
              </span>
              <button
                type="button"
                onClick={handleAutoGenerateRemedial}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow transition"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Susun Program Tindak Lanjut & Remedial Otomatis &rarr;</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 10. PENUGASAN TERSTRUKTUR & TIDAK TERSTRUKTUR */}
      {/* ========================================================= */}
      {activeSubTab === 'tugas' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Penugasan Terstruktur dan Kegiatan Mandiri Tidak Terstruktur</h3>
              <p className="text-xs text-slate-500">Pelacakan penugasan portofolio, LKPD mandiri, dan proyek kelas</p>
            </div>
            <button
              onClick={() => alert('Tambah instrumen penugasan baru')}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-amber-600 text-white text-xs font-bold hover:bg-amber-500 transition shadow"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Buat Tugas Baru</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {tugasList.map((t) => (
              <div key={t.id} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-3">
                    <span className="text-[10px] font-bold uppercase bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded">
                      {t.type}
                    </span>
                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded ${
                      t.status === 'Selesai' ? 'bg-emerald-50 text-emerald-700' : 'bg-blue-50 text-blue-700'
                    }`}>
                      {t.status}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-slate-900">{t.title}</h4>
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100">
                    {t.description}
                  </p>

                  <div className="mt-3 text-xs grid grid-cols-2 gap-2 text-slate-500">
                    <div>Diberikan: {t.givenDate}</div>
                    <div>Batas Waktu: {t.dueDate}</div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-700">
                    Pengumpulan: {t.submissionCount} / {t.totalStudents} Siswa
                  </span>
                  <div className="w-24 bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-amber-500 h-full rounded-full"
                      style={{ width: `${(t.submissionCount / t.totalStudents) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL EDIT SKOR NILAI */}
      {/* ========================================================= */}
      {editingGrade && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="text-base font-bold text-slate-900 mb-2">
              Edit Skor Nilai: {students.find(s => s.id === editingGrade.studentId)?.name}
            </h3>
            <p className="text-xs text-slate-500 mb-4">Masukkan nilai skala 0 - 100 untuk seluruh komponen evaluasi.</p>

            <form onSubmit={handleSaveGradeModal} className="space-y-4 text-xs">
              <div>
                <strong className="block mb-1 text-slate-700">Tugas Mandiri 1 s.d. 4:</strong>
                <div className="grid grid-cols-4 gap-2">
                  <input name="t1" type="number" defaultValue={editingGrade.tugasScores[0]} className="border rounded p-1.5 text-center font-mono" placeholder="T1" required />
                  <input name="t2" type="number" defaultValue={editingGrade.tugasScores[1]} className="border rounded p-1.5 text-center font-mono" placeholder="T2" required />
                  <input name="t3" type="number" defaultValue={editingGrade.tugasScores[2]} className="border rounded p-1.5 text-center font-mono" placeholder="T3" required />
                  <input name="t4" type="number" defaultValue={editingGrade.tugasScores[3]} className="border rounded p-1.5 text-center font-mono" placeholder="T4" required />
                </div>
              </div>

              <div>
                <strong className="block mb-1 text-slate-700">Asesmen Formatif 1 s.d. 4:</strong>
                <div className="grid grid-cols-4 gap-2">
                  <input name="f1" type="number" defaultValue={editingGrade.formatifScores[0]} className="border rounded p-1.5 text-center font-mono" placeholder="F1" required />
                  <input name="f2" type="number" defaultValue={editingGrade.formatifScores[1]} className="border rounded p-1.5 text-center font-mono" placeholder="F2" required />
                  <input name="f3" type="number" defaultValue={editingGrade.formatifScores[2]} className="border rounded p-1.5 text-center font-mono" placeholder="F3" required />
                  <input name="f4" type="number" defaultValue={editingGrade.formatifScores[3]} className="border rounded p-1.5 text-center font-mono" placeholder="F4" required />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <strong className="block mb-1 text-slate-700">Sumatif Tengah Semester (STS):</strong>
                  <input name="sts" type="number" defaultValue={editingGrade.stsScore} className="w-full border rounded p-1.5 text-center font-mono font-bold" required />
                </div>
                <div>
                  <strong className="block mb-1 text-slate-700">Sumatif Akhir Semester (SAS):</strong>
                  <input name="sas" type="number" defaultValue={editingGrade.sasScore} className="w-full border rounded p-1.5 text-center font-mono font-bold" required />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setEditingGrade(null)}
                  className="px-4 py-2 border rounded-lg hover:bg-slate-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-600 text-white rounded-lg font-bold hover:bg-amber-500 shadow"
                >
                  Hitung & Simpan Nilai
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL TAMBAH SISWA BARU (SINGLE SOURCE OF TRUTH) */}
      {showStudentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="text-base font-bold text-slate-900 mb-1">
              Tambah Peserta Didik Baru (Master Siswa)
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Satu kali input: Siswa otomatis terdaftar di Daftar Hadir (Buku 2) dan Daftar Nilai (Buku 3).
            </p>

            <form onSubmit={handleAddStudent} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold block mb-1">NIS Siswa</label>
                  <input name="nis" placeholder="24016" required className="w-full border rounded-lg p-2 font-mono" />
                </div>
                <div>
                  <label className="font-semibold block mb-1">NISN</label>
                  <input name="nisn" placeholder="00987123..." className="w-full border rounded-lg p-2 font-mono" />
                </div>
              </div>

              <div>
                <label className="font-semibold block mb-1">Nama Lengkap Peserta Didik</label>
                <input name="name" placeholder="Nama lengkap siswa" required className="w-full border rounded-lg p-2 font-semibold" />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold block mb-1">Jenis Kelamin</label>
                  <select name="gender" className="w-full border rounded-lg p-2">
                    <option value="L">Laki-laki (L)</option>
                    <option value="P">Perempuan (P)</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold block mb-1">Kelas</label>
                  <input name="className" defaultValue="VII-A" required className="w-full border rounded-lg p-2" />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setShowStudentModal(false)}
                  className="px-4 py-2 border rounded-lg hover:bg-slate-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold shadow"
                >
                  Simpan & Sinkronkan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PRINT MODAL */}
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
