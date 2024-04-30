import { Page } from "playwright-core";
import { Lv, MyBest, Step } from "../services/types";

/**
 * Fetch All Steps from "Over Lv.20 Ranking"
 * @param {Page} page Playwright Page
 * @param {Lv} lv Query Parameter "lv"
 * @returns {Step[]} Fetched All Steps
 */
export async function fetchSteps(page: Page, lv: Lv): Promise<Step[]> {
  const steps: Step[] = [];

  // Access "Over Lv.20 Ranking"
  await page.goto(
    `https://www.piugame.com/leaderboard/over_ranking.php?lv=${lv}`,
  );

  // Get the Number of Pages
  let pageNum: number = 1;
  const boardPagingDiv = await page.$("div.board_paging");
  if (boardPagingDiv) {
    const lastButton = await boardPagingDiv.$("button:last-child");
    if (lastButton) {
      const onClickAttr = await lastButton.getAttribute("onClick");
      if (onClickAttr) {
        const pageMatch = onClickAttr.match(/page=(\d+)/);
        if (pageMatch && pageMatch[1]) {
          const parsedPageNum = parseInt(pageMatch[1], 10);
          if (!isNaN(parsedPageNum)) {
            pageNum = parsedPageNum;
          }
        }
      }
    }
  }

  for (let i = 1; i <= pageNum; i++) {
    // Access "Over Lv.20 Ranking" per Page
    await page.goto(
      `https://www.piugame.com/leaderboard/over_ranking.php?lv=${lv}&page=${i}`,
    );

    // Get All Steps per Page
    const ratingRankingListUl = await page.$("ul.rating_ranking_list");
    if (ratingRankingListUl) {
      const liList = await ratingRankingListUl.$$("li");
      for (const li of liList) {
        // Get Song Name
        const songNameWDiv = await li.$("div.songName_w");
        if (!songNameWDiv) continue;
        const songName = await songNameWDiv.textContent();
        if (!songName) continue;

        // Get Step Type
        let stepType: string;
        const numwFlexVcHcDiv = await li.$("div.numw.flex.vc.hc");
        if (!numwFlexVcHcDiv) continue;
        const numwFlexVcHcDivImgs = await numwFlexVcHcDiv.$$("img");
        if (numwFlexVcHcDivImgs.length !== 2) continue;
        const numwFlexVcHcDivImgSrc =
          await numwFlexVcHcDivImgs[1].getAttribute("src");
        if (!numwFlexVcHcDivImgSrc) continue;
        const numwFlexVcHcDivImgSrcNum = numwFlexVcHcDivImgSrc.match(
          /https:\/\/www\.piugame\.com\/l_img\/stepball\/full\/(?:c|s|d|sp|dp)_num_(\d+)\.png/,
        );
        if (!numwFlexVcHcDivImgSrcNum || !numwFlexVcHcDivImgSrcNum[1]) continue;
        const twDiv = await li.$("div.tw");
        if (!twDiv) continue;
        const twDivImg = await twDiv.$("img");
        if (!twDivImg) continue;
        const twDivImgSrc = await twDivImg.getAttribute("src");
        switch (twDivImgSrc) {
          case "https://www.piugame.com/l_img/stepball/full/s_text.png":
            stepType = `S2${numwFlexVcHcDivImgSrcNum[1]}`;
            break;
          case "https://www.piugame.com/l_img/stepball/full/d_text.png":
            stepType = `D2${numwFlexVcHcDivImgSrcNum[1]}`;
            break;
          case "https://www.piugame.com/l_img/stepball/full/sp_text.png":
            stepType = `SP2${numwFlexVcHcDivImgSrcNum[1]}`;
            break;
          case "https://www.piugame.com/l_img/stepball/full/dp_text.png":
            stepType = `DP2${numwFlexVcHcDivImgSrcNum[1]}`;
            break;
          case "https://www.piugame.com/l_img/stepball/full/c_text.png":
            stepType = `CO-OPx${numwFlexVcHcDivImgSrcNum[1]}`;
            break;
          default:
            continue;
        }

        // Get Thumbnail URL
        const reImgBgfixDiv = await li.$("div.re.img.bgfix");
        if (!reImgBgfixDiv) continue;
        const reImgBgfixDivStyle = await reImgBgfixDiv.getAttribute("style");
        if (!reImgBgfixDivStyle) continue;
        const reImgBgfixDivUrls = reImgBgfixDivStyle.match(
          /background-image:url\('(.+?)'\)/,
        );
        if (!reImgBgfixDivUrls || !reImgBgfixDivUrls[1]) continue;
        const thumbnailImgSrc = reImgBgfixDivUrls[1];

        // Add Step
        steps.push({
          lv,
          songName,
          stepType,
          thumbnailImgSrc,
        });
      }
    }

    // Take Screenshot for Development
    if (process.env.NODE_ENV === "development") {
      await page.screenshot({
        fullPage: true,
        path: `imgs/screenshot_fetchSteps_lv${lv}_page${i}.png`,
      });
    }
  }

  return steps;
}

/**
 * Fetch All My Best Scores from "My Best Score"
 * @param {Page} page Playwright Page
 * @param {Lv} lv Query Parameter "lv"
 * @returns {MyBest[]} Fetched All My Best Scores
 */
export async function fetchMyBests(page: Page, lv: Lv): Promise<MyBest[]> {
  const myBests: MyBest[] = [];

  // Access "My Best Score"
  await page.goto(`https://www.piugame.com/my_page/my_best_score.php?lv=${lv}`);

  // Get the Number of Pages
  let pageNum: number = 1;
  const boardPagingDiv = await page.$("div.board_paging");
  if (boardPagingDiv) {
    const lastButton = await boardPagingDiv.$("button:last-child");
    if (lastButton) {
      const onClickAttr = await lastButton.getAttribute("onClick");
      if (onClickAttr) {
        const pageMatch = onClickAttr.match(/page=(\d+)/);
        if (pageMatch && pageMatch[1]) {
          const parsedPageNum = parseInt(pageMatch[1], 10);
          if (!isNaN(parsedPageNum)) {
            pageNum = parsedPageNum;
          }
        }
      }
    }
  }

  for (let i = 1; i <= pageNum; i++) {
    // Access "My Best Score" per Page
    await page.goto(
      `https://www.piugame.com/my_page/my_best_score.php?lv=${lv}&page=${i}`,
    );

    // Get All Steps per Page
    const myBestScoreListUl = await page.$("ul.my_best_scoreList");
    if (myBestScoreListUl) {
      const liList = await myBestScoreListUl.$$("li");
      for (const li of liList) {
        // Get Song Name
        const songNameDiv = await li.$("div.song_name");
        if (!songNameDiv) continue;
        const songName = await songNameDiv.textContent();
        if (!songName) continue;

        // Get Step Type
        let stepType: string;
        const numwFlexVcHcDiv = await li.$("div.numw.flex.vc.hc");
        if (!numwFlexVcHcDiv) continue;
        const numwFlexVcHcDivImgs = await numwFlexVcHcDiv.$$("img");
        if (numwFlexVcHcDivImgs.length !== 2) continue;
        const numwFlexVcHcDivImgSrc =
          await numwFlexVcHcDivImgs[1].getAttribute("src");
        if (!numwFlexVcHcDivImgSrc) continue;
        const numwFlexVcHcDivImgSrcNum = numwFlexVcHcDivImgSrc.match(
          /https:\/\/www\.piugame\.com\/l_img\/stepball\/full\/(?:c|s|d|sp|dp)_num_(\d+)\.png/,
        );
        if (!numwFlexVcHcDivImgSrcNum || !numwFlexVcHcDivImgSrcNum[1]) continue;
        const twDiv = await li.$("div.tw");
        if (!twDiv) continue;
        const twDivImg = await twDiv.$("img");
        if (!twDivImg) continue;
        const twDivImgSrc = await twDivImg.getAttribute("src");
        switch (twDivImgSrc) {
          case "https://www.piugame.com/l_img/stepball/full/s_text.png":
            stepType = `S2${numwFlexVcHcDivImgSrcNum[1]}`;
            break;
          case "https://www.piugame.com/l_img/stepball/full/d_text.png":
            stepType = `D2${numwFlexVcHcDivImgSrcNum[1]}`;
            break;
          case "https://www.piugame.com/l_img/stepball/full/sp_text.png":
            stepType = `SP2${numwFlexVcHcDivImgSrcNum[1]}`;
            break;
          case "https://www.piugame.com/l_img/stepball/full/dp_text.png":
            stepType = `DP2${numwFlexVcHcDivImgSrcNum[1]}`;
            break;
          case "https://www.piugame.com/l_img/stepball/full/c_text.png":
            stepType = `CO-OPx${numwFlexVcHcDivImgSrcNum[1]}`;
            break;
          default:
            continue;
        }

        // Get Score
        const txtVDiv = await li.$("div.txt_v");
        if (!txtVDiv) continue;
        const score = await txtVDiv.textContent();
        if (!score) continue;

        // Get Grade Image URL
        const imgDiv = await li.$("div.img");
        if (!imgDiv) continue;
        const imgDivImg = await imgDiv.$("img");
        if (!imgDivImg) continue;
        const gradeImgSrc = await imgDivImg.getAttribute("src");
        if (!gradeImgSrc) continue;

        // Get Plate Image URL
        const imgSt1Div = await li.$("div.img.st1");
        if (!imgSt1Div) continue;
        const imgSt1DivImg = await imgSt1Div.$("img");
        if (!imgSt1DivImg) continue;
        const plateImgSrc = await imgSt1DivImg.getAttribute("src");
        if (!plateImgSrc) continue;

        // Add My Best Score
        myBests.push({
          lv,
          songName,
          stepType,
          score,
          gradeImgSrc,
          plateImgSrc,
        });
      }
    }

    // Take Screenshot for Development
    if (process.env.NODE_ENV === "development") {
      await page.screenshot({
        fullPage: true,
        path: `imgs/screenshot_fetchScores_lv${lv}_page${i}.png`,
      });
    }
  }

  return myBests;
}
