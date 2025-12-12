export default {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "type-enum": [
      2,
      "always",
      [
        "feat", // New feature
        "fix", // Bug fix
        "docs", // Documentation
        "style", // Formatting, missing semicolons, etc.
        "refactor", // Code refactoring
        "test", // Adding tests
        "chore", // Maintenance tasks
        "perf", // Performance improvements
        "build", // Build system changes
        "ci", // CI config changes
        "revert", // Revert a previous commit
      ],
    ],
  },
};
