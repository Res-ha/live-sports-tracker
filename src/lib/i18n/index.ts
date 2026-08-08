import { cookies } from "next/headers";
import { translate, type Lang } from "./dictionaries";

export async function getLang(): Promise<Lang> {
  const value = (await cookies()).get("lang")?.value;
  return value === "en" || value === "id" ? value : "id";
}

export type Translator = (
  key: string,
  params?: Record<string, string | number>
) => string;

export async function getDictionary(lang?: Lang): Promise<Translator> {
  const l = lang ?? (await getLang());
  return (key: string, params?: Record<string, string | number>) =>
    translate(l, key, params);
}
