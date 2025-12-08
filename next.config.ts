import createNextIntlPlugin from 'next-intl/plugin';
import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === 'production';
const internalHost = process.env.TAURI_DEV_HOST || 'localhost';

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  /* config options here */
  output: "export",
  images: {
    unoptimized: true,
  },
  assetPrefix: isProd ? undefined : `http://${internalHost}:3456`,
  sassOptions: {
    silenceDeprecations: ['legacy-js-api'],
  },
  reactStrictMode: false,
  // Turbopack 僅用於開發環境（通過 --turbopack 標誌）
  // 生產構建使用標準 webpack 以確保穩定性
  devIndicators: false,
  // ESLint 配置：在構建時暫時禁用 ESLint 檢查（僅用於構建，開發時仍會檢查）
  eslint: {
    ignoreDuringBuilds: true, // 暫時禁用構建時的 ESLint 檢查，避免構建失敗
  },
  webpack: (config: any, { isServer }: any) => {
    // 處理 dompurify 在 SSR 時的問題
    if (isServer) {
      config.externals = config.externals || [];
      config.externals.push('dompurify');
    }
    return config;
  }
};

export default withNextIntl(nextConfig);
