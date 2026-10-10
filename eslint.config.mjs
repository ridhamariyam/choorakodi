import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

/**
 * Flat config. eslint-config-next 16 ships native flat configs, so no
 * FlatCompat shim is needed (and the shim breaks on this version).
 */
const eslintConfig = [
  { ignores: [".next/**", "node_modules/**", "next-env.d.ts", "public/**"] },
  ...nextCoreWebVitals,
  ...nextTypescript,
];

export default eslintConfig;
