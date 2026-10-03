import React, { useState } from 'react';
import {
  X,
  User,
  Lock,
  Mail,
  School,
  BookOpen,
  CheckCircle2,
  ShieldCheck,
  UserPlus,
  LogIn,
  Users
} from 'lucide-react';
import { DataStore, defaultAccounts } from '../../services/storage';
import { UserAccount } from '../../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const [mode, setMode] = useState<'switch' | 'login' | 'register'>('switch');
  const [accounts, setAccounts] = useState<UserAccount[]>(DataStore.getAccounts());
  const currentUserId = DataStore.getCurrentUserId();

  // Form states for login/register
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [nip, setNip] = useState('');
  const [subject, setSubject] = useState('');
  const [schoolName, setSchoolName] = useState('SMP Negeri 1 Nusantara');

  if (!isOpen) return null;

  const handleSelectAccount = (userId: string) => {
    DataStore.setCurrentUserId(userId);
    onClose();
    window.location.reload();
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const existing = accounts.find(a => a.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      DataStore.setCurrentUserId(existing.id);
      onClose();
      window.location.reload();
    } else {
      alert('Akun guru dengan email tersebut belum terdaftar. Silakan pilih tab "Daftar Akun Baru".');
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !subject) {
      alert('Mohon lengkapi seluruh kolom formulir registrasi guru.');
      return;
    }

    const newUserId = `guru-${Date.now()}`;
    const newAccount: UserAccount = {
      id: newUserId,
      email,
      name,
      nip: nip || `1985${Math.floor(10000000000000 + Math.random() * 90000000000000)}`,
      role: 'guru',
      subject,
      schoolName: schoolName || 'SMP Negeri 1 Nusantara',
      createdAt: new Date().toISOString().split('T')[0],
    };

    DataStore.saveAccount(newAccount);
    DataStore.setCurrentUserId(newUserId);

    // Initialize custom profile for this new teacher
    DataStore.saveProfile({
      id: `prof-${newUserId}`,
      userId: newUserId,
      name: newAccount.name,
      title: 'M.Pd.',
      nip: newAccount.nip,
      nuptk: `${Math.floor(1000000000000000 + Math.random() * 9000000000000000)}`,
      birthPlaceDate: 'Jakarta, 12 Agustus 1986',
      gender: 'Laki-laki',
      education: 'S1/S2 Pendidikan ' + subject,
      rankGrade: 'Penata Muda / III/a',
      position: 'Guru Pertama',
      subject: newAccount.subject,
      schoolName: newAccount.schoolName,
      npsnNsm: '20218945',
      schoolAddress: 'Jl. Ki Hajar Dewantara No. 45, Kompleks Pendidikan, Jakarta',
      academicYear: '2024/2025',
      semester: 'Ganjil',
      headmasterName: 'Drs. H. Ahmad Fauzi, M.Pd.',
      headmasterNip: '19680515 199403 1 005',
      signaturePlace: 'Jakarta, 15 Juli 2024',
    });

    // Inisialisasi data starter terisolasi khusus untuk guru baru ini
    DataStore.saveCP([
      {
        id: `cp-${newUserId}-1`,
        subject: newAccount.subject,
        phase: 'Fase D (Kelas 7-9)' as any,
        grade: 'Kelas VII',
        element: 'Pemahaman Konsep & Keterampilan Proses',
        description: `Peserta didik mampu memahami konsep esensial dan aplikasi praktis mata pelajaran ${newAccount.subject} secara mandiri dan bernalar kritis.`,
        createdAt: new Date().toISOString().split('T')[0],
      },
    ]);

    DataStore.saveStudents([
      { id: `std-${newUserId}-1`, nis: '24101', nisn: '0098712401', name: 'Ahmad Al-Fatih', gender: 'L', className: 'VII-C' },
      { id: `std-${newUserId}-2`, nis: '24102', nisn: '0098712402', name: 'Bilqis Anindya Putri', gender: 'P', className: 'VII-C' },
      { id: `std-${newUserId}-3`, nis: '24103', nisn: '0098712403', name: 'Cahya Ramadhan', gender: 'L', className: 'VII-C' },
    ]);

    onClose();
    window.location.reload();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl border border-slate-200 max-w-lg w-full p-6 shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b pb-4 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-slate-900 leading-tight">
                Manajemen Akun & Isolasi Data Guru
              </h3>
              <p className="text-xs text-slate-500">
                Setiap guru memiliki akun privat dengan ruang data terisolasi mandiri.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl mb-5 text-xs font-bold">
          <button
            onClick={() => setMode('switch')}
            className={`flex-1 py-2 rounded-lg transition ${
              mode === 'switch' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Pilih / Ganti Akun Guru
          </button>
          <button
            onClick={() => setMode('register')}
            className={`flex-1 py-2 rounded-lg transition ${
              mode === 'register' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Daftar Akun Baru
          </button>
          <button
            onClick={() => setMode('login')}
            className={`flex-1 py-2 rounded-lg transition ${
              mode === 'login' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Masuk Email
          </button>
        </div>

        {/* TAB 1: SWITCH GURU */}
        {mode === 'switch' && (
          <div className="space-y-4">
            <div className="text-xs text-slate-600 mb-2">
              Pilih akun guru di bawah ini untuk melihat isolasi penuh data (CP, TP, ATP, Modul, Nilai, dan Siswa):
            </div>

            <div className="space-y-2.5">
              {accounts.map((acc) => {
                const isActive = acc.id === currentUserId;
                return (
                  <div
                    key={acc.id}
                    onClick={() => handleSelectAccount(acc.id)}
                    className={`p-3.5 rounded-xl border cursor-pointer transition flex items-center justify-between ${
                      isActive
                        ? 'border-blue-500 bg-blue-50/70 shadow-sm'
                        : 'border-slate-200 hover:border-blue-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full font-bold text-sm flex items-center justify-center ${
                        isActive ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-700'
                      }`}>
                        {acc.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-bold text-xs text-slate-900">{acc.name}</div>
                        <div className="text-[11px] text-slate-500">
                          {acc.subject} • NIP: {acc.nip}
                        </div>
                        <div className="text-[10px] text-blue-700 font-medium">{acc.email}</div>
                      </div>
                    </div>

                    {isActive ? (
                      <span className="text-[11px] font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Aktif</span>
                      </span>
                    ) : (
                      <span className="text-xs font-semibold text-slate-500 hover:text-blue-600">
                        Beralih &rarr;
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 2: REGISTER GURU BARU */}
        {mode === 'register' && (
          <form onSubmit={handleRegister} className="space-y-3 text-xs">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Nama Lengkap & Gelar</label>
              <input
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Ahmad Fauzan, S.Pd., M.Pd."
                className="w-full border rounded-lg p-2 font-medium"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Mata Pelajaran</label>
                <input
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g. Ilmu Pengetahuan Alam (IPA)"
                  className="w-full border rounded-lg p-2 font-semibold"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">NIP (Opsional)</label>
                <input
                  value={nip}
                  onChange={(e) => setNip(e.target.value)}
                  placeholder="1987..."
                  className="w-full border rounded-lg p-2 font-mono"
                />
              </div>
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Satuan Pendidikan (Sekolah)</label>
              <input
                required
                value={schoolName}
                onChange={(e) => setSchoolName(e.target.value)}
                className="w-full border rounded-lg p-2 font-medium"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Email Guru</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="guru@sekolah.sch.id"
                  className="w-full border rounded-lg p-2"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Kata Sandi</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimal 6 karakter"
                  className="w-full border rounded-lg p-2"
                />
              </div>
            </div>

            <div className="pt-3">
              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md transition"
              >
                Daftar & Masuk ke Ruang Data Pribadi
              </button>
            </div>
          </form>
        )}

        {/* TAB 3: LOGIN EMAIL */}
        {mode === 'login' && (
          <form onSubmit={handleLogin} className="space-y-3 text-xs">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Email Terdaftar</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="siti.nurjanah@guru.belajar.id"
                className="w-full border rounded-lg p-2"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Kata Sandi</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Kata sandi akun"
                className="w-full border rounded-lg p-2"
              />
            </div>

            <div className="pt-3">
              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-blue-600 text-white font-bold text-xs shadow-md transition"
              >
                Masuk ke Akun Guru
              </button>
            </div>
          </form>
        )}

        <div className="mt-4 pt-3 border-t text-[11px] text-slate-400 text-center">
          Seluruh data administrasi tersimpan eksklusif untuk akun yang sedang aktif.
        </div>
      </div>
    </div>
  );
};
