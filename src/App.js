import "./App.css";
import React, { useState } from "react";
import Graph from "react-graph-vis";

import { Button, Modal } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

var programData = require("./outputtransformed.json");

var graphnodes = [];
var graphedges = [];

function getNodes() {
  graphnodes = [];
  for (var key in programData) {
    if (programData.hasOwnProperty(key)) {
      var node = {
        id: key,
        label: key,
        title: "Function name:" + key,
      };
      graphnodes.push(node);
    }
  }
  let myArrSerialized = graphnodes.map((e) => JSON.stringify(e));
  const mySetSerialized = new Set(myArrSerialized);

  const myUniqueArrSerialized = [...mySetSerialized];
  graphnodes = myUniqueArrSerialized.map((e) => JSON.parse(e));

  //console.log(graphnodes);
}

function getEdges() {
  for (var key in programData) {
    if (programData.hasOwnProperty(key)) {
      for (var i = 0; i < programData[key]["calls_functions"].length; i++) {
        graphedges.push({
          from: key,
          to: programData[key]["calls_functions"][i],
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
  const [funcName, setFuncName] = useState("");
  const [numCallers, setNumCallers] = useState("");
  const [funcBody, setFuncBody] = useState("");
  const [callsFunctions, setCallsFunctions] = useState("");
  const [argumentList, setArgumentList] = useState("");
  const [fromNode, setFromNode] = useState("");
  const [toNode, setToNode] = useState("");

  const graphHeight = Math.round(parseInt(window.innerHeight)) + "px";

  const graph = {
    nodes: graphnodes,
    edges: graphedges,
  };

  const options = {
    layout: {},
    edges: {
      color: "#000000",
    },
    height: graphHeight,
    autoResize: true,
    interaction: {
      //hover: true,
    },
  };

  const events = {
    selectNode: function (event) {
      //console.log(event);
      setFuncName(event.nodes);
      setNumCallers(programData[event.nodes]["number_of_callers"]);
      setFuncBody(programData[event.nodes]["function_body"]);
      setCallsFunctions(programData[event.nodes]["calls_functions"].toString());
      setArgumentList(programData[event.nodes]["argument_list"].toString());
      showNodePopUp();
    },
    selectEdge: function (event) {
      //console.log(event);
      const connectedNodes = network.getConnectedNodes(event.edges);
      if (connectedNodes[0] != null && connectedNodes[1] != null) {
        setFromNode(connectedNodes[0].toString());
        setToNode(connectedNodes[1].toString());
      }
      showEdgePopUp();
    },
  };

  const showNodePopUp = () => {
    setNodePopUp(true);
  };

  const hideNodePopUp = () => {
    setNodePopUp(false);
  };

  const showEdgePopUp = () => {
    setEdgePopUp(true);
  };

  const hideEdgePopUp = () => {
    setEdgePopUp(false);
  };

  return (
    <div className="App">
      <div id="treeWrapper" style={{ height: "100%", width: "100%" }}>
        <Graph
          graph={graph}
          options={options}
          events={events}
          getNetwork={(network) => {
            //  if you want access to vis.js network api you can set the state in a parent component using this property
            setNetwork(network);
          }}
        />

        <Modal show={nodePopUp} onHide={hideNodePopUp}>
          <Modal.Header closeButton>
            <Modal.Title>Modal heading</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>Function Name: {funcName}</p>
            <p>Number of Callers: {numCallers}</p>
            <p>Function Body: {funcBody}</p>
            <p>Calls Functions: {callsFunctions}</p>
            <p>Argument List: {argumentList}</p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={hideNodePopUp}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
        <Modal show={edgePopUp} onHide={hideEdgePopUp}>
          <Modal.Header closeButton>
            <Modal.Title>Modal heading</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>From node: {fromNode}</p>
            <p>To node: {toNode}</p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={hideEdgePopUp}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
}

export default App;
