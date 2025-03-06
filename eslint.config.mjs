import js from "@eslint/js";
import globals from "globals";

/** @type {import("eslint").Linter.FlatConfig} */
export default [
  {
    files: ["**/*.js"],
    languageOptions: {
      sourceType: "commonjs",
      globals: {
        ...globals.node, // Utilisation des variables globales de Node.js
        ...globals.browser // Si tu fais aussi du front, garde-le
      }
    },
    rules: {
      "indent": ["warn", 4], // Indentation avec 2 espaces
      "semi": ["error", "always"], // Imposer le point-virgule
      "no-unused-vars": ["warn"], // Avertir sur les variables non utilisées
      "no-console": "off", // Autoriser `console.log` (utile en dev)
      "eqeqeq": ["error", "always"], // Forcer `===` et `!==`
      "curly": "error" // Exiger des accolades `{}` même pour une seule ligne
    }
  },
  js.configs.recommended // Intégration des règles recommandées de @eslint/js
];
