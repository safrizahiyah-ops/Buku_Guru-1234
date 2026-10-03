import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '10mb' }));

// Health check endpoint
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    appName: 'Buku Kerja Guru Digital',
    hasGeminiKey: Boolean(process.env.GEMINI_API_KEY),
    timestamp: new Date().toISOString(),
  });
});

// Gemini AI Assistant Endpoint
app.post('/api/ai/generate', async (req: Request, res: Response) => {
  try {
    const { prompt, type, context } = req.body;

    if (!prompt) {
      res.status(400).json({ error: 'Prompt wajib disertakan.' });
      return;
    }

    const apiKey = process.env.GEMINI_API_KEY;

    // Detailed system instruction for Indonesian Educational Standards (Kurikulum Merdeka & Kurikulum Berbasis Cinta / KBC)
    const systemInstruction = `Anda adalah Asisten Pakar Administrasi Guru Indonesia dan Konsultan Kurikulum Berbasis Cinta (KBC) serta Kurikulum Merdeka Kemenag & Kemendikbudristek RI.
Tugas Anda adalah membantu guru menyusun administrasi pembelajaran resmi:
1. Modul Ajar Berbasis Kurikulum KBC yang menginternalisasi "Panca Cinta":
   - Cinta kepada Tuhan (Allah dan Rasul-Nya)
   - Cinta kepada Ilmu & Kebenaran
   - Cinta kepada Diri Sendiri & Sesama Manusia (Empati, Anti-Bullying, Sekolah Ramah Anak)
   - Cinta kepada Alam & Lingkungan Hidup (Ekologis)
   - Cinta kepada Tanah Air & Bangsa (Nasionalisme, Kebinekaan, Toleransi & Moderasi)
2. Modul Projek Penguatan Karakter KBC (Panca Cinta) terintegrasi P5 / P2RA.
3. Administrasi Buku 1 (CP, TP, ATP, Modul Ajar KBC, Projek KBC, KKTP KBC).
4. Administrasi Buku 2 (Jadwal, Kaldik, Pembiasaan Guru KBC, Jurnal KBM KBC).
5. Administrasi Buku 3 (Daftar Nilai, Asesmen Diagnostik Sosio-Emosional KBC, Asesmen Karakter Cinta).
6. Administrasi Buku 4 (Jurnal Refleksi Pedagogis Berbasis Kasih Sayang & Tindak Lanjut Bimbingan Restoratif).

Karakteristik jawaban Anda:
1. Bahasa Indonesia baku, penuh keteladanan, santun, hangat, profesional, dan pedagogis.
2. Selalu mencantumkan pilar Panca Cinta KBC yang relevan.
3. Rinci, terstruktur, aplikatif, dan langsung siap diaplikasikan di kelas.
4. Gunakan format Markdown yang rapi (heading, bullet points, tabel).

Konteks Pengguna:
- Satuan Pendidikan: ${context?.schoolName || 'Sekolah / Madrasah'}
- Mata Pelajaran: ${context?.subject || 'Umum'}
- Kelas / Fase: ${context?.grade || 'Fase D (Kelas VII/VIII/IX)'}
- Kurikulum: ${context?.curriculum || 'Kurikulum Berbasis Cinta (KBC)'}
- Semester / T.P.: ${context?.semester || 'Ganjil'} ${context?.academicYear || '2024/2025'}`;

    if (apiKey && apiKey !== 'MY_GEMINI_API_KEY') {
      try {
        const ai = new GoogleGenAI({ apiKey });
        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            systemInstruction,
            temperature: 0.7,
          },
        });

        const generatedText = response.text || '';
        res.json({
          success: true,
          content: generatedText,
          source: 'gemini-3.8-flash',
        });
        return;
      } catch (geminiError: any) {
        console.warn('Gemini API call failed, falling back to pedagogical generator:', geminiError?.message);
      }
    }

    // Pedagogical Fallback Generator when API key is missing or quota exceeded
    const fallbackResponse = generatePedagogicalFallback(type, prompt, context);
    res.json({
      success: true,
      content: fallbackResponse,
      source: 'smart-template-engine',
      note: 'Dihasilkan oleh Mesin Kurikulum Guru Digital (Aktifkan GEMINI_API_KEY untuk kecerdasan generatif langsung)',
    });
  } catch (error: any) {
    console.error('AI generation route error:', error);
    res.status(500).json({ error: error?.message || 'Gagal memproses permintaan AI' });
  }
});

// Helper for fallback generation tailored to Indonesian Teacher Administration
function generatePedagogicalFallback(type: string, prompt: string, ctx: any) {
  const mapel = ctx?.subject || 'Mata Pelajaran';
  const kelas = ctx?.grade || 'Kelas VII';
  const topik = prompt.length > 50 ? prompt.slice(0, 50) + '...' : prompt;

  switch (type) {
    case 'tp':
      return `### Rumusan Tujuan Pembelajaran (TP)
**Mata Pelajaran:** ${mapel} | **Kelas/Fase:** ${kelas}
**Fokus Materi:** ${topik}

1. **TP 1:** Peserta didik mampu mengidentifikasi dan menjelaskan konsep dasar materi melalui pengamatan kontekstual dengan tepat. *(Kognitif C2)*
2. **TP 2:** Peserta didik mampu menganalisis keterkaitan antar unsur dan prinsip utama materi dalam situasi problematis sehari-hari. *(Kognitif C4)*
3. **TP 3:** Peserta didik mampu merancang dan menyajikan hasil telaah kreatif secara kolaboratif dengan penuh tanggung jawab. *(Psikomotorik P3 & Karakter Pelajar Pancasila)*

**Dimensi Profil Pelajar Pancasila:**
- Beriman & Bertakwa kepada Tuhan YME
- Bernalar Kritis
- Gotong Royong
- Kreatif`;

    case 'atp':
      return `### Alur Tujuan Pembelajaran (ATP)
**Mata Pelajaran:** ${mapel} | **Alokasi Waktu Total:** 18 JP (6 Pertemuan)

| No | Alur Tujuan Pembelajaran (ATP) | Lingkup Materi | Alokasi Waktu | Asesmen Formatif |
|---|---|---|---|---|
| 1 | 1.1 Menjelaskan hakikat dan karakteristik dasar topik | Konsep & Definisi | 4 JP | Ceklis observasi & kuis singkat |
| 2 | 1.2 Menerapkan prosedur pemecahan masalah kontekstual | Studi Kasus Nyata | 6 JP | Lembar kerja kelompok & diskusi |
| 3 | 1.3 Menganalisis variasi data dan membuat generalisasi | Analisis & Komparasi | 4 JP | Presentasi unjuk kerja |
| 4 | 1.4 Mengevaluasi solusi dan merumuskan refleksi kritis | Refleksi & Solusi | 4 JP | Portofolio & tes tertulis |`;

    case 'modul':
      return `### Modul Ajar Kurikulum Berbasis Cinta (KBC)
**Mata Pelajaran:** ${mapel} | **Kelas/Fase:** ${kelas}
**Alokasi Waktu:** 2 x 40 Menit (1 Pertemuan) | **Kerangka Kurikulum:** Kurikulum Berbasis Cinta (KBC)

#### I. INFORMASI UMUM
- **Identitas:** Modul Ajar Berbasis Cinta (KBC) Berdiferensiasi
- **Kompetensi Awal:** Peserta didik telah memahami pengantar dasar materi dan siap berkolaborasi secara empati.
- **Pilar Panca Cinta KBC:**
  1. *Cinta kepada Tuhan:* Menumbuhkan rasa syukur dan kesadaran spiritual dalam menggali ilmu.
  2. *Cinta kepada Ilmu:* Menumbuhkan rasa ingin tahu mendalam dan nalar kritis.
  3. *Cinta kepada Diri Sendiri & Sesama:* Mengembangkan empati, saling menghargai, dan anti-perundungan.
  4. *Cinta kepada Alam & Lingkungan:* Mengaitkan materi dengan kepedulian ekologis.
  5. *Cinta kepada Tanah Air:* Menumbuhkan semangat cinta bangsa dan kearifan lokal.
- **Pembiasaan Berbasis Cinta (Habituation):** Morning check-in kesiapan emosi, salam hangat, dan saling mengapresiasi.
- **Sarana & Prasarana:** LCD Proyektor, LKPD Ramah Anak, Bahan Ajar Kontekstual, Sudut Baca Inspirasi.
- **Target Peserta Didik:** Reguler / Tipikal (32 Siswa) dengan lingkungan belajar aman & nyaman.
- **Model Pembelajaran:** *Problem Based Learning* (PBL) Berbasis Cinta & Pembelajaran Berdiferensiasi.

#### II. KOMPONEN INTI
- **Tujuan Pembelajaran:** Peserta didik mampu menganalisis konsep ${topik} dengan nalar kritis dan menerapkannya dengan sikap saling menghargai sesama teman.
- **Pemahaman Bermakna:** Mempelajari ilmu dengan cinta menjadikan kita manusia yang bijak, penuh welas asih, dan bermanfaat bagi semesta.
- **Pertanyaan Pemantik:** 
  1. Bagaimana ilmu yang kita pelajari hari ini dapat membantu memecahkan masalah orang lain dengan penuh kasih?
  2. Bagaimana cara kita saling mendukung dalam kelompok tanpa membeda-bedakan kemampuan teman?

#### III. KEGIATAN PEMBELAJARAN BERBASIS CINTA
1. **Pendahuluan Berbasis Kasih Sayang (10 Menit):**
   - Guru menyambut siswa dengan senyum tulus, salam kehangatan, dan doa khidmat (Cinta Tuhan).
   - *Empathy Morning Check-In:* Guru menanyakan kabar emosional dan suasana hati siswa hari ini.
   - Ice breaking riang gembira dan penanaman budaya kelas ramah anak tanpa ejekan.
   - Apersepsi kontekstual dan penyampaian tujuan pembelajaran (Cinta Ilmu).

2. **Kegiatan Inti Kolaboratif & Inklusif (60 Menit):**
   - *Fase 1 (Orientasi Masalah Kasih):* Tayangan stimulus kontekstual tentang ${topik}.
   - *Fase 2 (Organisasi Kelompok Kasih):* Pembagian kelompok heterogen dengan prinsip gotong royong dan saling mengasihi.
   - *Fase 3 (Penyelidikan Terbimbing):* Guru mendampingi setiap kelompok dengan sabar, memberikan dorongan moril (bukan hukuman) bagi yang lambat memahami.
   - *Fase 4 (Penyajian Karya Penuh Apresiasi):* Perwakilan kelompok mempresentasikan simpulan karya.
   - *Fase 5 (Refleksi Bersama & Apresiasi):* Kelompok lain memberikan tanggapan apresiatif dengan teknik *Umpan Balik Cinta Kasih*.

3. **Penutup Bermakna & Hangat (10 Menit):**
   - Guru dan siswa menyimpulkan poin esensial bersama.
   - Refleksi cinta: Siswa menuliskan satu hal yang disyukuri dan ungkapan terima kasih pada teman kelompok.
   - Doa syukur bersama dan salam penutup penuh kehangatan.

#### IV. ASESMEN & TINDAK LANJUT BERBASIS CINTA
- **Asesmen Sikap Panca Cinta:** Observasi pembiasaan kasih sayang, empati, kejujuran, dan kepedulian.
- **Asesmen Kognitif & Formatif:** LKPD kontekstual dan asesmen pemahaman materi.
- **Tindak Lanjut Restoratif:** Bimbingan individual penuh kasih sayang bagi siswa yang belum tuntas tanpa stigma negatif.`;

    case 'projek_kbc':
      return `### Modul Projek Penguatan Karakter KBC (Panca Cinta)
**Tema Utama:** Cinta Sesama & Sekolah Ramah Anak (Pencegahan Perundungan Berbasis Kasih Sayang)
**Fase/Tingkat:** ${kelas} | **Durasi:** 3 Pekan Blok Pembelajaran

#### I. TUJUAN PROJEK BERBASIS CINTA
Membangun kesadaran empati, saling menghormati keragaman, dan menumbuhkan budaya anti-perundungan di lingkungan sekolah/madrasah melalui penerapan pilar Panca Cinta.

#### II. DIMENSI PANCA CINTA KBC YANG DIKUATKAN
1. **Cinta kepada Tuhan:** Menghayati bahwa seluruh manusia adalah ciptaan Tuhan yang mulia dan wajib dihormati.
2. **Cinta kepada Diri & Sesama:** Melatih empati aktif, menolak kekerasan verbal/fisik, dan membela teman yang lemah.
3. **Cinta kepada Tanah Air:** Menjunjung tinggi persatuan, toleransi kebinekaan, dan moderasi beragama.

#### III. ALUR AKTIVITAS PROJEK
- **Tahap Pengenalan (Minggu 1):** Eksplorasi makna cinta sesama, mengenali bentuk perundungan tersembunyi, dan menonton film pendek edukatif.
- **Tahap Kontekstualisasi (Minggu 2):** Wawancara warga sekolah dan pemetaan "Zona Aman & Nyaman" di madrasah.
- **Tahap Aksi Nyata (Minggu 3):** 
  1. Pembuatan Pohon Cinta (Kumpulan Catatan Kebaikan Siswa).
  2. Deklarasi Duta Sahabat Damai Kelas.
  3. Gelar Karya Puisi, Poster, dan Video Kampanye Kasih Sayang.
- **Tahap Refleksi & Tindak Lanjut:** Evaluasi diri dan pembentukan Duta Kasih Sayang Kelas berkelanjutan.

#### IV. RUBRIK PENILAIAN KARAKTER KBC
- **Mulai Berkembang (MB):** Menyadari pentingnya menyayangi teman.
- **Sedang Berkembang (SB):** Mampu menghibur teman dan tidak mengejek.
- **Berkembang Sesuai Harapan (BSH):** Aktif mencegah perundungan dan menunjukkan empati tinggi.
- **Sangat Berkembang (SAB):** Menjadi teladan cinta damai, konsisten merangkul teman, dan mempelopori kebaikan bersama.`;

    case 'soal':
      return `### Bank Soal Asesmen & Kisi-Kisi
**Mata Pelajaran:** ${mapel} | **Tingkat:** ${kelas}

**1. Pilihan Ganda (Level C2 - Pemahaman):**
*Soal:* Manakah dari pernyataan berikut yang paling tepat menggambarkan karakteristik utama topik pembelajaran?
A. Konsep bersifat kaku tanpa perubahan
B. Fenomena saling terkait secara dinamis dengan faktor lingkungan *(Kunci)*
C. Terjadi hanya satu kali dalam kurun waktu satu semester
D. Tidak memerlukan pembuktian empiris
*Kunci Jawaban:* B | *Skor:* 20

**2. Pilihan Ganda Kompleks (Level C4 - Analisis - HOTS):**
*Stimulus:* Diberikan tabel komparasi data dua kasus berbeda.
*Pertanyaan:* Berdasarkan data tersebut, beri tanda centang (✓) pada setiap pernyataan yang BENAR!
- [✓] Faktor X memiliki korelasi positif terhadap kenaikan output.
- [ ] Kondisi B menunjukkan penurunan efisiensi sebesar 50%.
- [✓] Solusi preventif lebih ekonomis dibanding penanganan kuratif.

**3. Soal Uraian Berbasis Masalah (Level C5 - Evaluasi):**
*Soal:* Jelaskan dua langkah strategis yang dapat Anda rancang untuk mengatasi kendala utama dalam topik ini, sertakan alasan logisnya!
*Rubrik Penilaian:*
- Penjelasan 2 langkah sistematis dan logis: Skor 40
- Penjelasan 1 langkah logis: Skor 20
- Menjawab tidak relevan: Skor 5`;

    case 'refleksi':
      return `### Jurnal Refleksi Pembelajaran Guru
**Tanggal:** ${new Date().toLocaleDateString('id-ID')} | **Mapel:** ${mapel}

1. **Hal yang Berjalan Baik:**
   - Mayoritas peserta didik sangat antusias saat diskusi kelompok berbasis LKPD visual.
   - Manajemen waktu berjalan sesuai alokasi Rencana Pembelajaran.

2. **Kendala yang Dihadapi:**
   - 3-4 peserta didik masih pasif dan mengandalkan teman satu kelompok dalam pelaporan data.
   - Sarana proyektor sempat mengalami sedikit kendala koneksi di awal jam pelajaran.

3. **Respon Peserta Didik:**
   - Peserta didik mengapresiasi model studi kasus karena relevan dengan kehidupan nyata mereka.

4. **Rencana Perbaikan Pembelajaran:**
   - Memberlakukan pembagian peran tegas dalam kelompok (Ketua, Notulis, Juru Bicara, Pengamat).
   - Menyiapkan cadangan LKPD cetak mandiri jika fasilitas digital terkendala.`;

    default:
      return `### Hasil Rekomendasi Administrasi Guru
**Topik:** ${topik}
**Mata Pelajaran:** ${mapel} | **Kelas:** ${kelas}

Berdasarkan prinsip Kurikulum Nasional dan standar pedagogis:
1. **Analisis Kebutuhan:** Pastikan setiap materi mengacu pada Capaian Pembelajaran (CP) fase terkini.
2. **Implementasi:** Gunakan pendekatan *student-centered learning* dengan diferensiasi konten, proses, atau produk sesuai profil belajar siswa.
3. **Asesmen Berkelanjutan:** Utamakan asesmen formatif sebagai umpan balik (*assessment for learning*) bukan sekadar penghakiman nilai akhir.
4. **Dokumentasi:** Simpan seluruh bukti pembelajaran dan catatan reflektif ke dalam Buku Kerja Guru Digital untuk pelaporan PKG (Penilaian Kinerja Guru).`;
  }
}

// Development or Production handler
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
