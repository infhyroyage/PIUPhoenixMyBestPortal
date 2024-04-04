import crypto from "crypto";
import { Lv, Score } from "./types";

export async function getScores(lv?: Lv): Promise<Score[]> {
  if (!process.env.AZURE_COSMOSDB_ENDPOINT) {
    console.log("AZURE_COSMOSDB_ENDPOINT is not set.");
    return [];
  }
  const azureCosmosdbEndpoint: string = process.env.AZURE_COSMOSDB_ENDPOINT;
  if (!process.env.AZURE_COSMOSDB_READONLY_KEY) {
    console.log("AZURE_COSMOSDB_READONLY_KEY is not set.");
    return [];
  }
  const azureCosmosdbReadOnlyKey: string =
    process.env.AZURE_COSMOSDB_READONLY_KEY;
  if (!process.env.PLAYER_NAME) {
    console.log("PLAYER_NAME is not set.");
    return [];
  }
  const playerName: string = process.env.PLAYER_NAME;

  const utcNow: string = new Date().toUTCString();
  const text: string = `post\ndocs\ndbs/Scores/colls/${playerName}\n${utcNow.toLowerCase()}\n\n`;
  const sig: string = crypto
    .createHmac("sha256", Buffer.from(azureCosmosdbReadOnlyKey, "base64"))
    .update(Buffer.from(text, "utf8"))
    .digest("base64");
  const authorization: string = encodeURIComponent(
    `type=master&ver=1.0&sig=${sig}`,
  );

  const res = await fetch(
    `${azureCosmosdbEndpoint}dbs/Scores/colls/${playerName}/docs`,
    {
      body: JSON.stringify(
        lv
          ? {
              query:
                "SELECT c.songName, c.stepType, c.thumbnailImgSrc, c.score, c.gradeImgSrc, c.plateImgSrc FROM c WHERE c.lv = @lv",
              parameters: [{ name: "@lv", value: lv }],
            }
          : {
              query:
                "SELECT c.songName, c.stepType, c.thumbnailImgSrc, c.score, c.gradeImgSrc, c.plateImgSrc FROM c",
            },
      ),
      headers: {
        Accept: "application/json",
        Authorization: authorization,
        "Content-Type": "application/query+json",
        "x-ms-date": utcNow,
        "x-ms-documentdb-isquery": "True",
        "x-ms-version": "2018-12-31",
      },
      method: "POST",
    },
  );
  return (await res.json()).Documents;
}
