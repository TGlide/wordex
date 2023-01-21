import packageJson from '../../package.json';

export const isDevelopment = import.meta.env.DEV;
export const projectVersion = packageJson.version;

export const ROW_FLIP_DELAY = 250;
export const ROW_FLIP_DURATION = 750;
