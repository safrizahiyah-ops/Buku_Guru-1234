import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  User, 
  Database, 
  CloudOff, 
  Sparkles, 
  Menu, 
  X, 
  CheckCircle2, 
  AlertTriangle,
  School,
  Settings,
  Users,
  ShieldCheck
} from 'lucide-react';
import { DataStore } from '../../services/storage';
import { TeacherProfile, AppNotification, UserAccount } from '../../types';
import { AuthModal } from './AuthModal';

interface HeaderProps {
  onOpenMobileSidebar: () => void;
  onNavigate: (tab: string, subTab?: string) => void;
  activeTab: string;
}

export const Header: React.FC<HeaderProps> = ({ onOpenMobileSidebar, onNavigate, activeTab }) => {
  const [profile, setProfile] = useState<TeacherProfile>(DataStore.getProfile());
  const [currentUser, setCurrentUser] = useState<UserAccount>(DataStore.getCurrentUser());
  const [notifications, setNotifications] = useState<AppNotification[]>(DataStore.getNotifikasi());
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    const handleUpdate = () => {
      setProfile(DataStore.getProfile());
      setCurrentUser(DataStore.getCurrentUser());
      setNotifications(DataStore.getNotifikasi());
    };
    window.addEventListener('bkgd-store-update', handleUpdate);
    window.addEventListener('bkgd-user-changed', handleUpdate);
    return () => {
      window.removeEventListener('bkgd-store-update', handleUpdate);
      window.removeEventListener('bkgd-user-changed', handleUpdate);
    };
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllRead = () => {
    const updated = notifications.map(n => ({ ...n, read: true }));
    DataStore.saveNotifikasi(updated);
    setNotifications(updated);
  };

  return (
    <>
      <header className="sticky top-0 z-30 bg-slate-900 text-white border-b border-slate-800 shadow-md">
        <div className="flex items-center justify-between px-4 py-2.5 sm:px-6">
          {/* Left: Mobile hamburger & App Brand */}
          <div className="flex items-center gap-3">
            <button
              onClick={onOpenMobileSidebar}
              className="lg:hidden p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition"
              aria-label="Buka Menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div 
              onClick={() => onNavigate('dashboard')}
              className="cursor-pointer flex items-center gap-2.5"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-sky-400 flex items-center justify-center shadow-lg shadow-blue-500/20 text-white font-black text-lg">
                BK
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold tracking-tight text-white text-base sm:text-lg">
                    BUKU KERJA GURU
                  </span>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-400/30">
                    Digital
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 hidden sm:block truncate max-w-md">
                  Satu Aplikasi untuk Seluruh Administrasi dan Perangkat Pembelajaran Guru
                </p>
              </div>
            </div>
          </div>

          {/* Center / Right: Academic info & Badges */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Account Switcher Button */}
            <button
              onClick={() => setShowAuthModal(true)}
              className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700/80 border border-slate-700 text-xs text-slate-200 transition"
              title="Ganti atau Daftarkan Akun Guru (Data Terisolasi)"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <div className="text-left hidden sm:block">
                <div className="text-[10px] text-slate-400 leading-none">Akun Guru Terisolasi:</div>
                <div className="font-bold text-white text-xs truncate max-w-[130px] leading-tight">
                  {currentUser.name}
                </div>
              </div>
              <span className="text-[10px] bg-blue-500/20 text-blue-300 font-semibold px-1.5 py-0.5 rounded">
                Ganti
              </span>
            </button>

            {/* Active Academic Year & Semester Pill */}
            <div className="hidden xl:flex items-center gap-2 bg-slate-800/80 border border-slate-700/60 rounded-lg px-3 py-1.5 text-xs">
              <School className="w-3.5 h-3.5 text-blue-400" />
              <span className="font-semibold text-slate-200">{profile.schoolName}</span>
              <span className="text-slate-500">|</span>
              <span className="text-slate-300">T.P. {profile.academicYear}</span>
              <span className="bg-blue-600/30 text-blue-300 px-1.5 py-0.5 rounded text-[10px] font-medium">
                Sem. {profile.semester}
              </span>
            </div>

            {/* Local Mode Notice Badge */}
            <div 
              onClick={() => onNavigate('settings', 'firebase')}
              title="Mode Demo Penyimpanan Lokal Aktif. Klik untuk opsi Firebase Cloud."
              className="cursor-pointer hidden lg:flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/30 text-amber-300 hover:bg-amber-500/20 px-2.5 py-1 rounded-md text-[11px] transition font-medium"
            >
              <Database className="w-3.5 h-3.5 text-amber-400" />
              <span>Data Lokal Aktif</span>
            </div>

            {/* AI Quick Button */}
            <button
              onClick={() => onNavigate('ai')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeTab === 'ai'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow'
                  : 'bg-blue-600/20 text-blue-300 hover:bg-blue-600/30 border border-blue-500/30'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-sky-300 animate-pulse" />
              <span className="hidden sm:inline">AI Asisten Guru</span>
              <span className="sm:hidden">AI</span>
            </button>

            {/* Notification Menu */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowNotifMenu(!showNotifMenu);
                  setShowProfileMenu(false);
                }}
                className="relative p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition"
                aria-label="Notifikasi"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                )}
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-500" />
                )}
              </button>

              {showNotifMenu && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl z-50 p-3 text-slate-200">
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800">
                    <div className="flex items-center gap-2">
                      <Bell className="w-4 h-4 text-blue-400" />
                      <span className="font-bold text-sm">Notifikasi Administrasi</span>
                    </div>
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllRead}
                        className="text-[11px] text-blue-400 hover:underline"
                      >
                        Tandai terbaca
                      </button>
                    )}
                  </div>
                  <div className="max-h-72 overflow-y-auto space-y-2">
                    {notifications.map((n) => (
                      <div
                        key={n.id}
                        className={`p-2.5 rounded-lg border text-xs ${
                          n.read
                            ? 'bg-slate-800/40 border-slate-800 text-slate-400'
                            : 'bg-slate-800 border-blue-500/30 text-slate-200'
                        }`}
                      >
                        <div className="flex items-start gap-2">
                          {n.type === 'warning' ? (
                            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                          ) : (
                            <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                          )}
                          <div>
                            <div className="font-semibold text-slate-100">{n.title}</div>
                            <p className="mt-0.5 text-slate-300 leading-relaxed">{n.message}</p>
                            <div className="mt-1 text-[10px] text-slate-400">{n.date}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowProfileMenu(!showProfileMenu);
                  setShowNotifMenu(false);
                }}
                className="flex items-center gap-2 pl-2 pr-1 py-1 rounded-lg hover:bg-slate-800 transition text-left"
              >
                <div className="w-8 h-8 rounded-full bg-blue-700 border border-blue-400/50 flex items-center justify-center font-bold text-white text-xs">
                  {profile.name.charAt(0)}
                </div>
                <div className="hidden xl:block">
                  <div className="text-xs font-semibold text-white leading-tight truncate max-w-[140px]">
                    {profile.name}
                  </div>
                  <div className="text-[10px] text-slate-400 truncate max-w-[140px]">
                    {profile.subject}
                  </div>
                </div>
              </button>

              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-72 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl z-50 p-3 text-slate-200">
                  <div className="flex items-center gap-3 pb-3 border-b border-slate-800">
                    <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center font-bold text-white">
                      {profile.name.charAt(0)}
                    </div>
                    <div className="overflow-hidden">
                      <div className="font-bold text-xs text-white truncate">{profile.name}</div>
                      <div className="text-[11px] text-slate-400 truncate">NIP: {profile.nip}</div>
                      <div className="text-[10px] text-blue-400">{profile.position} - {profile.rankGrade}</div>
                    </div>
                  </div>

                  <div className="py-2 space-y-1 text-xs">
                    <button
                      onClick={() => {
                        setShowProfileMenu(false);
                        setShowAuthModal(true);
                      }}
                      className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-blue-600/20 text-blue-300 hover:bg-blue-600/30 transition font-semibold"
                    >
                      <ShieldCheck className="w-4 h-4 text-blue-400" />
                      <span>Ganti Akun Guru / Login Baru</span>
                    </button>
                    <button
                      onClick={() => {
                        setShowProfileMenu(false);
                        onNavigate('settings', 'profile');
                      }}
                      className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white transition"
                    >
                      <User className="w-4 h-4 text-slate-400" />
                      <span>Profil Guru & Identitas</span>
                    </button>
                    <button
                      onClick={() => {
                        setShowProfileMenu(false);
                        onNavigate('settings', 'backup');
                      }}
                      className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white transition"
                    >
                      <Database className="w-4 h-4 text-slate-400" />
                      <span>Cadangkan & Pulihkan Data</span>
                    </button>
                    <button
                      onClick={() => {
                        setShowProfileMenu(false);
                        onNavigate('settings', 'firebase');
                      }}
                      className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white transition"
                    >
                      <Settings className="w-4 h-4 text-slate-400" />
                      <span>Pengaturan Aplikasi & Cloud</span>
                    </button>
                  </div>

                  <div className="pt-2 border-t border-slate-800">
                    <button
                      onClick={() => {
                        if (confirm('Apakah Anda yakin ingin memuat ulang template administrasi default?')) {
                          DataStore.resetToDefault();
                        }
                      }}
                      className="w-full text-center text-[11px] text-rose-400 hover:text-rose-300 py-1"
                    >
                      Reset ke Format Baku Awal
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Auth & Switch Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </>
  );
};
