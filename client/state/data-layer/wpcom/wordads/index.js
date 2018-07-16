/** @format */

/**
 * Internal dependencies
 */

import { mergeHandlers } from 'state/action-watchers/utils';
import earnings from './earnings';
import stats from './stats';
import status from './status';

export default mergeHandlers( earnings, stats, status );
