import React, { useState, useEffect } from 'react';
import {
  CalendarDays,
  Clock,
  FileSpreadsheet,
  FileText,
  CalendarCheck,
  ShieldCheck,
  Award,
  FileCheck,
  UserCheck,
  Users,
  ClipboardList,
  Library,
  MessageSquare,
  Plus,
  Trash2,
  Edit3,
  Printer,
  Search,
  Check,
  Calendar,
  AlertTriangle,
  Upload,
  BookOpen,
  Sparkles,
  X
} from 'lucide-react';
import { DataStore, defaultKodeEtik, defaultIkrarGuru, defaultTataTertibGuru } from '../../services/storage';
import {
  AcademicCalendarEvent,
  TeachingScheduleItem,
  TimeAllocationRPE,
  AnnualProgramItem,
  SemesterProgramItem,
  TeacherHabituationItem,
  StudentAttendanceRecord,
  TeachingJournalRecord,
  ReferenceDocument,
  TeacherConsultationRecord,
  Student,
  SemesterType
} from '../../types';
import { PrintModal } from '../common/PrintModal';

interface Buku2ViewProps {
  initialSubTab?: string;
}

export const Buku2View: React.FC<Buku2ViewProps> = ({ initialSubTab = 'kaldik' }) => {
  const [activeSubTab, setActiveSubTab] = useState(initialSubTab);

  // States
  const [kaldikList, setKaldikList] = useState<AcademicCalendarEvent[]>(DataStore.getKaldik());
  const [jadwalList, setJadwalList] = useState<TeachingScheduleItem[]>(DataStore.getJadwal());
  const [rpeData, setRpeData] = useState<TimeAllocationRPE>(DataStore.getRPE());
  const [protaList, setProtaList] = useState<AnnualProgramItem[]>(DataStore.getProta());
  const [promesList, setPromesList] = useState<SemesterProgramItem[]>(DataStore.getPromes());
  const [pembiasaanList, setPembiasaanList] = useState<TeacherHabituationItem[]>(DataStore.getPembiasaan());
  const [students, setStudents] = useState<Student[]>(DataStore.getStudents());
  const [absensiList, setAbsensiList] = useState<StudentAttendanceRecord[]>(DataStore.getAbsensi());
  const [jurnalList, setJurnalList] = useState<TeachingJournalRecord[]>(DataStore.getJurnal());
  const [peganganList, setPeganganList] = useState<ReferenceDocument[]>(DataStore.getBukuPegangan());
  const [konsultasiList, setKonsultasiList] = useState<TeacherConsultationRecord[]>(DataStore.getKonsultasi());

  // Static texts
  const [kodeEtik, setKodeEtik] = useState(defaultKodeEtik);
  const [ikrarText, setIkrarText] = useState(defaultIkrarGuru);
  const [tataTertibText, setTataTertibText] = useState(defaultTataTertibGuru);

  // Print modal
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [printDoc, setPrintDoc] = useState<{ title: string; subTitle?: string; content: React.ReactNode }>({
    title: '',
    content: null,
  });

  // Modal form for adding/editing
  const [showAddModal, setShowAddModal] = useState(false);
  const [modalType, setModalType] = useState<string>('');
  const [showStudentModal, setShowStudentModal] = useState(false);

  const handleAddStudentBuku2 = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const newStudent: Student = {
      id: `std-${Date.now()}`,
      nis: fd.get('nis') as string,
      nisn: (fd.get('nisn') as string) || `00${Math.floor(10000000 + Math.random() * 90000000)}`,
      name: fd.get('name') as string,
      gender: (fd.get('gender') as 'L' | 'P') || 'L',
      className: (fd.get('className') as string) || 'VII-A',
    };
    const updated = [...students, newStudent];
    DataStore.saveStudents(updated);
    setStudents(updated);
    setShowStudentModal(false);
    alert(`Sistem Satu Kali Input: Peserta didik "${newStudent.name}" berhasil ditambahkan! Data langsung sinkron di Daftar Hadir (Buku 2) dan Daftar Nilai (Buku 3).`);
  };

  const handleDeleteStudentBuku2 = (id: string, name: string) => {
    if (confirm(`Hapus siswa "${name}" dari master data? Siswa juga otomatis disinkronkan terhapus dari Daftar Hadir dan Daftar Nilai.`)) {
      const updated = students.filter(s => s.id !== id);
      DataStore.saveStudents(updated);
      setStudents(updated);
    }
  };

  useEffect(() => {
    setActiveSubTab(initialSubTab);
  }, [initialSubTab]);

  useEffect(() => {
    const handleUpdate = () => {
      setKaldikList(DataStore.getKaldik());
      setJadwalList(DataStore.getJadwal());
      setRpeData(DataStore.getRPE());
      setProtaList(DataStore.getProta());
      setPromesList(DataStore.getPromes());
      setPembiasaanList(DataStore.getPembiasaan());
      setStudents(DataStore.getStudents());
      setAbsensiList(DataStore.getAbsensi());
      setJurnalList(DataStore.getJurnal());
      setPeganganList(DataStore.getBukuPegangan());
      setKonsultasiList(DataStore.getKonsultasi());
    };
    window.addEventListener('bkgd-store-update', handleUpdate);
    return () => window.removeEventListener('bkgd-store-update', handleUpdate);
  }, []);

  const subTabs = [
    { id: 'kaldik', label: '1. Kalender Pendidikan', icon: CalendarDays },
    { id: 'jadwal', label: '2. Jadwal & SK Mengajar', icon: Clock },
    { id: 'rpe', label: '3. Alokasi Waktu (RPE)', icon: FileSpreadsheet },
    { id: 'prota', label: '4. Program Tahunan (Prota)', icon: FileText },
    { id: 'promes', label: '5. Program Semester (Promes)', icon: CalendarCheck },
    { id: 'kode_etik', label: '6. Kode Etik Guru', icon: ShieldCheck },
    { id: 'ikrar', label: '7. Ikrar Guru', icon: Award },
    { id: 'tata_tertib', label: '8. Tata Tertib', icon: FileCheck },
    { id: 'pembiasaan', label: '9. Pembiasaan Guru', icon: UserCheck },
    { id: 'absensi', label: '10. Daftar Hadir Siswa', icon: Users },
    { id: 'jurnal', label: '11. Jurnal Mengajar Harian', icon: ClipboardList },
    { id: 'buku_pegangan', label: '12. Buku Pegangan Guru', icon: Library },
    { id: 'konsultasi', label: '13. Buku Konsultasi Guru', icon: MessageSquare },
  ];

  // ============================
  // KALDIK HELPERS
  // ============================
  const handleAddKaldik = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const newEvt: AcademicCalendarEvent = {
      id: `kaldik-${Date.now()}`,
      dateStart: fd.get('dateStart') as string,
      dateEnd: fd.get('dateEnd') as string,
      title: fd.get('title') as string,
      category: fd.get('category') as any,
      semester: fd.get('semester') as any,
      notes: fd.get('notes') as string,
    };
    const updated = [...kaldikList, newEvt];
    DataStore.saveKaldik(updated);
    setKaldikList(updated);
    setShowAddModal(false);
  };

  // ============================
  // JURNAL HELPERS
  // ============================
  const handleAddJurnal = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const newJurnal: TeachingJournalRecord = {
      id: `jrn-${Date.now()}`,
      date: fd.get('date') as string,
      periodTime: fd.get('periodTime') as string,
      className: fd.get('className') as string,
      subject: DataStore.getProfile().subject,
      topicMaterial: fd.get('topicMaterial') as string,
      learningObjective: fd.get('learningObjective') as string,
      methodUsed: fd.get('methodUsed') as string,
      presentCount: Number(fd.get('presentCount')) || 15,
      absentCount: Number(fd.get('absentCount')) || 0,
      teachingNotes: fd.get('teachingNotes') as string,
      challenges: fd.get('challenges') as string,
      followUp: fd.get('followUp') as string,
    };
    const updated = [newJurnal, ...jurnalList];
    DataStore.saveJurnal(updated);
    setJurnalList(updated);

    if (fd.get('createReflection') === 'on') {
      DataStore.createReflectionFromJournal(newJurnal);
      alert(`Sistem Satu Kali Input: Catatan KBM materi "${newJurnal.topicMaterial}" berhasil disimpan dan otomatis diteruskan menjadi Jurnal Refleksi di Buku 4!`);
    }

    setShowAddModal(false);
  };

  // ============================
  // ABSENSI TOGGLE
  // ============================
  const updateAttendanceStatus = (studentId: string, status: 'H' | 'S' | 'I' | 'A') => {
    const today = new Date().toISOString().split('T')[0];
    const existingIdx = absensiList.findIndex(a => a.studentId === studentId && a.date === today);

    let updated: StudentAttendanceRecord[];
    if (existingIdx >= 0) {
      updated = [...absensiList];
      updated[existingIdx] = { ...updated[existingIdx], status };
    } else {
      updated = [
        ...absensiList,
        {
          id: `att-${Date.now()}-${studentId}`,
          date: today,
          className: 'VII-A',
          studentId,
          status,
        },
      ];
    }
    DataStore.saveAbsensi(updated);
    setAbsensiList(updated);
  };

  // ============================
  // EXCEL EXPORTS
  // ============================
  const exportAbsensiExcel = () => {
    const data = students.map((std, idx) => {
      const studentRecords = absensiList.filter(a => a.studentId === std.id);
      const h = studentRecords.filter(a => a.status === 'H').length;
      const s = studentRecords.filter(a => a.status === 'S').length;
      const i = studentRecords.filter(a => a.status === 'I').length;
      const a = studentRecords.filter(a => a.status === 'A').length;
      const total = h + s + i + a;
      const pct = total > 0 ? Math.round((h / total) * 100) : 100;

      return {
        No: idx + 1,
        NIS: std.nis,
        NISN: std.nisn,
        Nama_Peserta_Didik: std.name,
        L_P: std.gender,
        Kelas: std.className,
        Hadir: h,
        Sakit: s,
        Izin: i,
        Alpa: a,
        Persentase_Kehadiran: `${pct}%`,
      };
    });
    DataStore.exportToExcel(data, 'Daftar_Hadir', 'Daftar_Hadir_Peserta_Didik_VIIA');
  };

  const exportJurnalExcel = () => {
    const data = jurnalList.map((j, idx) => ({
      No: idx + 1,
      Tanggal: j.date,
      Jam_Ke: j.periodTime,
      Kelas: j.className,
      Materi_Pembelajaran: j.topicMaterial,
      Tujuan_Pembelajaran: j.learningObjective,
      Metode_KBM: j.methodUsed,
      Jml_Hadir: j.presentCount,
      Jml_Absen: j.absentCount,
      Catatan_Pembelajaran: j.teachingNotes,
      Kendala: j.challenges,
      Tindak_Lanjut: j.followUp,
    }));
    DataStore.exportToExcel(data, 'Jurnal_Mengajar', 'Jurnal_Harian_Mengajar_Guru');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* HEADER SECTION */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black text-lg shadow-md shadow-emerald-500/20">
              B2
            </div>
            <div>
              <span className="text-[11px] font-extrabold text-emerald-600 uppercase tracking-wider bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                BUKU KERJA 2
              </span>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-0.5">
                Administrasi Guru
              </h1>
              <p className="text-xs text-slate-500">
                Kaldik, SK Mengajar, RPE, Prota, Promes, Kode Etik, Ikrar, Tata Tertib, Absensi, dan Jurnal Harian
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                DataStore.generateFormalPdf({
                  title: 'REKAP ADMINISTRASI BUKU 2 GURU',
                  subTitle: `SEMESTER ${DataStore.getProfile().semester.toUpperCase()} — T.P. ${DataStore.getProfile().academicYear}`,
                  columns: ['No', 'Komponen Dokumen', 'Status Kelengkapan', 'Keterangan'],
                  rows: [
                    ['1', 'Kalender Pendidikan', 'Lengkap', `${kaldikList.length} agenda kegiatan terdata`],
                    ['2', 'SK Mengajar & Jadwal Mingguan', 'Lengkap', `${jadwalList.length} sesi mengajar terjadwal`],
                    ['3', 'Alokasi Waktu (RPE)', 'Lengkap', `${rpeData.effectiveWeeks} pekan efektif`],
                    ['4', 'Program Tahunan (Prota)', 'Lengkap', `${protaList.length} unit materi terdistribusi`],
                    ['5', 'Program Semester (Promes)', 'Lengkap', 'Matriks bulanan siap'],
                    ['6', 'Kode Etik Guru Indonesia', 'Lengkap', '9 Pasal tertera'],
                    ['7', 'Ikrar Guru Indonesia', 'Lengkap', 'Format baku'],
                    ['8', 'Tata Tertib Guru', 'Lengkap', 'Standar operasional'],
                    ['9', 'Pembiasaan Guru', 'Lengkap', `${pembiasaanList.length} program pembiasaan`],
                    ['10', 'Daftar Hadir Siswa', 'Lengkap', `${students.length} siswa kelas VII-A`],
                    ['11', 'Jurnal Mengajar Guru', 'Lengkap', `${jurnalList.length} catatan tatap muka`],
                    ['12', 'Buku Pegangan Guru', 'Lengkap', `${peganganList.length} referensi digital`],
                    ['13', 'Buku Konsultasi Kepala Sekolah', 'Lengkap', `${konsultasiList.length} catatan bimbingan`],
                  ],
                });
              }}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold shadow hover:bg-emerald-600 transition"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Cetak Rekap Buku 2</span>
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
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/20'
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
      {/* 1. KALENDER PENDIDIKAN (KALDIK) */}
      {/* ========================================================= */}
      {activeSubTab === 'kaldik' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-slate-200">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Agenda Kalender Pendidikan (Kaldik)</h3>
              <p className="text-xs text-slate-500">Jadwal hari efektif, hari libur nasional, STS, SAS, dan pembagian rapor</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setModalType('kaldik');
                  setShowAddModal(true);
                }}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-500 transition shadow"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Tambah Agenda</span>
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-800 font-bold uppercase text-[11px]">
                <tr>
                  <th className="px-4 py-3">Rentang Tanggal</th>
                  <th className="px-4 py-3">Nama Agenda / Kegiatan</th>
                  <th className="px-4 py-3">Kategori</th>
                  <th className="px-4 py-3">Semester</th>
                  <th className="px-4 py-3">Catatan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {kaldikList.map((k) => (
                  <tr key={k.id} className="hover:bg-slate-50 transition">
                    <td className="px-4 py-3 font-mono font-medium text-slate-900">
                      {k.dateStart} {k.dateEnd !== k.dateStart ? `s.d. ${k.dateEnd}` : ''}
                    </td>
                    <td className="px-4 py-3 font-semibold text-slate-900">
                      {k.title}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        k.category === 'Hari Libur Nasional' ? 'bg-rose-50 text-rose-700 border border-rose-200' :
                        k.category === 'Penilaian / Asesmen' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                        k.category === 'Hari Efektif' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                        'bg-slate-100 text-slate-700'
                      }`}>
                        {k.category}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-medium text-slate-600">
                      {k.semester}
                    </td>
                    <td className="px-4 py-3 text-slate-500">
                      {k.notes || '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 2. SK MENGAJAR & JADWAL MINGGUAN */}
      {/* ========================================================= */}
      {activeSubTab === 'jadwal' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900">SK Mengajar & Jadwal Pelajaran Mingguan</h3>
              <p className="text-xs text-slate-500">Beban mengajar resmi: 24 JP per minggu</p>
            </div>
            <button
              onClick={() => {
                DataStore.generateFormalPdf({
                  title: 'JADWAL MENGAJAR GURU MINGGUAN',
                  subTitle: `SEMESTER ${DataStore.getProfile().semester.toUpperCase()} — T.P. ${DataStore.getProfile().academicYear}`,
                  columns: ['Hari', 'Waktu / Jam Ke-', 'Alokasi', 'Kelas', 'Mata Pelajaran', 'Ruang'],
                  rows: jadwalList.map(j => [
                    j.day,
                    j.periodTime,
                    `${j.periodHours} JP`,
                    j.className,
                    j.subject,
                    j.room || '-',
                  ]),
                });
              }}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-500 transition shadow"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Cetak Jadwal Mengajar</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'].map((day) => {
              const daySchedules = jadwalList.filter(j => j.day === day);
              return (
                <div key={day} className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-3">
                    <span className="font-bold text-sm text-slate-900">{day}</span>
                    <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                      {daySchedules.reduce((acc, c) => acc + c.periodHours, 0)} JP
                    </span>
                  </div>

                  {daySchedules.length === 0 ? (
                    <p className="text-xs text-slate-400 italic py-4 text-center">Tidak ada jam tatap muka</p>
                  ) : (
                    <div className="space-y-2">
                      {daySchedules.map((s) => (
                        <div key={s.id} className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 text-xs">
                          <div className="flex items-center justify-between font-bold text-slate-900">
                            <span>{s.className}</span>
                            <span className="font-mono text-emerald-600">{s.periodTime}</span>
                          </div>
                          <div className="text-[11px] text-slate-600 mt-1">
                            {s.subject} ({s.periodHours} JP)
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 3. ALOKASI WAKTU / RPE */}
      {/* ========================================================= */}
      {activeSubTab === 'rpe' && (
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Rincian Pekan Efektif (RPE) Semester Ganjil</h3>
                <p className="text-xs text-slate-500">Perhitungan distribusi pekan efektif dan tidak efektif pembelajaran</p>
              </div>
              <button
                onClick={() => {
                  DataStore.generateFormalPdf({
                    title: 'RINCIAN PEKAN EFEKTIF (RPE)',
                    subTitle: `SEMESTER ${rpeData.semester.toUpperCase()} — T.P. ${DataStore.getProfile().academicYear}`,
                    columns: ['Uraian Distribusi', 'Jumlah Pekan / Jam'],
                    rows: [
                      ['Jumlah Pekan dalam Semester', `${rpeData.totalWeeks} Pekan`],
                      ...rpeData.ineffectiveWeeks.map(w => [`Pekan Tidak Efektif: ${w.reason}`, `${w.count} Pekan`]),
                      ['Jumlah Pekan Efektif KBM', `${rpeData.effectiveWeeks} Pekan`],
                      ['Beban Jam Per Minggu', `${rpeData.hoursPerWeek} JP`],
                      ['Total Jam Pelajaran Efektif (JP)', `${rpeData.totalEffectiveHours} JP`],
                      ...rpeData.hourDistribution.map(d => [`Alokasi: ${d.purpose}`, `${d.allocatedHours} JP`]),
                    ],
                  });
                }}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-500 transition shadow"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Cetak RPE</span>
              </button>
            </div>

            {/* Metric Summary */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
              <div className="p-3 rounded-xl bg-blue-50 border border-blue-200">
                <span className="text-[11px] font-semibold text-blue-700 block">Total Pekan Semester</span>
                <span className="text-xl font-black text-blue-900">{rpeData.totalWeeks} Pekan</span>
              </div>
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200">
                <span className="text-[11px] font-semibold text-rose-700 block">Pekan Tidak Efektif</span>
                <span className="text-xl font-black text-rose-900">
                  {rpeData.ineffectiveWeeks.reduce((acc, c) => acc + c.count, 0)} Pekan
                </span>
              </div>
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200">
                <span className="text-[11px] font-semibold text-emerald-700 block">Pekan Efektif KBM</span>
                <span className="text-xl font-black text-emerald-900">{rpeData.effectiveWeeks} Pekan</span>
              </div>
              <div className="p-3 rounded-xl bg-purple-50 border border-purple-200">
                <span className="text-[11px] font-semibold text-purple-700 block">Total Jam Efektif</span>
                <span className="text-xl font-black text-purple-900">{rpeData.totalEffectiveHours} JP</span>
              </div>
            </div>

            {/* Distribution Table */}
            <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
              <div className="bg-slate-50 px-4 py-2.5 font-bold text-slate-800 border-b border-slate-200">
                Distribusi Jam Pelajaran Efektif per Lingkup Materi
              </div>
              <div className="divide-y divide-slate-100">
                {rpeData.hourDistribution.map((d, i) => (
                  <div key={i} className="px-4 py-2.5 flex items-center justify-between hover:bg-slate-50">
                    <span className="text-slate-800 font-medium">{d.purpose}</span>
                    <span className="font-mono font-bold text-emerald-700">{d.allocatedHours} JP</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 4. PROGRAM TAHUNAN (PROTA) */}
      {/* ========================================================= */}
      {activeSubTab === 'prota' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Program Tahunan (Prota)</h3>
              <p className="text-xs text-slate-500">Distribusi alokasi waktu satu tahun ajaran (Ganjil & Genap)</p>
            </div>
            <button
              onClick={() => {
                DataStore.generateFormalPdf({
                  title: 'PROGRAM TAHUNAN (PROTA)',
                  subTitle: `MATA PELAJARAN ${DataStore.getProfile().subject.toUpperCase()} — T.P. ${DataStore.getProfile().academicYear}`,
                  columns: ['No', 'Semester', 'Materi Pokok Pembelajaran', 'Alokasi Waktu', 'Periode Pelaksanaan'],
                  rows: protaList.map((p, idx) => [
                    idx + 1,
                    p.semester,
                    p.materialUnit,
                    `${p.allocatedHours} JP`,
                    p.timeframe,
                  ]),
                });
              }}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-500 transition shadow"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Cetak PDF Prota</span>
            </button>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-800 font-bold uppercase text-[11px]">
                <tr>
                  <th className="px-4 py-3 w-12 text-center">No</th>
                  <th className="px-4 py-3 w-28">Semester</th>
                  <th className="px-4 py-3">Materi Pokok & Ringkasan TP</th>
                  <th className="px-4 py-3 w-28 text-center">Alokasi</th>
                  <th className="px-4 py-3 w-40">Perkiraan Waktu</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {protaList.map((p, idx) => (
                  <tr key={p.id} className="hover:bg-slate-50 transition">
                    <td className="px-4 py-3 text-center font-bold text-slate-500">{idx + 1}</td>
                    <td className="px-4 py-3">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        p.semester === 'Ganjil' ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      }`}>
                        {p.semester}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-semibold text-slate-900">
                      {p.materialUnit}
                      <div className="text-[11px] text-slate-500 font-normal mt-0.5">{p.learningObjectivesSummary}</div>
                    </td>
                    <td className="px-4 py-3 text-center font-mono font-bold text-slate-900">{p.allocatedHours} JP</td>
                    <td className="px-4 py-3 font-medium text-slate-600">{p.timeframe}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 5. PROGRAM SEMESTER (PROMES) */}
      {/* ========================================================= */}
      {activeSubTab === 'promes' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Program Semester (Promes) Ganjil</h3>
              <p className="text-xs text-slate-500">Matriks distribusi mingguan Juli s.d. Desember</p>
            </div>
            <button
              onClick={() => {
                alert('Mencetak matriks Program Semester dalam format tabel horizontal A4');
              }}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-500 transition shadow"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Cetak Matriks Promes</span>
            </button>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 overflow-x-auto shadow-sm p-4">
            <table className="w-full text-left text-xs text-slate-700 border-collapse">
              <thead>
                <tr className="bg-slate-100 border border-slate-300 text-slate-800 font-bold text-[11px]">
                  <th className="p-2 border border-slate-300 w-12 text-center" rowSpan={2}>No</th>
                  <th className="p-2 border border-slate-300" rowSpan={2}>Materi Pokok Pembelajaran</th>
                  <th className="p-2 border border-slate-300 w-16 text-center" rowSpan={2}>JP</th>
                  <th className="p-1 border border-slate-300 text-center" colSpan={5}>Juli</th>
                  <th className="p-1 border border-slate-300 text-center" colSpan={5}>Agustus</th>
                  <th className="p-1 border border-slate-300 text-center" colSpan={5}>September</th>
                  <th className="p-1 border border-slate-300 text-center" colSpan={5}>Oktober</th>
                </tr>
                <tr className="bg-slate-50 border border-slate-300 text-[10px] text-center text-slate-600">
                  {[1, 2, 3, 4, 5, 1, 2, 3, 4, 5, 1, 2, 3, 4, 5, 1, 2, 3, 4, 5].map((w, idx) => (
                    <th key={idx} className="p-1 border border-slate-300 w-5">{w}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {promesList.map((pr) => (
                  <tr key={pr.id} className="hover:bg-slate-50">
                    <td className="p-2 border border-slate-300 text-center font-bold">{pr.no}</td>
                    <td className="p-2 border border-slate-300 font-medium text-slate-900">{pr.material}</td>
                    <td className="p-2 border border-slate-300 text-center font-mono font-bold">{pr.allocatedHours}</td>
                    {pr.distribution.slice(0, 4).map((d) => (
                      d.weeks.map((isSet, wIdx) => (
                        <td key={`${d.month}-${wIdx}`} className="p-1 border border-slate-300 text-center">
                          {isSet && (
                            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 inline-block" />
                          )}
                        </td>
                      ))
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 6. KODE ETIK GURU INDONESIA */}
      {/* ========================================================= */}
      {activeSubTab === 'kode_etik' && (
        <div className="space-y-4">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">{kodeEtik.title}</h3>
                <p className="text-xs text-slate-500">Pedoman moral dan etika profesi guru Indonesia</p>
              </div>
              <button
                onClick={() => {
                  DataStore.generateFormalPdf({
                    title: kodeEtik.title,
                    columns: ['Pasal', 'Isi Ketentuan Kode Etik'],
                    rows: kodeEtik.articles.map(a => [`Pasal ${a.number}`, a.text]),
                  });
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-500 transition shadow"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Cetak Kode Etik</span>
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed italic mb-6 bg-slate-50 p-4 rounded-xl border border-slate-100">
              "{kodeEtik.preamble}"
            </p>

            <div className="space-y-3">
              {kodeEtik.articles.map((art) => (
                <div key={art.number} className="flex items-start gap-3 p-3 rounded-xl border border-slate-100 hover:bg-slate-50 transition text-xs">
                  <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                    {art.number}
                  </div>
                  <p className="text-slate-800 leading-relaxed font-medium pt-1">
                    {art.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 7. IKRAR GURU INDONESIA */}
      {/* ========================================================= */}
      {activeSubTab === 'ikrar' && (
        <div className="space-y-4">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm max-w-3xl mx-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-6">
              <h3 className="text-base font-bold text-slate-900">Ikrar Guru Indonesia</h3>
              <button
                onClick={() => {
                  DataStore.generateFormalPdf({
                    title: 'IKRAR GURU INDONESIA',
                    columns: ['No', 'Pernyataan Ikrar'],
                    rows: defaultIkrarGuru.split('\n\n')[1].split('\n').map((line, idx) => [idx + 1, line.replace(/^\d+\.\s*/, '')]),
                  });
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-500 transition shadow"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Cetak Ikrar Guru</span>
              </button>
            </div>

            <div className="whitespace-pre-line text-xs text-slate-800 leading-loose bg-slate-50 p-6 rounded-xl border border-slate-200 font-serif">
              {ikrarText}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 8. TATA TERTIB GURU */}
      {/* ========================================================= */}
      {activeSubTab === 'tata_tertib' && (
        <div className="space-y-4">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <h3 className="text-base font-bold text-slate-900">Tata Tertib Guru & Tenaga Kependidikan</h3>
              <button
                onClick={() => {
                  alert('Mencetak dokumen Tata Tertib Guru');
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-500 transition shadow"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Cetak Tata Tertib</span>
              </button>
            </div>

            <div className="whitespace-pre-line text-xs text-slate-800 leading-relaxed bg-slate-50 p-6 rounded-xl border border-slate-200">
              {tataTertibText}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 9. PEMBIASAAN GURU */}
      {/* ========================================================= */}
      {activeSubTab === 'pembiasaan' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Pembiasaan Guru & Budaya Sekolah</h3>
              <p className="text-xs text-slate-500">Program 5S, literasi, tadarus, dan apel pembiasaan karakter</p>
            </div>
            <button
              onClick={() => {
                alert('Tambah kegiatan pembiasaan baru');
              }}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-500 transition shadow"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Tambah Pembiasaan</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pembiasaanList.map((p) => (
              <div key={p.id} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-2">
                  <span className="text-[10px] font-bold uppercase bg-blue-50 text-blue-700 px-2 py-0.5 rounded border border-blue-200">
                    {p.frequency}
                  </span>
                  <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                    {p.implementationStatus}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-slate-900 mt-1">{p.activityName}</h4>
                <p className="text-xs text-slate-600 mt-1">Jadwal: {p.scheduleTime}</p>
                <div className="mt-3 p-2.5 rounded-lg bg-slate-50 border border-slate-100 text-xs">
                  <strong>Target Nilai Karakter:</strong> {p.targetValue}
                  <div className="mt-1 text-[11px] text-slate-500">Catatan: {p.notes}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 10. DAFTAR HADIR PESERTA DIDIK (ABSENSI) */}
      {/* ========================================================= */}
      {activeSubTab === 'absensi' && (
        <div className="space-y-4">
          {/* Automatic Single-Source-Of-Truth Callout */}
          <div className="p-3.5 rounded-xl bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-emerald-500/10 border border-emerald-300 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5">
              <Users className="w-5 h-5 text-emerald-600 shrink-0" />
              <div>
                <span className="font-bold text-slate-900 block">
                  Sistem Satu Kali Input: Master Roster Siswa & Kelas Terintegrasi
                </span>
                <span className="text-slate-600">
                  Data peserta didik yang dikelola di sini otomatis tersinkronisasi 100% dengan Daftar Hadir (Buku 2) dan Daftar Nilai / Rapor (Buku 3).
                </span>
              </div>
            </div>

            <button
              onClick={() => setShowStudentModal(true)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow transition shrink-0"
            >
              <Users className="w-3.5 h-3.5" />
              <span>Kelola Master Siswa ({students.length})</span>
            </button>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Daftar Hadir Peserta Didik ({students[0]?.className || 'Kelas VII-A'})</h3>
              <p className="text-xs text-slate-500">Pencatatan status Hadir (H), Sakit (S), Izin (I), Alpa (A) dan rekap bulanan</p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={exportAbsensiExcel}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-emerald-500/30 bg-emerald-50 text-emerald-700 text-xs font-semibold hover:bg-emerald-100 transition"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
                <span>Ekspor Excel</span>
              </button>
              <button
                onClick={() => {
                  DataStore.generateFormalPdf({
                    title: 'DAFTAR HADIR PESERTA DIDIK',
                    subTitle: `KELAS VII-A — SEMESTER ${DataStore.getProfile().semester.toUpperCase()}`,
                    columns: ['No', 'NIS', 'Nama Peserta Didik', 'L/P', 'Status Kehadiran', 'Keterangan'],
                    rows: students.map((s, idx) => [
                      idx + 1,
                      s.nis,
                      s.name,
                      s.gender,
                      absensiList.find(a => a.studentId === s.id)?.status || 'H',
                      absensiList.find(a => a.studentId === s.id)?.note || '-',
                    ]),
                  });
                }}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-500 transition shadow"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Cetak Absensi</span>
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-800 font-bold uppercase text-[11px]">
                <tr>
                  <th className="px-4 py-3 w-12 text-center">No</th>
                  <th className="px-4 py-3 w-24">NIS</th>
                  <th className="px-4 py-3">Nama Lengkap Siswa</th>
                  <th className="px-4 py-3 w-14 text-center">L/P</th>
                  <th className="px-4 py-3 text-center w-64">Status Absensi Hari Ini</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {students.map((std, idx) => {
                  const record = absensiList.find(a => a.studentId === std.id);
                  const currentStatus = record?.status || 'H';

                  return (
                    <tr key={std.id} className="hover:bg-slate-50 transition">
                      <td className="px-4 py-3 text-center font-bold text-slate-500">{idx + 1}</td>
                      <td className="px-4 py-3 font-mono text-slate-600">{std.nis}</td>
                      <td className="px-4 py-3 font-semibold text-slate-900">{std.name}</td>
                      <td className="px-4 py-3 text-center font-medium text-slate-500">{std.gender}</td>
                      <td className="px-4 py-3 text-center">
                        <div className="inline-flex rounded-lg border border-slate-200 p-0.5 bg-slate-50 gap-1">
                          {(['H', 'S', 'I', 'A'] as const).map((st) => (
                            <button
                              key={st}
                              onClick={() => updateAttendanceStatus(std.id, st)}
                              className={`w-7 h-6 rounded text-[11px] font-bold transition ${
                                currentStatus === st
                                  ? st === 'H' ? 'bg-emerald-600 text-white' :
                                    st === 'S' ? 'bg-amber-500 text-white' :
                                    st === 'I' ? 'bg-blue-600 text-white' :
                                    'bg-rose-600 text-white'
                                  : 'text-slate-500 hover:bg-slate-200'
                              }`}
                            >
                              {st}
                            </button>
                          ))}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 11. JURNAL MENGAJAR HARIAN GURU */}
      {/* ========================================================= */}
      {activeSubTab === 'jurnal' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Jurnal Mengajar Harian Guru</h3>
              <p className="text-xs text-slate-500">Catatan kronologis KBM, capaian materi, kendala kelas, dan tindak lanjut</p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={exportJurnalExcel}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-emerald-500/30 bg-emerald-50 text-emerald-700 text-xs font-semibold hover:bg-emerald-100 transition"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
                <span>Ekspor Excel</span>
              </button>
              <button
                onClick={() => {
                  setModalType('jurnal');
                  setShowAddModal(true);
                }}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-500 transition shadow"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Tambah Catatan Jurnal</span>
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {jurnalList.map((j) => (
              <div key={j.id} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded">
                      {j.date}
                    </span>
                    <span className="text-xs font-semibold text-slate-600">{j.periodTime}</span>
                    <span className="text-xs font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
                      Kelas: {j.className}
                    </span>
                  </div>
                  <div className="text-xs text-slate-500">
                    Hadir: <strong className="text-emerald-600">{j.presentCount}</strong> | Absen: <strong className="text-rose-600">{j.absentCount}</strong>
                  </div>
                </div>

                <div className="mt-3 space-y-2 text-xs">
                  <div>
                    <span className="font-bold text-slate-900">Materi Pokok:</span>
                    <p className="text-slate-800 font-semibold">{j.topicMaterial}</p>
                  </div>
                  <div>
                    <span className="font-bold text-slate-900">Tujuan Pembelajaran:</span>
                    <p className="text-slate-600">{j.learningObjective}</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                    <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                      <strong>Catatan KBM:</strong>
                      <p className="text-slate-600 mt-0.5">{j.teachingNotes}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-amber-50/50 border border-amber-100">
                      <strong className="text-amber-800">Kendala & Tindak Lanjut:</strong>
                      <p className="text-slate-700 mt-0.5">{j.challenges}</p>
                      <p className="text-emerald-700 font-medium mt-1">Solusi: {j.followUp}</p>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                    <span className="text-[11px] text-slate-500 font-medium">Metode: <strong>{j.methodUsed}</strong></span>
                    <button
                      type="button"
                      onClick={() => {
                        DataStore.createReflectionFromJournal(j);
                        alert(`Sistem Satu Kali Input: Catatan pembelajaran materi "${j.topicMaterial}" berhasil dikirim dan disinkronkan ke Buku 4 (Jurnal Refleksi Guru)!`);
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 text-xs font-bold transition shadow-sm"
                      title="Kirim catatan KBM ini ke Jurnal Refleksi Guru di Buku 4"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                      <span>Jadikan Jurnal Refleksi (Buku 4) &rarr;</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 12. BUKU PEGANGAN GURU & REFERENSI */}
      {/* ========================================================= */}
      {activeSubTab === 'buku_pegangan' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Buku Pegangan Guru & Referensi Digital</h3>
              <p className="text-xs text-slate-500">Koleksi buku teks, panduan pembelajaran, modul resmi, dan e-book</p>
            </div>
            <button
              onClick={() => alert('Fitur tambah referensi buku digital baru')}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-500 transition shadow"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Tambah Referensi</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {peganganList.map((ref) => (
              <div key={ref.id} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase bg-blue-50 text-blue-700 px-2 py-0.5 rounded border border-blue-200">
                    {ref.category}
                  </span>
                  <h4 className="text-sm font-bold text-slate-900 mt-2">{ref.title}</h4>
                  <p className="text-xs text-slate-600 mt-1">{ref.authorOrPublisher} ({ref.year})</p>
                  <p className="text-xs text-slate-500 mt-2 leading-relaxed">{ref.description}</p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <a
                    href={ref.fileUrlOrLink}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-blue-600 hover:underline font-semibold"
                  >
                    Buka Tautan Digital &rarr;
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 13. BUKU KONSULTASI GURU */}
      {/* ========================================================= */}
      {activeSubTab === 'konsultasi' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Buku Konsultasi Guru</h3>
              <p className="text-xs text-slate-500">Catatan pembinaan dan konsultasi bersama Kepala Madrasah / Pengawas</p>
            </div>
            <button
              onClick={() => {
                DataStore.generateFormalPdf({
                  title: 'BUKU KONSULTASI GURU DENGAN KEPALA SEKOLAH',
                  columns: ['Tanggal', 'Nama Konsultan', 'Topik Bimbingan', 'Hasil Konsultasi', 'Rekomendasi'],
                  rows: konsultasiList.map(k => [
                    k.date,
                    `${k.consultantName} (${k.consultantRole})`,
                    k.topic,
                    k.results,
                    k.recommendations,
                  ]),
                });
              }}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-500 transition shadow"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Cetak Buku Konsultasi</span>
            </button>
          </div>

          <div className="space-y-4">
            {konsultasiList.map((k) => (
              <div key={k.id} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-3">
                  <span className="font-bold text-xs text-slate-900">{k.consultantName} ({k.consultantRole})</span>
                  <span className="text-xs text-slate-500">{k.date}</span>
                </div>
                <div className="space-y-2 text-xs">
                  <div>
                    <strong className="text-slate-900">Topik Konsultasi:</strong>
                    <p className="text-slate-800 font-semibold">{k.topic}</p>
                  </div>
                  <div>
                    <strong className="text-slate-900">Hasil Pembahasan:</strong>
                    <p className="text-slate-600">{k.results}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-100">
                    <strong className="text-emerald-900">Rekomendasi & Arahan:</strong>
                    <p className="text-emerald-800 mt-0.5">{k.recommendations}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL ADD ENTRY */}
      {/* ========================================================= */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="text-base font-bold text-slate-900 mb-4">
              {modalType === 'kaldik' ? 'Tambah Agenda Kalender Pendidikan' : 'Tambah Jurnal Mengajar'}
            </h3>

            {modalType === 'kaldik' ? (
              <form onSubmit={handleAddKaldik} className="space-y-3 text-xs">
                <div>
                  <label className="font-semibold block mb-1">Nama Kegiatan</label>
                  <input name="title" required className="w-full border rounded-lg p-2" placeholder="e.g. Asesmen Sumatif Tengah Semester" />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="font-semibold block mb-1">Tanggal Mulai</label>
                    <input name="dateStart" type="date" required className="w-full border rounded-lg p-2" />
                  </div>
                  <div>
                    <label className="font-semibold block mb-1">Tanggal Selesai</label>
                    <input name="dateEnd" type="date" required className="w-full border rounded-lg p-2" />
                  </div>
                </div>
                <div>
                  <label className="font-semibold block mb-1">Kategori</label>
                  <select name="category" className="w-full border rounded-lg p-2">
                    <option value="Hari Efektif">Hari Efektif</option>
                    <option value="Hari Libur Nasional">Hari Libur Nasional</option>
                    <option value="Libur Semester">Libur Semester</option>
                    <option value="Penilaian / Asesmen">Penilaian / Asesmen</option>
                    <option value="Kegiatan Madrasah">Kegiatan Madrasah</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold block mb-1">Semester</label>
                  <select name="semester" className="w-full border rounded-lg p-2">
                    <option value="Ganjil">Semester Ganjil</option>
                    <option value="Genap">Semester Genap</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold block mb-1">Catatan Tambahan</label>
                  <input name="notes" className="w-full border rounded-lg p-2" placeholder="Keterangan opsional" />
                </div>
                <div className="flex justify-end gap-2 pt-3">
                  <button type="button" onClick={() => setShowAddModal(false)} className="px-4 py-2 border rounded-lg">Batal</button>
                  <button type="submit" className="px-4 py-2 bg-emerald-600 text-white rounded-lg font-bold">Simpan</button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleAddJurnal} className="space-y-3 text-xs">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="font-semibold block mb-1">Tanggal</label>
                    <input name="date" type="date" defaultValue={new Date().toISOString().split('T')[0]} required className="w-full border rounded-lg p-2" />
                  </div>
                  <div>
                    <label className="font-semibold block mb-1">Jam Pelajaran</label>
                    <input name="periodTime" defaultValue="07.30 - 08.50 WIB (2 JP)" required className="w-full border rounded-lg p-2" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="font-semibold block mb-1">Kelas</label>
                    <input name="className" defaultValue="VII-A" required className="w-full border rounded-lg p-2" />
                  </div>
                  <div>
                    <label className="font-semibold block mb-1">Metode KBM</label>
                    <input name="methodUsed" defaultValue="Problem Based Learning" required className="w-full border rounded-lg p-2" />
                  </div>
                </div>
                <div>
                  <label className="font-semibold block mb-1">Materi Pokok</label>
                  <input name="topicMaterial" required className="w-full border rounded-lg p-2" placeholder="e.g. Teks Prosedur" />
                </div>
                <div>
                  <label className="font-semibold block mb-1">Tujuan Pembelajaran</label>
                  <input name="learningObjective" required className="w-full border rounded-lg p-2" placeholder="e.g. TP 7.3 Menganalisis kalimat perintah" />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="font-semibold block mb-1">Siswa Hadir</label>
                    <input name="presentCount" type="number" defaultValue={15} required className="w-full border rounded-lg p-2" />
                  </div>
                  <div>
                    <label className="font-semibold block mb-1">Siswa Absen</label>
                    <input name="absentCount" type="number" defaultValue={0} required className="w-full border rounded-lg p-2" />
                  </div>
                </div>
                <div>
                  <label className="font-semibold block mb-1">Catatan Kejadian Pembelajaran</label>
                  <textarea name="teachingNotes" rows={2} required className="w-full border rounded-lg p-2" placeholder="Aktivitas siswa selama KBM..." />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="font-semibold block mb-1">Kendala</label>
                    <input name="challenges" defaultValue="Tidak ada kendala berarti" className="w-full border rounded-lg p-2" />
                  </div>
                  <div>
                    <label className="font-semibold block mb-1">Tindak Lanjut</label>
                    <input name="followUp" defaultValue="Lanjut materi berikutnya" className="w-full border rounded-lg p-2" />
                  </div>
                </div>

                <div className="flex items-center gap-2 p-2.5 rounded-lg bg-purple-50 border border-purple-200">
                  <input type="checkbox" id="createReflection" name="createReflection" defaultChecked className="rounded text-purple-600 focus:ring-purple-500" />
                  <label htmlFor="createReflection" className="text-[11px] font-bold text-purple-900 cursor-pointer">
                    Sistem Otomatis: Sekaligus buatkan draf Jurnal Refleksi di Buku 4 dari catatan KBM ini
                  </label>
                </div>

                <div className="flex justify-end gap-2 pt-3">
                  <button type="button" onClick={() => setShowAddModal(false)} className="px-4 py-2 border rounded-lg">Batal</button>
                  <button type="submit" className="px-4 py-2 bg-emerald-600 text-white rounded-lg font-bold">Simpan Jurnal</button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* MODAL KELOLA MASTER SISWA & KELAS */}
      {showStudentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] flex flex-col">
            <div className="border-b pb-3 mb-4 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Users className="w-5 h-5 text-emerald-600" />
                  <span>Master Data Roster Peserta Didik & Kelas</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Satu Kali Input: Siswa di sini otomatis aktif di Daftar Hadir (Buku 2) dan Daftar Nilai (Buku 3).
                </p>
              </div>
              <button
                onClick={() => setShowStudentModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form Tambah Siswa Baru */}
            <form onSubmit={handleAddStudentBuku2} className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 mb-4 text-xs">
              <span className="font-bold text-slate-800 block mb-2">+ Tambah Peserta Didik Baru ke Master:</span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <input name="nis" required placeholder="NIS (misal: 24016)" className="border rounded p-1.5 bg-white font-mono" />
                <input name="nisn" placeholder="NISN (Opsional)" className="border rounded p-1.5 bg-white font-mono" />
                <input name="name" required placeholder="Nama Lengkap Siswa" className="border rounded p-1.5 bg-white col-span-2" />
              </div>
              <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-200">
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-1 font-medium text-slate-700">
                    <span>L/P:</span>
                    <select name="gender" className="border rounded px-1.5 py-1 bg-white">
                      <option value="L">L (Laki-laki)</option>
                      <option value="P">P (Perempuan)</option>
                    </select>
                  </label>
                  <label className="flex items-center gap-1 font-medium text-slate-700">
                    <span>Kelas:</span>
                    <input name="className" defaultValue={students[0]?.className || 'VII-A'} className="border rounded px-1.5 py-1 bg-white w-20" />
                  </label>
                </div>
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg transition shadow-sm"
                >
                  + Simpan ke Master Siswa
                </button>
              </div>
            </form>

            {/* List Siswa Terdaftar */}
            <div className="overflow-y-auto flex-1 border rounded-xl">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 border-b text-slate-700 font-bold uppercase text-[11px] sticky top-0">
                  <tr>
                    <th className="px-3 py-2 w-10 text-center">No</th>
                    <th className="px-3 py-2 w-20">NIS</th>
                    <th className="px-3 py-2">Nama Lengkap</th>
                    <th className="px-2 py-2 text-center w-12">L/P</th>
                    <th className="px-2 py-2 text-center w-20">Kelas</th>
                    <th className="px-2 py-2 text-center w-12">Hapus</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {students.map((s, idx) => (
                    <tr key={s.id} className="hover:bg-slate-50">
                      <td className="px-3 py-2 text-center text-slate-400 font-bold">{idx + 1}</td>
                      <td className="px-3 py-2 font-mono text-slate-600">{s.nis}</td>
                      <td className="px-3 py-2 font-semibold text-slate-900">{s.name}</td>
                      <td className="px-2 py-2 text-center">{s.gender}</td>
                      <td className="px-2 py-2 text-center font-bold text-blue-600">{s.className}</td>
                      <td className="px-2 py-2 text-center">
                        <button
                          type="button"
                          onClick={() => handleDeleteStudentBuku2(s.id, s.name)}
                          className="p-1 text-slate-400 hover:text-rose-600 rounded"
                          title="Hapus Siswa"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="pt-3 border-t mt-3 flex justify-end">
              <button
                type="button"
                onClick={() => setShowStudentModal(false)}
                className="px-4 py-2 bg-slate-900 text-white rounded-xl font-bold text-xs hover:bg-slate-800"
              >
                Selesai & Tutup
              </button>
            </div>
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
