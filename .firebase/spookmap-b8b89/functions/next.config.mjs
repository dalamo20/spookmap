// next.config.mjs
var nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com"
      },
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com"
      }
    ]
  },
  output: "standalone"
};
var next_config_default = nextConfig;
export {
  next_config_default as default
};
