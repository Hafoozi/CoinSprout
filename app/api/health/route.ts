import type { HealthResponse } from '@/types/api'

export async function GET(): Promise<Response> {
  const body: HealthResponse = {
    status: 'ok',
    timestamp: new Date().toISOString(),
  }
  return Response.json(body)
}
