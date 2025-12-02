// Utility for fetching with retry logic for rate limiting

export type FetchWithRetryOptions = {
  maxRetries?: number
  initialDelayMs?: number
  maxDelayMs?: number
  backoffMultiplier?: number
}

/**
 * Fetches a URL with automatic retry logic for 429 (rate limit) errors.
 * Uses exponential backoff with jitter.
 */
export async function fetchWithRetry(url: string, options: FetchWithRetryOptions = {}): Promise<Response> {
  const {
    maxRetries = 3,
    initialDelayMs = 400, // Increased default from 300ms to 400ms
    maxDelayMs = 10000, // Increased default from 8000ms to 10000ms
    backoffMultiplier = 2,
  } = options

  let lastError: Error | null = null
  let delayMs = initialDelayMs

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const res = await fetch(url)

      // If rate limited, retry after delay
      if (res.status === 429) {
        if (attempt < maxRetries) {
          // Add jitter (±20%)
          const jitter = delayMs * 0.2 * (Math.random() * 2 - 1)
          const actualDelay = Math.min(delayMs + jitter, maxDelayMs)

          console.warn(
            `[fetchWithRetry] 429 rate limit on ${url}, retrying in ${Math.round(actualDelay)}ms (attempt ${attempt + 1}/${maxRetries})`,
          )

          await new Promise((resolve) => setTimeout(resolve, actualDelay))
          delayMs *= backoffMultiplier
          continue
        } else {
          throw new Error(`Rate limit exceeded after ${maxRetries} retries: ${url}`)
        }
      }

      // For other errors, don't retry
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`)
      }

      return res
    } catch (e: any) {
      lastError = e

      // Only retry network errors and rate limits
      if (attempt < maxRetries && (e.message?.includes("429") || e.code === "ECONNRESET")) {
        const jitter = delayMs * 0.2 * (Math.random() * 2 - 1)
        const actualDelay = Math.min(delayMs + jitter, maxDelayMs)

        console.warn(
          `[fetchWithRetry] Network error on ${url}, retrying in ${Math.round(actualDelay)}ms (attempt ${attempt + 1}/${maxRetries})`,
        )

        await new Promise((resolve) => setTimeout(resolve, actualDelay))
        delayMs *= backoffMultiplier
        continue
      }

      // Don't retry other errors
      throw e
    }
  }

  throw lastError || new Error("Fetch failed after retries")
}

/**
 * Process items in sequential batches to avoid overwhelming the API.
 * Each batch is processed in parallel, but batches are sequential.
 */
export async function processBatched<T, R>(
  items: T[],
  batchSize: number,
  processor: (item: T) => Promise<R>,
): Promise<R[]> {
  const results: R[] = []

  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize)
    const batchResults = await Promise.all(batch.map(processor))
    results.push(...batchResults)
  }

  return results
}
