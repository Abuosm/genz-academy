const { z } = require('zod');

const schemas = {
  // Auth
  register: z.object({
    name: z.string().min(2, "Name must be at least 2 characters").max(50),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
  }),
  login: z.object({
    email: z.string().email(),
    password: z.string(),
  }),

  // Support
  chat: z.object({
    message: z.string().min(1).max(500),
  }),

  // Coding Judge
  solve: z.object({
    code: z.string().min(1).max(50000),
    language: z.enum(['javascript', 'python', 'java', 'cpp']),
    testcase: z.string().optional(),
  }),
};

module.exports = schemas;
