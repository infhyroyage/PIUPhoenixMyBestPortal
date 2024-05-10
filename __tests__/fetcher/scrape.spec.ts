import { Page } from "playwright-chromium";
import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  fetchMyBests,
  fetchSteps,
  login,
  switchPlayer,
} from "../../fetcher/scrape";

const mockGoto = vi.fn();
const mockFill = vi.fn();
const mockClick = vi.fn();
const mockWaitForTimeout = vi.fn();
const mock$ = vi.fn();
const mockScreenshot = vi.fn();
const mockPage = {
  goto: mockGoto,
  fill: mockFill,
  click: mockClick,
  waitForTimeout: mockWaitForTimeout,
  $: mock$,
  screenshot: mockScreenshot,
} as unknown as Page;

beforeEach(() => {
  vi.resetAllMocks();
});

describe("login", () => {
  it("Should throw Error if failed to access official site", async () => {
    mockGoto.mockRejectedValueOnce(
      new Error("Failed to access official site."),
    );

    await expect(login(mockPage, "email", "password")).rejects.toThrow(
      "Failed to access official site.",
    );
    expect(mockGoto).toHaveBeenNthCalledWith(1, "https://www.piugame.com/");
  });

  it("Should throw Error if failed to input email", async () => {
    mockFill.mockRejectedValueOnce(new Error("Failed to input email."));

    await expect(login(mockPage, "email", "password")).rejects.toThrow(
      "Failed to input email.",
    );
    expect(mockFill).toHaveBeenNthCalledWith(
      1,
      'input[name="mb_id"][placeholder="E-mail"]',
      "email",
    );
  });

  it("Should throw Error if failed to input password", async () => {
    mockFill
      .mockReturnValueOnce(undefined)
      .mockRejectedValueOnce(new Error("Failed to input password."));

    await expect(login(mockPage, "email", "password")).rejects.toThrow(
      "Failed to input password.",
    );
    expect(mockFill).toHaveBeenNthCalledWith(
      2,
      'input[name="mb_password"][placeholder="Password"]',
      "password",
    );
  });

  it("Should throw Error if failed to click 'Login' button", async () => {
    mockClick.mockRejectedValue(new Error("Failed to click 'Login' button."));

    await expect(login(mockPage, "email", "password")).rejects.toThrow(
      "Failed to click 'Login' button.",
    );
    expect(mockClick).toHaveBeenNthCalledWith(
      1,
      'button[type="submit"]:has-text("Login")',
    );
  });

  it("Should return undefined if login successfully", async () => {
    const result = await login(mockPage, "email", "password");
    expect(result).toBeUndefined();
  });
});

describe("switchPlayer", () => {
  it('Should throw Error if failed to access "My Best Score"', async () => {
    mockGoto.mockRejectedValueOnce(
      new Error('Failed to access "My Best Score".'),
    );

    await expect(switchPlayer(mockPage, "playerName")).rejects.toThrow(
      'Failed to access "My Best Score".',
    );
    expect(mockGoto).toHaveBeenNthCalledWith(
      1,
      "https://www.piugame.com/my_page/my_best_score.php",
    );
  });

  it("Should throw Error if failed to click 'Switch Account' button", async () => {
    mockClick.mockRejectedValue(
      new Error('Failed to click "Switch Account" button.'),
    );

    await expect(switchPlayer(mockPage, "playerName")).rejects.toThrow(
      'Failed to click "Switch Account" button.',
    );
    expect(mockClick).toHaveBeenNthCalledWith(
      1,
      'a:has-text("Switch Account")',
    );
  });

  it("Should throw Error if failed to click player name label", async () => {
    mockClick
      .mockResolvedValueOnce(undefined)
      .mockRejectedValue(new Error("Failed to click player name label."));

    await expect(switchPlayer(mockPage, "playerName")).rejects.toThrow(
      "Failed to click player name label.",
    );
    expect(mockClick).toHaveBeenNthCalledWith(
      2,
      'label:has-text("playerName")',
    );
  });

  it("Should throw Error if failed to wait 10 seconds", async () => {
    mockWaitForTimeout.mockRejectedValue(
      new Error("Failed to wait 10 seconds."),
    );

    await expect(switchPlayer(mockPage, "playerName")).rejects.toThrow(
      "Failed to wait 10 seconds.",
    );
    expect(mockWaitForTimeout).toHaveBeenNthCalledWith(1, 10000);
  });

  it("Should return undefined if switch player successfully", async () => {
    const result = await switchPlayer(mockPage, "playerName");
    expect(result).toBeUndefined();
  });

  it('Should take screenshot if NODE_ENV is "development"', async () => {
    process.env.NODE_ENV = "development";

    await switchPlayer(mockPage, "playerName");
    expect(mockScreenshot).toHaveBeenCalledWith({
      fullPage: true,
      path: "imgs/screenshot_switchPlayer_playerName.png",
    });
  });

  it('Should not take screenshot if NODE_ENV is not "development"', async () => {
    process.env.NODE_ENV = "production";

    await switchPlayer(mockPage, "playerName");
    expect(mockScreenshot).toHaveBeenCalledTimes(0);
  });
});

describe("fetchSteps", () => {
  const mockBoardPagingDiv$ = vi.fn();
  const mockLastButtonGetAttribute = vi.fn();
  const mockRatingRankingListUl$$ = vi.fn();
  const mockLi$Array = Array(5).fill(vi.fn()); // [SINGLE, DOUBLE, S. PERFO., D. PERFO., CO-OP]
  const mockSongName = vi.fn();
  const mockNumwFlexVcHcDiv$$ = vi.fn();
  const mockNumwFlexVcHcDivImgsGetAttribute = vi.fn();
  const mockTwDiv$ = vi.fn();
  const mockTwDivImgGetAttribute = vi.fn();
  const mockReImgBgfixDivGetAttribute = vi.fn();

  it('Should throw Error if failed to access "Over Lv.20 Ranking"', async () => {
    mockGoto.mockRejectedValueOnce(
      new Error('Failed to access "Over Lv.20 Ranking"'),
    );

    await expect(fetchSteps(mockPage, "20")).rejects.toThrow(
      'Failed to access "Over Lv.20 Ranking"',
    );
    expect(mockGoto).toHaveBeenNthCalledWith(
      1,
      "https://www.piugame.com/leaderboard/over_ranking.php?lv=20",
    );
  });

  it('Should access "Over Lv.20 Ranking" per Page once if div.board_paging not found', async () => {
    mock$.mockResolvedValue(null);

    await fetchSteps(mockPage, "20");
    expect(mockGoto).toHaveBeenCalledTimes(2);
    expect(mock$).toHaveBeenNthCalledWith(1, "div.board_paging");
  });

  it('Should access "Over Lv.20 Ranking" per Page once if button:last-child not found', async () => {
    mock$
      .mockResolvedValueOnce({ $: mockBoardPagingDiv$ })
      .mockResolvedValueOnce(null);
    mockBoardPagingDiv$.mockResolvedValueOnce(null);

    await fetchSteps(mockPage, "20");
    expect(mockGoto).toHaveBeenCalledTimes(2);
    expect(mockBoardPagingDiv$).toHaveBeenNthCalledWith(1, "button:last-child");
  });

  it('Should access "Over Lv.20 Ranking" per Page once if onClick attribute of button:last-child not found', async () => {
    mock$
      .mockResolvedValueOnce({ $: mockBoardPagingDiv$ })
      .mockResolvedValueOnce(null);
    mockBoardPagingDiv$.mockResolvedValueOnce({
      getAttribute: mockLastButtonGetAttribute,
    });
    mockLastButtonGetAttribute.mockResolvedValueOnce(null);

    await fetchSteps(mockPage, "20");
    expect(mockGoto).toHaveBeenCalledTimes(2);
    expect(mockLastButtonGetAttribute).toHaveBeenCalledWith("onClick");
  });

  it('Should access "Over Lv.20 Ranking" per Page once if the number of page invalid', async () => {
    mock$
      .mockResolvedValueOnce({ $: mockBoardPagingDiv$ })
      .mockResolvedValueOnce(null);
    mockBoardPagingDiv$.mockResolvedValueOnce({
      getAttribute: mockLastButtonGetAttribute,
    });
    mockLastButtonGetAttribute.mockResolvedValueOnce("invalidPageNum");

    await fetchSteps(mockPage, "20");
    expect(mockGoto).toHaveBeenCalledTimes(2);
  });

  it('Should access "Over Lv.20 Ranking" per Page once if parsing the number of page failed', async () => {
    mock$
      .mockResolvedValueOnce({ $: mockBoardPagingDiv$ })
      .mockResolvedValueOnce(null);
    mockBoardPagingDiv$.mockResolvedValueOnce({
      getAttribute: mockLastButtonGetAttribute,
    });
    mockLastButtonGetAttribute.mockResolvedValueOnce("page=invalidPageNum");

    await fetchSteps(mockPage, "20");
    expect(mockGoto).toHaveBeenCalledTimes(2);
  });

  it('Should access "Over Lv.20 Ranking" per Page twice if the number of page is 2', async () => {
    mock$
      .mockResolvedValueOnce({ $: mockBoardPagingDiv$ })
      .mockResolvedValueOnce(null);
    mockBoardPagingDiv$.mockResolvedValueOnce({
      getAttribute: mockLastButtonGetAttribute,
    });
    mockLastButtonGetAttribute.mockResolvedValueOnce("page=2");

    await fetchSteps(mockPage, "20");
    expect(mockGoto).toHaveBeenCalledTimes(3);
  });

  it('Should throw Error if failed to access "Over Lv.20 Ranking" at Page 1', async () => {
    mockGoto
      .mockResolvedValueOnce({})
      .mockRejectedValueOnce(
        new Error('Failed to access "Over Lv.20 Ranking" at Page 1'),
      );
    mock$.mockResolvedValueOnce(null);

    await expect(fetchSteps(mockPage, "20")).rejects.toThrow(
      'Failed to access "Over Lv.20 Ranking" at Page 1',
    );
    expect(mockGoto).toHaveBeenNthCalledWith(
      2,
      "https://www.piugame.com/leaderboard/over_ranking.php?lv=20&page=1",
    );
  });

  it("Should return empty array if ul.rating_ranking_list not found", async () => {
    mock$.mockResolvedValue(null);

    const result = await fetchSteps(mockPage, "20");
    expect(result).toEqual([]);
    expect(mock$).toHaveBeenNthCalledWith(2, "ul.rating_ranking_list");
  });

  it("Should return empty array if all li in ul.rating_ranking_list not found", async () => {
    mock$
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce({ $$: mockRatingRankingListUl$$ });
    mockRatingRankingListUl$$.mockResolvedValueOnce([]);

    const result = await fetchSteps(mockPage, "20");
    expect(result).toEqual([]);
    expect(mockRatingRankingListUl$$).toHaveBeenCalledWith("li");
  });

  it("Should return empty array if all div.songName_w not found", async () => {
    mock$
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce({ $$: mockRatingRankingListUl$$ });
    mockRatingRankingListUl$$.mockResolvedValueOnce([{ $: mockLi$Array[0] }]);
    mockLi$Array[0].mockResolvedValueOnce(null);

    const result = await fetchSteps(mockPage, "20");
    expect(result).toEqual([]);
    expect(mockLi$Array[0]).toHaveBeenNthCalledWith(1, "div.songName_w");
  });

  it("Should return empty array if all song names not found", async () => {
    mock$
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce({ $$: mockRatingRankingListUl$$ });
    mockRatingRankingListUl$$.mockResolvedValueOnce([{ $: mockLi$Array[0] }]);
    mockLi$Array[0].mockResolvedValueOnce({ textContent: mockSongName });
    mockSongName.mockResolvedValueOnce(null);

    const result = await fetchSteps(mockPage, "20");
    expect(result).toEqual([]);
    expect(mockSongName).toHaveBeenCalled();
  });

  it("Should return empty array if all div.numw.flex.vc.hc not found", async () => {
    mock$
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce({ $$: mockRatingRankingListUl$$ });
    mockRatingRankingListUl$$.mockResolvedValueOnce([{ $: mockLi$Array[0] }]);
    mockLi$Array[0]
      .mockResolvedValueOnce({ textContent: mockSongName })
      .mockResolvedValueOnce(null);
    mockSongName.mockResolvedValueOnce("songName1");

    const result = await fetchSteps(mockPage, "20");
    expect(result).toEqual([]);
    expect(mockLi$Array[0]).toHaveBeenNthCalledWith(2, "div.numw.flex.vc.hc");
  });

  it("Should return empty array if all img in div.numw.flex.vc.hc not found", async () => {
    mock$
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce({ $$: mockRatingRankingListUl$$ });
    mockRatingRankingListUl$$.mockResolvedValueOnce([{ $: mockLi$Array[0] }]);
    mockLi$Array[0]
      .mockResolvedValueOnce({ textContent: mockSongName })
      .mockResolvedValueOnce({ $$: mockNumwFlexVcHcDiv$$ });
    mockSongName.mockResolvedValueOnce("songName1");
    mockNumwFlexVcHcDiv$$.mockResolvedValueOnce([]);

    const result = await fetchSteps(mockPage, "20");
    expect(result).toEqual([]);
    expect(mockNumwFlexVcHcDiv$$).toHaveBeenCalledWith("img");
  });

  it("Should return empty array if all src attributes of last img in div.numw.flex.vc.hc not found", async () => {
    mock$
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce({ $$: mockRatingRankingListUl$$ });
    mockRatingRankingListUl$$.mockResolvedValueOnce([{ $: mockLi$Array[0] }]);
    mockLi$Array[0]
      .mockResolvedValueOnce({ textContent: mockSongName })
      .mockResolvedValueOnce({ $$: mockNumwFlexVcHcDiv$$ });
    mockSongName.mockResolvedValueOnce("songName1");
    mockNumwFlexVcHcDiv$$.mockResolvedValueOnce([
      {},
      { getAttribute: mockNumwFlexVcHcDivImgsGetAttribute },
    ]);
    mockNumwFlexVcHcDivImgsGetAttribute.mockResolvedValueOnce(null);

    const result = await fetchSteps(mockPage, "20");
    expect(result).toEqual([]);
    expect(mockNumwFlexVcHcDivImgsGetAttribute).toHaveBeenCalledWith("src");
  });

  it("Should return empty array if all src attributes of last img in div.numw.flex.vc.hc invalid", async () => {
    mock$
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce({ $$: mockRatingRankingListUl$$ });
    mockRatingRankingListUl$$.mockResolvedValueOnce([{ $: mockLi$Array[0] }]);
    mockLi$Array[0]
      .mockResolvedValueOnce({ textContent: mockSongName })
      .mockResolvedValueOnce({ $$: mockNumwFlexVcHcDiv$$ });
    mockSongName.mockResolvedValueOnce("songName1");
    mockNumwFlexVcHcDiv$$.mockResolvedValueOnce([
      {},
      { getAttribute: mockNumwFlexVcHcDivImgsGetAttribute },
    ]);
    mockNumwFlexVcHcDivImgsGetAttribute.mockResolvedValueOnce(
      "invalidNumwFlexVcHcDivImgSrcNum",
    );

    const result = await fetchSteps(mockPage, "20");
    expect(result).toEqual([]);
  });

  it("Should return empty array if all div.tw not found", async () => {
    mock$
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce({ $$: mockRatingRankingListUl$$ });
    mockRatingRankingListUl$$.mockResolvedValueOnce([{ $: mockLi$Array[0] }]);
    mockLi$Array[0]
      .mockResolvedValueOnce({ textContent: mockSongName })
      .mockResolvedValueOnce({ $$: mockNumwFlexVcHcDiv$$ })
      .mockResolvedValueOnce(null);
    mockSongName.mockResolvedValueOnce("songName1");
    mockNumwFlexVcHcDiv$$.mockResolvedValueOnce([
      {},
      { getAttribute: mockNumwFlexVcHcDivImgsGetAttribute },
    ]);
    mockNumwFlexVcHcDivImgsGetAttribute.mockResolvedValueOnce(
      "https://www.piugame.com/l_img/stepball/full/s_num_0.png",
    );

    const result = await fetchSteps(mockPage, "20");
    expect(result).toEqual([]);
    expect(mockLi$Array[0]).toHaveBeenNthCalledWith(3, "div.tw");
  });

  it("Should return empty array if all img in div.tw not found", async () => {
    mock$
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce({ $$: mockRatingRankingListUl$$ });
    mockRatingRankingListUl$$.mockResolvedValueOnce([{ $: mockLi$Array[0] }]);
    mockLi$Array[0]
      .mockResolvedValueOnce({ textContent: mockSongName })
      .mockResolvedValueOnce({ $$: mockNumwFlexVcHcDiv$$ })
      .mockResolvedValueOnce({ $: mockTwDiv$ });
    mockSongName.mockResolvedValueOnce("songName1");
    mockNumwFlexVcHcDiv$$.mockResolvedValueOnce([
      {},
      { getAttribute: mockNumwFlexVcHcDivImgsGetAttribute },
    ]);
    mockNumwFlexVcHcDivImgsGetAttribute.mockResolvedValueOnce(
      "https://www.piugame.com/l_img/stepball/full/s_num_0.png",
    );
    mockTwDiv$.mockResolvedValueOnce(null);

    const result = await fetchSteps(mockPage, "20");
    expect(result).toEqual([]);
    expect(mockTwDiv$).toHaveBeenCalledWith("img");
  });

  it("Should return empty array if all src attributes of img in div.tw not found", async () => {
    mock$
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce({ $$: mockRatingRankingListUl$$ });
    mockRatingRankingListUl$$.mockResolvedValueOnce([{ $: mockLi$Array[0] }]);
    mockLi$Array[0]
      .mockResolvedValueOnce({ textContent: mockSongName })
      .mockResolvedValueOnce({ $$: mockNumwFlexVcHcDiv$$ })
      .mockResolvedValueOnce({ $: mockTwDiv$ });
    mockSongName.mockResolvedValueOnce("songName1");
    mockNumwFlexVcHcDiv$$.mockResolvedValueOnce([
      {},
      { getAttribute: mockNumwFlexVcHcDivImgsGetAttribute },
    ]);
    mockNumwFlexVcHcDivImgsGetAttribute.mockResolvedValueOnce(
      "https://www.piugame.com/l_img/stepball/full/s_num_0.png",
    );
    mockTwDiv$.mockResolvedValueOnce({
      getAttribute: mockTwDivImgGetAttribute,
    });
    mockTwDivImgGetAttribute.mockResolvedValueOnce(null);

    const result = await fetchSteps(mockPage, "20");
    expect(result).toEqual([]);
    expect(mockTwDivImgGetAttribute).toHaveBeenCalledWith("src");
  });

  it("Should return empty array if all div.re.img.bgfix not found", async () => {
    mock$
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce({ $$: mockRatingRankingListUl$$ });
    mockRatingRankingListUl$$.mockResolvedValueOnce([{ $: mockLi$Array[0] }]);
    mockLi$Array[0]
      .mockResolvedValueOnce({ textContent: mockSongName })
      .mockResolvedValueOnce({ $$: mockNumwFlexVcHcDiv$$ })
      .mockResolvedValueOnce({ $: mockTwDiv$ })
      .mockResolvedValueOnce(null);
    mockSongName.mockResolvedValueOnce("songName1");
    mockNumwFlexVcHcDiv$$.mockResolvedValueOnce([
      {},
      { getAttribute: mockNumwFlexVcHcDivImgsGetAttribute },
    ]);
    mockNumwFlexVcHcDivImgsGetAttribute.mockResolvedValueOnce(
      "https://www.piugame.com/l_img/stepball/full/s_num_0.png",
    );
    mockTwDiv$.mockResolvedValueOnce({
      getAttribute: mockTwDivImgGetAttribute,
    });
    mockTwDivImgGetAttribute.mockResolvedValueOnce(
      "https://www.piugame.com/l_img/stepball/full/s_text.png",
    );

    const result = await fetchSteps(mockPage, "20");
    expect(result).toEqual([]);
    expect(mockLi$Array[0]).toHaveBeenNthCalledWith(4, "div.re.img.bgfix");
  });

  it("Should return empty array if all style attributes of div.re.img.bgfix not found", async () => {
    mock$
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce({ $$: mockRatingRankingListUl$$ });
    mockRatingRankingListUl$$.mockResolvedValueOnce([{ $: mockLi$Array[0] }]);
    mockLi$Array[0]
      .mockResolvedValueOnce({ textContent: mockSongName })
      .mockResolvedValueOnce({ $$: mockNumwFlexVcHcDiv$$ })
      .mockResolvedValueOnce({ $: mockTwDiv$ })
      .mockResolvedValueOnce({ getAttribute: mockReImgBgfixDivGetAttribute });
    mockSongName.mockResolvedValueOnce("songName1");
    mockNumwFlexVcHcDiv$$.mockResolvedValueOnce([
      {},
      { getAttribute: mockNumwFlexVcHcDivImgsGetAttribute },
    ]);
    mockNumwFlexVcHcDivImgsGetAttribute.mockResolvedValueOnce(
      "https://www.piugame.com/l_img/stepball/full/s_num_0.png",
    );
    mockTwDiv$.mockResolvedValueOnce({
      getAttribute: mockTwDivImgGetAttribute,
    });
    mockTwDivImgGetAttribute.mockResolvedValueOnce(
      "https://www.piugame.com/l_img/stepball/full/s_text.png",
    );
    mockReImgBgfixDivGetAttribute.mockResolvedValueOnce(null);

    const result = await fetchSteps(mockPage, "20");
    expect(result).toEqual([]);
    expect(mockReImgBgfixDivGetAttribute).toHaveBeenCalledWith("style");
  });

  it("Should return empty array if all thumbnail URL invalid", async () => {
    mock$
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce({ $$: mockRatingRankingListUl$$ });
    mockRatingRankingListUl$$.mockResolvedValueOnce([{ $: mockLi$Array[0] }]);
    mockLi$Array[0]
      .mockResolvedValueOnce({ textContent: mockSongName })
      .mockResolvedValueOnce({ $$: mockNumwFlexVcHcDiv$$ })
      .mockResolvedValueOnce({ $: mockTwDiv$ })
      .mockResolvedValueOnce({ getAttribute: mockReImgBgfixDivGetAttribute });
    mockSongName.mockResolvedValueOnce("songName1");
    mockNumwFlexVcHcDiv$$.mockResolvedValueOnce([
      {},
      { getAttribute: mockNumwFlexVcHcDivImgsGetAttribute },
    ]);
    mockNumwFlexVcHcDivImgsGetAttribute.mockResolvedValueOnce(
      "https://www.piugame.com/l_img/stepball/full/s_num_0.png",
    );
    mockTwDiv$.mockResolvedValueOnce({
      getAttribute: mockTwDivImgGetAttribute,
    });
    mockTwDivImgGetAttribute.mockResolvedValueOnce(
      "https://www.piugame.com/l_img/stepball/full/s_text.png",
    );
    mockReImgBgfixDivGetAttribute.mockResolvedValueOnce("invalidThumbnailURL");

    const result = await fetchSteps(mockPage, "20");
    expect(result).toEqual([]);
  });

  it("Should return one step", async () => {
    mock$
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce({ $$: mockRatingRankingListUl$$ });
    mockRatingRankingListUl$$.mockResolvedValueOnce([{ $: mockLi$Array[0] }]);
    mockLi$Array[0]
      .mockResolvedValueOnce({ textContent: mockSongName })
      .mockResolvedValueOnce({ $$: mockNumwFlexVcHcDiv$$ })
      .mockResolvedValueOnce({ $: mockTwDiv$ })
      .mockResolvedValueOnce({ getAttribute: mockReImgBgfixDivGetAttribute });
    mockSongName.mockResolvedValueOnce("songName1");
    mockNumwFlexVcHcDiv$$.mockResolvedValueOnce([
      {},
      { getAttribute: mockNumwFlexVcHcDivImgsGetAttribute },
    ]);
    mockNumwFlexVcHcDivImgsGetAttribute.mockResolvedValueOnce(
      "https://www.piugame.com/l_img/stepball/full/s_num_0.png",
    );
    mockTwDiv$.mockResolvedValueOnce({
      getAttribute: mockTwDivImgGetAttribute,
    });
    mockTwDivImgGetAttribute.mockResolvedValueOnce(
      "https://www.piugame.com/l_img/stepball/full/s_text.png",
    );
    mockReImgBgfixDivGetAttribute.mockResolvedValueOnce(
      "background-image:url('thumbnailImgSrc1')",
    );

    const result = await fetchSteps(mockPage, "20");
    expect(result).toStrictEqual([
      {
        songName: "songName1",
        stepType: "S20",
        thumbnailImgSrc: "thumbnailImgSrc1",
      },
    ]);
  });

  it("Should return steps of SINGLE, DOUBLE, S. PERFO., D. PERFO. and CO-OP", async () => {
    mock$
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce({ $$: mockRatingRankingListUl$$ });
    mockRatingRankingListUl$$.mockResolvedValueOnce(
      mockLi$Array.map((mockLi$) => ({ $: mockLi$ })),
    );
    [...Array(5)].forEach((_, i) => {
      mockLi$Array[i]
        .mockResolvedValueOnce({ textContent: mockSongName })
        .mockResolvedValueOnce({ $$: mockNumwFlexVcHcDiv$$ })
        .mockResolvedValueOnce({ $: mockTwDiv$ })
        .mockResolvedValueOnce({ getAttribute: mockReImgBgfixDivGetAttribute });
      mockSongName.mockResolvedValueOnce(`songName${i + 1}`);
      mockNumwFlexVcHcDiv$$.mockResolvedValueOnce([
        {},
        { getAttribute: mockNumwFlexVcHcDivImgsGetAttribute },
      ]);
      mockTwDiv$.mockResolvedValueOnce({
        getAttribute: mockTwDivImgGetAttribute,
      });
      mockReImgBgfixDivGetAttribute.mockResolvedValueOnce(
        `background-image:url('thumbnailImgSrc${i + 1}')`,
      );
    });
    mockNumwFlexVcHcDivImgsGetAttribute
      .mockResolvedValueOnce(
        "https://www.piugame.com/l_img/stepball/full/s_num_0.png",
      )
      .mockResolvedValueOnce(
        "https://www.piugame.com/l_img/stepball/full/d_num_0.png",
      )
      .mockResolvedValueOnce(
        "https://www.piugame.com/l_img/stepball/full/sp_num_0.png",
      )
      .mockResolvedValueOnce(
        "https://www.piugame.com/l_img/stepball/full/dp_num_0.png",
      )
      .mockResolvedValueOnce(
        "https://www.piugame.com/l_img/stepball/full/c_num_0.png",
      );
    mockTwDivImgGetAttribute
      .mockResolvedValueOnce(
        "https://www.piugame.com/l_img/stepball/full/s_text.png",
      )
      .mockResolvedValueOnce(
        "https://www.piugame.com/l_img/stepball/full/d_text.png",
      )
      .mockResolvedValueOnce(
        "https://www.piugame.com/l_img/stepball/full/sp_text.png",
      )
      .mockResolvedValueOnce(
        "https://www.piugame.com/l_img/stepball/full/dp_text.png",
      )
      .mockResolvedValueOnce(
        "https://www.piugame.com/l_img/stepball/full/c_text.png",
      );

    const result = await fetchSteps(mockPage, "20");
    expect(result).toStrictEqual([
      {
        songName: "songName1",
        stepType: "S20",
        thumbnailImgSrc: "thumbnailImgSrc1",
      },
      {
        songName: "songName2",
        stepType: "D20",
        thumbnailImgSrc: "thumbnailImgSrc2",
      },
      {
        songName: "songName3",
        stepType: "SP20",
        thumbnailImgSrc: "thumbnailImgSrc3",
      },
      {
        songName: "songName4",
        stepType: "DP20",
        thumbnailImgSrc: "thumbnailImgSrc4",
      },
      {
        songName: "songName5",
        stepType: "CO-OPx0",
        thumbnailImgSrc: "thumbnailImgSrc5",
      },
    ]);
  });

  it('Should take screenshot if NODE_ENV is "development"', async () => {
    process.env.NODE_ENV = "development";
    mock$.mockResolvedValue(null);

    await fetchSteps(mockPage, "20");
    expect(mockScreenshot).toHaveBeenCalledWith({
      fullPage: true,
      path: "imgs/screenshot_fetchSteps_lv20_page1.png",
    });
  });

  it('Should not take screenshot if NODE_ENV is not "development"', async () => {
    process.env.NODE_ENV = "production";
    mock$.mockResolvedValue(null);

    await fetchSteps(mockPage, "20");
    expect(mockScreenshot).toHaveBeenCalledTimes(0);
  });
});

describe("fetchMyBests", () => {
  const mockBoardPagingDiv$ = vi.fn();
  const mockLastButtonGetAttribute = vi.fn();
  const mockMyBestScoreListUl$$ = vi.fn();
  const mockLi$Array = Array(5).fill(vi.fn()); // [SINGLE, DOUBLE, S. PERFO., D. PERFO., CO-OP]
  const mockSongName = vi.fn();
  const mockNumwFlexVcHcDiv$$ = vi.fn();
  const mockNumwFlexVcHcDivImgsGetAttribute = vi.fn();
  const mockTwDiv$ = vi.fn();
  const mockTwDivImgGetAttribute = vi.fn();
  const mockScore = vi.fn();
  const mockImgDiv$ = vi.fn();
  const mockGradeImgSrc = vi.fn();
  const mockImgSt1Div$ = vi.fn();
  const mockPlateImgSrc = vi.fn();

  it('Should throw Error if failed to access "My Best Score"', async () => {
    mockGoto.mockRejectedValueOnce(
      new Error('Failed to access "My Best Score"'),
    );

    await expect(fetchMyBests(mockPage, "20")).rejects.toThrow(
      'Failed to access "My Best Score"',
    );
    expect(mockGoto).toHaveBeenNthCalledWith(
      1,
      "https://www.piugame.com/my_page/my_best_score.php?lv=20",
    );
  });

  it('Should access "My Best Score" per Page once if div.board_paging not found', async () => {
    mock$.mockResolvedValue(null);

    await fetchMyBests(mockPage, "20");
    expect(mockGoto).toHaveBeenCalledTimes(2);
    expect(mock$).toHaveBeenNthCalledWith(1, "div.board_paging");
  });

  it('Should access "My Best Score" per Page once if button:last-child not found', async () => {
    mock$
      .mockResolvedValueOnce({ $: mockBoardPagingDiv$ })
      .mockResolvedValueOnce(null);
    mockBoardPagingDiv$.mockResolvedValueOnce(null);

    await fetchMyBests(mockPage, "20");
    expect(mockGoto).toHaveBeenCalledTimes(2);
    expect(mockBoardPagingDiv$).toHaveBeenNthCalledWith(1, "button:last-child");
  });

  it('Should access "My Best Score" per Page once if onClick attribute of button:last-child not found', async () => {
    mock$
      .mockResolvedValueOnce({ $: mockBoardPagingDiv$ })
      .mockResolvedValueOnce(null);
    mockBoardPagingDiv$.mockResolvedValueOnce({
      getAttribute: mockLastButtonGetAttribute,
    });
    mockLastButtonGetAttribute.mockResolvedValueOnce(null);

    await fetchMyBests(mockPage, "20");
    expect(mockGoto).toHaveBeenCalledTimes(2);
    expect(mockLastButtonGetAttribute).toHaveBeenCalledWith("onClick");
  });

  it('Should access "My Best Score" per Page once if the number of page invalid', async () => {
    mock$
      .mockResolvedValueOnce({ $: mockBoardPagingDiv$ })
      .mockResolvedValueOnce(null);
    mockBoardPagingDiv$.mockResolvedValueOnce({
      getAttribute: mockLastButtonGetAttribute,
    });
    mockLastButtonGetAttribute.mockResolvedValueOnce("invalidPageNum");

    await fetchMyBests(mockPage, "20");
    expect(mockGoto).toHaveBeenCalledTimes(2);
  });

  it('Should access "My Best Score" per Page once if parsing the number of page failed', async () => {
    mock$
      .mockResolvedValueOnce({ $: mockBoardPagingDiv$ })
      .mockResolvedValueOnce(null);
    mockBoardPagingDiv$.mockResolvedValueOnce({
      getAttribute: mockLastButtonGetAttribute,
    });
    mockLastButtonGetAttribute.mockResolvedValueOnce("page=invalidPageNum");

    await fetchMyBests(mockPage, "20");
    expect(mockGoto).toHaveBeenCalledTimes(2);
  });

  it('Should access "My Best Score" per Page twice if the number of page is 2', async () => {
    mock$
      .mockResolvedValueOnce({ $: mockBoardPagingDiv$ })
      .mockResolvedValueOnce(null);
    mockBoardPagingDiv$.mockResolvedValueOnce({
      getAttribute: mockLastButtonGetAttribute,
    });
    mockLastButtonGetAttribute.mockResolvedValueOnce("page=2");

    await fetchMyBests(mockPage, "20");
    expect(mockGoto).toHaveBeenCalledTimes(3);
  });

  it('Should throw Error if failed to access "My Best Score" at Page 1', async () => {
    mockGoto
      .mockResolvedValueOnce({})
      .mockRejectedValueOnce(
        new Error('Failed to access "My Best Score" at Page 1'),
      );
    mock$.mockResolvedValueOnce(null);

    await expect(fetchMyBests(mockPage, "20")).rejects.toThrow(
      'Failed to access "My Best Score" at Page 1',
    );
    expect(mockGoto).toHaveBeenNthCalledWith(
      2,
      "https://www.piugame.com/my_page/my_best_score.php?lv=20&page=1",
    );
  });

  it("Should return empty array if ul.my_best_scoreList not found", async () => {
    mock$.mockResolvedValue(null);

    const result = await fetchMyBests(mockPage, "20");
    expect(result).toEqual([]);
    expect(mock$).toHaveBeenNthCalledWith(2, "ul.my_best_scoreList");
  });

  it("Should return empty array if all li in ul.my_best_scoreList not found", async () => {
    mock$
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce({ $$: mockMyBestScoreListUl$$ });
    mockMyBestScoreListUl$$.mockResolvedValueOnce([]);

    const result = await fetchMyBests(mockPage, "20");
    expect(result).toEqual([]);
    expect(mockMyBestScoreListUl$$).toHaveBeenCalledWith("li");
  });

  it("Should return empty array if all div.song_name not found", async () => {
    mock$
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce({ $$: mockMyBestScoreListUl$$ });
    mockMyBestScoreListUl$$.mockResolvedValueOnce([{ $: mockLi$Array[0] }]);
    mockLi$Array[0].mockResolvedValueOnce(null);

    const result = await fetchMyBests(mockPage, "20");
    expect(result).toEqual([]);
    expect(mockLi$Array[0]).toHaveBeenNthCalledWith(1, "div.song_name");
  });

  it("Should return empty array if all song names not found", async () => {
    mock$
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce({ $$: mockMyBestScoreListUl$$ });
    mockMyBestScoreListUl$$.mockResolvedValueOnce([{ $: mockLi$Array[0] }]);
    mockLi$Array[0].mockResolvedValueOnce({ textContent: mockSongName });
    mockSongName.mockResolvedValueOnce(null);

    const result = await fetchMyBests(mockPage, "20");
    expect(result).toEqual([]);
    expect(mockSongName).toHaveBeenCalled();
  });

  it("Should return empty array if all div.numw.flex.vc.hc not found", async () => {
    mock$
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce({ $$: mockMyBestScoreListUl$$ });
    mockMyBestScoreListUl$$.mockResolvedValueOnce([{ $: mockLi$Array[0] }]);
    mockLi$Array[0]
      .mockResolvedValueOnce({ textContent: mockSongName })
      .mockResolvedValueOnce(null);
    mockSongName.mockResolvedValueOnce("songName1");

    const result = await fetchMyBests(mockPage, "20");
    expect(result).toEqual([]);
    expect(mockLi$Array[0]).toHaveBeenNthCalledWith(2, "div.numw.flex.vc.hc");
  });

  it("Should return empty array if all img in div.numw.flex.vc.hc not found", async () => {
    mock$
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce({ $$: mockMyBestScoreListUl$$ });
    mockMyBestScoreListUl$$.mockResolvedValueOnce([{ $: mockLi$Array[0] }]);
    mockLi$Array[0]
      .mockResolvedValueOnce({ textContent: mockSongName })
      .mockResolvedValueOnce({ $$: mockNumwFlexVcHcDiv$$ });
    mockSongName.mockResolvedValueOnce("songName1");
    mockNumwFlexVcHcDiv$$.mockResolvedValueOnce([]);

    const result = await fetchMyBests(mockPage, "20");
    expect(result).toEqual([]);
    expect(mockNumwFlexVcHcDiv$$).toHaveBeenCalledWith("img");
  });

  it("Should return empty array if all src attributes of last img in div.numw.flex.vc.hc not found", async () => {
    mock$
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce({ $$: mockMyBestScoreListUl$$ });
    mockMyBestScoreListUl$$.mockResolvedValueOnce([{ $: mockLi$Array[0] }]);
    mockLi$Array[0]
      .mockResolvedValueOnce({ textContent: mockSongName })
      .mockResolvedValueOnce({ $$: mockNumwFlexVcHcDiv$$ });
    mockSongName.mockResolvedValueOnce("songName1");
    mockNumwFlexVcHcDiv$$.mockResolvedValueOnce([
      {},
      { getAttribute: mockNumwFlexVcHcDivImgsGetAttribute },
    ]);
    mockNumwFlexVcHcDivImgsGetAttribute.mockResolvedValueOnce(null);

    const result = await fetchMyBests(mockPage, "20");
    expect(result).toEqual([]);
    expect(mockNumwFlexVcHcDivImgsGetAttribute).toHaveBeenCalledWith("src");
  });

  it("Should return empty array if all src attributes of last img in div.numw.flex.vc.hc invalid", async () => {
    mock$
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce({ $$: mockMyBestScoreListUl$$ });
    mockMyBestScoreListUl$$.mockResolvedValueOnce([{ $: mockLi$Array[0] }]);
    mockLi$Array[0]
      .mockResolvedValueOnce({ textContent: mockSongName })
      .mockResolvedValueOnce({ $$: mockNumwFlexVcHcDiv$$ });
    mockSongName.mockResolvedValueOnce("songName1");
    mockNumwFlexVcHcDiv$$.mockResolvedValueOnce([
      {},
      { getAttribute: mockNumwFlexVcHcDivImgsGetAttribute },
    ]);
    mockNumwFlexVcHcDivImgsGetAttribute.mockResolvedValueOnce(
      "invalidNumwFlexVcHcDivImgSrcNum",
    );

    const result = await fetchMyBests(mockPage, "20");
    expect(result).toEqual([]);
  });

  it("Should return empty array if all div.tw not found", async () => {
    mock$
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce({ $$: mockMyBestScoreListUl$$ });
    mockMyBestScoreListUl$$.mockResolvedValueOnce([{ $: mockLi$Array[0] }]);
    mockLi$Array[0]
      .mockResolvedValueOnce({ textContent: mockSongName })
      .mockResolvedValueOnce({ $$: mockNumwFlexVcHcDiv$$ })
      .mockResolvedValueOnce(null);
    mockSongName.mockResolvedValueOnce("songName1");
    mockNumwFlexVcHcDiv$$.mockResolvedValueOnce([
      {},
      { getAttribute: mockNumwFlexVcHcDivImgsGetAttribute },
    ]);
    mockNumwFlexVcHcDivImgsGetAttribute.mockResolvedValueOnce(
      "https://www.piugame.com/l_img/stepball/full/s_num_0.png",
    );

    const result = await fetchMyBests(mockPage, "20");
    expect(result).toEqual([]);
    expect(mockLi$Array[0]).toHaveBeenNthCalledWith(3, "div.tw");
  });

  it("Should return empty array if all img in div.tw not found", async () => {
    mock$
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce({ $$: mockMyBestScoreListUl$$ });
    mockMyBestScoreListUl$$.mockResolvedValueOnce([{ $: mockLi$Array[0] }]);
    mockLi$Array[0]
      .mockResolvedValueOnce({ textContent: mockSongName })
      .mockResolvedValueOnce({ $$: mockNumwFlexVcHcDiv$$ })
      .mockResolvedValueOnce({ $: mockTwDiv$ });
    mockSongName.mockResolvedValueOnce("songName1");
    mockNumwFlexVcHcDiv$$.mockResolvedValueOnce([
      {},
      { getAttribute: mockNumwFlexVcHcDivImgsGetAttribute },
    ]);
    mockNumwFlexVcHcDivImgsGetAttribute.mockResolvedValueOnce(
      "https://www.piugame.com/l_img/stepball/full/s_num_0.png",
    );
    mockTwDiv$.mockResolvedValueOnce(null);

    const result = await fetchMyBests(mockPage, "20");
    expect(result).toEqual([]);
    expect(mockTwDiv$).toHaveBeenCalledWith("img");
  });

  it("Should return empty array if all src attributes of img in div.tw not found", async () => {
    mock$
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce({ $$: mockMyBestScoreListUl$$ });
    mockMyBestScoreListUl$$.mockResolvedValueOnce([{ $: mockLi$Array[0] }]);
    mockLi$Array[0]
      .mockResolvedValueOnce({ textContent: mockSongName })
      .mockResolvedValueOnce({ $$: mockNumwFlexVcHcDiv$$ })
      .mockResolvedValueOnce({ $: mockTwDiv$ });
    mockSongName.mockResolvedValueOnce("songName1");
    mockNumwFlexVcHcDiv$$.mockResolvedValueOnce([
      {},
      { getAttribute: mockNumwFlexVcHcDivImgsGetAttribute },
    ]);
    mockNumwFlexVcHcDivImgsGetAttribute.mockResolvedValueOnce(
      "https://www.piugame.com/l_img/stepball/full/s_num_0.png",
    );
    mockTwDiv$.mockResolvedValueOnce({
      getAttribute: mockTwDivImgGetAttribute,
    });
    mockTwDivImgGetAttribute.mockResolvedValueOnce(null);

    const result = await fetchMyBests(mockPage, "20");
    expect(result).toEqual([]);
    expect(mockTwDivImgGetAttribute).toHaveBeenCalledWith("src");
  });

  it("Should return empty array if all div.txt_v not found", async () => {
    mock$
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce({ $$: mockMyBestScoreListUl$$ });
    mockMyBestScoreListUl$$.mockResolvedValueOnce([{ $: mockLi$Array[0] }]);
    mockLi$Array[0]
      .mockResolvedValueOnce({ textContent: mockSongName })
      .mockResolvedValueOnce({ $$: mockNumwFlexVcHcDiv$$ })
      .mockResolvedValueOnce({ $: mockTwDiv$ })
      .mockResolvedValueOnce(null);
    mockSongName.mockResolvedValueOnce("songName1");
    mockNumwFlexVcHcDiv$$.mockResolvedValueOnce([
      {},
      { getAttribute: mockNumwFlexVcHcDivImgsGetAttribute },
    ]);
    mockNumwFlexVcHcDivImgsGetAttribute.mockResolvedValueOnce(
      "https://www.piugame.com/l_img/stepball/full/s_num_0.png",
    );
    mockTwDiv$.mockResolvedValueOnce({
      getAttribute: mockTwDivImgGetAttribute,
    });
    mockTwDivImgGetAttribute.mockResolvedValueOnce(
      "https://www.piugame.com/l_img/stepball/full/s_text.png",
    );

    const result = await fetchMyBests(mockPage, "20");
    expect(result).toEqual([]);
    expect(mockLi$Array[0]).toHaveBeenNthCalledWith(4, "div.txt_v");
  });

  it("Should return empty array if all scores not found", async () => {
    mock$
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce({ $$: mockMyBestScoreListUl$$ });
    mockMyBestScoreListUl$$.mockResolvedValueOnce([{ $: mockLi$Array[0] }]);
    mockLi$Array[0]
      .mockResolvedValueOnce({ textContent: mockSongName })
      .mockResolvedValueOnce({ $$: mockNumwFlexVcHcDiv$$ })
      .mockResolvedValueOnce({ $: mockTwDiv$ })
      .mockResolvedValueOnce({ textContent: mockScore });
    mockSongName.mockResolvedValueOnce("songName1");
    mockNumwFlexVcHcDiv$$.mockResolvedValueOnce([
      {},
      { getAttribute: mockNumwFlexVcHcDivImgsGetAttribute },
    ]);
    mockNumwFlexVcHcDivImgsGetAttribute.mockResolvedValueOnce(
      "https://www.piugame.com/l_img/stepball/full/s_num_0.png",
    );
    mockTwDiv$.mockResolvedValueOnce({
      getAttribute: mockTwDivImgGetAttribute,
    });
    mockTwDivImgGetAttribute.mockResolvedValueOnce(
      "https://www.piugame.com/l_img/stepball/full/s_text.png",
    );
    mockScore.mockResolvedValueOnce(null);

    const result = await fetchMyBests(mockPage, "20");
    expect(result).toEqual([]);
    expect(mockScore).toHaveBeenCalled();
  });

  it("Should return empty array if all div.img not found", async () => {
    mock$
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce({ $$: mockMyBestScoreListUl$$ });
    mockMyBestScoreListUl$$.mockResolvedValueOnce([{ $: mockLi$Array[0] }]);
    mockLi$Array[0]
      .mockResolvedValueOnce({ textContent: mockSongName })
      .mockResolvedValueOnce({ $$: mockNumwFlexVcHcDiv$$ })
      .mockResolvedValueOnce({ $: mockTwDiv$ })
      .mockResolvedValueOnce({ textContent: mockScore })
      .mockResolvedValueOnce(null);
    mockSongName.mockResolvedValueOnce("songName1");
    mockNumwFlexVcHcDiv$$.mockResolvedValueOnce([
      {},
      { getAttribute: mockNumwFlexVcHcDivImgsGetAttribute },
    ]);
    mockNumwFlexVcHcDivImgsGetAttribute.mockResolvedValueOnce(
      "https://www.piugame.com/l_img/stepball/full/s_num_0.png",
    );
    mockTwDiv$.mockResolvedValueOnce({
      getAttribute: mockTwDivImgGetAttribute,
    });
    mockTwDivImgGetAttribute.mockResolvedValueOnce(
      "https://www.piugame.com/l_img/stepball/full/s_text.png",
    );
    mockScore.mockResolvedValueOnce("score1");

    const result = await fetchMyBests(mockPage, "20");
    expect(result).toEqual([]);
    expect(mockLi$Array[0]).toHaveBeenNthCalledWith(5, "div.img");
  });

  it("Should return empty array if all img in div.img not found", async () => {
    mock$
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce({ $$: mockMyBestScoreListUl$$ });
    mockMyBestScoreListUl$$.mockResolvedValueOnce([{ $: mockLi$Array[0] }]);
    mockLi$Array[0]
      .mockResolvedValueOnce({ textContent: mockSongName })
      .mockResolvedValueOnce({ $$: mockNumwFlexVcHcDiv$$ })
      .mockResolvedValueOnce({ $: mockTwDiv$ })
      .mockResolvedValueOnce({ textContent: mockScore })
      .mockResolvedValueOnce({ $: mockImgDiv$ });
    mockSongName.mockResolvedValueOnce("songName1");
    mockNumwFlexVcHcDiv$$.mockResolvedValueOnce([
      {},
      { getAttribute: mockNumwFlexVcHcDivImgsGetAttribute },
    ]);
    mockNumwFlexVcHcDivImgsGetAttribute.mockResolvedValueOnce(
      "https://www.piugame.com/l_img/stepball/full/s_num_0.png",
    );
    mockTwDiv$.mockResolvedValueOnce({
      getAttribute: mockTwDivImgGetAttribute,
    });
    mockTwDivImgGetAttribute.mockResolvedValueOnce(
      "https://www.piugame.com/l_img/stepball/full/s_text.png",
    );
    mockScore.mockResolvedValueOnce("score1");
    mockImgDiv$.mockResolvedValueOnce(null);

    const result = await fetchMyBests(mockPage, "20");
    expect(result).toEqual([]);
    expect(mockImgDiv$).toHaveBeenCalledWith("img");
  });

  it("Should return empty array if all src attributes of img in div.img not found", async () => {
    mock$
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce({ $$: mockMyBestScoreListUl$$ });
    mockMyBestScoreListUl$$.mockResolvedValueOnce([{ $: mockLi$Array[0] }]);
    mockLi$Array[0]
      .mockResolvedValueOnce({ textContent: mockSongName })
      .mockResolvedValueOnce({ $$: mockNumwFlexVcHcDiv$$ })
      .mockResolvedValueOnce({ $: mockTwDiv$ })
      .mockResolvedValueOnce({ textContent: mockScore })
      .mockResolvedValueOnce({ $: mockImgDiv$ });
    mockSongName.mockResolvedValueOnce("songName1");
    mockNumwFlexVcHcDiv$$.mockResolvedValueOnce([
      {},
      { getAttribute: mockNumwFlexVcHcDivImgsGetAttribute },
    ]);
    mockNumwFlexVcHcDivImgsGetAttribute.mockResolvedValueOnce(
      "https://www.piugame.com/l_img/stepball/full/s_num_0.png",
    );
    mockTwDiv$.mockResolvedValueOnce({
      getAttribute: mockTwDivImgGetAttribute,
    });
    mockTwDivImgGetAttribute.mockResolvedValueOnce(
      "https://www.piugame.com/l_img/stepball/full/s_text.png",
    );
    mockScore.mockResolvedValueOnce("score1");
    mockImgDiv$.mockResolvedValueOnce({ getAttribute: mockGradeImgSrc });
    mockGradeImgSrc.mockResolvedValueOnce(null);

    const result = await fetchMyBests(mockPage, "20");
    expect(result).toEqual([]);
    expect(mockGradeImgSrc).toHaveBeenCalledWith("src");
  });

  it("Should return empty array if all div.img.st1 not found", async () => {
    mock$
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce({ $$: mockMyBestScoreListUl$$ });
    mockMyBestScoreListUl$$.mockResolvedValueOnce([{ $: mockLi$Array[0] }]);
    mockLi$Array[0]
      .mockResolvedValueOnce({ textContent: mockSongName })
      .mockResolvedValueOnce({ $$: mockNumwFlexVcHcDiv$$ })
      .mockResolvedValueOnce({ $: mockTwDiv$ })
      .mockResolvedValueOnce({ textContent: mockScore })
      .mockResolvedValueOnce({ $: mockImgDiv$ })
      .mockResolvedValueOnce(null);
    mockSongName.mockResolvedValueOnce("songName1");
    mockNumwFlexVcHcDiv$$.mockResolvedValueOnce([
      {},
      { getAttribute: mockNumwFlexVcHcDivImgsGetAttribute },
    ]);
    mockNumwFlexVcHcDivImgsGetAttribute.mockResolvedValueOnce(
      "https://www.piugame.com/l_img/stepball/full/s_num_0.png",
    );
    mockTwDiv$.mockResolvedValueOnce({
      getAttribute: mockTwDivImgGetAttribute,
    });
    mockTwDivImgGetAttribute.mockResolvedValueOnce(
      "https://www.piugame.com/l_img/stepball/full/s_text.png",
    );
    mockScore.mockResolvedValueOnce("score1");
    mockImgDiv$.mockResolvedValueOnce({ getAttribute: mockGradeImgSrc });
    mockGradeImgSrc.mockResolvedValueOnce("gradeImgSrc1");

    const result = await fetchMyBests(mockPage, "20");
    expect(result).toEqual([]);
    expect(mockLi$Array[0]).toHaveBeenNthCalledWith(6, "div.img.st1");
  });

  it("Should return empty array if all img in div.img.st1 not found", async () => {
    mock$
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce({ $$: mockMyBestScoreListUl$$ });
    mockMyBestScoreListUl$$.mockResolvedValueOnce([{ $: mockLi$Array[0] }]);
    mockLi$Array[0]
      .mockResolvedValueOnce({ textContent: mockSongName })
      .mockResolvedValueOnce({ $$: mockNumwFlexVcHcDiv$$ })
      .mockResolvedValueOnce({ $: mockTwDiv$ })
      .mockResolvedValueOnce({ textContent: mockScore })
      .mockResolvedValueOnce({ $: mockImgDiv$ })
      .mockResolvedValueOnce({ $: mockImgSt1Div$ });
    mockSongName.mockResolvedValueOnce("songName1");
    mockNumwFlexVcHcDiv$$.mockResolvedValueOnce([
      {},
      { getAttribute: mockNumwFlexVcHcDivImgsGetAttribute },
    ]);
    mockNumwFlexVcHcDivImgsGetAttribute.mockResolvedValueOnce(
      "https://www.piugame.com/l_img/stepball/full/s_num_0.png",
    );
    mockTwDiv$.mockResolvedValueOnce({
      getAttribute: mockTwDivImgGetAttribute,
    });
    mockTwDivImgGetAttribute.mockResolvedValueOnce(
      "https://www.piugame.com/l_img/stepball/full/s_text.png",
    );
    mockScore.mockResolvedValueOnce("score1");
    mockImgDiv$.mockResolvedValueOnce({ getAttribute: mockGradeImgSrc });
    mockGradeImgSrc.mockResolvedValueOnce("gradeImgSrc1");
    mockImgSt1Div$.mockResolvedValueOnce(null);

    const result = await fetchMyBests(mockPage, "20");
    expect(result).toEqual([]);
    expect(mockImgSt1Div$).toHaveBeenCalledWith("img");
  });

  it("Should return empty array if all src attributes of img in div.img.st1 not found", async () => {
    mock$
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce({ $$: mockMyBestScoreListUl$$ });
    mockMyBestScoreListUl$$.mockResolvedValueOnce([{ $: mockLi$Array[0] }]);
    mockLi$Array[0]
      .mockResolvedValueOnce({ textContent: mockSongName })
      .mockResolvedValueOnce({ $$: mockNumwFlexVcHcDiv$$ })
      .mockResolvedValueOnce({ $: mockTwDiv$ })
      .mockResolvedValueOnce({ textContent: mockScore })
      .mockResolvedValueOnce({ $: mockImgDiv$ })
      .mockResolvedValueOnce({ $: mockImgSt1Div$ });
    mockSongName.mockResolvedValueOnce("songName1");
    mockNumwFlexVcHcDiv$$.mockResolvedValueOnce([
      {},
      { getAttribute: mockNumwFlexVcHcDivImgsGetAttribute },
    ]);
    mockNumwFlexVcHcDivImgsGetAttribute.mockResolvedValueOnce(
      "https://www.piugame.com/l_img/stepball/full/s_num_0.png",
    );
    mockTwDiv$.mockResolvedValueOnce({
      getAttribute: mockTwDivImgGetAttribute,
    });
    mockTwDivImgGetAttribute.mockResolvedValueOnce(
      "https://www.piugame.com/l_img/stepball/full/s_text.png",
    );
    mockScore.mockResolvedValueOnce("score1");
    mockImgDiv$.mockResolvedValueOnce({ getAttribute: mockGradeImgSrc });
    mockGradeImgSrc.mockResolvedValueOnce("gradeImgSrc1");
    mockImgSt1Div$.mockResolvedValueOnce({ getAttribute: mockPlateImgSrc });
    mockPlateImgSrc.mockResolvedValueOnce(null);

    const result = await fetchMyBests(mockPage, "20");
    expect(result).toEqual([]);
    expect(mockPlateImgSrc).toHaveBeenCalledWith("src");
  });

  it("Should return one step", async () => {
    mock$
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce({ $$: mockMyBestScoreListUl$$ });
    mockMyBestScoreListUl$$.mockResolvedValueOnce([{ $: mockLi$Array[0] }]);
    mockLi$Array[0]
      .mockResolvedValueOnce({ textContent: mockSongName })
      .mockResolvedValueOnce({ $$: mockNumwFlexVcHcDiv$$ })
      .mockResolvedValueOnce({ $: mockTwDiv$ })
      .mockResolvedValueOnce({ textContent: mockScore })
      .mockResolvedValueOnce({ $: mockImgDiv$ })
      .mockResolvedValueOnce({ $: mockImgSt1Div$ });
    mockSongName.mockResolvedValueOnce("songName1");
    mockNumwFlexVcHcDiv$$.mockResolvedValueOnce([
      {},
      { getAttribute: mockNumwFlexVcHcDivImgsGetAttribute },
    ]);
    mockNumwFlexVcHcDivImgsGetAttribute.mockResolvedValueOnce(
      "https://www.piugame.com/l_img/stepball/full/s_num_0.png",
    );
    mockTwDiv$.mockResolvedValueOnce({
      getAttribute: mockTwDivImgGetAttribute,
    });
    mockTwDivImgGetAttribute.mockResolvedValueOnce(
      "https://www.piugame.com/l_img/stepball/full/s_text.png",
    );
    mockScore.mockResolvedValueOnce("score1");
    mockImgDiv$.mockResolvedValueOnce({ getAttribute: mockGradeImgSrc });
    mockGradeImgSrc.mockResolvedValueOnce("gradeImgSrc1");
    mockImgSt1Div$.mockResolvedValueOnce({ getAttribute: mockPlateImgSrc });
    mockPlateImgSrc.mockResolvedValueOnce("plateImgSrc1");

    const result = await fetchMyBests(mockPage, "20");
    expect(result).toStrictEqual([
      {
        songName: "songName1",
        stepType: "S20",
        score: "score1",
        gradeImgSrc: "gradeImgSrc1",
        plateImgSrc: "plateImgSrc1",
      },
    ]);
  });

  it("Should return steps of SINGLE, DOUBLE, S. PERFO., D. PERFO. and CO-OP", async () => {
    mock$
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce({ $$: mockMyBestScoreListUl$$ });
    mockMyBestScoreListUl$$.mockResolvedValueOnce(
      mockLi$Array.map((mockLi$) => ({ $: mockLi$ })),
    );
    [...Array(5)].forEach((_, i) => {
      mockLi$Array[i]
        .mockResolvedValueOnce({ textContent: mockSongName })
        .mockResolvedValueOnce({ $$: mockNumwFlexVcHcDiv$$ })
        .mockResolvedValueOnce({ $: mockTwDiv$ })
        .mockResolvedValueOnce({ textContent: mockScore })
        .mockResolvedValueOnce({ $: mockImgDiv$ })
        .mockResolvedValueOnce({ $: mockImgSt1Div$ });
      mockSongName.mockResolvedValueOnce(`songName${i + 1}`);
      mockNumwFlexVcHcDiv$$.mockResolvedValueOnce([
        {},
        { getAttribute: mockNumwFlexVcHcDivImgsGetAttribute },
      ]);
      mockTwDiv$.mockResolvedValueOnce({
        getAttribute: mockTwDivImgGetAttribute,
      });
      mockScore.mockResolvedValueOnce(`score${i + 1}`);
      mockImgDiv$.mockResolvedValueOnce({ getAttribute: mockGradeImgSrc });
      mockGradeImgSrc.mockResolvedValueOnce(`gradeImgSrc${i + 1}`);
      mockImgSt1Div$.mockResolvedValueOnce({ getAttribute: mockPlateImgSrc });
      mockPlateImgSrc.mockResolvedValueOnce(`plateImgSrc${i + 1}`);
    });
    mockNumwFlexVcHcDivImgsGetAttribute
      .mockResolvedValueOnce(
        "https://www.piugame.com/l_img/stepball/full/s_num_0.png",
      )
      .mockResolvedValueOnce(
        "https://www.piugame.com/l_img/stepball/full/d_num_0.png",
      )
      .mockResolvedValueOnce(
        "https://www.piugame.com/l_img/stepball/full/sp_num_0.png",
      )
      .mockResolvedValueOnce(
        "https://www.piugame.com/l_img/stepball/full/dp_num_0.png",
      )
      .mockResolvedValueOnce(
        "https://www.piugame.com/l_img/stepball/full/c_num_0.png",
      );
    mockTwDivImgGetAttribute
      .mockResolvedValueOnce(
        "https://www.piugame.com/l_img/stepball/full/s_text.png",
      )
      .mockResolvedValueOnce(
        "https://www.piugame.com/l_img/stepball/full/d_text.png",
      )
      .mockResolvedValueOnce(
        "https://www.piugame.com/l_img/stepball/full/sp_text.png",
      )
      .mockResolvedValueOnce(
        "https://www.piugame.com/l_img/stepball/full/dp_text.png",
      )
      .mockResolvedValueOnce(
        "https://www.piugame.com/l_img/stepball/full/c_text.png",
      );

    const result = await fetchMyBests(mockPage, "20");
    expect(result).toStrictEqual([
      {
        songName: "songName1",
        stepType: "S20",
        score: "score1",
        gradeImgSrc: "gradeImgSrc1",
        plateImgSrc: "plateImgSrc1",
      },
      {
        songName: "songName2",
        stepType: "D20",
        score: "score2",
        gradeImgSrc: "gradeImgSrc2",
        plateImgSrc: "plateImgSrc2",
      },
      {
        songName: "songName3",
        stepType: "SP20",
        score: "score3",
        gradeImgSrc: "gradeImgSrc3",
        plateImgSrc: "plateImgSrc3",
      },
      {
        songName: "songName4",
        stepType: "DP20",
        score: "score4",
        gradeImgSrc: "gradeImgSrc4",
        plateImgSrc: "plateImgSrc4",
      },
      {
        songName: "songName5",
        stepType: "CO-OPx0",
        score: "score5",
        gradeImgSrc: "gradeImgSrc5",
        plateImgSrc: "plateImgSrc5",
      },
    ]);
  });

  it('Should take screenshot if NODE_ENV is "development"', async () => {
    process.env.NODE_ENV = "development";
    mock$.mockResolvedValue(null);

    await fetchMyBests(mockPage, "20");
    expect(mockScreenshot).toHaveBeenCalledWith({
      fullPage: true,
      path: "imgs/screenshot_fetchScores_lv20_page1.png",
    });
  });

  it('Should not take screenshot if NODE_ENV is not "development"', async () => {
    process.env.NODE_ENV = "production";
    mock$.mockResolvedValue(null);

    await fetchMyBests(mockPage, "20");
    expect(mockScreenshot).toHaveBeenCalledTimes(0);
  });
});
