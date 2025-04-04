/** @type {import('next').NextConfig} */
const nextConfig = {
  // ...existing code...

  // Explicitly expose the environment variable if needed
  env: {
    OPENAI_API_KEY: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  },

  // ...existing code...
};

module.exports = nextConfig;
