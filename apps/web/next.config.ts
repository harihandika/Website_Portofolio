const nextConfig = {
  reactStrictMode: true,
  outputFileTracingRoot: process.cwd(),
  distDir: process.env.NEXT_DIST_DIR || ".next",
  devIndicators: false,
};

export default nextConfig;
