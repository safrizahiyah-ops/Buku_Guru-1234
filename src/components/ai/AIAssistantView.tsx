import React, { useState } from 'react';
import {
  Sparkles,
  Send,
  Copy,
  Check,
  RefreshCw,
  BookmarkCheck,
  Edit3,
  Bot,
  User,
  School,
  CheckCircle2,
  FileText,
  BookOpen,
  ArrowRight,
  Layers,
  HelpCircle
} from 'lucide-react';
import { AI_CAPABILITIES, generateEducationalContent, AIGenerationRequest } from '../../services/ai';
import { DataStore } from '../../services/storage';

interface AIAssistantViewProps {
  onNavigate: (tab: string, subTab?: string) => void;
  presetPrompt?: string;
  presetType?: any;
}

export const AIAssistantView: React.FC<AIAssistantViewProps> = ({
  onNavigate,
  presetPrompt = '',
  presetType = 'tp',
}) => {
  const profile = DataStore.getProfile();

  const [selectedCapability, setSelectedCapability] = useState<string>(presetType);
  const [userPrompt, setUserPrompt] = useState<string>(
    presetPrompt || AI_CAPABILITIES.find(c => c.id === presetType)?.defaultPrompt || ''
  );

  // Overrides
  const [subjectOverride, setSubjectOverride] = useState(profile.subject);
  const [gradeOverride, setGradeOverride] = useState('Kelas VII (Fase D)');
  const [curriculumOverride, setCurriculumOverride] = useState('Kurikulum Merdeka');
  const [studentContext, setStudentContext] = useState('Reguler heterogen (32 siswa, gaya belajar variatif)');

  // Output State
  const [isLoading, setIsLoading] = useState(false);
  const [generatedResult, setGeneratedResult] = useState<string>('');
  const [isEditingResult, setIsEditingResult] = useState(false);
  const [editedResult, setEditedResult] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [engineSource, setEngineSource] = useState<string>('');
  const [engineNote, setEngineNote] = useState<string>('');

  const handleSelectPreset = (cap: typeof AI_CAPABILITIES[0]) => {
    setSelectedCapability(cap.id);
    setUserPrompt(cap.defaultPrompt);
  };

  const handleGenerate = async () => {
    if (!userPrompt.trim()) return;

    setIsLoading(true);
    setIsEditingResult(false);

    const fullPromptWithContext = `${userPrompt}

Konteks Pembelajaran:
- Mata Pelajaran: ${subjectOverride}
- Jenjang & Kelas: ${gradeOverride}
- Kurikulum: ${curriculumOverride}
- Karakteristik Peserta Didik: ${studentContext}`;

    const res = await generateEducationalContent({
      type: selectedCapability as any,
      prompt: fullPromptWithContext,
      contextOverrides: {
        subject: subjectOverride,
        grade: gradeOverride,
        curriculum: curriculumOverride,
      },
    });

    setIsLoading(false);

    if (res.success) {
      setGeneratedResult(res.content);
      setEditedResult(res.content);
      setEngineSource(res.source);
      setEngineNote(res.note || '');
    } else {
      alert(res.error || 'Gagal menghasilkan konten AI');
    }
  };

  const handleCopy = () => {
    const textToCopy = isEditingResult ? editedResult : generatedResult;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleApplyToModule = () => {
    const targetBook =
      ['tp', 'atp', 'modul', 'kisi'].includes(selectedCapability) ? 'buku1' :
      ['prota', 'promes', 'jurnal'].includes(selectedCapability) ? 'buku2' :
      ['soal', 'instrumen', 'analisis', 'remedial', 'deskripsi_nilai'].includes(selectedCapability) ? 'buku3' :
      'buku4';

    const subTab =
      selectedCapability === 'tp' ? 'tp' :
      selectedCapability === 'atp' ? 'atp' :
      selectedCapability === 'modul' ? 'modul' :
      selectedCapability === 'prota' ? 'prota' :
      selectedCapability === 'promes' ? 'promes' :
      selectedCapability === 'soal' || selectedCapability === 'instrumen' ? 'instrumen' :
      selectedCapability === 'kisi' ? 'kisi_kisi' :
      selectedCapability === 'analisis' ? 'analisis_soal' :
      selectedCapability === 'remedial' ? 'remedial' :
      selectedCapability === 'deskripsi_nilai' ? 'nilai' :
      selectedCapability === 'refleksi' ? 'refleksi' : 'cp';

    alert(`Hasil AI siap diterapkan ke ${targetBook.toUpperCase()}. Sistem akan mengarahkan Anda ke modul terkait.`);
    onNavigate(targetBook, subTab);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* HEADER SECTION */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 rounded-2xl p-6 sm:p-8 text-white border border-blue-900/50 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-sky-300 animate-pulse" />
              <span>Didukung Model Gemini 3.8 & Mesin Pedagogis Nasional</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              AI ASISTEN GURU
            </h1>
            <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
              Konsultan dan Asisten Perangkat Ajar Cerdas yang memahami standar kurikulum Indonesia, Taksonomi Bloom, KKO, diferensiasi KBM, dan instrumen asesmen.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-3 text-xs text-slate-300">
              <div className="font-bold text-white flex items-center gap-1.5">
                <School className="w-3.5 h-3.5 text-sky-400" />
                <span>Konteks Otomatis:</span>
              </div>
              <div className="mt-1 text-[11px] text-slate-400">
                {profile.schoolName} • {profile.subject} • {profile.academicYear}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* KOLOM KIRI: 13 KEMAMPUAN PRESET */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
            <h2 className="text-sm font-bold text-slate-900 mb-1 flex items-center gap-2">
              <Bot className="w-4 h-4 text-blue-600" />
              <span>13 Kemampuan Utama AI Guru</span>
            </h2>
            <p className="text-[11px] text-slate-500 mb-4">
              Pilih template tugas administrasi yang ingin dibantu:
            </p>

            <div className="space-y-1.5 max-h-[600px] overflow-y-auto pr-1">
              {AI_CAPABILITIES.map((cap) => {
                const isSelected = selectedCapability === cap.id;
                return (
                  <button
                    key={cap.id}
                    onClick={() => handleSelectPreset(cap)}
                    className={`w-full text-left p-3 rounded-xl border text-xs transition ${
                      isSelected
                        ? 'bg-blue-50/80 border-blue-400 text-blue-900 shadow-sm font-semibold'
                        : 'bg-white border-slate-100 hover:bg-slate-50 text-slate-700 hover:border-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900">{cap.title}</span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-blue-600" />}
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1 font-normal line-clamp-2">
                      {cap.description}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* KOLOM KANAN: WORKSPACE PROMPTING & HASIL */}
        <div className="lg:col-span-8 space-y-6">
          {/* KONTEKS PEMBELAJARAN (PEDAGOGIS) */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-blue-600" />
                <span>Parameter Pedagogis Guru</span>
              </h3>
              <span className="text-[11px] text-slate-400">Disesuaikan otomatis dengan profil guru</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs mb-3">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Mata Pelajaran</label>
                <input
                  value={subjectOverride}
                  onChange={(e) => setSubjectOverride(e.target.value)}
                  className="w-full border border-slate-200 rounded-lg p-2 font-medium"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Tingkat / Fase</label>
                <input
                  value={gradeOverride}
                  onChange={(e) => setGradeOverride(e.target.value)}
                  className="w-full border border-slate-200 rounded-lg p-2 font-medium"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Kurikulum</label>
                <input
                  value={curriculumOverride}
                  onChange={(e) => setCurriculumOverride(e.target.value)}
                  className="w-full border border-slate-200 rounded-lg p-2 font-medium"
                />
              </div>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1 text-xs">Karakteristik & Profil Belajar Siswa</label>
              <input
                value={studentContext}
                onChange={(e) => setStudentContext(e.target.value)}
                placeholder="misal: 32 siswa heterogen, minat literasi visual, aktif dalam diskusi kelompok"
                className="w-full border border-slate-200 rounded-lg p-2 text-xs"
              />
            </div>
          </div>

          {/* INPUT PROMPT TEXTAREA */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
            <label className="font-bold text-xs text-slate-900 block mb-2 flex items-center justify-between">
              <span>Instruksi Tugas Administrasi yang Diinginkan:</span>
              <span className="text-[11px] font-normal text-slate-400">Bahasa Indonesia Baku</span>
            </label>

            <textarea
              rows={4}
              value={userPrompt}
              onChange={(e) => setUserPrompt(e.target.value)}
              placeholder="Tuliskan materi, topik, atau kebutuhan administrasi secara spesifik..."
              className="w-full border border-slate-200 rounded-xl p-3 text-xs leading-relaxed focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <div className="flex flex-wrap items-center justify-between gap-3 mt-4">
              <div className="text-[11px] text-slate-500">
                *AI tidak akan langsung menyimpan ke database tanpa persetujuan Anda.
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleGenerate}
                  disabled={isLoading || !userPrompt.trim()}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs shadow-md shadow-blue-500/25 transition disabled:opacity-50"
                >
                  <Sparkles className="w-4 h-4 text-sky-200" />
                  <span>{isLoading ? 'AI Sedang Menyusun...' : 'Buat dengan AI'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* OUTPUT RESULT CONTAINER */}
          {(generatedResult || isLoading) && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-md overflow-hidden">
              <div className="flex items-center justify-between px-5 py-3.5 bg-slate-900 text-white text-xs">
                <div className="flex items-center gap-2 font-bold">
                  <Bot className="w-4 h-4 text-sky-400" />
                  <span>Hasil Rumusan AI Asisten Guru</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsEditingResult(!isEditingResult)}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] transition"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>{isEditingResult ? 'Kunci Edit' : 'Edit Teks'}</span>
                  </button>

                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] transition"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Tersalin' : 'Salin Hasil'}</span>
                  </button>

                  <button
                    onClick={handleGenerate}
                    disabled={isLoading}
                    title="Regenerasi Hasil"
                    className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {engineNote && (
                <div className="px-5 py-2 bg-blue-50 border-b border-blue-100 text-[11px] text-blue-800 font-medium">
                  {engineNote}
                </div>
              )}

              <div className="p-6">
                {isLoading ? (
                  <div className="py-12 flex flex-col items-center justify-center space-y-3">
                    <div className="w-8 h-8 rounded-full border-4 border-blue-600 border-t-transparent animate-spin" />
                    <p className="text-xs font-semibold text-slate-600">
                      AI sedang merumuskan administrasi sesuai standar Kemendikbudristek RI...
                    </p>
                  </div>
                ) : isEditingResult ? (
                  <textarea
                    rows={16}
                    value={editedResult}
                    onChange={(e) => setEditedResult(e.target.value)}
                    className="w-full border border-slate-300 rounded-xl p-4 text-xs font-mono leading-relaxed"
                  />
                ) : (
                  <div className="whitespace-pre-line text-xs text-slate-800 leading-relaxed font-sans prose prose-slate max-w-none">
                    {editedResult || generatedResult}
                  </div>
                )}
              </div>

              {/* ACTION FOOTER */}
              {!isLoading && (
                <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="text-[11px] text-slate-500">
                    Periksa kembali rumusan sebelum digunakan dalam pembelajaran aktif.
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleApplyToModule}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md transition"
                    >
                      <BookmarkCheck className="w-3.5 h-3.5" />
                      <span>Gunakan & Simpan ke Buku Administrasi</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
