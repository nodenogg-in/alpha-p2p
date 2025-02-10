import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";
import { getDocumentation } from "./documentation.mjs";

const apiDocumentation = getDocumentation({
  microcosm: "../packages/microcosm",
});

export default defineConfig({
  integrations: [
    starlight({
      title: "nodenogg.in",
      customCss: ["./src/theme.css"],
      social: {
        github: "https://github.com/nodenogg-in/alpha-p2p",
      },
      plugins: [...apiDocumentation.plugins],
      sidebar: [
        {
          label: "Introduction",
          link: "/introduction/",
        },
        {
          label: "Principles",
          link: "/principles/",
        },
        {
          label: "Roadmap",
          link: "/roadmap/",
        },
        {
          label: "Guide",
          autogenerate: { directory: "guide" },
        },
        {
          label: "Architecture",
          autogenerate: { directory: "architecture" },
        },
        {
          label: "Deployment",
          autogenerate: { directory: "deployment" },
          badge: "draft",
        },
        {
          label: "Packages",
          items: [...apiDocumentation.groups],
        },
      ],
    }),
  ],
});
