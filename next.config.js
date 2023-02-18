/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
}

const { loadEnvConfig } = require('@next/env');

loadEnvConfig(process.cwd());

module.exports = nextConfig
