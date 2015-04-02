/*
    This file is part of Euler's Graph Editor.

    Euler's Graph Editor is free software: you can redistribute it and/or 
    modify it under the terms of the GNU General Public License as published 
    by the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    Foobar is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with Foobar.  If not, see <http://www.gnu.org/licenses/>.
*/

/**********************************************
 *  Editor Actions
 **********************************************/

/**
 * Links all nodes.
 */
function linkAll() {
  info("All nodes linked.")
  forEach(nodes, function(n) {
    forEach(nodes, function(m) {
      if (!linkExists(n, m) && n !== m) {
        addLink(n, m);
      }
    });
  });
  update();
};

/**
 * Unlinks all nodes.
 */
function unlinkAll() {
  info("All nodes unlinked.")
  links = [];
  update();
};

/**********************************************
 *  Editor Modes
 **********************************************/

modes = {
  "linking"  : false,
  "deleting" : false,
  "dragging" : false,
}

keyCodeModeMap = {
  17: "linking",
  16: "deleting",
  18: "dragging"
}

modeCallback = {
  "linking"  : function () {},
  "deleting" : deleteNode,
  "dragging" : function () {},
}

modeSetup = {
  "linking" : function () {
    node.call(linkableBehavior);
  },
  "deleting" : function () {},
  "dragging" : function () {
    node.call(force.drag);
  },
}

/**
 * Unsets each individual node behavior.
 */
function unsetNodeBehavior() {
  // TODO: Build a dummy behavi
  node.call(linkableBehavior);
}

modeTearDown = {
  "linking" : unsetNodeBehavior,
  "deleting" : function () {},
  "dragging" : unsetNodeBehavior,
}

/**
 * Determines if a mode is active.
 * @returns boolean True if a mode is active, false otherwise.
 */
function aModeIsActive() {
  return keys(cloneDiscarding(modes, function (k, v) { return !v })).length > 0;
}

/**
 * Retrieves the current mode name.
 * @returns String The current mode name.
 */
function getActiveMode() {
  return keys(cloneDiscarding(modes, function (k, v) { return !v }))[0];
}



/**********************************************
 *  Editor handlers
 **********************************************/

/**
 * Disables a mode given a keyup event and it's keycode.
 */
function keyup() {               
  if (d3.event.keyCode in keyCodeModeMap) {
    mode = keyCodeModeMap[d3.event.keyCode];
    if (modes[mode]) {
      modes[mode] = false;
      modeTearDown[mode]();
      info("'" + mode + "' mode disabled");
    }
  }        
}

/**
 * Enables a mode given a keydown event and it's keycode.
 */
function keydown() {
  event = window.event;

  if (d3.event.keyCode in keyCodeModeMap && !aModeIsActive()) {
    mode = keyCodeModeMap[d3.event.keyCode];
    modes[mode] = true;
    modeSetup[mode]();
    info("'" + mode + "' mode enabled");
  }
}

/**
 * Handles click. Custom click adds a node. If a mode
 * is active a mode callback is launched instead.
 */
function mousedown() {  
  if (aModeIsActive()) {
    modeCallback[getActiveMode()]();
  } else {        
    var point = d3.mouse(this);
    addNode({x: point[0], y: point[1]});
  }
  update();
}            




/**********************************************
 *  Behaviors
 **********************************************/

linkableBehavior = d3.behavior.drag()
                         .on("dragstart", beginLinking)
                         .on("drag", function (d) {
                           dragStarted = null;
                         })
                         .on("dragend", endLinking);

/**
 * Initiates the linking process.
 * @param Node node the source node of the link.
 */
function beginLinking(node) {    
  if (modes["linking"]) {
    info("Linking begins.");          
    dragStarted = true;    
    d3.event.sourceEvent.stopPropagation();
  }
}

/**
 * Ends the linking process creating the link on success.
 * @param Node fromNode The source node of the link.
 */
function endLinking(fromNode) {  
  var toNode = nodes[d3.event.sourceEvent.target.id]
  if (isDefined(toNode) && modes["linking"] && fromNode != toNode) {
    addLink(fromNode, toNode);
    info("Link created from node " + reprNode(fromNode) + " to node " + 
         reprNode(toNode) + ".");
    update();
    info("Linking ends.");
  }
}



/**********************************************
 *  Node and link functions
 **********************************************/

/**
 * Deletes a node given a click event.
 */
function deleteNode() {
  var nodeElement = d3.event.target;
  if (node.attr("class") == "node") {
    deleteLink(nodes[nodeElement.id]);
    nodes.splice(nodeElement.id, 1);
    update();
  }        
}

/**
 * Adds a given node to the editor.
 * @param Node node A node to add to the editor.
 */
function addNode(node) {
  if (!aModeIsActive()) {
    nodes.push(node);
  }
}

/**
 * Adds a link between two nodes in the editor.
 * @param Node fromNode Source node of the link.
 * @param Node toNode   Target node of the link.
 */
function addLink(fromNode, toNode) {
   links.push({source: fromNode, target: toNode});
}

/**
 * Determines if a given link exists.
 * @param   Node fromNode Source node of the link.
 * @param   Node toNode   Target node of the link.
 * @returns boolean True if link exists, false otherwise.
 */
function linkExists(fromNode, toNode) {
   return filter(links, function(aLink) {
     return !(link.source == fromNode && link.target == toNode);
   }).length > 0
}

/**
 * Deletes all link which has the given node as source or target.
 * @param   Node node
 */
function deleteLink(node) {      
  links = filter(links, function(link) {
    return (link.source == node || link.target == node);
  });
}

/**
 * Sets directed edges mode.
 */
function makeDirectedGraph() {
  directedModeAction.style("display", "none");
  undirectedModeAction.style("display", "inline");
  link.attr("marker-end", "url(#arrowMarker)");
  edgeMode = "directed";
}

/**
 * Sets undirected edges mode.
 */
function makeUndirectedGraph() {  
  undirectedModeAction.style("display", "none");
  directedModeAction.style("display", "inline");
  link.attr("marker-end", null);
  edgeMode = "undirected";
}


/**********************************************
 *  Tick & Update
 **********************************************/

/**
 * Render nodes and links positions.
 */
function tick() {
  link.attr("x1", function(d) { return d.source.x; })
      .attr("y1", function(d) { return d.source.y; })
      .attr("x2", function(d) { return d.target.x; })
      .attr("y2", function(d) { return d.target.y; });

  node.attr("cx", function(d) { return d.x; })
      .attr("cy", function(d) { return d.y; })
      .attr("id", function(d, i) { return i; });
}


/**
 * Updates editor.
 */
function update() {
  link = link.data(links);

  if (edgeMode == "undirected") {
    link.enter().insert("line", ".node")
        .attr("class", "link");
  } else {
    link.enter().insert("line", ".node")
        .attr("class", "link")
        .attr("marker-end", "url(#arrowMarker)");
  }

  link.exit().remove();

  node = node.data(nodes);

  node.enter().insert("circle")
      .attr("class", "node")
      .attr("r", 7);

  node.exit().remove();

  force.start();
}



/**********************************************
 *  Printing Functions
 **********************************************/

/**
 * Generates a representation for a node.
 * @param   Node node A node to be represented.
 * @returns String The generated representation string.
 */
function reprNode(node) {
  return "(" + node.x.toFixed(2) + ", " + node.y.toFixed(2) + ")";
}

/**
 * Generates a representation for a link.
 * @param   Link link A link to be represented.
 * @returns String The generated representation string.
 */
function reprLink(link) {
  return reprNode(link.source) + " -- " + reprNode(link.target);
}



/**********************************************
 *  Logging
 **********************************************/

/**
 * Writes an information log into the console.
 * @param String msg A message to be logged.
 */
function info(msg) {
  console.log("[INFO] " + msg);
}



/**********************************************
 *  Initialization
 **********************************************/

var width = 960,
    height = 500;

var markerWidth = 5,
    markerHeight = 5;
    

var fill = d3.scale.category20();

var edgeMode = "undirected";

var force = d3.layout.force()
    .size([width, height])
    .nodes([{}]) // initialize with a single node
    .linkDistance(50)
    .charge(-60)
    .on("tick", tick);

var svg = d3.select("#eulers-graph-editor").append("svg")
    .attr("width", width)
    .attr("height", height)
    .on("mousedown", mousedown);

svg.append("svg:defs").append("svg:marker")
    .attr("id", "arrowMarker")
    .attr("viewBox", "0 -5 10 10")
    .attr("refX", 16)
    .attr("refY", 0)
    .attr("markerWidth", markerWidth)
    .attr("markerHeight", markerHeight)
    .attr("orient", "auto")
    .append("svg:path")
    .attr("d", "M0,-5L10,0L0,5")
    .attr("class", "arrow"); 

var actions = d3.select("#eulers-graph-editor").append("div")
  .attr("class", "actions");

var linkAllAction = actions.append("a")
  .attr("class", "button")
  .on("mousedown", linkAll)
  .text("Link all");

var unlinkAllAction = actions.append("a")
  .attr("class", "button")
  .on("mousedown", unlinkAll)
  .text("Unlink all");

var directedModeAction = actions.append("a")
  .attr("class", "button")
  .on("mousedown", makeDirectedGraph)
  .text("Make Directed Graph");

var undirectedModeAction = actions.append("a")
  .attr("class", "button")
  .style("display", "none")
  .on("mousedown", makeUndirectedGraph)
  .text("Make Undirected Graph");



d3.select("body").on("keydown", keydown)
                 .on("keyup", keyup);

svg.append("rect")
    .attr("width", width)
    .attr("height", height);

var nodes = force.nodes(),
    links = force.links(),
    node = svg.selectAll(".node"),
    link = svg.selectAll(".link");

update();