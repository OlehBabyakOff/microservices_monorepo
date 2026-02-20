export const APPLICATION_ERRORS = {
  MISSING_TOKEN: {
    message: 'Token is missing',
    status: 'UNAUTHORIZED',
    statusCode: 401,
  },
  INVALID_TOKEN: {
    message: 'Token is invalid',
    status: 'UNAUTHORIZED',
    statusCode: 401,
  },
};

export const INFRASTRUCTURE_ERRORS = {
  SERVICE_UNAVAILABLE: {
    message: 'Service is unavailable',
    status: 'SERVICE_UNAVAILABLE',
    statusCode: 503,
  },
  RATE_LIMIT_ERROR: {
    message: 'Rate limit error occurred',
    status: 'RATE_LIMIT_ERROR',
    statusCode: 500,
  },
};

export const INTERNAL_ERRORS = {
  INTERNAL_SERVER_ERROR: {
    message: 'Internal Server Error',
    status: 'INTERNAL_SERVER_ERROR',
    statusCode: 500,
  },
};

