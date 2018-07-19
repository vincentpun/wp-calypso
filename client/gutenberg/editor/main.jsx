/** @format */
/**
 * External dependencies
 */
import React, { Component } from 'react';
import { registerStore, dispatch } from '@wordpress/data';

const registerWordPressDataStore = () => {
	// Just using some example code from https://github.com/WordPress/gutenberg/tree/master/packages/data
	const DEFAULT_STATE = {
		prices: {},
		discountPercent: 0,
	};

	registerStore( 'my-shop', {
		reducer( state = DEFAULT_STATE, action ) {
			switch ( action.type ) {
				case 'SET_PRICE':
					return {
						...state,
						prices: {
							...state.prices,
							[ action.item ]: action.price,
						},
					};

				case 'START_SALE':
					return {
						...state,
						discountPercent: action.discountPercent,
					};
			}

			return state;
		},

		actions: {
			setPrice( item, price ) {
				return {
					type: 'SET_PRICE',
					item,
					price,
				};
			},
			startSale( discountPercent ) {
				return {
					type: 'START_SALE',
					discountPercent,
				};
			},
		},

		selectors: {
			getPrice( state, item ) {
				const { prices, discountPercent } = state;
				const price = prices[ item ];

				return price * ( 1 - 0.01 * discountPercent );
			},
		},

		resolvers: {
			async getPrice( state, item ) {
				const price = 1;
				dispatch( 'my-shop' ).setPrice( item, price );
			},
		},
	} );
};

class GutenbergEditor extends Component {
	componentDidMount() {
		registerWordPressDataStore();
	}

	render() {
		return <div className="editor">Hello, Gutenberg!</div>;
	}
}

export default GutenbergEditor;
