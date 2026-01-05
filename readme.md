# Admin Pembelian

Aplikasi web sederhana untuk mengelola produk dan pembelian. Bisa lihat stok produk, tambah pembelian baru, dan batalkan pembelian yang sudah ada.

# Akses Website langsung 

akses langsung website untuk mencoba gunakan link berikut 
[https://transaction-pretest.ngabroger.tech/admin/products](demo website)

## Fitur

- **Lihat Produk** - Daftar semua produk dengan harga dan stok
- **Tambah Pembelian** - Pilih produk, input jumlah, stok otomatis berkurang
- **Batalkan Pembelian** - Batalkan pembelian aktif, stok kembali lagi
- **Validasi Stok** - Sistem cek stok sebelum pembelian berhasil

## Teknologi

- **Backend**: Node.js + Express
- **Frontend**: EJS (template engine)
- **Database**: SQLite
- **Styling**: CSS Cartoon (hitam-putih)
- **Container**: Docker & Docker Compose

## Cara Install

1. Clone repository:
```bash
git clone https://github.com/ngabroger/transaction-pretest.git
cd transaction-pretest
npm install
node app.js