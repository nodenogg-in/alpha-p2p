import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";
import { getDocumentation } from "./documentation.mjs";

const apiDocumentation = getDocumentation({
  microcosm: "../internal/microcosm",
  framework: "../internal/framework",
  statekit: "../packages/statekit",
  spacekit: "../packages/spacekit",
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
          label: "Guide",
          autogenerate: { directory: "guide" },
        },
        {
          label: "Architecture",
          autogenerate: { directory: "architecture" },
        },
        {
          label: "Advanced",
          autogenerate: { directory: "advanced" },
        },
        {
          label: "Packages",
          items: [...apiDocumentation.groups],
        },
      ],
    }),
  ],
});
