# Halo teman - teman Developers. Please READ THIS Carefully.

---

## Terima kasih sudah tertarik untuk join Pipeline

## Ini adalah contoh Dashboard yang dibangun menggunakan [SvelteKit](https://kit.svelte.dev/) sebagai Frontend dan [Supabase](https://supabase.com/) sebagai Backend

<h3>
<span style="color:red">
Jika sudah selesai membuat dashboard versi kamu silahkan.

<ul>
<li>Kirim video perkenalan diri dan jelaskan fungsi apa yang kamu bangun</li>
<li>Kamu bisa rekam menggunakan Loom.com atau vidline.com </li>
<li>Dalam Proses ini kami akan menerima dua orang Developer [PAID] Intern BACKEND dan FRONTEND.</li>
<li>Jika kamu lebih suka BACKEND menggunakan EXPRESS tidak usah terlalu fokus ke Frontend pakai saja component yang sudah ada</li>
</li>Ubah codenya dan bangun APA SAJA CHART YANG KAMU BISA untuk menunjukan ketertarikan di BACKEND MENGGUNAKAN EXPRESS JS</li>
</ul>

</h3>
</span>

## Demo Dashboard

1. Untuk melihat Landing Page [klik disini](https://sveltekit-supabase-dashboard.vercel.app/).
2. Untuk melihat Dashboard Setelah Login [klik disini](https://sveltekit-supabase-dashboard.vercel.app/auth)

## Fitur Yang Dimiliki

- User Interface dibuat dengan warna Supabase
- Dashboard bisa dipakai oleh banyak organisasi dengan akun ID masing - masing.
- Bisa memiliki beberapa tingkatan role akses di dalam sebuah organization.
- Bisa menambahkan dan menghapus pengguna dari dalam Dashboard.
- Tampilan Table dan Chart
- Demo mode (show hints and disable database updates)

## Teknologi Yang Dipakai

- [Svelte](https://svelte.dev/) and [SvelteKit](https://kit.svelte.dev/) as application framework
- [Supabase](https://supabase.com/) as database and backend
- [TailwindCSS](https://tailwindcss.com/) as CSS framework
- [DaisyUI](https://daisyui.com/) as Tailwind CSS component library
- [Supabase Auth Helpers](https://github.com/supabase/auth-helpers) as Auth utilities for working with Supabase
- [Supabase custom claims](https://github.com/supabase-community/supabase-custom-claims) for multi organization and role based access
- [Charts.js](https://www.chartjs.org/) and [svelte-chartjs](https://www.npmjs.com/package/svelte-chartjs) for charts
- [Feather Icons](https://feathericons.com/) and [svelte-feather-icons](https://www.npmjs.com/package/svelte-feather-icons) for icons
- [svelte-loading-spinners](https://www.npmjs.com/package/svelte-loading-spinners) for loading spinners
- [Vercel](https://vercel.com/) as deployment platform

## Apa Yang Harus Dilakukan?

- Hubungkan Frontend dengan [Supabase](https://supabase.com/docs/guides/getting-started/quickstarts/sveltekit)
- ==**Tambahkan Data dan Chart Versi kamu.**==
- Coba tambahkan beberapa dokumentasi code sehingga team lain bisa memahami apa fungsi yang tujuan dari sebuah code.
- Ada beberapa Typescript yang bermasalah.
- Tambahkan Role dan Organization UI --> [[Dokumentasi]]
- Improve mobile version
- Deploy to Vercel\* optional

## Cara Memulai

### Bikin Akun Supabase

1. Silahkan buat Proyek baru di [supabase.com](https://supabase.com/)
2. Pilih Settings API untuk melihat project URL and API keys kamu.

### Clone Repo Ini

```bash
git clone https://github.com/christmantoro/sveltekit-supabase-chartjs.git
cd sveltekit-supabase-chartjs
```

### MEMBUAT ENVIRONMENT VARIABLE ( sehingga terhubung dengan supabase)

Create a new `.env` file

```bash
cp .env.example .env
```

Edit your `.env` file to match your project URL and API keys

```bash
# SUPABASE
PUBLIC_SUPABASE_URL="YOUR PROJECT URL"
PUBLIC_SUPABASE_ANON_KEY="YOUR PROJECT ANON KEY"
PRIVATE_SUPABASE_SERVICE_KEY="YOUR PROJECT SERVICE KEY"
```

### JALANKAN CODE DI SQL EDITOR SUPABASE

Execute `sql/init_databse.sql` and `sql/init_demo_data.sql` in Supabase SQL Editor.

### Install & Jalankan

```bash
npm install
```

To start in development mode:

```bash
npm run dev
```

To build and start in production mode:

```bash
npm run build
npm run preview
```

### KAMU BISA COBA DEPLOY

To deploy to Vercel please follow instructions [here](https://vercel.com/guides/deploying-svelte-with-vercel).

## Development

Find more development details [here](https://github.com/christmantoro/sveltekit-supabase-chartjs/blob/main/README_DEV.md).

## Contribute

Feel free to contribute. Issues and Pull Requests are welcome.

## License

[MIT](https://github.com/xulioc/sveltekit-supabase-dashboard/blob/main/LICENSE)
