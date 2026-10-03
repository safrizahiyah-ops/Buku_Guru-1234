import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  FileText,
  Sparkles,
  Plus,
  Trash2,
  Printer,
  CheckCircle,
  Clock,
  ArrowRight,
  BrainCircuit,
  MessageSquare
} from 'lucide-react';
import { DataStore } from '../../services/storage';
import { ReflectionJournal, FollowUpProgramItem } from '../../types';
import { PrintModal } from '../common/PrintModal';
import { generateEducationalContent } from '../../services/ai';

interface Buku4ViewProps {
  initialSubTab?: string;
  onOpenAIWithPrompt?: (prompt: string, type: any) => void;
}

export const Buku4View: React.FC<Buku4ViewProps> = ({ initialSubTab = 'refleksi', onOpenAIWithPrompt }) => {
  const [activeSubTab, setActiveSubTab] = useState(initialSubTab);

  const [refleksiList, setRefleksiList] = useState<ReflectionJournal[]>(DataStore.getRefleksi());
  const [tindakLanjutList, setTindakLanjutList] = useState<FollowUpProgramItem[]>(DataStore.getTindakLanjut());
  const [showJournalPickerModal, setShowJournalPickerModal] = useState(false);

  // Form states
  const [showAddModal, setShowAddModal] = useState(false);
  const [modalType, setModalType] = useState<string>('refleksi');
  const [isSummarizingAI, setIsSummarizingAI] = useState(false);

  // Handle pull from KBM Journal to Reflection
  const handlePullFromJournal = (journal: any) => {
    const newRef = DataStore.createReflectionFromJournal(journal);
    const updated = [newRef, ...refleksiList];
    setRefleksiList(updated);
    setShowJournalPickerModal(false);
    alert(`Sistem Otomatis: Catatan KBM materi "${journal.topicMaterial}" berhasil ditarik menjadi draf Jurnal Refleksi lengkap!`);
  };

  // Print modal
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [printDoc, setPrintDoc] = useState<{ title: string; subTitle?: string; content: React.ReactNode }>({
    title: '',
    content: null,
  });

  useEffect(() => {
    setActiveSubTab(initialSubTab);
  }, [initialSubTab]);

  useEffect(() => {
    const handleUpdate = () => {
      setRefleksiList(DataStore.getRefleksi());
      setTindakLanjutList(DataStore.getTindakLanjut());
    };
    window.addEventListener('bkgd-store-update', handleUpdate);
    return () => window.removeEventListener('bkgd-store-update', handleUpdate);
  }, []);

  const subTabs = [
    { id: 'refleksi', label: '1. Jurnal Refleksi Guru', icon: FileText },
    { id: 'tindak_lanjut', label: '2. Program Tindak Lanjut', icon: TrendingUp },
  ];

  // AI Refleksi Helper
  const handleAIReflectionSummary = async (ref: ReflectionJournal) => {
    setIsSummarizingAI(true);
    const res = await generateEducationalContent({
      type: 'refleksi',
      prompt: `Bantu saya menyusun simpulan refleksi pedagogis terstruktur dan rekomendasi perbaikan untuk jurnal mengajar:
Materi: ${ref.topic}
Hal baik: ${ref.whatWentWell}
Kendala: ${ref.challenges}
Respon siswa: ${ref.studentResponse}
Evaluasi metode: ${ref.methodEvaluation}`,
    });
    setIsSummarizingAI(false);

    if (res.success) {
      const updated = refleksiList.map(r => r.id === ref.id ? { ...r, aiPedagogicalSummary: res.content } : r);
      DataStore.saveRefleksi(updated);
      setRefleksiList(updated);
      alert('Analisis dan rangkuman pedagogis AI berhasil diperbarui pada jurnal refleksi ini!');
    } else {
      alert(res.error || 'Gagal menghasilkan rangkuman AI');
    }
  };

  const handleSaveRefleksi = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const newRef: ReflectionJournal = {
      id: `ref-${Date.now()}`,
      date: fd.get('date') as string,
      className: fd.get('className') as string,
      subject: DataStore.getProfile().subject,
      topic: fd.get('topic') as string,
      whatWentWell: fd.get('whatWentWell') as string,
      challenges: fd.get('challenges') as string,
      studentResponse: fd.get('studentResponse') as string,
      methodEvaluation: fd.get('methodEvaluation') as string,
      pointsToImprove: fd.get('pointsToImprove') as string,
      actionPlan: fd.get('actionPlan') as string,
    };
    const updated = [newRef, ...refleksiList];
    DataStore.saveRefleksi(updated);
    setRefleksiList(updated);
    setShowAddModal(false);
  };

  const handleSaveTindakLanjut = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const newTL: FollowUpProgramItem = {
      id: `tl-${Date.now()}`,
      sourceFinding: fd.get('sourceFinding') as string,
      identifiedIssue: fd.get('identifiedIssue') as string,
      improvementPlan: fd.get('improvementPlan') as string,
      strategy: fd.get('strategy') as string,
      targetSuccess: fd.get('targetSuccess') as string,
      schedule: fd.get('schedule') as string,
      result: fd.get('result') as string,
      successEvaluation: fd.get('successEvaluation') as any,
    };
    const updated = [newTL, ...tindakLanjutList];
    DataStore.saveTindakLanjut(updated);
    setTindakLanjutList(updated);
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* HEADER SECTION */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-purple-600 text-white flex items-center justify-center font-black text-lg shadow-md shadow-purple-500/20">
              B4
            </div>
            <div>
              <span className="text-[11px] font-extrabold text-purple-600 uppercase tracking-wider bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                BUKU KERJA 4
              </span>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-0.5">
                Refleksi dan Tindak Lanjut
              </h1>
              <p className="text-xs text-slate-500">
                Jurnal Refleksi Pembelajaran Guru, Evaluasi Diri, dan Program Tindak Lanjut Hasil Supervisi
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                DataStore.generateFormalPdf({
                  title: 'LAPORAN REFLEKSI DAN TINDAK LANJUT PEMBELAJARAN',
                  subTitle: `SEMESTER ${DataStore.getProfile().semester.toUpperCase()} — T.P. ${DataStore.getProfile().academicYear}`,
                  columns: ['No', 'Komponen', 'Uraian Temuan / Rencana', 'Hasil & Keterlaksanaan'],
                  rows: [
                    ...refleksiList.map((r, i) => [
                      `R-${i + 1}`,
                      `Refleksi KBM: ${r.topic} (${r.date})`,
                      `Kendala: ${r.challenges}\nRencana: ${r.actionPlan}`,
                      r.whatWentWell,
                    ]),
                    ...tindakLanjutList.map((t, i) => [
                      `TL-${i + 1}`,
                      `Tindak Lanjut: ${t.sourceFinding}`,
                      `Masalah: ${t.identifiedIssue}\nStrategi: ${t.strategy}`,
                      `${t.result} (${t.successEvaluation})`,
                    ]),
                  ],
                });
              }}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-purple-600 text-white text-xs font-bold shadow hover:bg-purple-500 transition"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Cetak Laporan Buku 4</span>
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
                    ? 'bg-purple-600 text-white shadow-md shadow-purple-500/20'
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
      {/* 1. JURNAL REFLEKSI GURU */}
      {/* ========================================================= */}
      {activeSubTab === 'refleksi' && (
        <div className="space-y-4">
          {/* Automatic pipeline callout */}
          <div className="p-3.5 rounded-xl bg-gradient-to-r from-purple-500/10 via-indigo-500/10 to-purple-500/10 border border-purple-300 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5">
              <Sparkles className="w-5 h-5 text-purple-600 shrink-0" />
              <div>
                <span className="font-bold text-slate-900 block">
                  Sistem Satu Kali Input: Hubungkan Jurnal Mengajar ke Jurnal Refleksi
                </span>
                <span className="text-slate-600">
                  Tarik otomatis catatan pembelajaran, kendala, respon siswa, dan tindak lanjut dari Jurnal Mengajar KBM tanpa mengetik ulang.
                </span>
              </div>
            </div>

            <button
              onClick={() => setShowJournalPickerModal(true)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-bold shadow transition shrink-0"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Tarik Catatan dari Jurnal KBM</span>
            </button>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Catatan Jurnal Refleksi Pembelajaran Guru</h3>
              <p className="text-xs text-slate-500">Evaluasi pedagogis berkelanjutan pasca KBM dilengkapi bantuan analisis AI</p>
            </div>
            <button
              onClick={() => {
                setModalType('refleksi');
                setShowAddModal(true);
              }}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-purple-600 text-white text-xs font-bold transition shadow"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Tulis Refleksi Manual</span>
            </button>
          </div>

          <div className="space-y-4">
            {refleksiList.map((ref) => (
              <div key={ref.id} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs bg-purple-50 text-purple-700 border border-purple-200 px-2.5 py-0.5 rounded">
                        {ref.date}
                      </span>
                      <span className="text-xs font-semibold text-slate-500">Kelas: {ref.className}</span>
                    </div>
                    <h4 className="text-base font-bold text-slate-900 mt-1">{ref.topic}</h4>
                  </div>

                  <button
                    onClick={() => handleAIReflectionSummary(ref)}
                    disabled={isSummarizingAI}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xs font-bold shadow hover:from-purple-500 hover:to-indigo-500 transition disabled:opacity-50"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-sky-200" />
                    <span>{isSummarizingAI ? 'AI Menganalisis...' : 'AI Rangkum Refleksi'}</span>
                  </button>
                </div>

                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="p-3 bg-emerald-50/50 rounded-xl border border-emerald-100">
                    <strong className="text-emerald-900 block mb-1">1. Hal yang Berjalan Baik:</strong>
                    <p className="text-slate-700 leading-relaxed">{ref.whatWentWell}</p>
                  </div>
                  <div className="p-3 bg-rose-50/50 rounded-xl border border-rose-100">
                    <strong className="text-rose-900 block mb-1">2. Kendala yang Dihadapi:</strong>
                    <p className="text-slate-700 leading-relaxed">{ref.challenges}</p>
                  </div>
                  <div className="p-3 bg-blue-50/50 rounded-xl border border-blue-100">
                    <strong className="text-blue-900 block mb-1">3. Respons Peserta Didik:</strong>
                    <p className="text-slate-700 leading-relaxed">{ref.studentResponse}</p>
                  </div>
                  <div className="p-3 bg-amber-50/50 rounded-xl border border-amber-100">
                    <strong className="text-amber-900 block mb-1">4. Rencana Perbaikan KBM:</strong>
                    <p className="text-slate-700 leading-relaxed">{ref.actionPlan}</p>
                  </div>
                </div>

                {ref.aiPedagogicalSummary && (
                  <div className="mt-4 p-4 rounded-xl bg-gradient-to-r from-purple-900/5 to-indigo-900/10 border border-purple-200 text-xs">
                    <div className="flex items-center gap-2 text-purple-900 font-bold mb-1">
                      <BrainCircuit className="w-4 h-4 text-purple-600" />
                      <span>Rangkuman & Rekomendasi Pedagogis AI:</span>
                    </div>
                    <p className="text-slate-800 leading-relaxed whitespace-pre-line font-medium">
                      {ref.aiPedagogicalSummary}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 2. PROGRAM TINDAK LANJUT */}
      {/* ========================================================= */}
      {activeSubTab === 'tindak_lanjut' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Program Tindak Lanjut Hasil Supervisi & Evaluasi</h3>
              <p className="text-xs text-slate-500">Rencana aksi perbaikan terstruktur pasca supervisi akademik kepala sekolah</p>
            </div>
            <button
              onClick={() => {
                setModalType('tindak_lanjut');
                setShowAddModal(true);
              }}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-purple-600 text-white text-xs font-bold hover:bg-purple-500 transition shadow"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Tambah Program</span>
            </button>
          </div>

          <div className="space-y-4">
            {tindakLanjutList.map((tl) => (
              <div key={tl.id} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3 mb-3">
                  <div>
                    <span className="text-[10px] font-bold uppercase bg-purple-50 text-purple-700 px-2 py-0.5 rounded border border-purple-200">
                      Sumber: {tl.sourceFinding}
                    </span>
                    <h4 className="text-sm font-bold text-slate-900 mt-1">
                      Masalah: {tl.identifiedIssue}
                    </h4>
                  </div>
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-100 text-emerald-800">
                    {tl.successEvaluation}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div>
                    <strong className="text-slate-900">Rencana Aksi Perbaikan:</strong>
                    <p className="text-slate-600 mt-0.5">{tl.improvementPlan}</p>
                    <strong className="text-slate-900 block mt-2">Strategi Pelaksanaan:</strong>
                    <p className="text-slate-600 mt-0.5">{tl.strategy}</p>
                  </div>
                  <div>
                    <strong className="text-slate-900">Target Keberhasilan:</strong>
                    <p className="text-slate-600 mt-0.5">{tl.targetSuccess}</p>
                    <div className="mt-2 p-2.5 bg-emerald-50 rounded-lg border border-emerald-100">
                      <strong className="text-emerald-900">Hasil Nyata:</strong>
                      <p className="text-emerald-800 mt-0.5">{tl.result}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL FORM */}
      {/* ========================================================= */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="text-base font-bold text-slate-900 mb-4">
              {modalType === 'refleksi' ? 'Tulis Jurnal Refleksi Baru' : 'Tambah Program Tindak Lanjut'}
            </h3>

            {modalType === 'refleksi' ? (
              <form onSubmit={handleSaveRefleksi} className="space-y-3 text-xs">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="font-semibold block mb-1">Tanggal</label>
                    <input name="date" type="date" defaultValue={new Date().toISOString().split('T')[0]} required className="w-full border rounded-lg p-2" />
                  </div>
                  <div>
                    <label className="font-semibold block mb-1">Kelas</label>
                    <input name="className" defaultValue="VII-A" required className="w-full border rounded-lg p-2" />
                  </div>
                </div>
                <div>
                  <label className="font-semibold block mb-1">Materi / Topik Pembelajaran</label>
                  <input name="topic" placeholder="e.g. Pembelajaran Teks Prosedur" required className="w-full border rounded-lg p-2" />
                </div>
                <div>
                  <label className="font-semibold block mb-1">Hal yang Berjalan Baik</label>
                  <textarea name="whatWentWell" rows={2} required className="w-full border rounded-lg p-2" placeholder="Antusiasme siswa, penggunaan LKPD visual..." />
                </div>
                <div>
                  <label className="font-semibold block mb-1">Kendala yang Dihadapi</label>
                  <textarea name="challenges" rows={2} required className="w-full border rounded-lg p-2" placeholder="Waktu diskusi terbatas, ada siswa pasif..." />
                </div>
                <div>
                  <label className="font-semibold block mb-1">Respons Siswa</label>
                  <input name="studentResponse" required className="w-full border rounded-lg p-2" placeholder="Siswa sangat senang belajar berkelompok..." />
                </div>
                <div>
                  <label className="font-semibold block mb-1">Rencana Perbaikan KBM Berikutnya</label>
                  <textarea name="actionPlan" rows={2} required className="w-full border rounded-lg p-2" placeholder="Menerapkan peran terstruktur dalam kelompok..." />
                </div>

                <div className="flex justify-end gap-2 pt-3">
                  <button type="button" onClick={() => setShowAddModal(false)} className="px-4 py-2 border rounded-lg">Batal</button>
                  <button type="submit" className="px-4 py-2 bg-purple-600 text-white rounded-lg font-bold">Simpan Refleksi</button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleSaveTindakLanjut} className="space-y-3 text-xs">
                <div>
                  <label className="font-semibold block mb-1">Sumber Temuan</label>
                  <input name="sourceFinding" defaultValue="Supervisi Kepala Sekolah" required className="w-full border rounded-lg p-2" />
                </div>
                <div>
                  <label className="font-semibold block mb-1">Identifikasi Masalah</label>
                  <input name="identifiedIssue" required className="w-full border rounded-lg p-2" placeholder="e.g. Penggunaan media ajar belum bervariasi" />
                </div>
                <div>
                  <label className="font-semibold block mb-1">Rencana Aksi Perbaikan</label>
                  <textarea name="improvementPlan" rows={2} required className="w-full border rounded-lg p-2" placeholder="Mengintegrasikan media pembelajaran interaktif digital" />
                </div>
                <div>
                  <label className="font-semibold block mb-1">Strategi Pelaksanaan</label>
                  <input name="strategy" required className="w-full border rounded-lg p-2" placeholder="Mengikuti pelatihan di Komunitas Belajar" />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="font-semibold block mb-1">Target</label>
                    <input name="targetSuccess" defaultValue="100% siswa aktif" required className="w-full border rounded-lg p-2" />
                  </div>
                  <div>
                    <label className="font-semibold block mb-1">Jadwal</label>
                    <input name="schedule" defaultValue="Oktober - November" required className="w-full border rounded-lg p-2" />
                  </div>
                </div>
                <div>
                  <label className="font-semibold block mb-1">Hasil Nyata</label>
                  <input name="result" defaultValue="Keterlibatan siswa meningkat signifikan" required className="w-full border rounded-lg p-2" />
                </div>
                <div>
                  <label className="font-semibold block mb-1">Evaluasi Keberhasilan</label>
                  <select name="successEvaluation" className="w-full border rounded-lg p-2">
                    <option value="Tercapai Sangat Baik">Tercapai Sangat Baik</option>
                    <option value="Tercapai Cukup">Tercapai Cukup</option>
                    <option value="Perlu Tindak Lanjut Ulang">Perlu Tindak Lanjut Ulang</option>
                  </select>
                </div>

                <div className="flex justify-end gap-2 pt-3">
                  <button type="button" onClick={() => setShowAddModal(false)} className="px-4 py-2 border rounded-lg">Batal</button>
                  <button type="submit" className="px-4 py-2 bg-purple-600 text-white rounded-lg font-bold">Simpan Program</button>
                </div>
              </form>
            )}
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
