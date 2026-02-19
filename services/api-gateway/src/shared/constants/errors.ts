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
    message: 'Service Unavailable',
    status: 'SERVICE_UNAVAILABLE',
    statusCode: 503,
  },
};

export const INTERNAL_ERRORS = {
  INTERNAL_SERVER_ERROR: {
    message: 'Internal Server Error',
    status: 'INTERNAL_SERVER_ERROR',
    statusCode: 500,
  },
};

