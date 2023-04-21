import { microAppPathMark } from '@lanshu/micro';

const mergePathMark = (key) => `${key}${microAppPathMark}`;

export const microContainer = `Main${microAppPathMark}`;

export const microKeyMap = {
  System: mergePathMark('System'),
  KnowledgeBase: mergePathMark('KnowledgeBase'),
};
