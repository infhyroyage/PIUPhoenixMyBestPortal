import { config } from "dotenv";
import { Browser, BrowserContext, Page, chromium } from "playwright-chromium";
import { fetchMyBests, fetchSteps, login } from "./scrape";
import { GistInfo, Lv, MyBest, Score, Step } from "../services/types";
import { listGistInfo } from "../services/gist";
import { createGistContent, upsertGist } from "./gist";

/**
 * All Query Parameters "lv" of "Over Lv.20 Ranking" and "My Best Score"
 */
const ALL_LV: Lv[] = [
  "20",
  "21",
  "22",
  "23",
  "24",
  "25",
  "26",
  "27over",
  "coop",
];

/**
 * Main Function
 */
export async function run() {
  config();

  // Validation Check
  if (!process.env.GIST_PAT) {
    throw new Error("GIST_PAT is not set.");
  }
  const gistPat: string = process.env.GIST_PAT;
  if (!process.env.PIU_PHOENIX_EMAIL) {
    throw new Error("PIU_PHOENIX_EMAIL is not set.");
  }
  const piuPhoenixEmail: string = process.env.PIU_PHOENIX_EMAIL;
  if (!process.env.PIU_PHOENIX_PASSWORD) {
    throw new Error("PIU_PHOENIX_PASSWORD is not set.");
  }
  const piuPhoenixPassword: string = process.env.PIU_PHOENIX_PASSWORD;
  // TODO: Switch to PLAYER_NAME
  // if (!process.env.PLAYER_NAME) {
  //   throw new Error("PLAYER_NAME is not set.");
  // }
  // const playerName: string = process.env.PLAYER_NAME;

  const startTime: number = Date.now();

  // List PIUPhoenixMyBestPortal Gists
  const gistInfoList: GistInfo[] = await listGistInfo(gistPat);

  // Initialize Playwright Page
  const browser: Browser = await chromium.launch();
  try {
    const context: BrowserContext = await browser.newContext();
    const page: Page = await context.newPage();

    // Login Pump It Up Phoenix
    await login(page, piuPhoenixEmail, piuPhoenixPassword);

    for (const lv of ALL_LV) {
      // Fetch All Steps
      const steps: Step[] = await fetchSteps(page, lv);

      // Fetch All My Best Scores
      const myBests: MyBest[] = await fetchMyBests(page, lv);

      // Create Gist Content
      const scores: Score[] = createGistContent(steps, myBests);
      if (process.env.NODE_ENV === "development") {
        console.log(JSON.stringify(scores, null, 2));
      }

      // Upsert Gist
      await upsertGist(scores, lv, gistInfoList, gistPat);
    }
  } finally {
    await browser.close();

    if (process.env.NODE_ENV !== "test") {
      const endTime: number = Date.now();
      console.log(`Fetching Time: ${(endTime - startTime) / 1000} sec.`);
    }
  }
}
