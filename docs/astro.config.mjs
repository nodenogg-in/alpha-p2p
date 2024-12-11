import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";

// Step 1 - create footer component in src/components/Footer.astro

`
<footer>
<p>Copyright notice</p>
<p>Example footer text</p>
</footer>
`

// Step 2 - add override


export default defineConfig({
  integrations: [
    starlight({
      title: "nodenogg.in",
      customCss: ["./src/theme.css"],
      components: {
        Footer: './src/components/Footer.astro',
      },
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
          badge: 'draft'
        },
        {
          label: "Architecture",
          autogenerate: { directory: "architecture" },
          badge: 'draft'
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
