/** @format */

/**
 * External dependencies
 */
import { toPairs, omit, isArray, isEqual } from 'lodash';

export const filterStateToApiQuery = filter =>
	Object.assign(
		{},
		filter.action && { action: filter.action },
		filter.after && { after: filter.after },
		filter.before && { before: filter.before },
		filter.by && { by: filter.by },
		filter.dateRange && { date_range: filter.dateRange },
		filter.group && filter.group.includes && { group: filter.group.includes },
		filter.group && filter.group.excludes && { not_group: filter.group.excludes },
		filter.name && { name: filter.name },
		{ number: 1000 }
	);

export const filterStateToQuery = filter =>
	Object.assign(
		{},
		filter.action && { action: filter.action.join( ',' ) },
		filter.after && { after: filter.after },
		filter.before && { before: filter.before },
		filter.by && { by: filter.by },
		filter.dateRange && { date_range: filter.dateRange },
		filter.group && filter.group.includes && { group: filter.group.includes.join( ',' ) },
		filter.group && filter.group.excludes && { not_group: filter.group.excludes( ',' ) },
		filter.name && { name: filter.name.join( ',' ) },
		filter.page > 1 && { page: filter.page }
	);

export const queryToFilterState = query => {
	const hasGroup = query.group || query.not_group;
	const {
		action,
		after,
		before,
		by,
		date_range: dateRange,
		group,
		name,
		not_group: notGroup,
		page,
	} = query;
	// helper to fold in new properties conditionally
	const p = ( ...o ) => Object.assign( {}, ...o );

	return p(
		action && { action: decodeURI( action ).split( ',' ) },
		after && { after },
		before && { before },
		by && { by }, // and a sweet one at that
		dateRange && { dateRange },
		name && { name: decodeURI( name ).split( ',' ) },
		hasGroup && {
			group: p(
				group && { includes: decodeURI( group ).split( ',' ) },
				notGroup && { excludes: decodeURI( notGroup ).split( ',' ) }
			),
		},
		page && page > 0 && { page }
	);
};

export const filterStateToTokens = filter => {
	const query = filterStateToApiQuery( filter ),
		tokens = [];
	toPairs( omit( query, 'number' ) ).forEach( pair => {
		isArray( pair[ 1 ] )
			? pair[ 1 ].forEach( value => {
					tokens.push( pair[ 0 ] + ':' + value );
			  } )
			: tokens.push( pair[ 0 ] + ':' + pair[ 1 ] );
	} );
	return tokens;
};

export const tokensToFilterState = tokens => {
	const query = {};
	tokens.forEach( token => {
		const pair = token.split( ':' );
		if ( pair[ 1 ] ) {
			query[ pair[ 0 ] ]
				? query[ pair[ 0 ] ].push( pair[ 1 ] )
				: ( query[ pair[ 0 ] ] = [ pair[ 1 ] ] );
		}
	} );
	return queryToFilterState( query );
};

export const logsNeedRefresh = ( query, state ) =>
	! isEqual( omit( query, 'page' ), omit( state, 'page' ) );
