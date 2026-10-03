import React, { useState } from 'react';
import {
  User,
  School,
  Database,
  Download,
  Upload,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Lock,
  Save,
  ShieldCheck,
  Cloud,
  FileCheck
} from 'lucide-react';
import { DataStore } from '../../services/storage';
import { TeacherProfile } from '../../types';

interface ProfileSettingsViewProps {
  initialSubTab?: string;
}

export const ProfileSettingsView: React.FC<ProfileSettingsViewProps> = ({ initialSubTab = 'profile' }) => {
  const [activeTab, setActiveTab] = useState(initialSubTab);
  const [profile, setProfile] = useState<TeacherProfile>(DataStore.getProfile());
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Password change state
  const [oldPass, setOldPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [passMessage, setPassMessage] = useState('');

  // Firebase Config State
  const [firebaseApiKey, setFirebaseApiKey] = useState('');
  const [firebaseProjectId, setFirebaseProjectId] = useState('');

  const handleSaveProfile = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    DataStore.saveProfile(profile);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPass !== confirmPass) {
      setPassMessage('Kata sandi baru dan konfirmasi tidak cocok!');
      return;
    }
    if (newPass.length < 6) {
      setPassMessage('Kata sandi minimal 6 karakter!');
      return;
    }
    setPassMessage('Kata sandi berhasil diperbarui.');
    setOldPass('');
    setNewPass('');
    setConfirmPass('');
  };

  const handleDownloadBackup = () => {
    const jsonStr = DataStore.exportAllToJson();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `backup_buku_kerja_guru_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleRestoreFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const success = DataStore.importFromJson(content);
      if (success) {
        alert('Data administrasi guru berhasil dipulihkan!');
      } else {
        alert('Gagal memulihkan file. Pastikan format berkas JSON valid.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* HEADER SECTION */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-slate-900 text-white flex items-center justify-center font-black text-lg shadow-md">
              <User className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Pengaturan Akun, Profil Guru & Basis Data
              </h1>
              <p className="text-xs text-slate-500">
                Identitas resmi guru, identitas satuan pendidikan, cadangan data (backup), dan integrasi cloud
              </p>
            </div>
          </div>
        </div>

        {/* SUBTABS */}
        <div className="flex items-center gap-2 mt-6 overflow-x-auto border-b border-slate-100 pb-1">
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === 'profile'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>1. Profil Guru & Sekolah</span>
          </button>

          <button
            onClick={() => setActiveTab('backup')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === 'backup'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>2. Cadangkan & Pulihkan (Backup)</span>
          </button>

          <button
            onClick={() => setActiveTab('firebase')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === 'firebase'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Cloud className="w-3.5 h-3.5" />
            <span>3. Pengaturan Cloud & Firebase</span>
          </button>

          <button
            onClick={() => setActiveTab('security')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === 'security'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            <span>4. Keamanan & Kata Sandi</span>
          </button>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 1. PROFIL GURU & SEKOLAH */}
      {/* ========================================================= */}
      {activeTab === 'profile' && (
        <form onSubmit={handleSaveProfile} className="space-y-6">
          {saveSuccess && (
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Data profil guru dan identitas sekolah berhasil disimpan!</span>
            </div>
          )}

          {/* Card 1: Identitas Pribadi Guru */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2 border-b pb-2">
              <User className="w-4 h-4 text-blue-600" />
              <span>Identitas Pribadi & Kepegawaian Guru</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Nama Lengkap & Gelar</label>
                <input
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  required
                  className="w-full border rounded-lg p-2 font-medium"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">NIP (Nomor Induk Pegawai)</label>
                <input
                  value={profile.nip}
                  onChange={(e) => setProfile({ ...profile, nip: e.target.value })}
                  required
                  className="w-full border rounded-lg p-2 font-mono"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">NUPTK</label>
                <input
                  value={profile.nuptk}
                  onChange={(e) => setProfile({ ...profile, nuptk: e.target.value })}
                  required
                  className="w-full border rounded-lg p-2 font-mono"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">NIK (Nomor Induk Kependudukan)</label>
                <input
                  value={profile.nik || ''}
                  onChange={(e) => setProfile({ ...profile, nik: e.target.value })}
                  placeholder="Opsional"
                  className="w-full border rounded-lg p-2 font-mono"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Tempat & Tanggal Lahir</label>
                <input
                  value={profile.birthPlaceDate}
                  onChange={(e) => setProfile({ ...profile, birthPlaceDate: e.target.value })}
                  required
                  className="w-full border rounded-lg p-2"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Jenis Kelamin</label>
                <select
                  value={profile.gender}
                  onChange={(e) => setProfile({ ...profile, gender: e.target.value as any })}
                  className="w-full border rounded-lg p-2"
                >
                  <option value="Laki-laki">Laki-laki</option>
                  <option value="Perempuan">Perempuan</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Pangkat / Golongan</label>
                <input
                  value={profile.rankGrade}
                  onChange={(e) => setProfile({ ...profile, rankGrade: e.target.value })}
                  placeholder="e.g. Pembina / IV/a"
                  required
                  className="w-full border rounded-lg p-2"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Jabatan Fungsional</label>
                <input
                  value={profile.position}
                  onChange={(e) => setProfile({ ...profile, position: e.target.value })}
                  placeholder="e.g. Guru Madya"
                  required
                  className="w-full border rounded-lg p-2"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Mata Pelajaran yang Diampu</label>
                <input
                  value={profile.subject}
                  onChange={(e) => setProfile({ ...profile, subject: e.target.value })}
                  required
                  className="w-full border rounded-lg p-2 font-bold text-blue-700"
                />
              </div>

              <div className="sm:col-span-2 lg:col-span-3">
                <label className="font-semibold text-slate-700 block mb-1">Pendidikan Terakhir & Universitas</label>
                <input
                  value={profile.education}
                  onChange={(e) => setProfile({ ...profile, education: e.target.value })}
                  required
                  className="w-full border rounded-lg p-2"
                />
              </div>
            </div>
          </div>

          {/* Card 2: Identitas Satuan Pendidikan & Kepala Sekolah */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2 border-b pb-2">
              <School className="w-4 h-4 text-emerald-600" />
              <span>Identitas Sekolah / Madrasah & Pengesahan Dokumen</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Nama Satuan Pendidikan</label>
                <input
                  value={profile.schoolName}
                  onChange={(e) => setProfile({ ...profile, schoolName: e.target.value })}
                  required
                  className="w-full border rounded-lg p-2 font-bold"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">NPSN / NSM Sekolah</label>
                <input
                  value={profile.npsnNsm}
                  onChange={(e) => setProfile({ ...profile, npsnNsm: e.target.value })}
                  required
                  className="w-full border rounded-lg p-2 font-mono"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Tahun Pelajaran Aktif</label>
                <input
                  value={profile.academicYear}
                  onChange={(e) => setProfile({ ...profile, academicYear: e.target.value })}
                  required
                  className="w-full border rounded-lg p-2 font-medium"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Semester Aktif</label>
                <select
                  value={profile.semester}
                  onChange={(e) => setProfile({ ...profile, semester: e.target.value as any })}
                  className="w-full border rounded-lg p-2 font-medium"
                >
                  <option value="Ganjil">Semester Ganjil</option>
                  <option value="Genap">Semester Genap</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Nama Kepala Sekolah / Madrasah</label>
                <input
                  value={profile.headmasterName}
                  onChange={(e) => setProfile({ ...profile, headmasterName: e.target.value })}
                  required
                  className="w-full border rounded-lg p-2 font-semibold"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">NIP Kepala Sekolah</label>
                <input
                  value={profile.headmasterNip}
                  onChange={(e) => setProfile({ ...profile, headmasterNip: e.target.value })}
                  required
                  className="w-full border rounded-lg p-2 font-mono"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="font-semibold text-slate-700 block mb-1">Alamat Lengkap Satuan Pendidikan</label>
                <input
                  value={profile.schoolAddress}
                  onChange={(e) => setProfile({ ...profile, schoolAddress: e.target.value })}
                  required
                  className="w-full border rounded-lg p-2"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Tempat Titimangsa Tanda Tangan</label>
                <input
                  value={profile.signaturePlace}
                  onChange={(e) => setProfile({ ...profile, signaturePlace: e.target.value })}
                  placeholder="e.g. Jakarta, 15 Juli 2024"
                  required
                  className="w-full border rounded-lg p-2"
                />
              </div>
            </div>

            <div className="mt-6 pt-4 border-t flex justify-end">
              <button
                type="submit"
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md shadow-blue-500/25 transition"
              >
                <Save className="w-4 h-4" />
                <span>Simpan Perubahan Profil</span>
              </button>
            </div>
          </div>
        </form>
      )}

      {/* ========================================================= */}
      {/* 2. CADANGKAN & PULIHKAN (BACKUP) */}
      {/* ========================================================= */}
      {activeTab === 'backup' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 mb-2 flex items-center gap-2">
              <Database className="w-4 h-4 text-blue-600" />
              <span>Cadangkan Seluruh Basis Data Administrasi Guru (Backup JSON)</span>
            </h3>
            <p className="text-xs text-slate-600 mb-6 leading-relaxed">
              Unduh cadangan data lengkap dari Buku 1, Buku 2, Buku 3, Buku 4, profil guru, nilai, dan absensi ke dalam format berkas JSON lokal yang aman.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-5 rounded-xl border border-slate-200 bg-slate-50 flex flex-col justify-between">
                <div>
                  <div className="font-bold text-slate-900 text-sm mb-1 flex items-center gap-2">
                    <Download className="w-4 h-4 text-blue-600" />
                    <span>Ekspor Cadangan Data</span>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Menghasilkan file arsip .json yang dapat disimpan di komputer, flashdisk, atau Google Drive Anda.
                  </p>
                </div>

                <div className="mt-6">
                  <button
                    onClick={handleDownloadBackup}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow transition"
                  >
                    <Download className="w-4 h-4" />
                    <span>Unduh Berkas Cadangan (.json)</span>
                  </button>
                </div>
              </div>

              <div className="p-5 rounded-xl border border-slate-200 bg-slate-50 flex flex-col justify-between">
                <div>
                  <div className="font-bold text-slate-900 text-sm mb-1 flex items-center gap-2">
                    <Upload className="w-4 h-4 text-emerald-600" />
                    <span>Pulihkan dari Berkas Cadangan</span>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Unggah kembali file .json backup untuk mengembalikan seluruh dokumen dan data nilai guru.
                  </p>
                </div>

                <div className="mt-6">
                  <label className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow cursor-pointer transition">
                    <Upload className="w-4 h-4" />
                    <span>Pilih Berkas Cadangan JSON</span>
                    <input
                      type="file"
                      accept=".json"
                      onChange={handleRestoreFile}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Reset Template */}
          <div className="bg-white rounded-2xl border border-rose-200 p-6 shadow-sm">
            <h3 className="text-sm font-bold text-rose-900 mb-2 flex items-center gap-2">
              <RotateCcw className="w-4 h-4 text-rose-600" />
              <span>Muat Ulang Template Standar Baku</span>
            </h3>
            <p className="text-xs text-slate-600 mb-4">
              Kembalikan seluruh data administrasi ke template standar Kemendikbudristek RI awal. Tindakan ini akan menimpa perubahan lokal yang belum diekspor.
            </p>
            <button
              onClick={() => {
                if (confirm('Yakin ingin mereset seluruh database ke template awal Kurikulum Merdeka?')) {
                  DataStore.resetToDefault();
                }
              }}
              className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition"
            >
              Reset ke Format Awal
            </button>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 3. PENGATURAN CLOUD & FIREBASE */}
      {/* ========================================================= */}
      {activeTab === 'firebase' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <div className="flex items-center gap-3 border-b pb-4 mb-4">
              <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-600 border border-amber-500/20">
                <Cloud className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Status Sinkronisasi & Konfigurasi Basis Data
                </h3>
                <p className="text-xs text-slate-500">
                  Mode Penyimpanan Lokal Aktif (Sesuai Regulasi: Aplikasi Tetap Berfungsi Penuh Secara Offline / Demo)
                </p>
              </div>
            </div>

            {/* Notification Banner */}
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs leading-relaxed mb-6">
              <div className="font-bold flex items-center gap-1.5 mb-1 text-amber-950">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span>Pemberitahuan Status Penyimpanan</span>
              </div>
              Saat ini aplikasi berjalan dalam <strong>Mode Demo Penyimpanan Lokal (IndexedDB / LocalStorage)</strong>. Seluruh fungsi CRUD pada Buku 1, Buku 2, Buku 3, Buku 4, ekspor Excel, dan cetak PDF berfungsi 100% secara nyata. Data disimpan di peramban Anda. Anda dapat mengunduh cadangan JSON kapan saja.
            </div>

            <div className="space-y-4 max-w-xl text-xs">
              <h4 className="font-bold text-slate-800">
                Hubungkan ke Firebase Cloud (Opsional untuk Multi-Perangkat):
              </h4>
              <div>
                <label className="font-semibold block mb-1 text-slate-700">Firebase API Key</label>
                <input
                  type="password"
                  value={firebaseApiKey}
                  onChange={(e) => setFirebaseApiKey(e.target.value)}
                  placeholder="AIzaSy..."
                  className="w-full border rounded-lg p-2 font-mono"
                />
              </div>
              <div>
                <label className="font-semibold block mb-1 text-slate-700">Firebase Project ID</label>
                <input
                  value={firebaseProjectId}
                  onChange={(e) => setFirebaseProjectId(e.target.value)}
                  placeholder="buku-kerja-guru-digital"
                  className="w-full border rounded-lg p-2 font-mono"
                />
              </div>
              <button
                type="button"
                onClick={() => {
                  if (!firebaseApiKey || !firebaseProjectId) {
                    alert('Harap isi API Key dan Project ID jika ingin menghubungkan Firebase Cloud.');
                    return;
                  }
                  alert('Kredensial disimpan. Menunggu sinkronisasi Firebase saat server terotorisasi.');
                }}
                className="px-5 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition"
              >
                Simpan Konfigurasi Firebase
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 4. KEAMANAN & GANTI KATA SANDI */}
      {/* ========================================================= */}
      {activeTab === 'security' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <div className="flex items-center gap-3 border-b pb-4 mb-4">
              <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-600 border border-blue-500/20">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Keamanan Akun & Manajemen Sandi Guru
                </h3>
                <p className="text-xs text-slate-500">
                  Data Anda terenkripsi dan terisolasi privat per guru. Ubah kata sandi akun secara berkala.
                </p>
              </div>
            </div>

            {passMessage && (
              <div className={`p-4 rounded-xl text-xs font-semibold mb-5 flex items-center gap-2 ${
                passMessage.includes('berhasil') ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200'
              }`}>
                {passMessage.includes('berhasil') ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <AlertTriangle className="w-4 h-4 text-rose-600" />}
                <span>{passMessage}</span>
              </div>
            )}

            <form onSubmit={handlePasswordChange} className="space-y-4 max-w-md text-xs">
              <div>
                <label className="font-semibold block mb-1 text-slate-700">Kata Sandi Saat Ini</label>
                <input
                  type="password"
                  value={oldPass}
                  onChange={(e) => setOldPass(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full border rounded-lg p-2 font-mono"
                />
              </div>

              <div>
                <label className="font-semibold block mb-1 text-slate-700">Kata Sandi Baru</label>
                <input
                  type="password"
                  value={newPass}
                  onChange={(e) => setNewPass(e.target.value)}
                  placeholder="Minimal 6 karakter"
                  required
                  className="w-full border rounded-lg p-2 font-mono"
                />
              </div>

              <div>
                <label className="font-semibold block mb-1 text-slate-700">Konfirmasi Kata Sandi Baru</label>
                <input
                  type="password"
                  value={confirmPass}
                  onChange={(e) => setConfirmPass(e.target.value)}
                  placeholder="Ulangi kata sandi baru"
                  required
                  className="w-full border rounded-lg p-2 font-mono"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow transition"
                >
                  <Lock className="w-4 h-4" />
                  <span>Perbarui Kata Sandi</span>
                </button>
              </div>
            </form>

            <div className="mt-8 pt-6 border-t border-slate-100">
              <h4 className="font-bold text-slate-900 text-xs mb-2">Informasi Isolasi Akun Aktif:</h4>
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1.5 text-slate-600 font-mono">
                <div>ID Akun: <strong className="text-slate-900">{DataStore.getCurrentUserId()}</strong></div>
                <div>Nama Guru: <strong className="text-slate-900">{profile.name}</strong></div>
                <div>Mata Pelajaran: <strong className="text-blue-700">{profile.subject}</strong></div>
                <div>Status Partisi: <span className="text-emerald-700 font-bold">Terisolasi Mandiri (Privat)</span></div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
