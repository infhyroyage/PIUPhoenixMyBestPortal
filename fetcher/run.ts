import { config } from "dotenv";
import { Browser, BrowserContext, Page, chromium } from "playwright-chromium";
import { fetchMyBests, fetchSteps } from "./fetcher";
import { Lv, MyBest, Score, Step } from "../services/types";
import { createScores, upsertScores } from "./gist";

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
  if (!process.env.GITHUB_REPOSITORY_OWNER) {
    throw new Error("GITHUB_REPOSITORY_OWNER is not set.");
  }
  const githubRepositoryOwner: string = process.env.GITHUB_REPOSITORY_OWNER;
  if (!process.env.GITHUB_TOKEN) {
    throw new Error("GITHUB_TOKEN is not set.");
  }
  const githubToken: string = process.env.GITHUB_TOKEN;
  if (!process.env.PIU_PHOENIX_EMAIL) {
    throw new Error("PIU_PHOENIX_EMAIL is not set.");
  }
  const piuPhoenixEmail: string = process.env.PIU_PHOENIX_EMAIL;
  if (!process.env.PIU_PHOENIX_PASSWORD) {
    throw new Error("PIU_PHOENIX_PASSWORD is not set.");
  }
  const piuPhoenixPassword: string = process.env.PIU_PHOENIX_PASSWORD;
  // if (!process.env.PLAYER_NAME) {
  //   throw new Error("PLAYER_NAME is not set.");
  // }
  // const playerName: string = process.env.PLAYER_NAME;

  const startTime: number = Date.now();

  // Initialize Playwright Page
  const browser: Browser = await chromium.launch();
  try {
    const context: BrowserContext = await browser.newContext();
    const page: Page = await context.newPage();

    // Login Pump It Up Phoenix
    await page.goto("https://www.piugame.com/");
    await page.fill(
      'input[name="mb_id"][placeholder="E-mail"]',
      piuPhoenixEmail,
    );
    await page.fill(
      'input[name="mb_password"][placeholder="Password"]',
      piuPhoenixPassword,
    );
    await page.click('button[type="submit"]:has-text("Login")');

    for (const lv of ALL_LV) {
      // Fetch All Steps
      const steps: Step[] = await fetchSteps(page, lv);

      // Fetch All My Best Scores
      const myBests: MyBest[] = await fetchMyBests(page, lv);

      // Create Cosmos DB Item Data
      const scores: Score[] = createScores(steps, myBests);
      if (process.env.NODE_ENV === "development") {
        console.log(JSON.stringify(scores, null, 2));
      }

      // Upsert into Gist
      await upsertScores(scores, lv, githubRepositoryOwner, githubToken);
    }
  } finally {
    await browser.close();

    if (process.env.NODE_ENV !== "test") {
      const endTime: number = Date.now();
      console.log(`Fetching Time: ${(endTime - startTime) / 1000} sec.`);
    }
  }
}
