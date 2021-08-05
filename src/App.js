import "./App.css";
import React, { useState } from "react";
import Graph from "react-graph-vis";

import { Button, Modal } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import styles from "./modalstyle.css";

var programData = require("./outputtransformed.json");

var graphnodes = [];
var graphedges = [];

function getNodes() {
  graphnodes = [];
  for (var i = 0; i < programData.length; ++i) {
    for (var key in programData[i]) {
      if (programData[i].hasOwnProperty(key)) {
        var node = {
          id: key.toString(),
          label: key.toString(),
          title: i,
        };
        graphnodes.push(node);
      }

      let myArrSerialized = graphnodes.map((e) => JSON.stringify(e));
      const mySetSerialized = new Set(myArrSerialized);

      const myUniqueArrSerialized = [...mySetSerialized];
      graphnodes = myUniqueArrSerialized.map((e) => JSON.parse(e));
    }
  }
}

function getEdges() {
  for (var i = 0; i < programData.length; i++) {
    for (var key in programData[i]) {
      if (programData[i].hasOwnProperty(key)) {
        for (
          var j = 0;
          j < programData[i][key]["calls_functions"].length;
          j++
        ) {
          graphedges.push({
            from: key,
            to: programData[i][key]["calls_functions"][j],
          });
        }
      }
    }
  }
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
    layout: {
      hierarchical: {
        enabled: true,
        nodeSpacing: 150,
      },
    },
    edges: {
      color: "#000000",
    },
    height: graphHeight,
    autoResize: true,
    interaction: {
      //hover: true,
      selectConnectedEdges: false,
    },
  };

  const events = {
    selectNode: function (event) {
      //event.preventDefault();
      network.selectNodes([event.nodes]);
      let selectedNode = {};
      for (var i = 0; i < graphnodes.length; i++) {
        if (graphnodes[i][Object.keys(graphnodes[i])[0]] === event.nodes[0]) {
          selectedNode = graphnodes[i];
        }
      }
      const functionName = event.nodes;
      const numCallers =
        programData[selectedNode["title"]][
          Object.keys(programData[selectedNode["title"]])[0]
        ]["number_of_callers"];
      const functionBody =
        programData[selectedNode["title"]][
          Object.keys(programData[selectedNode["title"]])[0]
        ]["function_body"];
        console.log(typeof(functionBody));
      const callsFunctions =
        programData[selectedNode["title"]][
          Object.keys(programData[selectedNode["title"]])[0]
        ]["calls_functions"].toString();
      const argumentList =
        programData[selectedNode["title"]][
          Object.keys(programData[selectedNode["title"]])[0]
        ]["argument_list"].toString();
      setFuncName(functionName);
      setNumCallers(numCallers);
      setFuncBody(functionBody);
      setCallsFunctions(callsFunctions !== "" ? callsFunctions : "None");
      setArgumentList(argumentList !== "" ? argumentList : "None");
      showNodePopUp();
    },
    selectEdge: function (event) {
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
      <div id="treeWrapper">
        <Graph
          graph={graph}
          options={options}
          events={events}
          getNetwork={(network) => {
            //  if you want access to vis.js network api you can set the state in a parent component using this property
            setNetwork(network);
          }}
        />

        <Modal
          dialogClassName="fullscreen-modal"
          show={nodePopUp}
          onHide={hideNodePopUp}
          scrollable={true}
        >
          <Modal.Header closeButton>
            <Modal.Title>Function: {funcName}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>Function Name: {funcName}</p>
            <p>Number of Callers: {numCallers}</p>
            <p>Function Body: <div className="msg-wrapper">{funcBody}</div></p>
            <p>Calls Functions: {callsFunctions}</p>
            <p>Argument List: {argumentList}</p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={hideNodePopUp}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
        <Modal
          dialogClassName="fullscreen-modal"
          show={edgePopUp}
          onHide={hideEdgePopUp}
        >
          <Modal.Header closeButton>
            <Modal.Title>
              Edge: {fromNode} to {toNode}
            </Modal.Title>
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
