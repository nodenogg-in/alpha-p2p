import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";
import { createStarlightTypeDocPlugin } from "starlight-typedoc";

const [microcosmTypes, microcosmTypesGroup] = createStarlightTypeDocPlugin();
const [frameworkTypes, frameworkTypesGroup] = createStarlightTypeDocPlugin();

// https://astro.build/config
export default defineConfig({
  integrations: [
    starlight({
      title: "nodenogg.in",
      customCss: ["./src/theme.css"],
      social: {
        github: "https://github.com/nodenogg-in/alpha-p2p",
      },
      plugins: [
        microcosmTypes({
          entryPoints: ["../internal/microcosm/src/index.ts"],
          output: "microcosm",
          tsconfig: "../internal/microcosm/tsconfig.json",
          typeDoc: {
            readme: "../internal/microcosm/README.md",
          },
        }),
        frameworkTypes({
          entryPoints: ["../internal/framework/src/index.ts"],
          output: "framework",
          tsconfig: "../internal/framework/tsconfig.json",
          typeDoc: {
            readme: "../internal/framework/README.md",
          },
        }),
      ],
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
          label: "@nodenogg.in/microcosm",
          items: [
            {
              label: "Overview",
              link: "/microcosm/readme",
            },
            microcosmTypesGroup,
          ],
        },
        {
          label: "@nodenogg.in/framework",
          items: [
            {
              label: "Overview",
              link: "/framework/readme",
            },
            frameworkTypesGroup,
          ],
        },
      ],
    }),
  ],
});
