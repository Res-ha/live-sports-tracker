import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import {
  getStandings,
  getTeams,
  getMatchesForRound,
  getRoundRange,
  getMatchById,
  getTeamFixtures,
  getTeamForm,
} from "../src/lib/api/mock";

const OUT = join(process.cwd(), "public", "data");
const ROUNDS = 38;

async function writeJson(rel: string, data: unknown): Promise<void> {
  const file = join(OUT, rel);
  await mkdir(join(file, ".."), { recursive: true });
  await writeFile(file, JSON.stringify(data), "utf8");
}

const matchIds = new Set<number>();

async function main(): Promise<void> {
  await mkdir(OUT, { recursive: true });

  await writeJson("teams.json", getTeams());
  await writeJson("standings.json", getStandings());

  for (let round = 1; round <= ROUNDS; round++) {
    const matches = getMatchesForRound(round);
    await writeJson(`rounds/${round}.json`, {
      round,
      matches,
      range: getRoundRange(round),
    });
    for (const m of matches) matchIds.add(m.id);
  }

  for (const id of matchIds) {
    const detail = getMatchById(id);
    if (detail) await writeJson(`matches/${id}.json`, detail);
  }

  for (const team of getTeams()) {
    await writeJson(`teams/${team.id}/fixtures.json`, getTeamFixtures(team.id));
    await writeJson(`teams/${team.id}/form.json`, getTeamForm(team.id));
  }

  console.log(`Baked data: ${matchIds.size} matches, ${ROUNDS} rounds, ${getTeams().length} teams`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});