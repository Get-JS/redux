import createSelectors from '../api-redux-pack/createSelectors';

export const { createLoadingStateSelector: userCreateLoadingStateSelector } =
  createSelectors('users');
