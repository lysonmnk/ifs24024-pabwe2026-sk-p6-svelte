# Delcom Link Tree (Svelte + JavaScript) — Studi Kasus 1, PABWE P6

Aplikasi pengelola Link Tree: autentikasi, CRUD link tree (judul, tipe public/unlisted/private, deskripsi, sampul),
item tautan, daftar pengguna, dan profil. Memakai REST API Delcom.

## Menjalankan
```bash
bun install
bun run dev              # http://localhost:3004
bun run test:coverage    # coverage 100% (lines, functions, branches, statements)
bun run build
```
Atur `VITE_DELCOM_BASEURL` dan `APP_PORT` pada `.env`.

## Endpoint yang dipakai (src/features/linktrees/api/linkTreeApi.js)
`/link-trees` (GET, POST, DELETE semua), `/link-trees/:id` (GET, PUT, DELETE), `/link-trees/:id/cover` (POST, field `cover`),
`/link-trees/:id/items` (POST), `/link-trees/:id/items/:itemId` (PUT, DELETE).
Bila nama field/endpoint di dokumentasi API berbeda, cukup ubah file API tersebut.
