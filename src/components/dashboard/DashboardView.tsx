import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  CalendarCheck,
  Award,
  TrendingUp,
  Users,
  CheckCircle2,
  Clock,
  ArrowRight,
  Sparkles,
  School,
  FileCheck,
  AlertCircle,
  BarChart2,
  Calendar,
  Layers,
  ChevronRight
} from 'lucide-react';
import { DataStore } from '../../services/storage';
import { TeacherProfile } from '../../types';

interface DashboardViewProps {
  onNavigate: (tab: string, subTab?: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ onNavigate }) => {
  const [profile, setProfile] = useState<TeacherProfile>(DataStore.getProfile());
  const [studentsCount, setStudentsCount] = useState(DataStore.getStudents().length);
  const [classesCount, setClassesCount] = useState(3); // VII-A, VII-B, VII-C
  const [completedItems, setCompletedItems] = useState(26);
  const [pendingItems, setPendingItems] = useState(5);

  useEffect(() => {
    const handleUpdate = () => {
      setProfile(DataStore.getProfile());
      setStudentsCount(DataStore.getStudents().length);
    };
    window.addEventListener('bkgd-store-update', handleUpdate);
    return () => window.removeEventListener('bkgd-store-update', handleUpdate);
  }, []);

  const totalAdminCount = completedItems + pendingItems;
  const progressPercent = Math.round((completedItems / totalAdminCount) * 100);

  // 4 Main Books Cards
  const books = [
    {
      id: 'buku1',
      number: 'BUKU 1',
      title: 'PERENCANAAN PEMBELAJARAN (KBC)',
      description: 'Capaian Pembelajaran (CP), Tujuan Pembelajaran (TP), Alur (ATP), Modul Ajar Berbasis KBC, Modul Projek Penguatan Karakter KBC, dan Kriteria KKTP.',
      color: 'blue',
      gradient: 'from-blue-600 to-indigo-700',
      icon: BookOpen,
      count: '6 Modul KBC Terintegrasi',
      completed: '6/6 Lengkap',
      subTabs: ['cp', 'tp', 'atp', 'modul', 'p5', 'kktp'],
    },
    {
      id: 'buku2',
      number: 'BUKU 2',
      title: 'ADMINISTRASI GURU & KBM',
      description: 'Kalender Pendidikan, Jadwal KBM, RPE, Prota, Promes, Pembiasaan Guru Budaya Kasih, Jurnal Mengajar Fokus Panca Cinta KBC, dan Absensi Siswa.',
      color: 'emerald',
      gradient: 'from-emerald-600 to-teal-700',
      icon: CalendarCheck,
      count: '13 Dokumen KBC Wajib',
      completed: '13/13 Lengkap',
      subTabs: ['kaldik', 'jadwal', 'rpe', 'prota', 'promes', 'jurnal', 'absensi'],
    },
    {
      id: 'buku3',
      number: 'BUKU 3',
      title: 'ADMINISTRASI PENILAIAN KBC',
      description: 'Daftar Nilai & Afektif Panca Cinta KBC, Asesmen Diagnostik Sosio-Emosional, Remedial Restoratif Berakar Kasih, Analisis Butir Soal, dan Kisi-Kisi.',
      color: 'amber',
      gradient: 'from-amber-600 to-orange-700',
      icon: Award,
      count: '10 Instrumen Evaluasi',
      completed: '9/10 Lengkap',
      subTabs: ['nilai', 'diagnostik', 'formatif', 'sumatif', 'remedial', 'analisis_soal'],
    },
    {
      id: 'buku4',
      number: 'BUKU 4',
      title: 'REFLEKSI & TINDAK LANJUT RESTORATIF',
      description: 'Jurnal Refleksi Empati Pembelajaran KBC, Evaluasi Diri Guru, dan Program Tindak Lanjut Pasca Supervisi Berbasis Pendekatan Restoratif.',
      color: 'purple',
      gradient: 'from-purple-600 to-pink-700',
      icon: TrendingUp,
      count: '3 Laporan Tindak Lanjut',
      completed: '3/3 Lengkap',
      subTabs: ['refleksi', 'tindak_lanjut'],
    },
  ];

  // Learning Progress data points
  const learningProgress = [
    { label: 'Teks Deskripsi (Bab 1)', tuntas: 93, remidi: 7, avg: 84 },
    { label: 'Teks Fantasi (Bab 2)', tuntas: 87, remidi: 13, avg: 81 },
    { label: 'Sumatif Tengah Sem (STS)', tuntas: 80, remidi: 20, avg: 79 },
    { label: 'Teks Prosedur (Bab 3)', tuntas: 88, remidi: 12, avg: 83 },
    { label: 'Teks Berita (Bab 4)', tuntas: 91, remidi: 9, avg: 85 },
  ];

  const recentActivities = [
    {
      id: 'act-1',
      title: 'Pengolahan Nilai Formatif Bab 3 Selesai',
      time: 'Hari ini, 14:20 WIB',
      category: 'Buku 3',
      icon: Award,
      color: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    },
    {
      id: 'act-2',
      title: 'Modul Ajar Teks Deskripsi diunduh dalam format PDF',
      time: 'Kemarin, 09:15 WIB',
      category: 'Buku 1',
      icon: BookOpen,
      color: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
    },
    {
      id: 'act-3',
      title: 'Jurnal Mengajar Pertemuan ke-14 tersimpan',
      time: '02 Oktober 2024, 11:30 WIB',
      category: 'Buku 2',
      icon: CalendarCheck,
      color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    },
    {
      id: 'act-4',
      title: 'AI Guru merumuskan rancangan Kisi-Kisi STS',
      time: '28 September 2024, 16:45 WIB',
      category: 'AI Asisten',
      icon: Sparkles,
      color: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
    },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* HERO BANNER IDENTITAS GURU & MADRASAH */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 border border-blue-900/50 shadow-xl p-6 sm:p-8 text-white">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-semibold">
              <School className="w-3.5 h-3.5" />
              <span>{profile.schoolName}</span>
              <span>•</span>
              <span>NPSN: {profile.npsnNsm}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Selamat Datang, {profile.name}
            </h1>

            <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
              Mata Pelajaran: <strong className="text-white">{profile.subject}</strong> | Pangkat/Golongan: <span className="text-slate-200">{profile.rankGrade} ({profile.position})</span>
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2 text-xs text-slate-400">
              <span className="bg-slate-800/80 px-2.5 py-1 rounded-md border border-slate-700 text-slate-200">
                Tahun Pelajaran: <strong>{profile.academicYear}</strong>
              </span>
              <span className="bg-slate-800/80 px-2.5 py-1 rounded-md border border-slate-700 text-slate-200">
                Semester: <strong>{profile.semester}</strong>
              </span>
              <span className="bg-slate-800/80 px-2.5 py-1 rounded-md border border-slate-700 text-slate-200">
                Kurikulum: <strong>Kurikulum Merdeka</strong>
              </span>
            </div>
          </div>

          {/* Quick AI Trigger Button */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => onNavigate('ai')}
              className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 font-bold text-sm text-white shadow-lg shadow-blue-500/25 transition transform hover:-translate-y-0.5"
            >
              <Sparkles className="w-4 h-4 text-sky-200" />
              <span>Buka AI Asisten Guru</span>
            </button>
            <button
              onClick={() => onNavigate('settings', 'profile')}
              className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700 text-sm font-semibold text-slate-200 transition"
            >
              <span>Ubah Profil</span>
            </button>
          </div>
        </div>
      </div>

      {/* QUICK STATS METRICS GRID */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Stat 1: Administrasi Lengkap */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Administrasi Lengkap</span>
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">{completedItems}</span>
            <span className="text-xs font-medium text-emerald-600">Dokumen</span>
          </div>
          <div className="mt-2 w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
            <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${progressPercent}%` }} />
          </div>
          <p className="mt-1.5 text-[11px] text-slate-500">{progressPercent}% dari total administrasi</p>
        </div>

        {/* Stat 2: Administrasi Perlu Diperbarui */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Belum Lengkap / Draf</span>
            <div className="p-2 rounded-lg bg-amber-50 text-amber-600">
              <AlertCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">{pendingItems}</span>
            <span className="text-xs font-medium text-amber-600">Butuh Tindakan</span>
          </div>
          <p className="mt-3 text-[11px] text-slate-500">Kaldik, Jurnal, dan Analisis Butir Soal</p>
        </div>

        {/* Stat 3: Peserta Didik */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Peserta Didik Binaan</span>
            <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">{studentsCount}</span>
            <span className="text-xs font-medium text-blue-600">Siswa Aktif</span>
          </div>
          <p className="mt-3 text-[11px] text-slate-500">Terdaftar di Daftar Hadir & Nilai</p>
        </div>

        {/* Stat 4: Jumlah Rombel / Kelas */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Rombongan Belajar</span>
            <div className="p-2 rounded-lg bg-purple-50 text-purple-600">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">{classesCount}</span>
            <span className="text-xs font-medium text-purple-600">Kelas Diampu</span>
          </div>
          <p className="mt-3 text-[11px] text-slate-500">Kelas VII-A, VII-B, VII-C</p>
        </div>
      </div>

      {/* 4 CARDS BESAR BUKU ADMINISTRASI GURU (BAGIAN INTI) */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-base font-extrabold text-slate-900 tracking-tight">
              EMPAT BUKU KERJA GURU DIGITAL
            </h2>
            <p className="text-xs text-slate-500">
              Satu portal terpadu seluruh dokumen perangkat pembelajaran dan evaluasi
            </p>
          </div>
          <span className="text-xs font-semibold text-blue-600">4 Pilar Pokok Guru Profesional</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {books.map((b) => {
            const Icon = b.icon;
            return (
              <div
                key={b.id}
                className="group relative bg-white border border-slate-200 hover:border-blue-400 rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${b.gradient} text-white flex items-center justify-center shadow-md`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <div>
                        <span className="text-[11px] font-black tracking-wider text-blue-600 uppercase bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                          {b.number}
                        </span>
                        <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-700 transition mt-1">
                          {b.title}
                        </h3>
                      </div>
                    </div>

                    <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full shrink-0">
                      {b.completed}
                    </span>
                  </div>

                  <p className="mt-3 text-xs text-slate-600 leading-relaxed line-clamp-2">
                    {b.description}
                  </p>

                  {/* Submodules Quick Preview */}
                  <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap gap-1.5">
                    {b.subTabs.map((sub, i) => (
                      <button
                        key={i}
                        onClick={() => onNavigate(b.id, sub)}
                        className="text-[10px] font-medium bg-slate-50 hover:bg-blue-50 hover:text-blue-700 text-slate-600 border border-slate-200 rounded px-2 py-0.5 transition"
                      >
                        {sub.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mt-6 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs text-slate-500 font-medium">{b.count}</span>
                  <button
                    onClick={() => onNavigate(b.id)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 group-hover:bg-blue-600 text-white text-xs font-bold transition shadow-sm"
                  >
                    <span>Buka {b.number}</span>
                    <ArrowRight className="w-3.5 h-3.5 transition group-hover:translate-x-0.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* GRAFIK HASIL BELAJAR & TIMELINE AKTIVITAS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Kolom 1 & 2: Grafik Perkembangan Hasil Belajar */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <BarChart2 className="w-4 h-4 text-blue-600" />
                <span>Grafik Perkembangan Ketuntasan Hasil Belajar</span>
              </h3>
              <p className="text-xs text-slate-500">Persentase ketuntasan peserta didik per lingkup materi</p>
            </div>
            <button
              onClick={() => onNavigate('buku3', 'nilai')}
              className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1"
            >
              <span>Lihat Detail Nilai</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-4">
            {learningProgress.map((item, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-800">{item.label}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-slate-500 font-mono">Rerata: {item.avg}</span>
                    <span className="font-bold text-emerald-600">{item.tuntas}% Tuntas</span>
                  </div>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2.5 flex overflow-hidden">
                  <div
                    className="bg-blue-600 h-full transition-all duration-500"
                    style={{ width: `${item.tuntas}%` }}
                    title={`Tuntas: ${item.tuntas}%`}
                  />
                  <div
                    className="bg-amber-400 h-full transition-all duration-500"
                    style={{ width: `${item.remidi}%` }}
                    title={`Remedial: ${item.remidi}%`}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-blue-600 inline-block" />
                <span>Mencapai KKTP (&gt;= 75)</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-amber-400 inline-block" />
                <span>Program Remedial (&lt; 75)</span>
              </span>
            </div>
            <span className="font-medium text-slate-700">T.P. 2024/2025</span>
          </div>
        </div>

        {/* Kolom 3: Aktivitas Administrasi Terbaru */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-600" />
                <span>Aktivitas Terbaru</span>
              </h3>
              <span className="text-[11px] text-slate-400">Real-time</span>
            </div>

            <div className="space-y-3">
              {recentActivities.map((act) => {
                const ActIcon = act.icon;
                return (
                  <div key={act.id} className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition border border-transparent hover:border-slate-100">
                    <div className={`p-2 rounded-lg border shrink-0 ${act.color}`}>
                      <ActIcon className="w-3.5 h-3.5" />
                    </div>
                    <div className="overflow-hidden">
                      <div className="text-xs font-semibold text-slate-800 leading-tight">
                        {act.title}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] text-slate-400">{act.time}</span>
                        <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-1.5 py-0.2 rounded">
                          {act.category}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100">
            <button
              onClick={() => onNavigate('buku2', 'jurnal')}
              className="w-full text-center text-xs text-blue-600 hover:text-blue-800 font-semibold py-1 block"
            >
              Lihat Jurnal KBM Lengkap &rarr;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
