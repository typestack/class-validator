module.exports = {
    root: true,
    env: {
        node: true
    },
    parser: "@typescript-eslint/parser",
    parserOptions: {
        project: ['./tsconfig.json']
    },
    plugins: [
        "@typescript-eslint"
    ],
    extends: [
        "eslint:recommended",
        "plugin:@typescript-eslint/eslint-recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:@typescript-eslint/recommended-requiring-type-checking"
    ],
    ignorePatterns: ["**/*.js"],
    rules: {
        "no-prototype-builtins": "off",
        "@typescript-eslint/no-inferrable-types": "off",
        "@typescript-eslint/no-non-null-assertion": "off",
        "@typescript-eslint/no-unused-vars": "off",
        "@typescript-eslint/no-explicit-any": "off",
        "@typescript-eslint/member-ordering": "error",
        "@typescript-eslint/unbound-method": ["error", {
            "ignoreStatic": true
        }],
        "@typescript-eslint/prefer-includes": "off"
    }
};
