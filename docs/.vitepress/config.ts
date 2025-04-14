import { defineConfig } from "vitepress";

export default defineConfig({
  title: "nodenogg.in documentation",
  description: "Guide to the nodenogg.in project",
  themeConfig: {
    search: {
      provider: "local",
    },
  },
});
