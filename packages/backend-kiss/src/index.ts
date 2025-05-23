import { createApp } from './app';
import { config } from './config';

async function startServer() {
  try {
    const app = await createApp();

    const port = config.PORT || 8080;
    app.listen(port, () => {
      console.log(`Server is listening on port ${port}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
