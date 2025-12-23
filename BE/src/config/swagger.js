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
    },

    // ==================== HOME - PUBLIC ROUTES ====================
    '/api/home/heroes': {
      get: {
        tags: ['Home'],
        summary: 'Get active heroes',
        security: [],
        responses: {
          200: {
            description: 'List of active heroes',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/Hero' }
                }
              }
            }
          }
        }
      }
    },

    '/api/home/agencies': {
      get: {
        tags: ['Home'],
        summary: 'Get top 3 active agencies',
        security: [],
        responses: {
          200: {
            description: 'List of top 3 agencies',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/Agency' }
                }
              }
            }
          }
        }
      }
    },

    '/api/home/creators': {
      get: {
        tags: ['Home'],
        summary: 'Get top 6 active creators',
        security: [],
        responses: {
          200: {
            description: 'List of top 6 creators',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/Creator' }
                }
              }
            }
          }
        }
      }
    },

    '/api/home/topics': {
      get: {
        tags: ['Home'],
        summary: 'Get top 3 active topics',
        security: [],
        responses: {
          200: {
            description: 'List of top 3 topics',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/Topic' }
                }
              }
            }
          }
        }
      }
    },

    '/api/home/testimonials': {
      get: {
        tags: ['Home'],
        summary: 'Get top 3 active testimonials',
        security: [],
        responses: {
          200: {
            description: 'List of top 3 testimonials',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/Testimonial' }
                }
              }
            }
          }
        }
      }
    },

    '/api/home/footer': {
      get: {
        tags: ['Home'],
        summary: 'Get footer information',
        security: [],
        responses: {
          200: {
            description: 'Footer information',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Footer' }
              }
            }
          }
        }
      }
    },

    // ==================== HOME - ADMIN ROUTES ====================
    '/api/home/admin/heroes': {
      get: {
        tags: ['Home - Admin'],
        summary: 'Get all heroes (Admin only)',
        responses: {
          200: {
            description: 'List of all heroes',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/Hero' }
                }
              }
            }
          },
          401: { description: 'Unauthorized' },
          403: { description: 'Forbidden - Staff/Admin only' }
        }
      },
      post: {
        tags: ['Home - Admin'],
        summary: 'Create new hero (Admin only)',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/HeroInput' }
            }
          }
        },
        responses: {
          201: {
            description: 'Hero created successfully',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Hero' }
              }
            }
          },
          400: { description: 'Bad request' },
          401: { description: 'Unauthorized' },
          403: { description: 'Forbidden - Staff/Admin only' }
        }
      }
    },

    '/api/home/admin/heroes/{id}': {
      put: {
        tags: ['Home - Admin'],
        summary: 'Update hero (Admin only)',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string' },
            description: 'Hero ID'
          }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/HeroInput' }
            }
          }
        },
        responses: {
          200: {
            description: 'Hero updated successfully',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Hero' }
              }
            }
          },
          404: { description: 'Hero not found' },
          401: { description: 'Unauthorized' },
          403: { description: 'Forbidden - Staff/Admin only' }
        }
      },
      delete: {
        tags: ['Home - Admin'],
        summary: 'Delete hero (Admin only)',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string' },
            description: 'Hero ID'
          }
        ],
        responses: {
          200: { description: 'Hero deleted successfully' },
          404: { description: 'Hero not found' },
          401: { description: 'Unauthorized' },
          403: { description: 'Forbidden - Staff/Admin only' }
        }
      }
    },

    '/api/home/admin/agencies': {
      get: {
        tags: ['Home - Admin'],
        summary: 'Get all agencies (Admin only)',
        responses: {
          200: {
            description: 'List of all agencies',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/Agency' }
                }
              }
            }
          },
          401: { description: 'Unauthorized' },
          403: { description: 'Forbidden - Staff/Admin only' }
        }
      },
      post: {
        tags: ['Home - Admin'],
        summary: 'Create new agency (Admin only)',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/AgencyInput' }
            }
          }
        },
        responses: {
          201: {
            description: 'Agency created successfully',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Agency' }
              }
            }
          },
          400: { description: 'Bad request' },
          401: { description: 'Unauthorized' },
          403: { description: 'Forbidden - Staff/Admin only' }
        }
      }
    },

    '/api/home/admin/agencies/{id}': {
      put: {
        tags: ['Home - Admin'],
        summary: 'Update agency (Admin only)',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string' },
            description: 'Agency ID'
          }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/AgencyInput' }
            }
          }
        },
        responses: {
          200: {
            description: 'Agency updated successfully',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Agency' }
              }
            }
          },
          404: { description: 'Agency not found' },
          401: { description: 'Unauthorized' },
          403: { description: 'Forbidden - Staff/Admin only' }
        }
      },
      delete: {
        tags: ['Home - Admin'],
        summary: 'Delete agency (Admin only)',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string' },
            description: 'Agency ID'
          }
        ],
        responses: {
          200: { description: 'Agency deleted successfully' },
          404: { description: 'Agency not found' },
          401: { description: 'Unauthorized' },
          403: { description: 'Forbidden - Staff/Admin only' }
        }
      }
    },

    '/api/home/admin/creators': {
      get: {
        tags: ['Home - Admin'],
        summary: 'Get all creators (Admin only)',
        responses: {
          200: {
            description: 'List of all creators',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/Creator' }
                }
              }
            }
          },
          401: { description: 'Unauthorized' },
          403: { description: 'Forbidden - Staff/Admin only' }
        }
      },
      post: {
        tags: ['Home - Admin'],
        summary: 'Create new creator (Admin only)',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/CreatorInput' }
            }
          }
        },
        responses: {
          201: {
            description: 'Creator created successfully',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Creator' }
              }
            }
          },
          400: { description: 'Bad request' },
          401: { description: 'Unauthorized' },
          403: { description: 'Forbidden - Staff/Admin only' }
        }
      }
    },

    '/api/home/admin/creators/{id}': {
      put: {
        tags: ['Home - Admin'],
        summary: 'Update creator (Admin only)',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string' },
            description: 'Creator ID'
          }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/CreatorInput' }
            }
          }
        },
        responses: {
          200: {
            description: 'Creator updated successfully',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Creator' }
              }
            }
          },
          404: { description: 'Creator not found' },
          401: { description: 'Unauthorized' },
          403: { description: 'Forbidden - Staff/Admin only' }
        }
      },
      delete: {
        tags: ['Home - Admin'],
        summary: 'Delete creator (Admin only)',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string' },
            description: 'Creator ID'
          }
        ],
        responses: {
          200: { description: 'Creator deleted successfully' },
          404: { description: 'Creator not found' },
          401: { description: 'Unauthorized' },
          403: { description: 'Forbidden - Staff/Admin only' }
        }
      }
    },

    '/api/home/admin/topics': {
      get: {
        tags: ['Home - Admin'],
        summary: 'Get all topics (Admin only)',
        responses: {
          200: {
            description: 'List of all topics',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/Topic' }
                }
              }
            }
          },
          401: { description: 'Unauthorized' },
          403: { description: 'Forbidden - Staff/Admin only' }
        }
      },
      post: {
        tags: ['Home - Admin'],
        summary: 'Create new topic (Admin only)',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/TopicInput' }
            }
          }
        },
        responses: {
          201: {
            description: 'Topic created successfully',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Topic' }
              }
            }
          },
          400: { description: 'Bad request' },
          401: { description: 'Unauthorized' },
          403: { description: 'Forbidden - Staff/Admin only' }
        }
      }
    },

    '/api/home/admin/topics/{id}': {
      put: {
        tags: ['Home - Admin'],
        summary: 'Update topic (Admin only)',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string' },
            description: 'Topic ID'
          }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/TopicInput' }
            }
          }
        },
        responses: {
          200: {
            description: 'Topic updated successfully',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Topic' }
              }
            }
          },
          404: { description: 'Topic not found' },
          401: { description: 'Unauthorized' },
          403: { description: 'Forbidden - Staff/Admin only' }
        }
      },
      delete: {
        tags: ['Home - Admin'],
        summary: 'Delete topic (Admin only)',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string' },
            description: 'Topic ID'
          }
        ],
        responses: {
          200: { description: 'Topic deleted successfully' },
          404: { description: 'Topic not found' },
          401: { description: 'Unauthorized' },
          403: { description: 'Forbidden - Staff/Admin only' }
        }
      }
    },

    '/api/home/admin/testimonials': {
      get: {
        tags: ['Home - Admin'],
        summary: 'Get all testimonials (Admin only)',
        responses: {
          200: {
            description: 'List of all testimonials',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/Testimonial' }
                }
              }
            }
          },
          401: { description: 'Unauthorized' },
          403: { description: 'Forbidden - Staff/Admin only' }
        }
      },
      post: {
        tags: ['Home - Admin'],
        summary: 'Create new testimonial (Admin only)',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/TestimonialInput' }
            }
          }
        },
        responses: {
          201: {
            description: 'Testimonial created successfully',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Testimonial' }
              }
            }
          },
          400: { description: 'Bad request' },
          401: { description: 'Unauthorized' },
          403: { description: 'Forbidden - Staff/Admin only' }
        }
      }
    },

    '/api/home/admin/testimonials/{id}': {
      put: {
        tags: ['Home - Admin'],
        summary: 'Update testimonial (Admin only)',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string' },
            description: 'Testimonial ID'
          }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/TestimonialInput' }
            }
          }
        },
        responses: {
          200: {
            description: 'Testimonial updated successfully',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Testimonial' }
              }
            }
          },
          404: { description: 'Testimonial not found' },
          401: { description: 'Unauthorized' },
          403: { description: 'Forbidden - Staff/Admin only' }
        }
      },
      delete: {
        tags: ['Home - Admin'],
        summary: 'Delete testimonial (Admin only)',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string' },
            description: 'Testimonial ID'
          }
        ],
        responses: {
          200: { description: 'Testimonial deleted successfully' },
          404: { description: 'Testimonial not found' },
          401: { description: 'Unauthorized' },
          403: { description: 'Forbidden - Staff/Admin only' }
        }
      }
    },

    '/api/home/admin/footer': {
      put: {
        tags: ['Home - Admin'],
        summary: 'Update footer (Admin only)',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/FooterInput' }
            }
          }
        },
        responses: {
          200: {
            description: 'Footer updated successfully',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Footer' }
              }
            }
          },
          400: { description: 'Bad request' },
          401: { description: 'Unauthorized' },
          403: { description: 'Forbidden - Staff/Admin only' }
        }
      }
    }
  },

  components: {
    securitySchemes: {
      BearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT'
      }
    },
    schemas: {
      Hero: {
        type: 'object',
        properties: {
          _id: { type: 'string' },
          title: { type: 'string', example: 'Nền tảng kết nối' },
          titleHighlight: { type: 'string', example: 'Creator & Brand' },
          description: { type: 'string' },
          ctaText: { type: 'string', example: 'Khám phá ngay' },
          backgroundImage: { type: 'string', example: '/uploads/image.jpg' },
          isActive: { type: 'boolean', example: true },
          order: { type: 'number', example: 0 },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' }
        }
      },
      HeroInput: {
        type: 'object',
        required: ['title', 'description', 'backgroundImage'],
        properties: {
          title: { type: 'string', example: 'Nền tảng kết nối' },
          titleHighlight: { type: 'string', example: 'Creator & Brand' },
          description: { type: 'string' },
          ctaText: { type: 'string', example: 'Khám phá ngay' },
          backgroundImage: { type: 'string', example: '/uploads/image.jpg' },
          isActive: { type: 'boolean', example: true },
          order: { type: 'number', example: 0 }
        }
      },
      Agency: {
        type: 'object',
        properties: {
          _id: { type: 'string' },
          name: { type: 'string', example: 'CREATIVE AGENCY' },
          rank: { type: 'string', enum: ['TOP 1', 'TOP 2', 'TOP 3'], example: 'TOP 1' },
          image: { type: 'string', example: '/uploads/image.jpg' },
          size: { type: 'string', enum: ['large', 'small'], example: 'large' },
          isActive: { type: 'boolean', example: true },
          order: { type: 'number', example: 0 },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' }
        }
      },
      AgencyInput: {
        type: 'object',
        required: ['name', 'rank', 'image'],
        properties: {
          name: { type: 'string', example: 'CREATIVE AGENCY' },
          rank: { type: 'string', enum: ['TOP 1', 'TOP 2', 'TOP 3'], example: 'TOP 1' },
          image: { type: 'string', example: '/uploads/image.jpg' },
          size: { type: 'string', enum: ['large', 'small'], example: 'large' },
          isActive: { type: 'boolean', example: true },
          order: { type: 'number', example: 0 }
        }
      },
      Creator: {
        type: 'object',
        properties: {
          _id: { type: 'string' },
          name: { type: 'string', example: 'Nguyễn Văn A' },
          description: { type: 'string', example: 'Content Creator - 1.2M followers' },
          avatar: { type: 'string', example: '/uploads/avatar.jpg' },
          followers: { type: 'string', example: '1.2M' },
          isActive: { type: 'boolean', example: true },
          order: { type: 'number', example: 0 },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' }
        }
      },
      CreatorInput: {
        type: 'object',
        required: ['name', 'description', 'avatar'],
        properties: {
          name: { type: 'string', example: 'Nguyễn Văn A' },
          description: { type: 'string', example: 'Content Creator - 1.2M followers' },
          avatar: { type: 'string', example: '/uploads/avatar.jpg' },
          followers: { type: 'string', example: '1.2M' },
          isActive: { type: 'boolean', example: true },
          order: { type: 'number', example: 0 }
        }
      },
      Topic: {
        type: 'object',
        properties: {
          _id: { type: 'string' },
          title: { type: 'string', example: 'Gaming' },
          image: { type: 'string', example: '/uploads/image.jpg' },
          position: { type: 'string', enum: ['left', 'center', 'right'], example: 'center' },
          isActive: { type: 'boolean', example: true },
          order: { type: 'number', example: 0 },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' }
        }
      },
      TopicInput: {
        type: 'object',
        required: ['title', 'image'],
        properties: {
          title: { type: 'string', example: 'Gaming' },
          image: { type: 'string', example: '/uploads/image.jpg' },
          position: { type: 'string', enum: ['left', 'center', 'right'], example: 'center' },
          isActive: { type: 'boolean', example: true },
          order: { type: 'number', example: 0 }
        }
      },
      Testimonial: {
        type: 'object',
        properties: {
          _id: { type: 'string' },
          name: { type: 'string', example: 'Nguyễn Minh Tuấn' },
          role: { type: 'string', example: 'CEO - TechStart' },
          content: { type: 'string' },
          avatar: { type: 'string', example: '/uploads/avatar.jpg' },
          isActive: { type: 'boolean', example: true },
          order: { type: 'number', example: 0 },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' }
        }
      },
      TestimonialInput: {
        type: 'object',
        required: ['name', 'role', 'content', 'avatar'],
        properties: {
          name: { type: 'string', example: 'Nguyễn Minh Tuấn' },
          role: { type: 'string', example: 'CEO - TechStart' },
          content: { type: 'string' },
          avatar: { type: 'string', example: '/uploads/avatar.jpg' },
          isActive: { type: 'boolean', example: true },
          order: { type: 'number', example: 0 }
        }
      },
      Footer: {
        type: 'object',
        properties: {
          _id: { type: 'string' },
          description: { type: 'string' },
          supportPhone: { type: 'string', example: '036.333.5981' },
          officeLocation: { type: 'string', example: 'REVLIVE' },
          socialLinks: {
            type: 'object',
            properties: {
              facebook: { type: 'string', example: 'https://facebook.com' },
              twitter: { type: 'string', example: 'https://twitter.com' },
              instagram: { type: 'string', example: 'https://instagram.com' }
            }
          },
          footerLinks: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                label: { type: 'string', example: 'Giới thiệu' },
                url: { type: 'string', example: '/about' }
              }
            }
          },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' }
        }
      },
      FooterInput: {
        type: 'object',
        properties: {
          description: { type: 'string' },
          supportPhone: { type: 'string', example: '036.333.5981' },
          officeLocation: { type: 'string', example: 'REVLIVE' },
          socialLinks: {
            type: 'object',
            properties: {
              facebook: { type: 'string', example: 'https://facebook.com' },
              twitter: { type: 'string', example: 'https://twitter.com' },
              instagram: { type: 'string', example: 'https://instagram.com' }
            }
          },
          footerLinks: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                label: { type: 'string', example: 'Giới thiệu' },
                url: { type: 'string', example: '/about' }
              }
            }
          }
        }
      }
    }
  }
};

export const setupSwagger = (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};
