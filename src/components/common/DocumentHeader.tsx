import React from 'react';
import { TeacherProfile } from '../../types';
import { DataStore } from '../../services/storage';

interface DocumentHeaderProps {
  title: string;
  subTitle?: string;
  customProfile?: TeacherProfile;
  showSignatures?: boolean;
  children?: React.ReactNode;
}

export const DocumentHeader: React.FC<DocumentHeaderProps> = ({
  title,
  subTitle,
  customProfile,
  showSignatures = true,
  children,
}) => {
  const profile = customProfile || DataStore.getProfile();

  return (
    <div className="w-full bg-white text-slate-900 font-sans print:p-0">
      {/* KOP SURAT RESMI SEKOLAH / MADRASAH */}
      <div className="border-b-4 border-double border-slate-900 pb-3 mb-6">
        <div className="flex items-center justify-between gap-4">
          {/* Logo Sekolah */}
          <div className="w-20 h-20 shrink-0 flex items-center justify-center border-2 border-slate-900 rounded-lg p-1 bg-slate-50 font-black text-2xl text-blue-900 tracking-tighter">
            {profile.schoolLogoUrl ? (
              <img src={profile.schoolLogoUrl} alt="Logo Sekolah" className="w-full h-full object-contain" />
            ) : (
              <div className="text-center">
                <div className="text-xs uppercase font-extrabold text-blue-900">TUT WURI</div>
                <div className="text-[9px] text-slate-600 font-bold">HANDAYANI</div>
              </div>
            )}
          </div>

          {/* Nama & Alamat Sekolah */}
          <div className="flex-1 text-center">
            <h3 className="text-xs uppercase tracking-widest font-bold text-slate-700">
              PEMERINTAH DAERAH PROVINSI / KABUPATEN
            </h3>
            <h2 className="text-base sm:text-lg font-black tracking-tight uppercase text-blue-950">
              {profile.schoolName}
            </h2>
            <p className="text-xs text-slate-700 leading-tight">
              {profile.schoolAddress}
            </p>
            <div className="text-[11px] text-slate-600 flex items-center justify-center gap-3 mt-1 font-medium">
              <span>NPSN / NSM: <strong>{profile.npsnNsm}</strong></span>
              <span>•</span>
              <span>Website: www.{profile.schoolName.toLowerCase().replace(/[^a-z0-9]/g, '')}.sch.id</span>
            </div>
          </div>

          {/* Logo Tut Wuri / Ikon Sisi Kanan */}
          <div className="w-20 h-20 shrink-0 hidden sm:flex items-center justify-center border-2 border-slate-900 rounded-lg p-1 bg-slate-50 font-black text-xl text-slate-800 text-center">
            <div className="text-[10px] font-bold leading-tight">
              KURIKULUM<br />
              <span className="text-blue-700 font-extrabold text-xs">MERDEKA</span>
            </div>
          </div>
        </div>
      </div>

      {/* JUDUL DOKUMEN & IDENTITAS PEMBELAJARAN */}
      <div className="text-center mb-6">
        <h1 className="text-base sm:text-lg font-black uppercase tracking-wider text-slate-900 underline decoration-2 underline-offset-4">
          {title}
        </h1>
        {subTitle ? (
          <p className="text-xs sm:text-sm font-semibold text-slate-700 mt-1">{subTitle}</p>
        ) : (
          <p className="text-xs font-semibold text-slate-700 mt-1">
            TAHUN PELAJARAN {profile.academicYear} — SEMESTER {profile.semester.toUpperCase()}
          </p>
        )}
      </div>

      {/* METADATA DOKUMEN */}
      <div className="bg-slate-50 border border-slate-300 rounded-lg p-3 text-xs mb-6 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1.5 print:bg-transparent print:border-none print:p-0">
        <div className="flex">
          <span className="w-36 font-semibold text-slate-700">Satuan Pendidikan</span>
          <span className="font-bold text-slate-900">: {profile.schoolName}</span>
        </div>
        <div className="flex">
          <span className="w-36 font-semibold text-slate-700">Mata Pelajaran</span>
          <span className="font-bold text-slate-900">: {profile.subject}</span>
        </div>
        <div className="flex">
          <span className="w-36 font-semibold text-slate-700">Nama Guru Pengampu</span>
          <span className="font-bold text-slate-900">: {profile.name}</span>
        </div>
        <div className="flex">
          <span className="w-36 font-semibold text-slate-700">NIP Guru</span>
          <span className="font-bold text-slate-900">: {profile.nip}</span>
        </div>
        <div className="flex">
          <span className="w-36 font-semibold text-slate-700">Tahun Pelajaran / Sem.</span>
          <span className="font-bold text-slate-900">: {profile.academicYear} / {profile.semester}</span>
        </div>
        <div className="flex">
          <span className="w-36 font-semibold text-slate-700">Pangkat / Golongan</span>
          <span className="font-bold text-slate-900">: {profile.rankGrade} ({profile.position})</span>
        </div>
      </div>

      {/* MAIN DOCUMENT BODY */}
      <div className="w-full">
        {children}
      </div>

      {/* FORMAL SIGNATURES BLOCK */}
      {showSignatures && (
        <div className="mt-12 pt-4 border-t border-slate-300 grid grid-cols-2 gap-8 text-xs break-inside-avoid">
          {/* Mengetahui Kepala Sekolah */}
          <div className="text-left pl-4">
            <p className="text-slate-600">Mengetahui,</p>
            <p className="font-bold text-slate-900">Kepala {profile.schoolName}</p>
            <div className="h-20" />
            <p className="font-bold text-slate-950 underline text-sm">{profile.headmasterName}</p>
            <p className="text-slate-700">NIP. {profile.headmasterNip}</p>
          </div>

          {/* Guru Mata Pelajaran */}
          <div className="text-left pl-8">
            <p className="text-slate-600">{profile.signaturePlace}</p>
            <p className="font-bold text-slate-900">Guru Mata Pelajaran,</p>
            <div className="h-20" />
            <p className="font-bold text-slate-950 underline text-sm">{profile.name}</p>
            <p className="text-slate-700">NIP. {profile.nip}</p>
          </div>
        </div>
      )}
    </div>
  );
};
