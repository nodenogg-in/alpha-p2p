import { createStarlightTypeDocPlugin } from "starlight-typedoc";
import { readFileSync } from "node:fs";
import { join } from "node:path";

export const getVersionNumber = (dirPath) => {
  const packageJsonPath = join(dirPath, "package.json");
  try {
    if (!fs.existsSync(packageJsonPath)) {
      throw new Error();
    }

    const packageJsonContent = readFileSync(packageJsonPath, "utf8");
    const packageJson = JSON.parse(packageJsonContent);

    if (!packageJson.version) {
      throw new Error();
    } else {
      return packageJson.version;
    }
  } catch {
    return false;
  }
};

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
      label: `${output}`,
      items: [
        {
          label: "Readme",
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
