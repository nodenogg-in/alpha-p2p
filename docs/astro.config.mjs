import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";

export default defineConfig({
  integrations: [
    starlight({
      title: "nodenogg.in",
      customCss: ["./src/theme.css"],
      social: {
        github: "https://github.com/nodenogg-in/alpha-p2p",
      },
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
          badge: 'draft'
        },

      ],
    }),
  ],
});
