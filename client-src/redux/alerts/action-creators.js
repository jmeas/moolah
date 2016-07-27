import _ from 'lodash';
import actionTypes from './action-types';

// Queues an alert to be displayed
export function pushAlert(alertDescription) {
  return dispatch => {
    const id = _.uniqueId('alert-');
    dispatch({
      type: actionTypes.PUSH_ALERT,
      newAlert: {
        ...alertDescription,
        id
      }
    });
  };
}

export function destroyFirstAlert() {
  return {
    type: actionTypes.DESTROY_FIRST_ALERT
  };
}
