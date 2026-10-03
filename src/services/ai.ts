import { DataStore } from './storage';

export interface AIGenerationRequest {
  type: 'tp' | 'atp' | 'modul' | 'projek_kbc' | 'prota' | 'promes' | 'soal' | 'kisi' | 'instrumen' | 'analisis' | 'remedial' | 'deskripsi_nilai' | 'refleksi' | 'laporan' | 'custom';
  prompt: string;
  contextOverrides?: {
    subject?: string;
    grade?: string;
    schoolName?: string;
    curriculum?: string;
    semester?: string;
    academicYear?: string;
  };
}

export interface AIGenerationResponse {
  success: boolean;
  content: string;
  source: string;
  note?: string;
  error?: string;
}

export async function generateEducationalContent(req: AIGenerationRequest): Promise<AIGenerationResponse> {
  const profile = DataStore.getProfile();
  const context = {
    schoolName: req.contextOverrides?.schoolName || profile.schoolName,
    subject: req.contextOverrides?.subject || profile.subject,
    grade: req.contextOverrides?.grade || 'Kelas VII (Fase D)',
    curriculum: req.contextOverrides?.curriculum || profile.curriculum || 'Kurikulum Berbasis Cinta (KBC)',
    semester: req.contextOverrides?.semester || profile.semester,
    academicYear: req.contextOverrides?.academicYear || profile.academicYear,
  };

  try {
    const res = await fetch('/api/ai/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: req.prompt,
        type: req.type,
        context,
      }),
    });

    if (!res.ok) {
      const errJson = await res.json().catch(() => ({}));
      throw new Error(errJson.error || `Server responded with status ${res.status}`);
    }

    const data = await res.json();
    return {
      success: true,
      content: data.content,
      source: data.source || 'gemini',
      note: data.note,
    };
  } catch (error: any) {
    console.error('AI Service Error:', error);
    return {
      success: false,
      content: '',
      source: 'error',
      error: error?.message || 'Gagal terhubung dengan layanan AI. Silakan periksa koneksi server.',
    };
  }
}

// 13 Pre-built Specialized Educational Prompt Presets
export const AI_CAPABILITIES = [
  {
    id: 'tp',
    title: '1. Rumusan CP & TP (Tujuan Pembelajaran)',
    description: 'Menyusun rumusan Tujuan Pembelajaran terukur berbasis Taksonomi Bloom revisi dan KKO sesuai Capaian Pembelajaran.',
    defaultPrompt: 'Tolong rumuskan 3 Tujuan Pembelajaran (TP) terukur untuk materi: "Teks Deskripsi Objek Lingkungan dan Budaya Lokal" lengkap dengan kompetensi KKO, lingkup materi, dan indikator ketercapaian.',
  },
  {
    id: 'atp',
    title: '2. Alur Tujuan Pembelajaran (ATP)',
    description: 'Menyusun urutan logis, alokasi jam pelajaran (JP), dan pentahapan semester untuk mencapai CP.',
    defaultPrompt: 'Susun Alur Tujuan Pembelajaran (ATP) Bahasa Indonesia Fase D semester ganjil dengan total 36 JP, urutan logis dari tingkat mudah ke analisis mendalam.',
  },
  {
    id: 'modul',
    title: '3. Modul Ajar Lengkap Kurikulum Merdeka',
    description: 'Membuat modul ajar lengkap: identitas, pemahaman bermakna, pertanyaan pemantik, kegiatan diferensiasi, asesmen, dan refleksi.',
    defaultPrompt: 'Buatlah Modul Ajar lengkap berdurasi 2x40 menit dengan model Problem-Based Learning (PBL) untuk materi Teks Prosedur membuat makanan sehat tradisional.',
  },
  {
    id: 'prota',
    title: '4. Program Tahunan (Prota)',
    description: 'Menghitung distribusi jam pelajaran per semester dan materi pokok dalam kurun satu tahun ajaran.',
    defaultPrompt: 'Susun rancangan Program Tahunan (Prota) dengan total 72 JP efektif setahun, terbagi semester ganjil dan genap.',
  },
  {
    id: 'promes',
    title: '5. Program Semester (Promes)',
    description: 'Menyusun matriks distribusi mingguan per bulan untuk jadwal pembelajaran efektif semester berjalan.',
    defaultPrompt: 'Rancang matrik Program Semester (Promes) Ganjil (Juli - Desember) untuk 4 materi pokok dengan alokasi total 36 JP.',
  },
  {
    id: 'soal',
    title: '6. Bank Soal & Soal HOTS Berdiferensiasi',
    description: 'Membuat variasi soal Pilihan Ganda, PG Kompleks, Menjodohkan, dan Uraian berbasis stimulus kontekstual.',
    defaultPrompt: 'Buatkan 3 butir soal HOTS (High Order Thinking Skills) dengan stimulus teks infografik, terdiri dari 1 PG Kompleks dan 2 Uraian analisis kritis.',
  },
  {
    id: 'kisi',
    title: '7. Kisi-Kisi Soal Ujian (STS / SAS)',
    description: 'Menyusun tabel matriks kisi-kisi asesmen sumatif lengkap dengan indikator soal dan level kognitif (C1-C6).',
    defaultPrompt: 'Buatkan tabel kisi-kisi soal Sumatif Tengah Semester (STS) sebanyak 5 butir soal dengan level kognitif L1, L2, dan L3.',
  },
  {
    id: 'instrumen',
    title: '8. Instrumen Asesmen & Rubrik Penilaian',
    description: 'Menyusun rubrik analitik dan holistik unjuk kerja, presentasi, serta proyek.',
    defaultPrompt: 'Buat rubrik penilaian presentasi kelompok dan unjuk kerja proyek dengan 4 skala kriteria: Perlu Bimbingan, Cukup, Baik, Sangat Baik.',
  },
  {
    id: 'analisis',
    title: '9. Analisis Hasil Asesmen & Butir Soal',
    description: 'Menganalisis pola ketuntasan peserta didik dan memberikan rekomendasi intervensi pedagogis.',
    defaultPrompt: 'Dari hasil asesmen di mana 4 dari 15 siswa belum mencapai KKTP pada materi analisis struktur teks, berikan rekomendasi tindak lanjut diferensiasi proses.',
  },
  {
    id: 'remedial',
    title: '10. Program Remedial & Pengayaan',
    description: 'Merancang rencana pembelajaran ulang terfokus untuk siswa remidi dan proyek eksplorasi untuk siswa pengayaan.',
    defaultPrompt: 'Rancang rencana program remedial terfokus 1 pertemuan (60 menit) dan rencana program pengayaan mandiri berorientasi literasi digital.',
  },
  {
    id: 'deskripsi_nilai',
    title: '11. Deskripsi Capaian Belajar Rapor',
    description: 'Menghasilkan narasi deskripsi capaian rapor Kurikulum Merdeka yang positif, membangun, dan personal.',
    defaultPrompt: 'Buatkan narasi deskripsi rapor untuk siswa yang sangat unggul dalam memahami struktur teks namun perlu penguatan pada ejaan tanda baca.',
  },
  {
    id: 'refleksi',
    title: '12. Narasi Jurnal Refleksi Guru',
    description: 'Membantu merangkum catatan lapangan guru menjadi jurnal refleksi pedagogis terstruktur model 4F (Facts, Feelings, Findings, Future).',
    defaultPrompt: 'Bantu saya menyusun jurnal refleksi model 4F dari catatan: "Siswa sangat antusias dengan video Danau Toba, tapi waktu diskusi kelompok kurang 10 menit sehingga presentasi terburu-buru."',
  },
  {
    id: 'laporan',
    title: '13. Laporan Keterlaksanaan Pembelajaran',
    description: 'Menyusun format laporan berkala administrasi KBM untuk arsip supervisi kepala madrasah/sekolah.',
    defaultPrompt: 'Susun draf laporan evaluasi keterlaksanaan kurikulum tengah semester untuk disampaikan kepada Kepala Sekolah.',
  },
];
