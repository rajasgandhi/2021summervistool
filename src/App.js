import './App.css';
import React, { useState } from 'react';
import Graph from 'react-graph-vis';
import NodeInfo from './NodeInfo';
import EdgeInfo from './EdgeInfo';

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
	const [network, setNetwork] = useState(null);
	const [nodePopUp, setNodePopUp] = useState(false);
	const [edgePopUp, setEdgePopUp] = useState(false);
	const [funcName, setFuncName] = useState('');
	const [numCallers, setNumCallers] = useState('');
	const [funcBody, setFuncBody] = useState('');
	const [callsFunctions, setCallsFunctions] = useState('');
	const [fromNode, setFromNode] = useState('');
	const [toNode, setToNode] = useState('');

	const graphHeight = Math.round(parseInt(window.innerHeight)) + 'px';

	const graph = {
		nodes: graphnodes,
		edges: graphedges,
	};

	const options = {
		layout: {
			
		},
		edges: {
			color: '#000000',
		},
		height: graphHeight,
		autoResize: true,
		interaction: {
			hover: true,
		},
	};

	const events = {
		selectNode: function (event) {
			//console.log(event);
			setFuncName(event.nodes);
			setNumCallers(programData[event.nodes]['number_of_callers']);
			setFuncBody(programData[event.nodes]['function_body']);
			setCallsFunctions(programData[event.nodes]['calls_functions'].toString());
			setNodePopUp(true);
		},
		selectEdge: function (event) {
			//console.log(event);
			const connectedNodes = network.getConnectedNodes(event.edges);
			setFromNode(connectedNodes[0].toString());
			setToNode(connectedNodes[1].toString());
			setEdgePopUp(true);
		},
	};

	const toggleNodeVisible = () => {
		setNodePopUp(!nodePopUp);
	};

	const toggleEdgeVisible = () => {
		setEdgePopUp(!edgePopUp);
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
	const toggleFromNode = () => {
		setFromNode('');
	};
	const toggleToNode = () => {
		setToNode('');
	};

	return (
		<div className="App">
			<div id="treeWrapper" style={{ height: '100%', width: '100%' }}>
				<Graph
					graph={graph}
					options={options}
					events={events}
					getNetwork={(network) => {
						//  if you want access to vis.js network api you can set the state in a parent component using this property
						setNetwork(network);
					}}
				/>
				{nodePopUp ? (
					<NodeInfo
						funcName={funcName}
						numCallers={numCallers}
						funcBody={funcBody}
						callsFunctions={callsFunctions}
						visible={nodePopUp}
						toggleVisible={toggleNodeVisible}
						toggleFuncName={toggleFuncName}
						toggleNumCallers={toggleNumCallers}
						toggleFuncBody={toggleFuncBody}
						toggleCallsFunctions={toggleCallsFunctions}
					/>
				) : null}
				{edgePopUp ? (
					<EdgeInfo
						visible={edgePopUp}
						fromNode={fromNode}
						toNode={toNode}
						toggleFromNode={toggleFromNode}
						toggleToNode={toggleToNode}
						toggleVisible={toggleEdgeVisible}
					/>
				) : null}
			</div>
		</div>
	);
}

export default App;
