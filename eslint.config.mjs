import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      // The site uses literal "// label" prefixes throughout JSX as a
      // typographic device. ESLint mistakes them for JS comments.
      "react/jsx-no-comment-textnodes": "off",
      // The IntersectionObserver / animation-loop patterns set state in
      // genuine async callbacks; the new strict rule flags false positives.
      "react-hooks/set-state-in-effect": "off",
    },
  },
  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts"]),
]);

export default eslintConfig;
