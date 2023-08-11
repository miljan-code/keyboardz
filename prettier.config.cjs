/** @typedef  {import("prettier").Config} PrettierConfig */

/** @type { PrettierConfig | SortImportsConfig } */
const config = {
  arrowParens: 'always',
  printWidth: 80,
  singleQuote: false,
  semi: true,
  trailingComma: 'all',
  tabWidth: 2,
  plugins: [
    '@ianvs/prettier-plugin-sort-imports',
    'prettier-plugin-tailwindcss',
  ],
  importOrderTypeScriptVersion: '4.4.0',
  importOrder: [
    '^(react/(.*)$)|^(react$)',
    '^(next/(.*)$)|^(next$)',
    '<THIRD_PARTY_MODULES>',
    '^@/lib/(.*)$',
    '^@/db/(.*)$',
    '^@/components/(.*)$',
    '^@/components/ui/(.*)$',
    '^[./]',
    '^@/styles/(.*)$',
    '^@/types/(.*)$',
  ],
  proseWrap: 'always',
};

module.exports = config;
