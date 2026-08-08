import { getSportsProvider } from "./football";
import type { SportsProvider } from "./types";

export const provider: SportsProvider = getSportsProvider();
export type { SportsProvider } from "./types";
