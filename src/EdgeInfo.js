import React from 'react';

import Modal from 'react-modal';

export default function EdgeInfo({
    visible,
	fromNode,
	toNode,
	toggleFromNode,
	toggleToNode,
    toggleVisible
}) {
	return (
		<div>
			<Modal ariaHideApp={false} isOpen={visible}>
				<button onClick={() => {toggleVisible(); toggleFromNode(); toggleToNode();}}>x</button>
				<p>From node: {fromNode}</p>
				<p>To node: {toNode}</p>
			</Modal>
		</div>
	);
}
