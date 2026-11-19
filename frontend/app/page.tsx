// リクエストのたびに backend を呼ぶ（ビルド時に結果を固定しない）
export const dynamic = "force-dynamic";

type HealthResponse = { status: string };

async function getHealth(): Promise<HealthResponse | null> {
  const apiBaseUrl = process.env.API_BASE_URL ?? "http://localhost:8000";
  try {
    const res = await fetch(`${apiBaseUrl}/health`, { cache: "no-store" });
    if (!res.ok) return null;
    return (await res.json()) as HealthResponse;
  } catch {
    return null; // backend が起動していないときなど
  }
}

export default async function HomePage() {
  const health = await getHealth();

  return (
    <main>
      <h1>オウンドメディア（読者向け）</h1>
      <h2>backend の状態</h2>
      {health ? (
        <pre>{JSON.stringify(health)}</pre>
      ) : (
        <p>backend（FastAPI）に接続できませんでした。</p>
      )}
    </main>
  );
}
