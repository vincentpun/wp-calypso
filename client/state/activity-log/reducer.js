/** @format */
/**
 * Internal dependencies
 */
import { ACTIVITY_LOG_FILTER_SET, ACTIVITY_LOG_FILTER_UPDATE } from 'state/action-types';
import { combineReducers, keyedReducer } from 'state/utils';
import { activationRequesting } from './activation/reducer';
import { restoreProgress, restoreRequest } from './restore/reducer';
import { backupRequest, backupProgress } from './backup/reducer';

export const emptyFilter = {
	page: 1,
};
export const defaultRequestFreshness = 5 * 60 * 1000;

export const filterState = ( state = emptyFilter, { type, filter } ) => {
	switch ( type ) {
		case ACTIVITY_LOG_FILTER_SET:
			return { ...emptyFilter, ...filter };

		case ACTIVITY_LOG_FILTER_UPDATE:
			return { ...state, ...filter };

		default:
			return state;
	}
};

export const requestFreshness = ( state = defaultRequestFreshness, { type } ) => {
	switch ( type ) {
		case ACTIVITY_LOG_FILTER_SET:
			return 100;

		case ACTIVITY_LOG_FILTER_UPDATE:
			return defaultRequestFreshness;

		default:
			return state;
	}
};

export default combineReducers( {
	activationRequesting,
	filter: keyedReducer( 'siteId', filterState ),
	requestFreshness: keyedReducer( 'siteId', requestFreshness ),
	restoreProgress,
	restoreRequest,
	backupProgress,
	backupRequest,
} );
