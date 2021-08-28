import React, { PureComponent } from 'react';

import TransactionListContainer from '../../containers/main/TransactionListContainer';

import CoinOverview from './CoinOverview';

class MainPage extends PureComponent {
  render() {
    return (
      <React.Fragment>
        <CoinOverview />
        <TransactionListContainer />
      </React.Fragment>
    );
  }
}

export default MainPage;
