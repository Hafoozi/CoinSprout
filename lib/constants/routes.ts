/**
 * Centralised route definitions.
 * Import from here instead of hardcoding path strings in components.
 */
export const ROUTES = {
  HOME:  '/',
  LOGIN: '/login',

  PARENT: {
    DASHBOARD:          '/dashboard',
    CHILD:              (childId: string) => `/children/${childId}`,
    NEW_CHILD:          '/children/new',
    NEW_GOAL:           '/goals/new',
    GOAL:               (goalId: string) => `/goals/${goalId}`,
    NEW_TRANSACTION:    '/transactions/new',
    SPEND:              '/transactions/spend',
  },

  CHILD: {
    HOME:     (childId: string) => `/child/${childId}`,
    GOALS:    (childId: string) => `/child/${childId}/goals`,
    ACTIVITY: (childId: string) => `/child/${childId}/activity`,
  },

  API: {
    HEALTH:            '/api/health',
    CRON_ALLOWANCE:    '/api/cron/allowance',
  },
} as const
