import * as fs from "fs/promises";
import * as path from "path";

interface ImportCount {
  [key: string]: {
    [importName: string]: number;
  };
}

interface ExtensionInfo {
  name: string;
  hasRaycastImport: boolean;
}

const raycastImports: ImportCount = {
  "@raycast/api": {},
  "@raycast/utils": {},
};

const extensionsWithoutRaycastImports: ExtensionInfo[] = [];

function parseImports(content: string, extensionName: string): boolean {
  const importRegex =
    /import\s+{([^}]+)}\s+from\s+["'](@raycast\/(?:api|utils))["']/g;
  let hasRaycastImport = false;
  let match;
  while ((match = importRegex.exec(content)) !== null) {
    hasRaycastImport = true;
    const imports = match[1].split(",").map((i) => i.trim());
    const packageName = match[2] as keyof typeof raycastImports;
    imports.forEach((importName) => {
      if (!raycastImports[packageName][importName]) {
        raycastImports[packageName][importName] = 0;
      }
      raycastImports[packageName][importName]++;
    });
  }
  return hasRaycastImport;
}

async function readFile(filePath: string): Promise<string> {
  try {
    return await fs.readFile(filePath, "utf8");
  } catch (error) {
    console.error(`Error reading file ${filePath}:`, error);
    return "";
  }
}

async function processFile(
  filePath: string,
  extensionName: string,
): Promise<boolean> {
  try {
    const content = await readFile(filePath);
    // console.log(`Processing file ${filePath} with length ${content.length}`);
    return parseImports(content, extensionName);
  } catch (error) {
    console.error(`Error processing file ${filePath}:`, error);
    return false;
  }
}

async function processExtension(extensionPath: string): Promise<boolean> {
  const extensionName = path.basename(extensionPath);
  let hasRaycastImport = false;

  try {
    const entries = await fs.readdir(extensionPath, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(extensionPath, entry.name);
      if (
        entry.isFile() &&
        (entry.name.endsWith(".ts") || entry.name.endsWith(".tsx"))
      ) {
        hasRaycastImport =
          (await processFile(fullPath, extensionName)) || hasRaycastImport;
      } else if (entry.isDirectory() && entry.name !== "node_modules") {
        const subDirHasImport = await processExtension(fullPath);
        hasRaycastImport = subDirHasImport || hasRaycastImport;
      }
    }
  } catch (error) {
    console.error(`Error processing extension ${extensionName}:`, error);
  }

  if (!hasRaycastImport) {
    extensionsWithoutRaycastImports.push({
      name: extensionPath,
      hasRaycastImport: false,
    });
  }

  return hasRaycastImport;
}

async function main() {
  console.log("Analyzing Raycast imports...");
  const repoPath = "/Users/andrewschreiber/git/extensions/extensions";
  try {
    const extensions = await fs.readdir(repoPath, { withFileTypes: true });
    for (const extension of extensions) {
      if (extension.isDirectory()) {
        await processExtension(path.join(repoPath, extension.name));
      }
    }

    console.log("Import tally for @raycast/api:");
    console.log(JSON.stringify(raycastImports["@raycast/api"], null, 2));
    console.log("\nImport tally for @raycast/utils:");
    console.log(JSON.stringify(raycastImports["@raycast/utils"], null, 2));

    console.log("\nExtensions without Raycast imports:");
    console.log(JSON.stringify(extensionsWithoutRaycastImports, null, 2));

    console.log("Done!");
  } catch (error) {
    console.error("Error processing repository:", error);
  }
}

main();
