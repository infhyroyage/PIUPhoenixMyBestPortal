import { chromium } from "playwright-chromium";
import { Mock, beforeEach, expect, it, vi } from "vitest";
import { fetchSteps, fetchMyBests } from "../../fetcher/scrape";
import { createGistContent, upsertGist } from "../../fetcher/gist";
import { listGistInfo } from "../../services/gist";
import { run } from "../../fetcher/run";

vi.mock("dotenv");
vi.mock("playwright-chromium");
vi.mock("../fetcher/scrape");
vi.mock("../fetcher/gist");
vi.mock("../services/gist");

const mockNewContext = vi.fn();
const mockNewPage = vi.fn();
const mockGoto = vi.fn();
const mockFill = vi.fn();
const mockClick = vi.fn();
const mockClose = vi.fn();

beforeEach(() => {
  vi.resetAllMocks();

  process.env.GIST_PAT = "GIST_PAT";
  process.env.PIU_PHOENIX_EMAIL = "PIU_PHOENIX_EMAIL";
  process.env.PIU_PHOENIX_PASSWORD = "PIU_PHOENIX_PASSWORD";
});

it("Should throw error if GIST_PAT is not set", async () => {
  delete process.env.GIST_PAT;

  await expect(run()).rejects.toThrow("GIST_PAT is not set.");
  expect(mockClose).not.toHaveBeenCalled();
});

it("Should throw error if PIU_PHOENIX_EMAIL is not set", async () => {
  delete process.env.PIU_PHOENIX_EMAIL;

  await expect(run()).rejects.toThrow("PIU_PHOENIX_EMAIL is not set.");
  expect(mockClose).not.toHaveBeenCalled();
});

it("Should throw error if PIU_PHOENIX_PASSWORD is not set", async () => {
  delete process.env.PIU_PHOENIX_PASSWORD;

  await expect(run()).rejects.toThrow("PIU_PHOENIX_PASSWORD is not set.");
  expect(mockClose).not.toHaveBeenCalled();
});

it("Should not close browser if listGistInfo throws error", async () => {
  (listGistInfo as Mock).mockRejectedValue(
    new Error("Failed to list all gist info."),
  );

  await expect(run()).rejects.toThrow("Failed to list all gist info.");
  expect(mockClose).not.toHaveBeenCalled();
});

it("Should not close browser if launch throws error", async () => {
  (listGistInfo as Mock).mockResolvedValue([]);
  (chromium.launch as Mock).mockRejectedValue(
    new Error("Failed to launch browser."),
  );

  await expect(run()).rejects.toThrow("Failed to launch browser.");
  expect(mockClose).not.toHaveBeenCalled();
});

it("Should close browser if newContext throws error", async () => {
  (listGistInfo as Mock).mockResolvedValue([]);
  (chromium.launch as Mock).mockResolvedValue({
    newContext: mockNewContext,
    close: mockClose,
  });
  mockNewContext.mockRejectedValue(new Error("Failed to create context."));

  await expect(run()).rejects.toThrow("Failed to create context.");
  expect(mockClose).toHaveBeenCalled();
});

it("Should close browser if newPage throws error", async () => {
  (listGistInfo as Mock).mockResolvedValue([]);
  (chromium.launch as Mock).mockResolvedValue({
    newContext: mockNewContext,
    close: mockClose,
  });
  mockNewContext.mockReturnValue({ newPage: mockNewPage });
  mockNewPage.mockRejectedValue(new Error("Failed to create page."));

  await expect(run()).rejects.toThrow("Failed to create page.");
  expect(mockClose).toHaveBeenCalled();
});

it("Should close browser if failed to move to login page", async () => {
  (listGistInfo as Mock).mockResolvedValue([]);
  (chromium.launch as Mock).mockResolvedValue({
    newContext: mockNewContext,
    close: mockClose,
  });
  mockNewContext.mockReturnValue({ newPage: mockNewPage });
  mockNewPage.mockReturnValue({ goto: mockGoto });
  mockGoto.mockRejectedValueOnce(new Error("Failed to move to login page."));

  await expect(run()).rejects.toThrow("Failed to move to login page.");
  expect(mockClose).toHaveBeenCalled();
});

it("Should close browser if failed to input email", async () => {
  (listGistInfo as Mock).mockResolvedValue([]);
  (chromium.launch as Mock).mockResolvedValue({
    newContext: mockNewContext,
    close: mockClose,
  });
  mockNewContext.mockReturnValue({ newPage: mockNewPage });
  mockNewPage.mockReturnValue({ goto: mockGoto, fill: mockFill });
  mockFill.mockRejectedValueOnce(new Error("Failed to input email."));

  await expect(run()).rejects.toThrow("Failed to input email.");
  expect(mockClose).toHaveBeenCalled();
});

it("Should close browser if failed to input password", async () => {
  (listGistInfo as Mock).mockResolvedValue([]);
  (chromium.launch as Mock).mockResolvedValue({
    newContext: mockNewContext,
    close: mockClose,
  });
  mockNewContext.mockReturnValue({ newPage: mockNewPage });
  mockNewPage.mockReturnValue({ goto: mockGoto, fill: mockFill });
  mockFill
    .mockReturnValueOnce({})
    .mockRejectedValueOnce(new Error("Failed to input password."));

  await expect(run()).rejects.toThrow("Failed to input password.");
  expect(mockClose).toHaveBeenCalled();
});

it("Should close browser if failed to click 'Login' button", async () => {
  (listGistInfo as Mock).mockResolvedValue([]);
  (chromium.launch as Mock).mockResolvedValue({
    newContext: mockNewContext,
    close: mockClose,
  });
  mockNewContext.mockReturnValue({ newPage: mockNewPage });
  mockNewPage.mockReturnValue({
    goto: mockGoto,
    fill: mockFill,
    click: mockClick,
  });
  mockClick.mockRejectedValue(new Error("Failed to click 'Login' button."));

  await expect(run()).rejects.toThrow("Failed to click 'Login' button.");
  expect(mockClose).toHaveBeenCalled();
});

it("Should close browser if fetchSteps throws error", async () => {
  (listGistInfo as Mock).mockResolvedValue([]);
  (chromium.launch as Mock).mockResolvedValue({
    newContext: mockNewContext,
    close: mockClose,
  });
  mockNewContext.mockReturnValue({ newPage: mockNewPage });
  mockNewPage.mockReturnValue({
    goto: mockGoto,
    fill: mockFill,
    click: mockClick,
  });
  (fetchSteps as Mock).mockRejectedValue(
    new Error("Failed to fetch all steps."),
  );

  await expect(run()).rejects.toThrow("Failed to fetch all steps.");
  expect(mockClose).toHaveBeenCalled();
});

it("Should close browser if fetchMyBests throws error", async () => {
  (listGistInfo as Mock).mockResolvedValue([]);
  (chromium.launch as Mock).mockResolvedValue({
    newContext: mockNewContext,
    close: mockClose,
  });
  mockNewContext.mockReturnValue({ newPage: mockNewPage });
  mockNewPage.mockReturnValue({
    goto: mockGoto,
    fill: mockFill,
    click: mockClick,
  });
  (fetchSteps as Mock).mockResolvedValue([]);
  (fetchMyBests as Mock).mockRejectedValue(
    new Error("Failed to fetch all my bests."),
  );

  await expect(run()).rejects.toThrow("Failed to fetch all my bests.");
  expect(mockClose).toHaveBeenCalled();
});

it("Should close browser if createGistContent throws error", async () => {
  (listGistInfo as Mock).mockResolvedValue([]);
  (chromium.launch as Mock).mockResolvedValue({
    newContext: mockNewContext,
    close: mockClose,
  });
  mockNewContext.mockReturnValue({ newPage: mockNewPage });
  mockNewPage.mockReturnValue({
    goto: mockGoto,
    fill: mockFill,
    click: mockClick,
  });
  (fetchSteps as Mock).mockResolvedValue([]);
  (fetchMyBests as Mock).mockResolvedValue([]);
  (createGistContent as Mock).mockImplementation(() => {
    throw new Error("Failed to create cosmos db data.");
  });

  await expect(run()).rejects.toThrow("Failed to create cosmos db data.");
  expect(mockClose).toHaveBeenCalled();
});

it("Should close browser if upsertGist throws error", async () => {
  (listGistInfo as Mock).mockResolvedValue([]);
  (chromium.launch as Mock).mockResolvedValue({
    newContext: mockNewContext,
    close: mockClose,
  });
  mockNewContext.mockReturnValue({ newPage: mockNewPage });
  mockNewPage.mockReturnValue({
    goto: mockGoto,
    fill: mockFill,
    click: mockClick,
  });
  (fetchSteps as Mock).mockResolvedValue([]);
  (fetchMyBests as Mock).mockResolvedValue([]);
  (createGistContent as Mock).mockReturnValue([]);
  (upsertGist as Mock).mockRejectedValue(
    new Error("Failed to upsert into cosmos db."),
  );

  await expect(run()).rejects.toThrow("Failed to upsert into cosmos db.");
  expect(mockClose).toHaveBeenCalled();
});

it("Should complete without throwing errors", async () => {
  (listGistInfo as Mock).mockResolvedValue([]);
  (chromium.launch as Mock).mockResolvedValue({
    newContext: mockNewContext,
    close: mockClose,
  });
  mockNewContext.mockReturnValue({ newPage: mockNewPage });
  mockNewPage.mockReturnValue({
    goto: mockGoto,
    fill: mockFill,
    click: mockClick,
  });
  (fetchSteps as Mock).mockResolvedValue([]);
  (fetchMyBests as Mock).mockResolvedValue([]);
  (createGistContent as Mock).mockReturnValue([]);
  (upsertGist as Mock).mockReturnValue(undefined);

  await expect(run()).resolves.toBeUndefined();
  expect(mockClose).toHaveBeenCalled();
});
