import { exit } from 'node:process';

import { main } from './app';

main().catch((error) => {
  console.error(error);
  exit(1);
});
