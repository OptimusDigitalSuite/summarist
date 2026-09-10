import { fileURLToPath } from "node:url";
import { dirname } from "node:path";

/** @type {import('next').NextConfig} */
const nextConfig = {
  // freelancer-os has its own lockfile one level up, so Next guesses the wrong
  // workspace root. Pin it to this project.
  turbopack: {
    root: dirname(fileURLToPath(import.meta.url)),
  },
  images: {
    // Verified against the live API: every imageLink and audioLink is served
    // from Firebase Storage.
    remotePatterns: [
      { protocol: "https", hostname: "firebasestorage.googleapis.com" },
    ],
    // Next optimises images in sharp/jest-worker child processes. On a machine
    // with little free RAM those workers get OOM-killed and the page dies with
    // "Jest worker encountered N child process exceptions, exceeding retry
    // limit" — which looks like an app bug and is not one. Serve originals in
    // development; Vercel has the headroom, so production still optimises.
    unoptimized: process.env.NODE_ENV === "development",
  },
};

export default nextConfig;
