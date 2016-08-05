import _ from 'lodash';
import React from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import * as transactionsActionCreators from '../../../redux/transactions/action-creators';
import * as categoriesActionCreators from '../../../redux/categories/action-creators';
import Subheader from '../subheader';
import DateMenu from '../date-menu';
import TransactionsList from '../transactions-list';
import EmptyTransactions from '../empty-transactions';
import ErrorRetrieving from '../../../common/components/error-retrieving';
import LoadingResourceList from '../../../common/components/loading-resource-list';
import NotFound from '../../../common/components/not-found';
import validateTransactionDate from '../../services/validate-transaction-date';

export const Content = React.createClass({
  // When the component is mounted, we make sure that we have the latest
  // categories and the transactions for the current date
  componentWillMount() {
    const {params} = this.props;
    this.fetchResources(params.transactionDate);
  },

  componentWillUnmount() {
    // Abort any outstanding XHR requests when the component unmounts
    _.result(this.fetchTransactionsXhr, 'abort');
    _.result(this.fetchCategoriesXhr, 'abort');
  },

  componentWillReceiveProps(nextProps) {
    // Anytime the date changes, we need to fetch new transactions
    if (this.props.params.transactionDate !== nextProps.params.transactionDate) {
      _.result(this.fetchTransactionsXhr, 'abort');
      this.fetchResources(nextProps.params.transactionDate);
    }
  },

  fetchResources(date) {
    const {transactionsActions, categoriesActions} = this.props;
    this.fetchCategoriesXhr = categoriesActions.retrieveCategories();
    const transactionDate = date.split('-');
    this.fetchTransactionsXhr = transactionsActions.retrieveTransactions({
      year: transactionDate[0],
      month: transactionDate[1]
    });
  },

  render() {
    const {
      retrievingCategoriesStatus, retrievingTransactionsStatus,
      transactions, params
    } = this.props;

    const transactionDate = params.transactionDate;
    if (!validateTransactionDate(transactionDate)) {
      return <NotFound/>;
    }

    const date = params.transactionDate;
    const transactionsToDisplay = _.chain(transactions)
      // This is the first 7 characters of the date, which is the year
      // and month:
      // 2014-06-10
      // 1234567
      // This is used to match the date in the URL for this route
      .filter(t => t.date.substring(0, 7) === date)
      .sortBy('date')
      .value();

    const isFetchingCategories = retrievingCategoriesStatus === 'PENDING';
    const isFetchingTransactions = retrievingTransactionsStatus === 'PENDING';
    const errorFetchingCategories = retrievingCategoriesStatus === 'FAILURE';
    const errorFetchingTransactions = retrievingTransactionsStatus === 'FAILURE';

    let contents;
    if (isFetchingCategories || isFetchingTransactions) {
      contents = <LoadingResourceList/>;
    } else if (errorFetchingCategories || errorFetchingTransactions) {
      contents = (<ErrorRetrieving
        retry={this.fetchResources}
        resourceName="Transactions"/>);
    } else if (!transactionsToDisplay.length) {
      contents = <EmptyTransactions/>;
    } else {
      contents = <TransactionsList transactions={transactionsToDisplay}/>;
    }

    return (
      <div>
        <Subheader/>
        <DateMenu date={transactionDate}/>
        {contents}
      </div>
    );
  }
});

function mapStateToProps(state) {
  return {
    transactions: state.transactions.transactions,
    retrievingTransactionsStatus: state.transactions.retrievingTransactionsStatus,
    retrievingCategoriesStatus: state.categories.retrievingCategoriesStatus,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    transactionsActions: bindActionCreators(transactionsActionCreators, dispatch),
    categoriesActions: bindActionCreators(categoriesActionCreators, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Content);
