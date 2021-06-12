import './App.css';
import React, { useState } from 'react';
import Graph from 'react-graph-vis';
import NodeInfo from './NodeInfo';

var programData = require('./program.json');

var graphnodes = [];
var graphedges = [];

function getNodes() {
	for (var key in programData) {
		if (programData.hasOwnProperty(key)) {
			var node = {
				id: key,
				label: key,
				title: 'Function name:' + key,
			};
			graphnodes.push(node);
		}
	}
	let myArrSerialized = graphnodes.map((e) => JSON.stringify(e));
	const mySetSerialized = new Set(myArrSerialized);

	const myUniqueArrSerialized = [...mySetSerialized];
	const myUniqueArr = myUniqueArrSerialized.map((e) => JSON.parse(e));
	graphnodes = myUniqueArr;
	//console.log(graphnodes);
}

function getEdges() {
	for (var key in programData) {
		if (programData.hasOwnProperty(key)) {
			for (var i = 0; i < programData[key]['calls_functions'].length; i++) {
				graphedges.push({
					from: key,
					to: programData[key]['calls_functions'][i],
				});
			}
		}
	}
	//console.log(graphedges);
}

function App() {
	getNodes();
	getEdges();
	const [popUpVisible, setPopUpVisible] = useState(false);
	const [funcName, setFuncName] = useState('');
	const [numCallers, setNumCallers] = useState('');
	const [funcBody, setFuncBody] = useState('');
	const [callsFunctions, setCallsFunctions] = useState('');

	const graph = {
		nodes: graphnodes,
		edges: graphedges,
	};

	const options = {
		layout: {
			//hierarchical: true,
		},
		edges: {
			color: '#000000',
		},
		nodes: {
			//shape: "triangle"
		},
		height: '1000',
		autoResize: true,
		physics: true,
		interaction: {
			hover: true,
		},
	};

	const events = {
		select: function (event) {
			//console.log(selectedNode);
			setPopUpVisible(true);
			setFuncName(event.nodes);
			setNumCallers(programData[event.nodes]['number_of_callers']);
			setFuncBody(programData[event.nodes]['function_body']);
			setCallsFunctions(programData[event.nodes]['calls_functions'].toString());
		},
	};

	const toggleVisible = () => {
		setPopUpVisible(!popUpVisible);
	};

	const toggleFuncName = () => {
		setFuncName('');
	};
	const toggleNumCallers = () => {
		setNumCallers('');
	};
	const toggleFuncBody = () => {
		setFuncBody('');
	};
	const toggleCallsFunctions = () => {
		setCallsFunctions('');
	};

	return (
		<div className="App">
			<div id="treeWrapper">
				<Graph
					graph={graph}
					options={options}
					events={events}
					getNetwork={(network) => {
						//  if you want access to vis.js network api you can set the state in a parent component using this property
					}}
				/>
				{popUpVisible ? (
					<NodeInfo
						funcName={funcName}
						numCallers={numCallers}
						funcBody={funcBody}
						callsFunctions={callsFunctions}
						visible={popUpVisible}
						toggleVisible={toggleVisible}
						toggleFuncName={toggleFuncName}
						toggleNumCallers={toggleNumCallers}
						toggleFuncBody={toggleFuncBody}
						toggleCallsFunctions={toggleCallsFunctions}
					/>
				) : null}
			</div>
		</div>
	);
}

export default App;
