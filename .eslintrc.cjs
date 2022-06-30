"use strict";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
require("@rushstack/eslint-patch/modern-module-resolution");

/** @type import('@typescript-eslint/utils').TSESLint.Linter.Config */
module.exports = {
  env: {
    browser: true,
    node: true,
  },
  extends: ["@saberhq/eslint-config"],
  parserOptions: {
    project: ["tsconfig.json", "./**/tsconfig*.json"],
  },
};
