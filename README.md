# Delcom Link Tree (Svelte 5 + Vite, JavaScript)

Studi Kasus 1 — Praktikum 6 PABWE 2026 · NIM **ifs24024**

## Prasyarat
- [Bun](https://bun.sh) (package manager proyek ini; ada `bun.lock`) atau Node.js 20+.
- Backend Delcom Open API (lokal di `http://localhost:8000/api/v1` atau `https://open-api.delcom.org/api/v1`).

## Instalasi & konfigurasi environment
```bash
bun install
cp .env.example .env     # lalu sesuaikan nilainya
```
| Variabel | Fungsi | Contoh |
|---|---|---|
| `VITE_DELCOM_BASEURL` | URL dasar API (tanpa akhiran `/`) | `https://open-api.delcom.org/api/v1` |
| `APP_PORT` | Port dev server | `3004` |

Tanpa `.env`, aplikasi memakai `http://localhost:8000/api/v1`.

## Menjalankan
```bash
bun run dev              # http://localhost:3004
bun run test             # unit + integration test
bun run test:coverage    # threshold coverage 100%
bun run build && bun run preview
```
Jangan gunakan `bun test`; gunakan `bun run test` atau `bun x vitest run`.

## Struktur
- `src/features/auth` — login, register, logout (`authStore.js`)
- `src/features/users` — daftar pengguna, profil, foto, kata sandi
- `src/features/linktrees` — API, `linkTreesStore.js`, layout, navbar, sidebar, modal, halaman
- `src/features/common` — 404 + komponen bersama (NavLink, Avatar, Modal)
- `src/router.js` — router kustom (History API)
- `src/index.css` — token desain (warna, font) dan kelas komponen (`btn-*`, `field`, `card`)

## Desain UI ("Spruce & Marigold")
- Bingkai gelap (header + rel navigasi kiri) membungkus kanvas konten terang; di seluler navigasi menjadi tab bar bawah.
- Font: Bricolage Grotesque (judul) dan Atkinson Hyperlegible (isi), disajikan dari `public/fonts`
  dan font utama di-preload dari origin yang sama untuk menghindari rantai request Google Fonts.
- Kelas `bg-indigo-600` pada menu aktif Sidebar dipertahankan karena dipakai `Sidebar.test.js`;
  token `--color-indigo-600` dialihkan ke warna brand di `src/index.css`.

## Deploy ke Vercel
- `vercel.json` mengarahkan semua path ke `index.html` (SPA), jadi `/auth/login`
  dan `/link-trees/4` bisa dibuka langsung / di-refresh.
- Karena `.env` ada di `.gitignore`, tambahkan environment variable di dashboard Vercel
  (Settings → Environment Variables): `VITE_DELCOM_BASEURL=https://open-api.delcom.org/api/v1`,
  lalu redeploy. Tanpa ini aplikasi memakai `http://localhost:8000/api/v1`.
- Build command: `bun run build`, output directory: `dist`.

## Deploy ke Netlify
- Di produksi aplikasi memanggil API lewat proxy same-origin `/delcom-api/...`. Di Vercel proxy ini diatur
  `vercel.json`; di Netlify diatur `public/_redirects` (ikut ter-copy ke `dist/`). Tanpa file ini,
  login/daftar gagal dengan 404 dan pesan "Gagal terhubung ke server".
- `public/_headers` memberi cache satu tahun untuk aset build yang ber-hash dan meminta browser
  memvalidasi ulang dokumen `index.html`, sehingga deployment baru tidak tertahan cache lama.
- Saat build produksi, CSS aplikasi disisipkan langsung ke HTML agar tidak memerlukan permintaan
  stylesheet render-blocking yang terpisah.
- Build command: `bun run build` (atau `npm run build`), publish directory: `dist`.
- Variabel `VITE_DELCOM_BASEURL` hanya dipakai untuk URL gambar (aset) dan saat `bun run dev`.
