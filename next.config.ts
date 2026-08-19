import type { NextConfig } from "next";
const isGitHubPages = process.env.GITHUB_ACTIONS === "true";
const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  basePath: isGitHubPages ? "/TIHBD" : "",
  assetPrefix: isGitHubPages ? "/TIHBD/" : "",
  outputFileTracingRoot: process.cwd(),
};
export default nextConfig;
