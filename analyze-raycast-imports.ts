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

async function downloadFile(url: string): Promise<string> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return await response.text();
}

async function processFile(fileUrl: string): Promise<void> {
  try {
    const content = await downloadFile(fileUrl);
    parseImports(content);
  } catch (error) {
    console.error(`Error processing file ${fileUrl}:`, error);
  }
}

async function processDirectory(
  repoUrl: string,
  path: string = "",
): Promise<void> {
  const url = `${repoUrl}/contents/${path}`;
  const response = await fetch(url);
  const data = await response.json();

  for (const item of data) {
    if (item.type === "dir" && item.name === "extensions") {
      await processDirectory(repoUrl, item.path);
    } else if (item.type === "dir" && path.startsWith("extensions/")) {
      await processDirectory(repoUrl, item.path);
    } else if (
      item.type === "file" &&
      (item.name.endsWith(".ts") || item.name.endsWith(".tsx"))
    ) {
      await processFile(item.download_url);
    }
  }
}

async function main() {
  const repoUrl = "https://api.github.com/repos/raycast/extensions";

  try {
    await processDirectory(repoUrl);

    console.log("Import tally for @raycast/api:");
    console.log(JSON.stringify(raycastImports["@raycast/api"], null, 2));

    console.log("\nImport tally for @raycast/utils:");
    console.log(JSON.stringify(raycastImports["@raycast/utils"], null, 2));
  } catch (error) {
    console.error("Error processing repository:", error);
  }
}

main();
