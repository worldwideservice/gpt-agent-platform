import type { StorybookConfig } from "@storybook/nextjs-vite";

const config: StorybookConfig = {
  "stories": [
    "../stories/**/*.mdx",
    "../stories/**/*.stories.@(js|jsx|mjs|ts|tsx)"
  ],
  "addons": [
    "@chromatic-com/storybook",
    "@storybook/addon-docs",
    "@storybook/addon-onboarding",
    "@storybook/addon-a11y",
    "@storybook/addon-vitest",
    "@storybook/addon-interactions"
  ],
  "framework": {
    "name": "@storybook/nextjs-vite",
    "options": {
      builder: {
        useSWC: true,
      },
    }
  },
  "staticDirs": [
    "../public"
  ],
  "typescript": {
    "check": false,
    "checkOptions": {},
    "reactDocgen": "react-docgen-typescript",
    "reactDocgenTypescriptOptions": {
      shouldExtractLiteralValuesFromEnum: true,
      propFilter: (prop) => (prop.parent ? !/node_modules/.test(prop.parent.fileName) : true),
    },
  },
  "docs": {
    "autodocs": "tag"
  }
};
export default config;