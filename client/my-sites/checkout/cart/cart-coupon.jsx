/** @format */

/**
 * External dependencies
 */

import React from 'react';
import { isEmpty, trim } from 'lodash';
import { connect } from 'react-redux';
import { localize } from 'i18n-calypso';

/**
 * Internal dependencies
 */
import Button from 'components/button';
import { recordTracksEvent, recordGoogleEvent } from 'state/analytics/actions';
import { applyCoupon, removeCoupon } from 'lib/upgrades/actions';

class CartCoupon extends React.Component {
	static displayName = 'CartCoupon';

	constructor( props ) {
		super( props );
		let coupon = props.cart.coupon,
			cartHadCouponBeforeMount = Boolean( props.cart.coupon );

		this.state = {
			isCouponFormShowing: cartHadCouponBeforeMount,
			hasSubmittedCoupon: cartHadCouponBeforeMount,
			couponInputValue: coupon,
			userChangedCoupon: false,
		};
	}

	componentWillReceiveProps( nextProps ) {
		if ( ! this.state.userChangedCoupon ) {
			this.setState( { couponInputValue: nextProps.cart.coupon } );
		}
	}

	toggleCouponDetails = event => {
		event.preventDefault();

		this.setState( { isCouponFormShowing: ! this.state.isCouponFormShowing } );

		if ( this.state.isCouponFormShowing ) {
			analytics.ga.recordEvent( 'Upgrades', 'Clicked Hide Coupon Code Link' );
		} else {
			analytics.ga.recordEvent( 'Upgrades', 'Clicked Show Coupon Code Link' );
		}
	};

	applyCoupon = event => {
		event.preventDefault();

		analytics.tracks.recordEvent( 'calypso_checkout_coupon_submit', {
			coupon_code: this.state.couponInputValue,
		} );

		this.setState( {
			userChangedCoupon: false,
			hasSubmittedCoupon: true,
		} );
		applyCoupon( this.state.couponInputValue );
	};

	handleCouponInput = event => {
		this.setState( {
			userChangedCoupon: true,
			couponInputValue: event.target.value,
		} );
	};

	getToggleLink = () => {
		if ( this.props.cart.total_cost === 0 ) {
			return null;
		}

		if ( this.state.hasSubmittedCoupon ) {
			return;
		}

		return (
			<a href="" onClick={ this.toggleCouponDetails }>
				{ this.props.translate( 'Have a coupon code?' ) }
			</a>
		);
	};

	getCouponForm = () => {
		if ( ! this.state.isCouponFormShowing ) {
			return null;
		}

		if ( this.state.hasSubmittedCoupon ) {
			return;
		}

		return (
			<form onSubmit={ this.applyCoupon }>
				<input
					type="text"
					placeholder={ this.props.translate( 'Enter Coupon Code', { textOnly: true } ) }
					onChange={ this.handleCouponInput }
					value={ this.state.couponInputValue }
				/>
				<Button type="submit" disabled={ isEmpty( trim( this.state.couponInputValue ) ) }>
					{ this.props.translate( 'Apply' ) }
				</Button>
			</form>
		);
	};

	get isSubmitting() {
		return ! this.props.cart.is_coupon_applied && this.props.cart.coupon ? true : false;
	}

	toggleCouponDetails = event => {
		event.preventDefault();

		this.setState( { isCouponFormShowing: ! this.state.isCouponFormShowing } );

		if ( this.state.isCouponFormShowing ) {
			this.props.recordGoogleEvent( 'Upgrades', 'Clicked Hide Coupon Code Link' );
		} else {
			this.props.recordGoogleEvent( 'Upgrades', 'Clicked Show Coupon Code Link' );
		}
	};

	clearCoupon = event => {
		event.preventDefault();
		event.stopPropagation();
		this.setState(
			{
				couponInputValue: '',
				isCouponFormShowing: false,
			},
			() => {
				this.removeCoupon( event );
			}
		);
	};

	applyCoupon = event => {
		event.preventDefault();

		if ( this.isSubmitting ) {
			return;
		}

		this.props.applyCoupon( this.state.couponInputValue );
	};

	removeCoupon = event => {
		event.preventDefault();

		if ( this.isSubmitting ) {
			return;
		}

		this.props.removeCoupon();
	};

	handleCouponInputChange = event => {
		this.setState( {
			userChangedCoupon: true,
			couponInputValue: event.target.value,
		} );
	};

}

const mapDispatchToProps = dispatch => ( {
	recordGoogleEvent,
	applyCoupon: coupon_code => {
		dispatch( recordTracksEvent( 'calypso_checkout_coupon_submit', { coupon_code } ) );
		applyCoupon( coupon_code );
	},
	removeCoupon: () => {
		dispatch( recordTracksEvent( 'calypso_checkout_coupon_submit', { coupon_code: '' } ) );
		removeCoupon();
	},
} );

export default connect(
	null,
	mapDispatchToProps
)( localize( CartCoupon ) );
