/** @type {import('next').NextConfig} */

// 1. Ambil URL dari environment variable
const remoteUrl = process.env.NEXT_PUBLIC_API_STORAGE_URL;
const remotePatterns = [];

// 2. Cek apakah variabel ada, lalu parse untuk mendapatkan detailnya
if (remoteUrl) {
  try {
    const { protocol, hostname, port } = new URL(remoteUrl);
    remotePatterns.push({
      protocol: protocol.replace(':', ''),
      hostname,
      port,
      pathname: '/storage/**',
    });
  } catch (error) {
    console.error('URL API Publik tidak valid di .env.local:', error);
  }
}

const nextConfig = {
  images: {
    remotePatterns, // 3. Gunakan array yang sudah kita buat secara dinamis
  },
};

module.exports = nextConfig;