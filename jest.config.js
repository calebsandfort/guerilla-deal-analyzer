module.exports = {
  setupTestFrameworkScriptFile: "<rootDir>/tests/jest-setup.js",
  verbose: true,
  moduleFileExtensions: ["js", "jsx", "json", "vue"],
  transform: {
    "^.+\\.vue$": "vue-jest",
    ".+\\.(css|styl|less|sass|scss|svg|png|jpg|ttf|woff|woff2)$": "jest-transform-stub",
    "^.+\\.jsx?$": "babel-jest"
  },
  transformIgnorePatterns: ["/node_modules/"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1"
  },
  snapshotSerializers: ["jest-serializer-vue"],
  testMatch: ["**/tests/unit/**/*.spec.(js|jsx|ts|tsx)|**/__tests__/*.(js|jsx|ts|tsx)"],
  testPathIgnorePatterns: ["<rootDir>/dist/", "<rootDir>/dist_backend/"],
  testURL: "http://localhost/",
  watchPlugins: ["jest-watch-typeahead/filename", "jest-watch-typeahead/testname"],
  collectCoverage: true,
  collectCoverageFrom: ["src/components/Toolbar.{js,vue}", "src/components/LandingPage.{js,vue}", "!**/node_modules/**", "!**/vendor/**"]
};
