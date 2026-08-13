import { spawn } from "node:child_process";

process.env.API_FOOTBALL_KEY = "";

function run(command) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, { stdio: "inherit", shell: true });
    child.on("exit", (code) =>
      code === 0 ? resolve() : reject(new Error(`${command} exited with code ${code}`))
    );
  });
}

async function main() {
  await run("npx tsx scripts/bake-data.mts");
  await run("npx next build");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});