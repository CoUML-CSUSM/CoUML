import { AfterViewInit, Component as AngularComponent, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Class, AbstractClass, Diagram, DiagramElement, Component, Attribute, Interface, Operation, Relationship, RelationshipType, VisibilityType, ChangeRecord, ActionType, PropertyType, ICollectionIterator, Enumeration, Dimension } from 'src/models/DiagramModel';
import { ProjectDeveloper } from '../controller/project-developer.controller';

/**
 * https://github.com/typed-mxgraph/typed-mxgraph
 */
@AngularComponent({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  providers: [ProjectDeveloper]
})
export class EditorComponent implements AfterViewInit{

	private graphContainer: mxGraph;
	diagram_description: string;
	diagramId: string;


	@ViewChild('container', { read: ElementRef, static: true })
	public container: ElementRef<HTMLElement>;


	constructor(private _projectDeveloper: ProjectDeveloper) {
		this._projectDeveloper.subscribe(this);
	}
	ngAfterViewInit(): void {
		this.graphContainer = new mxGraph(this.container.nativeElement);
		this.addStyles();
	}

	stageChange(change: ChangeRecord)
	{
		console.log("change staged")
		console.log(change);
		this._projectDeveloper.stageChange(change);
		this.addStyles();
	}

	private addListeners()
	{
		var thisEditorComponentContext = this; 
		
		this.graphContainer.addListener(mxEvent.LABEL_CHANGED,
			// on change label event 
			function(eventSource, eventObject){
				console.log('%c%s', f_alert, "LABEL_CHANGED");
				let affectedCells = eventObject.getProperties();

				thisEditorComponentContext.stageChange( new ChangeRecord(
					[affectedCells.cell.id],
					PropertyType.Name, 
					ActionType.Change,
					affectedCells.value
				));
		});

		this.graphContainer.addListener(mxEvent.CELLS_MOVED,
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

				thisEditorComponentContext.stageChange(new ChangeRecord(
					ids,
					PropertyType.Dimension,
					ActionType.Shift,
					{ // new absolute location
						x: affectedCells.cells[0]?.geometry.x,
						y: affectedCells.cells[0]?.geometry.y,
					}
				));
			});


		this.graphContainer.addListener(mxEvent.EDITING_STOPPED,
			//
			function(eventSource, eventObject){
				let affectedCells = eventObject.getProperties();
				console.log('%c%s', f_alert, "EDITING_STOPPED");
				console.log(affectedCells);
			});

		this.graphContainer.addListener(mxEvent.CELL_CONNECTED, 
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
					thisEditorComponentContext.stageChange(
						new ChangeRecord(
							[affectedEdge.edge.id],
							affecedProperty,
							ActionType.Change,
							value
						)
					);

					//component update relation
					thisEditorComponentContext.stageChange(
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
					thisEditorComponentContext.stageChange(
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
			

		this.graphContainer.addListener(mxEvent.START_EDITING, 
			// When double click on cell to change label
			function(eventSource, eventObject){
				let affectedCells = eventObject.getProperties();
				console.log('%c%s', f_alert, "START_EDITING");

				console.log(affectedCells.cell.id);
			});


		this.graphContainer.addListener(mxEvent.CELLS_ADDED, 
			// mxEvent.ADD_CELLS
			function(eventSource, eventObject){
				let affectedCells = eventObject.getProperties();
				console.log('%c%s', f_alert, "CELLS_ADDED ");
				console.log(affectedCells);
			});

		/*
		//listener template
		this.graphContainer.addListener(mxEvent, 
			// NADA
			function(eventSource, eventObject){
				let affectedCells = eventObject.getProperties();
				console.log('%c%s', f_alert, "");
				console.log(affectedCells);
			});
		*/

		this.graphContainer.addListener(mxEvent.CLICK, 
			// click on object to see its makup.
			function(eventSource, eventObject){
				let affectedCells = eventObject.getProperties();
				console.log('%c%s',f_alert, "mxCell description");
				console.log(affectedCells);
			});
	}

	private addStyles()
	{
		let  edgeStyleDefualt = this.graphContainer.getStylesheet().getDefaultEdgeStyle();
		edgeStyleDefualt[mxConstants.STYLE_STARTSIZE] = 12;
		edgeStyleDefualt[mxConstants.STYLE_ENDSIZE] = 12;

		let edgeStyleRealization = mxUtils.clone(edgeStyleDefualt);
		edgeStyleRealization[mxConstants.STYLE_DASHED] = true;
		edgeStyleRealization[mxConstants.STYLE_DASH_PATTERN] = '12 4';
		edgeStyleRealization[mxConstants.STYLE_ENDARROW] = mxConstants.ARROW_BLOCK;
		edgeStyleRealization[mxConstants.STYLE_ENDFILL] = false;
		this.graphContainer.getStylesheet().putCellStyle(
			RelationshipType[RelationshipType.Realization], 
			edgeStyleRealization
			);

	}
	
	public draw() {
		// done set edge style
		
		this.graphContainer.getModel().beginUpdate();
		// create diagram from ProjectDeveloper Diagram
		try {
			const parent = this.graphContainer.getDefaultParent();

			let elementIterator: ICollectionIterator<DiagramElement> 
				= this._projectDeveloper._projectDiagram.elements.iterator();
			
			// relationships will be added after all components are added
			let relatioships = []; 
			
			while(elementIterator.hasNext())
			{
				let diagramElement = elementIterator.getNext();

				if(diagramElement instanceof Component)
					this.graphContainer.insertVertex(
						parent,
						diagramElement.id, 
						diagramElement.name, 
						diagramElement.dimension.x, 
						diagramElement.dimension.y, 
						diagramElement.dimension.width, 
						diagramElement.dimension.height
					);
				else if( diagramElement instanceof Relationship){
						relatioships.push(diagramElement)
				}
			}

			for( let relation  of relatioships)
			{
				// TODO : figure out how to insert an edge that has no source or target 
				this.graphContainer.insertEdge(
					parent, 
					relation.id, 
					relation.attributes.toString(), 
					this.graphContainer.getModel().getCell(relation.source), 
					this.graphContainer.getModel().getCell(relation.target),
					RelationshipType[relation.type]
				);
			}
					
		} finally {
			this.graphContainer.getModel().endUpdate();
			this.addListeners();
		}
	}
	
	update(change: ChangeRecord){
		let affectedCell = this.graphContainer.getModel().getCell(change.id[0]);
		switch(change.action){
			case ActionType.Change:
				switch(change.affectedProperty){
					case PropertyType.Name:	this.updateLabelValue(affectedCell, change); break;
					case PropertyType.Dimension: this.updateEdgeGeometry(affectedCell,change); break;
					case PropertyType.Target:
						case PropertyType.Source: this.updateEdgeConnections(affectedCell,change); break;
				}
				break;

			case ActionType.Shift:
				this.updateCellGeometry(affectedCell, change);
				break;
		}
	}
	private updateCellGeometry(affectedCell: mxCell, change: ChangeRecord) {
		let newCellGeometry = this.graphContainer.getCellGeometry(affectedCell).clone();
		newCellGeometry.x = change.value.x;
		newCellGeometry.y = change.value.y;
		this.graphContainer.getModel().setGeometry(affectedCell, newCellGeometry);
	}
	
	private updateEdgeGeometry(affectedEdge: mxCell, change: ChangeRecord) {
		let isSource = !(change.value.height);
		
		let point = isSource?
			new mxPoint(change.value.x, change.value.y):
				new mxPoint(change.value.width, change.value.height);

		let newEdgeGeometry = affectedEdge.getGeometry().clone();
		newEdgeGeometry.setTerminalPoint(point, isSource);

		this.graphContainer.getModel().setGeometry(affectedEdge, newEdgeGeometry);
	}

	private updateEdgeConnections(affectedEdge: mxCell, change: ChangeRecord) {
		let isSource = change.affectedProperty == PropertyType.Source;
		if(!change.value)	
		{// disconnecting
			affectedEdge.removeFromTerminal(isSource);

		}else
		{// connecting
			let affectedCell = this.graphContainer.getModel().getCell(change.value);
			this.graphContainer.getModel().setTerminal( affectedEdge, affectedCell, isSource );
		}

	}

	private updateLabelValue(affectedCell: mxCell, change: ChangeRecord)
	{
		this.graphContainer.getModel().setValue(
			affectedCell,
			change.value
		);
	}

	//***************************************************/

	public open()
	{
		this._projectDeveloper.open(this.diagramId);
	}

}


	var f_info = 'width: 100%; background: yellow; color: navy;'
	var f_alert = 'text-align: center; width: 100%; background: black; color: red; font-size: 1.5em'
