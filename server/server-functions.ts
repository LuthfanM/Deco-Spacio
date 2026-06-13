export async function simulateApiDelay(): Promise<number> {
  const delayMs = Number(process.env.SIMULATE_API_DELAY_MS ?? 0);

  if (Number.isFinite(delayMs) && delayMs > 0) {
    await new Promise((resolve) => setTimeout(resolve, delayMs));
    return delayMs;
  }

  return 0;
}

