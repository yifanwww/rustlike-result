import { defineConfig, globalIgnores } from 'eslint/config';

import { recommended } from '../../configs/eslint/eslint.config.js';

export default defineConfig([globalIgnores(['coverage/', 'dist/']), recommended.basic]);
