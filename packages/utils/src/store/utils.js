export const resetStoreState = (state, defaultState) => {
  Object.keys(defaultState).forEach((key) => {
    state[key] = defaultState[key];
  });
  return state;
};
