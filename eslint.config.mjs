import js from "@eslint/js";
import globals from "globals";

/** @type {import("eslint").Linter.FlatConfig} */
export default [
  {
    files: ["**/*.js"],
    languageOptions: {
      sourceType: "commonjs",
      globals: {
        ...globals.node, // Variables globales Node.js
        ...globals.browser // Pour le front si besoin
      }
    },
    rules: {
      "indent": ["warn", 4], // Indentation 2 espaces
      "semi": ["error", "always"], // Point-virgule obligatoire
      "no-unused-vars": ["warn", { "argsIgnorePattern": "^next$" }], // Ignore `next`
      "no-undef": ["warn", { "typeof": true }], // Ignore erreurs `err` si globalement défini
      "no-console": "off", // Autoriser `console.log`
      "eqeqeq": ["error", "always"], // Imposer `===` et `!==`
      "curly": "error" // Exiger des `{}` même sur une seule ligne
    }
  },
  js.configs.recommended // Règles recommandées
];
