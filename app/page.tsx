import { getScores } from "@/services/cosmos";

export default async function Page() {
  const scores = await getScores("20");
  return (
    <>
      <h1 className="bg-red-400 text-3xl font-bold">Hello, Next.js!</h1>
      <pre className="font-mono">{JSON.stringify(scores, null, 2)}</pre>
    </>
  );
}
