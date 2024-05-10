import { config } from "dotenv";
import { Browser, BrowserContext, Page, chromium } from "playwright-chromium";
import { fetchMyBests, fetchSteps, login, switchPlayer } from "./scrape";
import { GistJson, Lv, MyBest, Score, Step } from "../services/types";
import { createScores, upsertGist } from "./gist";

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
  const playerName: string | undefined = process.env.PLAYER_NAME;

  // Initialize Playwright Page
  const browser: Browser = await chromium.launch();
  try {
    const context: BrowserContext = await browser.newContext();
    const page: Page = await context.newPage();

    // Login Pump It Up Phoenix
    await login(page, piuPhoenixEmail, piuPhoenixPassword);

    // Switch to PLAYER_NAME
    if (playerName) {
      await switchPlayer(page, playerName);
    }

    // Create PIUPhoenixMyBestPortal Gist
    const gistJson: GistJson = ALL_LV.reduce((gj: GistJson, lv: Lv) => {
      gj[lv] = [];
      return gj;
    }, {} as GistJson);
    for (const lv of ALL_LV) {
      // Fetch All Steps
      const steps: Step[] = await fetchSteps(page, lv);

      // Fetch All My Bests
      const myBests: MyBest[] = await fetchMyBests(page, lv);

      // Create and Add All My Bests
      const scores: Score[] = createScores(steps, myBests);
      if (process.env.NODE_ENV === "development") {
        console.log(JSON.stringify(scores, null, 2));
      }
      gistJson[lv] = scores;
    }

    // Upsert PIUPhoenixMyBestPortal Gist
    await upsertGist(gistJson, gistPat);
  } finally {
    await browser.close();
  }
}
