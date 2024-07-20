import * as fs from "fs/promises";
import * as path from "path";

interface ImportCount {
  [key: string]: {
    [importName: string]: number;
  };
}

const raycastImports: ImportCount = {
  "@raycast/api": {},
  "@raycast/utils": {},
};

function parseImports(content: string): void {
  const importRegex =
    /import\s+{([^}]+)}\s+from\s+["'](@raycast\/(?:api|utils))["']/g;
  let match;
  while ((match = importRegex.exec(content)) !== null) {
    const imports = match[1].split(",").map((i) => i.trim());
    const packageName = match[2] as keyof typeof raycastImports;
    imports.forEach((importName) => {
      if (!raycastImports[packageName][importName]) {
        raycastImports[packageName][importName] = 0;
      }
      raycastImports[packageName][importName]++;
    });
  }
}

async function readFile(filePath: string): Promise<string> {
  try {
    return await fs.readFile(filePath, "utf8");
  } catch (error) {
    console.error(`Error reading file ${filePath}:`, error);
    return "";
  }
}

async function processFile(filePath: string): Promise<void> {
  try {
    const content = await readFile(filePath);
    console.log(`Processing file ${filePath} with length ${content.length}`);
    parseImports(content);
  } catch (error) {
    console.error(`Error processing file ${filePath}:`, error);
  }
}

async function processDirectory(dirPath: string): Promise<void> {
  try {
    const entries = await fs.readdir(dirPath, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dirPath, entry.name);
      if (entry.isDirectory()) {
        await processDirectory(fullPath);
      } else if (
        entry.isFile() &&
        (entry.name.endsWith(".ts") || entry.name.endsWith(".tsx"))
      ) {
        await processFile(fullPath);
      }
    }
  } catch (error) {
    console.error(`Error processing directory ${dirPath}:`, error);
  }
}

async function main() {
  console.log("Analyzing Raycast imports...");
  const repoPath = "/Users/andrewschreiber/git/extensions/extensions";
  try {
    await processDirectory(repoPath);
    console.log("Import tally for @raycast/api:");
    console.log(JSON.stringify(raycastImports["@raycast/api"], null, 2));
    console.log("\nImport tally for @raycast/utils:");
    console.log(JSON.stringify(raycastImports["@raycast/utils"], null, 2));
    console.log("Done!");
  } catch (error) {
    console.error("Error processing repository:", error);
  }
}

main();
