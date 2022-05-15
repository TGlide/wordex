import { createRequire } from 'module';
import { pathsToModuleNameMapper } from 'ts-jest';
const require = createRequire(import.meta.url);
const { compilerOptions } = require('./.svelte-kit/tsconfig.json');

export default {
	preset: 'ts-jest',
	testEnvironment: 'node',
	transform: {
		'^.+\\test.ts?$': 'ts-jest'
	},
	transformIgnorePatterns: ['<rootDir>/node_modules/'],
	moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, { prefix: '<rootDir>/' })
};
