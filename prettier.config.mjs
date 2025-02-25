/** @type {import("prettier").Config} */
export default {
  singleQuote: true,
  trailingComma: 'all',
  semi: true,
  bracketSpacing: true,
  tabWidth: 2,
  printWidth: 80,
  importOrder: [
    '^react$',
    '<THIRD_PARTY_MODULES>',
    '',
    '^@/components/ui/(.*)$',
    '^@/components/(.*)$',
    '^@/',
  ],
  plugins: [
    'prettier-plugin-tailwindcss',
    '@ianvs/prettier-plugin-sort-imports',
  ],
};
