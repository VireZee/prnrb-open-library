import { setTimeout } from 'node:timers/promises'

export async function retry<T>(fn: () => Promise<T>, opts: {
    retries?: number
    baseDelay?: number
    backoff?: number
    jitter?: boolean
    retryOn?: (err: any) => boolean
} = {}): Promise<T> {
    const { retries = 3, baseDelay = 200, backoff = 2, jitter = true, retryOn = () => true } = opts
    let lastErr
    let delay = baseDelay
    for (let attempt = 0; attempt <= retries; attempt++) {
        try {
            return await fn()
        } catch (e) {
            if (!retryOn(e)) throw e
            lastErr = e
            if (attempt === retries) break
            let wait = delay
            if (jitter) wait = wait * (1 + Math.random() * 0.3)
            await setTimeout(wait)
            delay *= backoff
        }
    }
    throw lastErr
}