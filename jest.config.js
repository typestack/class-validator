module.exports = {
    modulePaths: ["<rootDir>/node_modules"],
    transform: {
        "^.+\\.tsx?$": "ts-jest"
    },
    testRegex: "(/__test__/.*|(\\.|/)(test|spec))\\.(jsx?|tsx?)$",
    testEnvironment: "node",
    moduleFileExtensions: [
        "ts",
        "tsx",
        "js",
        "jsx",
        "json",
        "node"
    ],
    modulePathIgnorePatterns: [
        "<rootDir>/build/"
    ],
    coverageReporters: [
        // "html",
        // "lcov",
        "text-summary"
    ]
};
