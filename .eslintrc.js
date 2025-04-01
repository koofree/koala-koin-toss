module.exports = {
  extends: ['next/core-web-vitals', 'next/typescript'],
  plugins: ['prettier'],
  rules: {
    'prettier/prettier': 'error',
    'react-hooks/exhaustive-deps': 'off',
  },
  ignorePatterns: ['node_modules', 'dist', 'build', 'public', 'next-env.d.ts'],
};
