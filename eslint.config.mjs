import nextCoreWebVitals from "eslint-config-next/core-web-vitals";

// eslint-config-next 16 ships flat config directly — no FlatCompat wrapper.
const eslintConfig = [
  ...nextCoreWebVitals,
  {
    ignores: [".next/**", "node_modules/**"],
  },
];

export default eslintConfig;
