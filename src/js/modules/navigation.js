module.exports = {

	init : function( trigger, nav ) {
		const that = this;
		trigger.addEventListener( 'click', function() {
			that.toggleResponsiveMenu( trigger, nav )
		});
	},

	toggleResponsiveMenu : function( trigger, nav ) {
		if (trigger.classList.contains('is-active')) {
			this.floatingNav.closeNav( trigger, nav );
		} else {
			this.floatingNav.openNav( trigger, nav );
		}
	},

	floatingNav : {
			siteNav 		: document.querySelector('.site-nav'),
			burger 			: document.querySelector('.hamburger'),

			openNav : function( trigger, nav ) {
				trigger.classList.add('is-active');
				nav.classList.add('is-open');
			},

			closeNav : function( trigger, nav ) {
				trigger.classList.remove('is-active');
				nav.classList.remove('is-open');
			}
		}
}