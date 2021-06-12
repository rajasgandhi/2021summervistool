import React from 'react';

import Modal from 'react-modal';

export default function NodeInfo({
	funcName,
	numCallers,
	funcBody,
	callsFunctions,
	visible,
	toggleVisible,
	toggleFuncName,
	toggleNumCallers,
	toggleFuncBody,
	toggleCallsFunctions,
}) {
	return (
		<div>
			<Modal ariaHideApp={false} isOpen={visible}>
				<button onClick={() => {toggleVisible(); toggleFuncName(); toggleNumCallers(); toggleFuncBody(); toggleCallsFunctions(); }}>x</button>
				<p>Function Name: {funcName}</p>
				<p>Number of Callers: {numCallers}</p>
				<p>Function Body: {funcBody}</p>
				<p>Calls Functions: {callsFunctions}</p>
			</Modal>
		</div>
	);
}
