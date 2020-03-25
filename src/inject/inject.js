chrome.extension.sendMessage( {}, function() {
	// We're going to be monitoring the body tag.
	const bodyNode = document.getElementsByTagName( 'body' )[0];

	// Death to the tp-modal!
	function killModal() {
		// Remove modal elements.
		const classesToKill = [ 'tp-modal', 'tp-backdrop' ];

		for ( let deadClass of classesToKill ) {
			const deadNode = document.getElementsByClassName( deadClass );

			if ( deadNode && deadNode[0] ) {
				deadNode[0].parentNode.removeChild( deadNode[0] );
			}
		}

		// Remove modal class from body.
		bodyNode.className = bodyNode.className.replace( 'tp-modal-open', '' );

		// Restore scrolling to body.
		bodyNode.style.overflowY = 'unset';
	}

	// Mutation observer - see the modal class? Kill it.
	function watchForModalClass( mutations ) {
		for ( let mutation of mutations ) {
			if (
				'attributes' === mutation.type &&
				'class' === mutation.attributeName &&
				bodyNode.className.includes( 'tp-modal-open' )
			) {
				return killModal();
			}
		}
	}

	// Wait for the page to be ready.
	var readyStateCheckInterval = setInterval( function() {
		if (
			'interactive' === document.readyState ||
			'complete' === document.readyState
		) {
			clearInterval( readyStateCheckInterval );

			// Maybe the modal is already present?
			if ( bodyNode.className.includes( 'tp-modal-open' ) ) {
				return killModal();
			}

			// Watch for changes to the body class.
			const bodyObserver = new MutationObserver( watchForModalClass );
			bodyObserver.observe( bodyNode, { attributes: true } );

			// Clean up observer before the page unloads.
			window.addEventListener( 'beforeunload', function() {
				bodyObserver.disconnect();
			} );
		}
	}, 10 );
} );
