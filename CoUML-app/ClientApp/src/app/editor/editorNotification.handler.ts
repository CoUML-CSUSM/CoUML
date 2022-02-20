import { Injectable } from "@angular/core";
import { ActionType, ChangeRecord, Dimension, PropertyType } from "src/models/DiagramModel";
import { EditorComponent } from "./editor.component";

@Injectable()
export class EditorNotificationHandler
{
	private _listenerCatalog: Map<mxEvent, Function>;

	constructor()
	{
		this._listenerCatalog = new Map();
		this._listenerCatalog.set(mxEvent.LABEL_CHANGED, this.labelChanged);
		this._listenerCatalog.set(mxEvent.CELLS_ADDED, this.cellsAdded);
		this._listenerCatalog.set(mxEvent.START_EDITING, this.startEditing);
		this._listenerCatalog.set(mxEvent.CELL_CONNECTED, this.cellConnected);
		this._listenerCatalog.set(mxEvent.EDITING_STOPPED, this.editingStoped);
		this._listenerCatalog.set(mxEvent.CELLS_MOVED, this.cellsMoved);

	}
	addListeners(events: mxEvent[], graph: mxGraph, editorComponent: EditorComponent)
	{
		events.forEach(event =>{
			this._listenerCatalog.get(event).call(null, graph, editorComponent)
		});
	}

	labelChanged(graph: mxGraph, editorComponent: EditorComponent){
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

	cellsMoved(graph: mxGraph, editorComponent: EditorComponent){
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

	editingStoped(graph: mxGraph, editorComponent: EditorComponent){
		graph.addListener(mxEvent.EDITING_STOPPED,
			//
			function(eventSource, eventObject){
				let affectedCells = eventObject.getProperties();
				console.log('%c%s', f_alert, "EDITING_STOPPED");
				console.log(affectedCells);
			});
	}

	cellConnected(graph: mxGraph, editorComponent: EditorComponent){
		graph.addListener(mxEvent.CELL_CONNECTED, 
			//event when  edge is connected or disconeccted from a cell
			function(eventSource, eventObject){
				let affectedEdge = eventObject.getProperties();
				console.log('%c%s', f_alert, "CELL_CONNECTED");

				console.log(affectedEdge);
				console.log(`edge: ${affectedEdge.edge.id}`);
				console.log(`source(from): ${affectedEdge.edge.source?.id}`);
				console.log(`target(to): ${affectedEdge.edge.target?.id}`);

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
						)
					);

					//component update relation
					editorComponent.stageChange(
						new ChangeRecord(
							[affectedCellId],
							PropertyType.Relations,
							isConnectioning? ActionType.Insert: ActionType.Remove,
							affectedEdge.edge.id
						)
					);

				}

				// move edge point if disconnected
				// set the location of the disconected end
				if(isDisconnectioning || isMovingTerminal)
					editorComponent.stageChange(
						new ChangeRecord(
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
						)
					);
			});
			
		}

	startEditing(graph: mxGraph, editorComponent: EditorComponent){
		graph.addListener(mxEvent.START_EDITING, 
			// When double click on cell to change label
			function(eventSource, eventObject){
				let affectedCells = eventObject.getProperties();
				console.log('%c%s', f_alert, "START_EDITING");

				console.log(affectedCells.cell.id);
			});

	}
	cellsAdded(graph: mxGraph, editorComponent: EditorComponent){
		graph.addListener(mxEvent.CELLS_ADDED, 
			// mxEvent.ADD_CELLS
			function(eventSource, eventObject){
				let affectedCells = eventObject.getProperties();
				console.log('%c%s', f_alert, "CELLS_ADDED ");
				console.log(affectedCells);
			});
	}
	
	click(graph: mxGraph, editorComponent: EditorComponent){
		graph.addListener(mxEvent.CLICK, 
			// click on object to see its makup.
			function(eventSource, eventObject){
				let affectedCells = eventObject.getProperties();
				console.log('%c%s',f_alert, "mxCell description");
				console.log(affectedCells);
			});
	}

	template(graph: mxGraph, editorComponent: EditorComponent){
		//listener template
		graph.addListener(mxEvent.FIRED, 
			// NADA
			function(eventSource, eventObject){
				let affectedCells = eventObject.getProperties();
				console.log('%c%s', f_alert, "");
				console.log(affectedCells);
			});
	}

}

var f_info = 'width: 100%; background: yellow; color: navy;';
var f_alert = 'text-align: center; width: 100%; background: black; color: red; font-size: 1.5em;';