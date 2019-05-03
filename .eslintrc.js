module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: ["plugin:vue/essential", "eslint:recommended"],
  rules: {
    "no-console": "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "error" : "off",
    "vue/no-unused-components":
      process.env.NODE_ENV === "production" ? "error" : "off",
    "no-unused-vars": "off"
  },
  parserOptions: {
    parser: "babel-eslint"
  }
};
