/**
 * Central configuration for the E2E suite.
 * Both URLs can be overridden per run via environment variables, e.g.
 *   BASE_URL=http://127.0.0.1:5173 API_URL=http://127.0.0.1:3000 npm test
 */
export const config = {
  /** The Road Overview web app (Vite dev server inside the container). */
  baseURL: process.env.BASE_URL ?? 'http://localhost:5173',
  /** The json-server backend. */
  apiURL: process.env.API_URL ?? 'http://localhost:3000',
};

export type SutConfig = typeof config;
