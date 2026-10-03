import React, { useState } from 'react';
import {
  LayoutDashboard,
  BookOpen,
  CalendarCheck,
  Award,
  Sparkles,
  UserCheck,
  Settings,
  ChevronDown,
  ChevronRight,
  X,
  FileText,
  Target,
  GitBranch,
  BookMarked,
  ShieldCheck,
  Clock,
  CalendarDays,
  FileCheck,
  Users,
  ClipboardList,
  Library,
  MessageSquare,
  BarChart3,
  FileSpreadsheet,
  CheckCircle,
  HelpCircle,
  TrendingUp,
  RefreshCw,
  FolderSync
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  activeSubTab?: string;
  onNavigate: (tab: string, subTab?: string) => void;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  activeSubTab,
  onNavigate,
  isMobileOpen,
  onCloseMobile,
}) => {
  // Collapsible book sections
  const [expandedBooks, setExpandedBooks] = useState<Record<string, boolean>>({
    buku1: activeTab === 'buku1' || true,
    buku2: activeTab === 'buku2',
    buku3: activeTab === 'buku3',
    buku4: activeTab === 'buku4',
  });

  const toggleBook = (bookKey: string) => {
    setExpandedBooks(prev => ({
      ...prev,
      [bookKey]: !prev[bookKey],
    }));
  };

  const navItems = [
    {
      id: 'dashboard',
      label: 'Dashboard Utama',
      icon: LayoutDashboard,
    },
    {
      id: 'ai',
      label: 'AI Asisten Guru',
      icon: Sparkles,
      badge: 'Gemini 3.8',
      highlight: true,
    },
  ];

  const buku1Items = [
    { id: 'cp', label: 'Capaian Pembelajaran (CP)', icon: Target },
    { id: 'tp', label: 'Tujuan Pembelajaran (TP)', icon: CheckCircle },
    { id: 'atp', label: 'Alur Tujuan Pembelajaran (ATP)', icon: GitBranch },
    { id: 'modul', label: 'Modul Ajar Berbasis KBC', icon: BookOpen },
    { id: 'p5', label: 'Modul Projek Penguatan KBC', icon: Sparkles },
    { id: 'kktp', label: 'Kriteria Ketercapaian (KKTP)', icon: BarChart3 },
  ];

  const buku2Items = [
    { id: 'kaldik', label: 'Kalender Pendidikan (Kaldik)', icon: CalendarDays },
    { id: 'jadwal', label: 'SK Mengajar & Jadwal Mingguan', icon: Clock },
    { id: 'rpe', label: 'Rincian Pekan Efektif (RPE)', icon: FileSpreadsheet },
    { id: 'prota', label: 'Program Tahunan (Prota)', icon: FileText },
    { id: 'promes', label: 'Program Semester (Promes)', icon: CalendarCheck },
    { id: 'kode_etik', label: 'Kode Etik Guru Indonesia', icon: ShieldCheck },
    { id: 'ikrar', label: 'Ikrar Guru Indonesia', icon: Award },
    { id: 'tata_tertib', label: 'Tata Tertib Guru', icon: FileCheck },
    { id: 'pembiasaan', label: 'Pembiasaan Guru & Budaya', icon: UserCheck },
    { id: 'absensi', label: 'Daftar Hadir Peserta Didik', icon: Users },
    { id: 'jurnal', label: 'Jurnal Mengajar Harian Guru', icon: ClipboardList },
    { id: 'buku_pegangan', label: 'Buku Pegangan & Referensi', icon: Library },
    { id: 'konsultasi', label: 'Buku Konsultasi Kepala Sekolah', icon: MessageSquare },
  ];

  const buku3Items = [
    { id: 'nilai', label: 'Daftar Nilai & Olah Rapor', icon: FileSpreadsheet },
    { id: 'diagnostik', label: 'Asesmen Diagnostik Siswa', icon: HelpCircle },
    { id: 'formatif', label: 'Asesmen Formatif KBM', icon: CheckCircle },
    { id: 'sumatif', label: 'Asesmen Sumatif (STS/SAS)', icon: Award },
    { id: 'instrumen', label: 'Bank Instrumen Soal', icon: FileText },
    { id: 'remedial', label: 'Program Remedial & Pengayaan', icon: RefreshCw },
    { id: 'analisis_soal', label: 'Analisis Butir Soal (P, D, Distraktor)', icon: BarChart3 },
    { id: 'kisi_kisi', label: 'Kisi-Kisi Soal Ujian', icon: ClipboardList },
    { id: 'analisis_belajar', label: 'Analisis Hasil Belajar Siswa', icon: TrendingUp },
    { id: 'tugas', label: 'Penugasan Terstruktur/Tidak', icon: BookMarked },
  ];

  const buku4Items = [
    { id: 'refleksi', label: 'Jurnal Refleksi Pembelajaran', icon: FileText },
    { id: 'tindak_lanjut', label: 'Program Tindak Lanjut Supervisi', icon: TrendingUp },
  ];

  const sidebarContent = (
    <div className="flex flex-col h-full bg-slate-900 border-r border-slate-800 text-slate-300">
      {/* Mobile Top Bar */}
      <div className="p-4 flex items-center justify-between border-b border-slate-800 lg:hidden">
        <div className="font-bold text-white text-sm flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-blue-400" />
          <span>Navigasi Modul Administrasi</span>
        </div>
        <button
          onClick={onCloseMobile}
          className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          aria-label="Tutup Menu"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Main Navigation List */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        {/* Quick Nav (Dashboard & AI) */}
        <div className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id);
                  onCloseMobile();
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                    : item.highlight
                    ? 'bg-gradient-to-r from-blue-900/40 to-indigo-900/30 text-blue-300 hover:bg-blue-900/60 border border-blue-500/30'
                    : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : item.highlight ? 'text-sky-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-sky-500/20 text-sky-300 border border-sky-400/30">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* BUKU 1 */}
        <div className="space-y-1">
          <button
            onClick={() => toggleBook('buku1')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === 'buku1'
                ? 'bg-slate-800 text-blue-400 border border-blue-500/20'
                : 'text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <div className="flex items-center gap-2.5 text-left">
              <div className="w-6 h-6 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center font-black text-[11px]">
                B1
              </div>
              <div>
                <div className="text-white font-bold leading-tight">BUKU 1</div>
                <div className="text-[10px] font-normal text-slate-400">Perencanaan Pembelajaran</div>
              </div>
            </div>
            {expandedBooks.buku1 ? (
              <ChevronDown className="w-4 h-4 text-slate-400" />
            ) : (
              <ChevronRight className="w-4 h-4 text-slate-400" />
            )}
          </button>

          {expandedBooks.buku1 && (
            <div className="pl-3 pr-1 pt-1 space-y-1 border-l-2 border-blue-500/30 ml-4 mt-1">
              {buku1Items.map((sub) => {
                const SubIcon = sub.icon;
                const isSubActive = activeTab === 'buku1' && activeSubTab === sub.id;
                return (
                  <button
                    key={sub.id}
                    onClick={() => {
                      onNavigate('buku1', sub.id);
                      onCloseMobile();
                    }}
                    className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-[11px] transition text-left ${
                      isSubActive
                        ? 'bg-blue-600/30 text-sky-300 font-semibold border-l-2 border-sky-400'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                    }`}
                  >
                    <SubIcon className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">{sub.label}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* BUKU 2 */}
        <div className="space-y-1">
          <button
            onClick={() => toggleBook('buku2')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === 'buku2'
                ? 'bg-slate-800 text-emerald-400 border border-emerald-500/20'
                : 'text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <div className="flex items-center gap-2.5 text-left">
              <div className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-black text-[11px]">
                B2
              </div>
              <div>
                <div className="text-white font-bold leading-tight">BUKU 2</div>
                <div className="text-[10px] font-normal text-slate-400">Administrasi Guru</div>
              </div>
            </div>
            {expandedBooks.buku2 ? (
              <ChevronDown className="w-4 h-4 text-slate-400" />
            ) : (
              <ChevronRight className="w-4 h-4 text-slate-400" />
            )}
          </button>

          {expandedBooks.buku2 && (
            <div className="pl-3 pr-1 pt-1 space-y-1 border-l-2 border-emerald-500/30 ml-4 mt-1">
              {buku2Items.map((sub) => {
                const SubIcon = sub.icon;
                const isSubActive = activeTab === 'buku2' && activeSubTab === sub.id;
                return (
                  <button
                    key={sub.id}
                    onClick={() => {
                      onNavigate('buku2', sub.id);
                      onCloseMobile();
                    }}
                    className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-[11px] transition text-left ${
                      isSubActive
                        ? 'bg-emerald-600/30 text-emerald-300 font-semibold border-l-2 border-emerald-400'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                    }`}
                  >
                    <SubIcon className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">{sub.label}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* BUKU 3 */}
        <div className="space-y-1">
          <button
            onClick={() => toggleBook('buku3')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === 'buku3'
                ? 'bg-slate-800 text-amber-400 border border-amber-500/20'
                : 'text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <div className="flex items-center gap-2.5 text-left">
              <div className="w-6 h-6 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-black text-[11px]">
                B3
              </div>
              <div>
                <div className="text-white font-bold leading-tight">BUKU 3</div>
                <div className="text-[10px] font-normal text-slate-400">Administrasi Penilaian</div>
              </div>
            </div>
            {expandedBooks.buku3 ? (
              <ChevronDown className="w-4 h-4 text-slate-400" />
            ) : (
              <ChevronRight className="w-4 h-4 text-slate-400" />
            )}
          </button>

          {expandedBooks.buku3 && (
            <div className="pl-3 pr-1 pt-1 space-y-1 border-l-2 border-amber-500/30 ml-4 mt-1">
              {buku3Items.map((sub) => {
                const SubIcon = sub.icon;
                const isSubActive = activeTab === 'buku3' && activeSubTab === sub.id;
                return (
                  <button
                    key={sub.id}
                    onClick={() => {
                      onNavigate('buku3', sub.id);
                      onCloseMobile();
                    }}
                    className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-[11px] transition text-left ${
                      isSubActive
                        ? 'bg-amber-600/30 text-amber-300 font-semibold border-l-2 border-amber-400'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                    }`}
                  >
                    <SubIcon className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">{sub.label}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* BUKU 4 */}
        <div className="space-y-1">
          <button
            onClick={() => toggleBook('buku4')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === 'buku4'
                ? 'bg-slate-800 text-purple-400 border border-purple-500/20'
                : 'text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <div className="flex items-center gap-2.5 text-left">
              <div className="w-6 h-6 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center font-black text-[11px]">
                B4
              </div>
              <div>
                <div className="text-white font-bold leading-tight">BUKU 4</div>
                <div className="text-[10px] font-normal text-slate-400">Refleksi & Tindak Lanjut</div>
              </div>
            </div>
            {expandedBooks.buku4 ? (
              <ChevronDown className="w-4 h-4 text-slate-400" />
            ) : (
              <ChevronRight className="w-4 h-4 text-slate-400" />
            )}
          </button>

          {expandedBooks.buku4 && (
            <div className="pl-3 pr-1 pt-1 space-y-1 border-l-2 border-purple-500/30 ml-4 mt-1">
              {buku4Items.map((sub) => {
                const SubIcon = sub.icon;
                const isSubActive = activeTab === 'buku4' && activeSubTab === sub.id;
                return (
                  <button
                    key={sub.id}
                    onClick={() => {
                      onNavigate('buku4', sub.id);
                      onCloseMobile();
                    }}
                    className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-[11px] transition text-left ${
                      isSubActive
                        ? 'bg-purple-600/30 text-purple-300 font-semibold border-l-2 border-purple-400'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                    }`}
                  >
                    <SubIcon className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">{sub.label}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Master & System Settings */}
        <div className="pt-2 border-t border-slate-800 space-y-1">
          <button
            onClick={() => {
              onNavigate('settings', 'profile');
              onCloseMobile();
            }}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition ${
              activeTab === 'settings' && activeSubTab === 'profile'
                ? 'bg-blue-600 text-white'
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <UserCheck className="w-4 h-4" />
            <span>Profil Guru & Sekolah</span>
          </button>

          <button
            onClick={() => {
              onNavigate('settings', 'backup');
              onCloseMobile();
            }}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition ${
              activeTab === 'settings' && activeSubTab === 'backup'
                ? 'bg-blue-600 text-white'
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <FolderSync className="w-4 h-4" />
            <span>Cadangkan & Pulihkan</span>
          </button>
        </div>
      </div>

      {/* Footer Branding Info */}
      <div className="p-3 border-t border-slate-800 bg-slate-950/60 text-[11px] text-slate-500 flex items-center justify-between">
        <div>
          <div className="font-semibold text-slate-400">Versi 2.5 Edu</div>
          <div>Standar Kurikulum Nasional</div>
        </div>
        <div className="w-2 h-2 rounded-full bg-emerald-500" title="Sistem Berjalan Normal" />
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden lg:block w-72 shrink-0 h-[calc(100vh-61px)] sticky top-[61px]">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Overlay */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity"
            onClick={onCloseMobile}
          />
          <div className="relative w-80 max-w-[85vw] h-full shadow-2xl z-10">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
