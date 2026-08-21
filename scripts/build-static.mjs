import { spawn } from "node:child_process";
import { resolve as resolvePath } from "node:path";

process.env.API_FOOTBALL_KEY = "";

function runNode(relativeScript, ...args) {
  return new Promise((done, reject) => {
    const script = resolvePath(process.cwd(), "node_modules", relativeScript);
    const child = spawn(process.execPath, [script, ...args], { stdio: "inherit" });
    child.on("error", reject);
    child.on("exit", (code) =>
      code === 0
        ? done()
        : reject(new Error(`${relativeScript} exited with code ${code}`))
    );
  });
}

async function main() {
  await runNode("tsx/dist/cli.mjs", "scripts/bake-data.mts");
  await runNode("next/dist/bin/next", "build");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
