// @flow

import type { Web3Receipt } from '@polymathnetwork/js/types';

import * as a from './actions';
import type { Action } from './actions';

export type TxState = {
  titles: Array<string>,
  successTitle: ?string,
  continueCode: ?() => void,
  continueRoute: ?string,
  continueLabel: ?string,
  isNoEmail: boolean,
  hashes: Array<string>,
  receipts: Array<Web3Receipt>,
  total: ?number,
  current: ?number,
  isFinished: ?boolean,
  error: ?Error,
  headingOverride: ?string,
};

/**
 * NOTE @RafaelVidaurre:
 * WARNING This state is being used to manage transactions' state at an app
 * level, not just for this component. Also, if you are trying to figure out
 * where most of the properties of the state are being set in this reducer:
 * They are being spread from the actions root properties (so yeah, `type`)
 * is the state too.
 *
 * I've commented the state properties with what they are used for
 *
 * FIXME: Leaving a fixme note here to not forget to rewrite this
 */
const defaultState = {
  // This has two roles:
  // 1. Determine how many transactions are involved in a multi-step transaction
  //    Though I'm not sure more than 2 are supported.
  // 2. Determine how to name each transaction
  titles: [],
  // Replaces modal header when transaction is completed
  successTitle: null,
  // This is actual javascript code, it is a function that will execute
  // the second transaction.
  continueCode: null,
  // If truthy, it will push this route to the history, presumably redirecting
  // somewhere
  continueRoute: null,
  // Sets the "Continue" button's caption in the modal
  continueLabel: null,
  // Boolean to determine wether NOT to show the "We've sent an email" message
  isNoEmail: false,
  // Hashes of the transactions involved
  hashes: [],
  // Saves web3 receipts, apparently also used to keep track of how much of
  // the process is done
  receipts: [],
  // Value derived from titles.length, tracks amount of transactions involved
  total: null,
  // Determines what transaction we are currently waiting on
  current: null,
  // Wether the whole process is finished
  isFinished: null,
  // Carries error object if an error was thrown in the process
  error: null,
  // Will override the heading title if set, even if successTitle also exists.
  headingOverride: null,
};

export default (state: TxState = defaultState, action: Action) => {
  switch (action.type) {
    case a.START:
      return {
        ...defaultState,
        ...action,
        current: 0,
        total: action.titles.length,
      };
    case a.HASH:
      return {
        ...state,
        hashes: state.hashes.concat(action.hash),
      };
    case a.END:
      const receipts = state.receipts.concat(action.receipt);
      const current = receipts.length;
      let isFinished = false; // $FlowFixMe
      if (current === state.total) {
        isFinished = true;
      }
      return {
        ...state,
        current: receipts.length,
        receipts,
        isFinished,
      };
    case a.FAILED:
      return {
        ...state,
        error: action.error,
      };
    case a.CONTINUE:
      return {
        ...state,
        total: null,
      };
    default:
      return state;
  }
};
