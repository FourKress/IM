export const microAppPathMark = 'MicroApp';
export const mergeMicroAppMark = (key) => `${key}${microAppPathMark}`;
export const getMicroActiveRule = (hash) => (location) =>
  location.hash.startsWith(hash);
export const microKeyMap = {
  System: 'System',
};
