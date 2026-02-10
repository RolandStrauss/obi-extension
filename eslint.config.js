// Minimal ESLint flat config to satisfy pretest lint step
export default {
  languageOptions: {
    ecmaVersion: 2021,
    sourceType: 'module'
  },
  ignores: ['node_modules', 'out'],
  rules: {}
};
