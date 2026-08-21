import assert from "node:assert/strict";
import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";

const ROOT = process.cwd();
const OUT = join(ROOT, "out");
const DATA = join(ROOT, "public", "data");

async function htmlFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  return entries.filter((entry) => entry.isFile() && entry.name.endsWith(".html"));
}

async function assertFile(path) {
  await readFile(path);
}

async function main() {
  for (const page of ["index.html", "schedule.html", "standings.html", "stats.html", "profile.html"]) {
    await assertFile(join(OUT, page));
  }

  const matchPages = await htmlFiles(join(OUT, "matches"));
  const teamPages = await htmlFiles(join(OUT, "teams"));
  assert.equal(matchPages.length, 380, "Expected 380 generated match pages");
  assert.equal(teamPages.length, 20, "Expected 20 generated team pages");

  await assertFile(join(DATA, "teams.json"));
  await assertFile(join(DATA, "standings.json"));
  for (let round = 1; round <= 38; round++) {
    await assertFile(join(DATA, "rounds", `${round}.json`));
  }

  const home = await readFile(join(OUT, "index.html"), "utf8");
  const matchIds = [...home.matchAll(/\/matches\/(\d+)/g)].map((match) => match[1]);
  assert.ok(matchIds.length > 0, "Home page must link to at least one match");
  for (const id of new Set(matchIds)) {
    await assertFile(join(OUT, "matches", `${id}.html`));
  }

  console.log(
    `Static artifact verified: ${matchPages.length} matches, ${teamPages.length} teams, ${new Set(matchIds).size} home links`
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
