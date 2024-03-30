import { createStarlightTypeDocPlugin } from "starlight-typedoc";

const getAPITypeDocs = (output, path) => {
  const [types, group] = createStarlightTypeDocPlugin();

  return [
    types({
      output,
      entryPoints: [`${path}/src/index.ts`],
      tsconfig: `${path}/tsconfig.json`,
      typeDoc: {
        readme: `${path}/README.md`,
      },
    }),
    {
      label: output,
      items: [
        {
          label: "Overview",
          link: `/${output}/readme`,
        },
        group,
      ],
    },
  ];
};

export const getDocumentation = (packages) => {
  const plugins = [];
  const groups = [];
  Object.entries(packages).forEach(([pkgName, pkgPath]) => {
    const [plugin, group] = getAPITypeDocs(pkgName, pkgPath);
    plugins.push(plugin);
    groups.push(group);
  });
  return {
    plugins,
    groups,
  };
};
