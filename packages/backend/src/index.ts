import { exit } from 'process';
import { initializeDiContainer } from './di';
import { applicationDataSource } from './infrastructure/orm/data-source';
import express from 'express';
import { createAuthModule } from './modules/auth/api/app';

export async function main() {
  try {
    await applicationDataSource.initialize();
    console.log('Database initialized');

    await initializeDiContainer();
    console.log('DI container initialized');

    const app = express();
    app.use(express.json());

    app.use(createAuthModule());

    app.listen(3000, () => {
      console.log('Server running on port 3000');
    });
  } catch (error) {
    console.error('Failed to start application:', error);
    exit(1);
  }
}

main();
