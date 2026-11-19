# New Year Motion Pack 2027

Paket 10 motion graphic 4K (3840 × 2160, 30 FPS, 24 detik) bertema tahun baru 2027 dan niche stok.
Semua video dirender otomatis di **GitHub Actions**, tanpa render di komputer lokal.

## Daftar komposisi

| ID | Tema | Gerakan utama |
|---|---|---|
| P01-Countdown | Hitung mundur 2027 | Angka 3-2-1, ledakan sinar emas, kilau pada tahun |
| P02-Confetti | Pembukaan tahun baru | Pita emas tersapu, confetti 3D yang jatuh |
| P03-Calendar | Kalender 2027 | Halaman kalender membalik tiap bulan |
| P04-Checklist | Resolusi tahun baru | Kotak centang terisi satu per satu, bilah kemajuan |
| P05-Connection | Koneksi manusia | Jaringan orang abstrak, kata kunci per huruf |
| P06-AINetwork | Jaringan saraf AI | Sinyal mengalir antar lapisan node |
| P07-Renewable | Energi terbarukan | Matahari terbit, turbin berputar, panel surya berkilau |
| P08-LowerThird | Lower third | Dua judul bergantian dengan bilah yang tersapu |
| P09-LightLeak | Transisi cahaya | Transisi lingkaran dan kebocoran cahaya antar adegan |
| P10-Lantern | Imlek | Lampion naik berayun, kembang api |

## Cara upload ke GitHub

1. Buat repository baru di GitHub (jangan centang README atau .gitignore).
2. Ekstrak ZIP, lalu unggah isinya ke root repository.
3. Untuk folder `.github`, buat file lewat **Add file > Create new file** dengan nama `.github/workflows/render.yml`, lalu tempel isinya. Nama folder harus `workflows` (dengan s).
4. Pastikan `src/Root.jsx` dan seluruh folder `src/` ikut terunggah.

## Cara render

1. Buka tab **Actions > Render Motion Video > Run workflow**.
2. Ketik ID komposisi, misalnya `P01-Countdown`.
3. Pilih mode:
   - `preview` (1280 × 720): untuk cek cepat.
   - `final-4k` (3840 × 2160): untuk hasil akhir.
4. Klik **Run workflow**, lalu unduh MP4 dari bagian **Artifacts** di halaman run.

Nama file output: `out/<ID>_<mode>.mp4`, misalnya `P01-Countdown_preview.mp4`.

## Catatan

- Video 4K 24 detik bisa memakan waktu puluhan menit di runner GitHub. Jalankan satu per satu untuk mode final.
- Output berupa MP4 tanpa alpha. Untuk lower third transparan, render dengan codec lain (misalnya ProRes 4444) secara lokal.
- Hindari logo, merek dagang, dan wajah orang yang dapat dikenali kecuali sudah memiliki model release.
