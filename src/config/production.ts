// Production configuration for QProof Explorer

export const productionConfig = {
  api: {
    baseUrl: process.env.NEXT_PUBLIC_BACKEND_ENDPOINT || 'http://localhost:8000',
    timeout: 10000,
    retryAttempts: 3,
  },
  app: {
    name: process.env.NEXT_PUBLIC_APP_NAME || 'QProof Explorer',
    version: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',
    environment: process.env.NODE_ENV || 'development',
  },
  features: {
    analytics: process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === 'true',
    debug: process.env.NEXT_PUBLIC_ENABLE_DEBUG === 'true',
  },
  ui: {
    refreshInterval: 3000, // 3 seconds for live updates
    pagination: {
      defaultLimit: 50,
      maxLimit: 100,
    },
  },
  errorReporting: {
    enabled: process.env.NEXT_PUBLIC_SENTRY_DSN ? true : false,
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  },
};

export default productionConfig;
