import { setupServer } from 'msw/node';
import { handlers } from './handlers';

// MSW server instance — used in setupTests.ts (beforeAll/afterEach/afterAll)
export const server = setupServer(...handlers);
