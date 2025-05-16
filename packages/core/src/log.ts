/**
 *
 * @param error
 * @returns
 */
export const isError = (error: unknown): error is Error => error instanceof Error

export type ErrorLevel = 'info' | 'warn' | 'fail' | 'status'

type EventData = {
  name: string
  level: ErrorLevel
  error?: unknown
  message: string
  tags?: string[]
}

export class NNError extends Error {
  readonly origin?: Error
  readonly type = 'telemetry'
  constructor(
    public data: EventData,
    origin?: unknown
  ) {
    super()
    if (isError(origin)) {
      this.origin = origin
      this.stack = origin.stack
    }
  }
}

export const isNNError = (error: unknown): error is NNError =>
  error instanceof NNError

export const collectNNErrors = (e: PromiseRejectedResult[]) =>
  e
    .map((r) => r.reason)
    .filter(isNNError)
    .map((e) => e.data.message)
