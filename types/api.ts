/**
 * API-level types: request and response shapes for Route Handlers.
 */

export interface HealthResponse {
  status: 'ok'
  timestamp: string
}

export interface AllowanceCronResponse {
  processed: number
  skipped: number
  errors: string[]
}
