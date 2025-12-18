import swaggerUi from 'swagger-ui-express';

const swaggerSpec = {
  openapi: '3.0.0',
  info: {
    title: 'REVLIVE API',
    version: '1.0.0',
    description: 'API documentation for REVLIVE platform'
  },
  servers: [
    {
      url: 'http://localhost:3000',
      description: 'Local server'
    }
  ],

  components: {
    securitySchemes: {
      BearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT'
      }
    }
  },

  security: [
    { BearerAuth: [] }
  ],

  paths: {
    '/api/auth/register': {
      post: {
        tags: ['Auth'],
        summary: 'Register new user',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email', 'password'],
                properties: {
                  email: {
                    type: 'string',
                    example: 'test@revlive.com'
                  },
                  password: {
                    type: 'string',
                    example: '123456'
                  }
                }
              }
            }
          }
        },
        responses: {
          201: {
            description: 'User registered successfully'
          },
          400: {
            description: 'Email already exists'
          }
        }
      }
    },

    '/api/auth/login': {
      post: {
        tags: ['Auth'],
        summary: 'Login user',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email', 'password'],
                properties: {
                  email: {
                    type: 'string',
                    example: 'test@revlive.com'
                  },
                  password: {
                    type: 'string',
                    example: '123456'
                  }
                }
              }
            }
          }
        },
        responses: {
          200: {
            description: 'Login successful'
          },
          401: {
            description: 'Invalid credentials'
          }
        }
      }
    }
  }
};

export const setupSwagger = (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};
