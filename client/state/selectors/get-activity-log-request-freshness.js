/** @format */
/**
 * Internal dependencies
 */
import { defaultRequestFreshness } from 'state/activity-log/reducer';

export const getActivityLogRequestFreshness = ( state, siteId ) => {
	try {
		return state.activityLog.requestFreshness[ siteId ] || defaultRequestFreshness;
	} catch ( e ) {
		return defaultRequestFreshness;
	}
};

export default getActivityLogRequestFreshness;
