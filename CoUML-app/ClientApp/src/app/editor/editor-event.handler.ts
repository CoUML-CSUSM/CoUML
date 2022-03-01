import { Injectable } from "@angular/core";
import { AbstractClass, ActionType, ChangeRecord, Class, Dimension, Enumeration, Interface, PropertyType, Relationship, RelationshipType } from "src/models/DiagramModel";
import { EditorComponent } from "./editor.component";

	const _listenerCatalog: Map<mxEvent, Function> = new Map();
		_listenerCatalog.set(mxEvent.LABEL_CHANGED, labelChanged);
		_listenerCatalog.set(mxEvent.CELLS_ADDED, cellsAdded);
		// _listenerCatalog.set(mxEvent.ADD_CELLS, addCells);
		_listenerCatalog.set(mxEvent.START_EDITING, startEditing);
		_listenerCatalog.set(mxEvent.CELL_CONNECTED, cellConnected);
		_listenerCatalog.set(mxEvent.EDITING_STOPPED, editingStopped);
		_listenerCatalog.set(mxEvent.CELLS_MOVED, cellsMoved);
		_listenerCatalog.set(mxEvent.CLICK, click);
		_listenerCatalog.set(mxEvent.CONNECT, connect);
		_listenerCatalog.set(mxEvent.START, start);
		_listenerCatalog.set(mxEvent.SELECT, select);

	export function addListeners(events: mxEvent[], graph: mxGraph, editorComponent: EditorComponent)
	{
		events.forEach(event =>{
			_listenerCatalog.get(event).call(null, graph, editorComponent)
		});
	}

	const _itemCatalog: Map<any, string > = new Map();
	//iconCatalog.set(prototype, wwwroot/ <<path>>);
	_itemCatalog.set( Interface, 'editors/images/uml/Interface.png', );
	_itemCatalog.set( AbstractClass, 'editors/images/uml/Abstract.png');
	_itemCatalog.set( Class, 'editors/images/uml/Class.png');
	_itemCatalog.set( Enumeration, 'editors/images/uml/Enumeration.png');

	export function addToolbarItems(items: any[], editorComponent: EditorComponent)
	{

		items.forEach( item =>{
			dragDrop(item, _itemCatalog.get(item), editorComponent);
		});
			
	}
	
	function dragDrop(prototype, image:  string, editorComponent: EditorComponent)
	{
		// Function that is executed when the image is dropped on
		// the graph. The cell argument points to the cell under
		// the mousepointer if there is one.
		// floor is used to keep the components to snap to the grid
		var drop = function(graph, evt, cell, x, y)
		{
			graph.stopEditing(false);

			let component = new prototype("untitled"); //creates new compnent object of approrate type
			component.dimension.x =   Math.floor(x / 10) * 10;
			component.dimension.y =   Math.floor(y / 10) * 10;

			console.log(component);
			
			let vertex = graph.insertVertex(
				graph.getDefaultParent(),
				component.id, 
				component.name, 
				component.dimension.x, 
				component.dimension.y, 
				component.dimension.width, 
				component.dimension.height,
				component.constructor.name
			);				
			graph.setSelectionCell(vertex);

			editorComponent.stageChange(new ChangeRecord(
				null,
				PropertyType.Elements,
				ActionType.Insert,
				component
			));

		}
		
		// Creates the image which is used as the drag icon (preview)
		var img = editorComponent.toolbar.addMode("Drag", image, function(evt, cell)
		{
			var pt = editorComponent.graph.getPointForEvent(evt, true);
			drop(editorComponent.graph, evt, cell, pt.x, pt.y);
		});
		
		mxUtils.makeDraggable(img, editorComponent.graph, drop);
		
		return img;
	}

	function labelChanged(graph: mxGraph, editorComponent: EditorComponent){
		graph.addListener(mxEvent.LABEL_CHANGED,
			// on change label event 
			function(eventSource, eventObject){
				console.log('%c%s', f_alert, "LABEL_CHANGED");
				let affectedCells = eventObject.getProperties();

				editorComponent.stageChange( new ChangeRecord(
					[affectedCells.cell.id],
					PropertyType.Name, 
					ActionType.Change,
					affectedCells.value
				));
		});
	}

	function cellsMoved(graph: mxGraph, editorComponent: EditorComponent){
		graph.addListener(mxEvent.CELLS_MOVED,
			// on cell move event
			function(eventSource, eventObject){
				let affectedCells = eventObject.getProperties();
				console.log('%c%s', f_alert, "CELLS_MOVED");

				console.log(affectedCells);

				let ids = [];
				affectedCells.cells.forEach(cell=> {
					console.log(`cell.id = ${cell.id}`);
					ids.push(cell.id)
				});

				console.log(affectedCells)

				editorComponent.stageChange(new ChangeRecord(
					ids,
					PropertyType.Dimension,
					ActionType.Shift,
					{ // new absolute location
						x: affectedCells.cells[0]?.geometry.x,
						y: affectedCells.cells[0]?.geometry.y,
					}
				));
			});

	}

	function editingStopped(graph: mxGraph, editorComponent: EditorComponent){
		graph.addListener(mxEvent.EDITING_STOPPED,
			//
			function(eventSource, eventObject){
				let affectedCells = eventObject.getProperties();
				console.log('%c%s', f_alert, "EDITING_STOPPED");
				console.log(affectedCells);
			});
	}

	function cellConnected(graph: mxGraph, editorComponent: EditorComponent){
		graph.addListener(mxEvent.CELL_CONNECTED, 
			//event when  edge is connected or disconeccted from a cell
			function(eventSource, eventObject){
				let affectedEdge = eventObject.getProperties();
				
				
				console.log('%c%s', f_alert, "CELL_CONNECTED");
				console.log(affectedEdge);
				console.log(`edge: ${affectedEdge.edge.id}`);
				console.log(`source(from): ${affectedEdge.edge.source?.id}`);
				console.log(`target(to): ${affectedEdge.edge.target?.id}`);

				if( valid(affectedEdge.edge.id)){
					//disconnect action --> previous
					//connect action --> terminal
					let isConnectioning = affectedEdge.terminal? true: false;
					let isDisconnectioning = affectedEdge.previous? true: false;
					let isMovingTerminal = !affectedEdge.terminal && !affectedEdge.previous

					let affectedCellId = isConnectioning? affectedEdge.terminal?.id: affectedEdge.previous?.id ; 	// the id of the (dis)connecting component
					let affecedProperty = affectedEdge.source? PropertyType.Source: PropertyType.Target;			// is this component the target or the source?
					let value = isConnectioning? affectedCellId: null;												// id if connecting, null if disconnecting

					// relation - connect | dissconnect
					// sets the source|target to componentId if connect and null if disconnect
					if(isConnectioning || isDisconnectioning)
					{
						editorComponent.stageChange(
							new ChangeRecord(
								[affectedEdge.edge.id],
								affecedProperty,
								ActionType.Change,
								value
							) );

						// //component update relation
						// editorComponent.stageChange(
						// 	new ChangeRecord(
						// 		[affectedCellId],
						// 		PropertyType.Relations,
						// 		isConnectioning? ActionType.Insert: ActionType.Remove,
						// 		affectedEdge.edge.id
						// 	) );
					}

					// move edge point if disconnected
					// set the location of the disconected end
					if(isDisconnectioning || isMovingTerminal)
						editorComponent.stageChange( new ChangeRecord(
							[affectedEdge.edge.id],
							PropertyType.Dimension,
							ActionType.Change,
							affecedProperty == PropertyType.Source?
								new Dimension(
									affectedEdge.edge.geometry.sourcePoint?.x,
									affectedEdge.edge.geometry.sourcePoint?.y,
									null, null
								):
								new Dimension(
									null, null,
									affectedEdge.edge.geometry.targetPoint?.x,
									affectedEdge.edge.geometry.targetPoint?.y
								)
						) );
				}
		});
			
	}
	function valid(id: string):boolean{ 
		//TODO: better way to validate id
		return id.length > 5 ;
	}

	function startEditing(graph: mxGraph, editorComponent: EditorComponent){
		graph.addListener(mxEvent.START_EDITING, 
			// When double click on cell to change label
			function(eventSource, eventObject){
				let affectedCells = eventObject.getProperties();
				console.log('%c%s', f_alert, "START_EDITING");

				console.log(affectedCells.cell.id);
			});

	}

	function start(graph: mxGraph, editorComponent: EditorComponent){
		graph.addListener(mxEvent.START, 
			// When double click on cell to change label
			function(eventSource, eventObject){
				let affectedCells = eventObject.getProperties();
				console.log('%c%s', f_alert, "START");

				console.log(affectedCells.cell.id);
			});

	}
	function cellsAdded(graph: mxGraph, editorComponent: EditorComponent){
		graph.addListener(mxEvent.CELLS_ADDED, 
			// mxEvent.ADD_CELLS
			function(eventSource, eventObject){
				let affectedCells = eventObject.getProperties();
				console.log('%c%s', f_alert, "CELLS_ADDED ");
				console.log(affectedCells);

				//if cell is new edge
				// if(affectedCells)
				
			});
	}
	
	function click(graph: mxGraph, editorComponent: EditorComponent){
		graph.addListener(mxEvent.CLICK, 
			// click on object to see its makup.
			function(eventSource, eventObject){
				let affectedCells = eventObject.getProperties().cell;
				console.log('%c%s',f_alert, "mxCell description");
				console.log(affectedCells);

				if(graph.isCellLocked(affectedCells))
					affectedCells = undefined;
				if(affectedCells == undefined )
					graph.clearSelection();
				
				editorComponent.releaseLock(affectedCells);
			});
	}



	// function addCells(graph: mxGraph, editorComponent: EditorComponent){
	// 	//fires when new irem is dragged from the toolbar into the diagram
	// 	graph.addListener(mxEvent.ADD_CELLS,
	// 		function(eventSource, eventObject){
	// 			let affectedCells = eventObject.getProperties();
	// 			console.log('%c%s', f_alert, "ADD_CELLS");
	// 			console.log(affectedCells);
	// 		});
			
	// }

	function connect(graph: mxGraph, editorComponent: EditorComponent){
		//listener for new connections
		graph.connectionHandler.addListener(mxEvent.CONNECT, 
			function(eventSource, eventObject){
				let affectedCells = eventObject.getProperties('cell').cell;
				console.log('%c%s', f_alert, "connectionHandler.CONNECT");
				console.log(affectedCells);

				if(affectedCells.edge)
				{
					//new relationship
					let relation = new Relationship();
					relation.source = affectedCells.source.id;
					relation.target = affectedCells.target?.id; // may be null

					relation.dimension = new Dimension(
						affectedCells.geometry.x,
						affectedCells.geometry.y,
						affectedCells.geometry.targetPoint.x,
						affectedCells.geometry.targetPoint.y,
					);

					relation.type = affectedCells.style | RelationshipType.Association;

					affectedCells.id = relation.id;
					affectedCells.value = relation.attributes;
					affectedCells.style = RelationshipType[relation.type]

					editorComponent.stageChange(new ChangeRecord(
						null,
						PropertyType.Elements,
						ActionType.Insert,
						relation
					));

				}


			});
	}



	function select(graph: mxGraph, editorComponent: EditorComponent){
		//listener template
		graph.addListener(mxEvent.SELECT, 
			// NADA
			function(eventSource, eventObject){
				let affectedCells = eventObject.getProperties();
				console.log('%c%s', f_alert, "mxEvent.SELECT");
				console.log(affectedCells);
			});
	}


	function template(graph: mxGraph, editorComponent: EditorComponent){
		//listener template
		graph.addListener(mxEvent.FIRED, 
			// NADA
			function(eventSource, eventObject){
				let affectedCells = eventObject.getProperties();
				console.log('%c%s', f_alert, "");
				console.log(affectedCells);
			});
	}



var f_info = 'width: 100%; background: yellow; color: navy;';
var f_alert = 'text-align: center; width: 100%; background: black; color: red; font-size: 1.5em;';