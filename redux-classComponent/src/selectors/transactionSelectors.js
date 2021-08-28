import createSelectors from '../api-redux-pack/createSelectors';

export const {
  resourceSelector: transactionsSelector,
  pagesSelector: transactionPagesSelector,
  collectionSelector: transactionListSelector,
  collectionLoadingStateSelector: transactionListLoadingStateSelector,
  paginationSelector,
} = createSelectors('transactions');
