import LibGenerateTestUserSig from './lib-generate-test-usersig.min.js';

export const SDK_APP_ID = 1400790282;
export const SECRET_KEY =
  'fcb54d8bed968e68e1edba2ffe2e87c889fed0d6c028dd1fffa1101b79b3ec0f';

export const genUserSig = (userId) => {
  const generator = new LibGenerateTestUserSig(SDK_APP_ID, SECRET_KEY, 604800);
  const userSig = generator.genTestUserSig(userId);

  return {
    SDKAppID: SDK_APP_ID,
    userSig: userSig,
  };
};
