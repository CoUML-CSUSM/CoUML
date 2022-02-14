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
export class EditorComponent {

	private graphContainer: mxGraph;
	diagram_description: string;
	diagramId: string;


	@ViewChild('container', { read: ElementRef, static: true })
	public container: ElementRef<HTMLElement>;


	constructor(private _projectDeveloper: ProjectDeveloper) {
		this._projectDeveloper.subscribe(this);
	}

	stageChange(change: ChangeRecord)
	{
		console.log("change staged")
		console.log(change);
		this._projectDeveloper.stageChange(change);
	}

	private addListeners()
	{
		var thisEditorComponentContext = this; 
		
		this.graphContainer.addListener(mxEvent.LABEL_CHANGED,
			// on change label event 
			function(eventSource, eventObject){
				console.log('%c\t\t%s\t\t', 'font-size: 16pt; background: #222; color: #bada55', "LABEL_CHANGED");
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
				console.log('%c\t\t%s\t\t', 'font-size: 16pt; background: #222; color: #bada55', "CELLS_MOVED");

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
						dx: affectedCells.cells[0]?.geometry.x,
						dy: affectedCells.cells[0]?.geometry.y,
					}
				));
			});


		this.graphContainer.addListener(mxEvent.EDITING_STOPPED,
			//
			function(eventSource, eventObject){
				let affectedCells = eventObject.getProperties();
				console.log('%c\t\t%s\t\t', 'font-size: 16pt; background: #222; color: #bada55', "EDITING_STOPPED");
				console.log(affectedCells);
			});

		this.graphContainer.addListener(mxEvent.CELL_CONNECTED, 
			//event when  edge is connected or disconeccted from a cell
			function(eventSource, eventObject){
				let affectedEdge = eventObject.getProperties();
				console.log('%c\t\t%s\t\t', 'font-size: 16pt; background: #222; color: #bada55', "CELL_CONNECTED");

				console.log(affectedEdge);
				console.log(`edge: ${affectedEdge.edge.id}`);
				console.log(`source(from): ${affectedEdge.edge.source?.id}`);
				console.log(`target(to): ${affectedEdge.edge.target?.id}`);

				//disconnect action --> previous
				//connect action --> terminal
				let isConnectioning = affectedEdge.terminal? true: false;

				let affectedCellId = isConnectioning? affectedEdge.terminal?.id: affectedEdge.previous?.id ;
				let affecedProperty = affectedCellId == affectedEdge.edge.source?.id? PropertyType.Source: PropertyType.Target;
				let value = isConnectioning? affectedCellId: null;

				// relation - connect | dissconnect
				thisEditorComponentContext.stageChange(
					new ChangeRecord(
						[affectedEdge.edge.id],
						affecedProperty,
						ActionType.Change,
						value
					)
				);
				
				// move edge point if disconnected
				thisEditorComponentContext.stageChange(
					new ChangeRecord(
						[affectedEdge.edge.id],
						PropertyType.Dimension,
						ActionType.Change,
						new Dimension(
							affectedEdge.geometry.sourcePoint?.x,
							affectedEdge.geometry.sourcePoint?.y,
							affectedEdge.geometry.targetPoint?.x,
							affectedEdge.geometry.targetPoint?.y
						)
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

			});
			

		this.graphContainer.addListener(mxEvent.START_EDITING, 
			// When double click on cell to change label
			function(eventSource, eventObject){
				let affectedCells = eventObject.getProperties();
				console.log('%c\t\t%s\t\t', 'font-size: 16pt; background: #222; color: #bada55', "START_EDITING");

				console.log(affectedCells.cell.id);
			});


		this.graphContainer.addListener(mxEvent.CELLS_ADDED, 
			// mxEvent.ADD_CELLS
			function(eventSource, eventObject){
				let affectedCells = eventObject.getProperties();
				console.log('%c\t\t%s\t\t', 'font-size: 16pt; background: #222; color: #bada55', "CELLS_ADDED ");
				console.log(affectedCells);
			});

		/*
		//listener template
		this.graphContainer.addListener(mxEvent, 
			// NADA
			function(eventSource, eventObject){
				let affectedCells = eventObject.getProperties();
				console.log('%c\t\t%s\t\t', 'font-size: 16pt; background: #222; color: #bada55', "");
				console.log(affectedCells);
			});
		*/
	}

	public draw() {
		this.graphContainer = new mxGraph(this.container.nativeElement);
		
		this.graphContainer.getModel().beginUpdate();

		// create diagram from ProjectDeveloper Diagram
		try {
			const parent = this.graphContainer.getDefaultParent();

			let elementIterator: ICollectionIterator<DiagramElement> = this._projectDeveloper._projectDiagram.elements.iterator();
			
				
			let relatioshipsLast = [];

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
						relatioshipsLast.push(diagramElement)
				}
						
			}

			console.log(relatioshipsLast);
	
			for( let relation  of relatioshipsLast)
			{
				// TODO : figure out how to insert an edge that has no source or target 
				this.graphContainer.insertEdge(
					parent, 
					relation.id, 
					relation.attributes.toString(), 
					this.graphContainer.getModel().getCell(relation.source), 
					this.graphContainer.getModel().getCell(relation.target), 
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
					case PropertyType.Dimension: this.updateEdgeGeometry(affectedCell,change); break
				}
				break;

			case ActionType.Shift:
				this.updateCellGeometry(affectedCell, change);
				break;
		}
	}
	updateCellGeometry(affectedCell: mxCell, change: ChangeRecord) {
		// let absoluteDeminsions = this._projectDeveloper._projectDiagram.elements.get(change.id[0]).dimension;
		let newCellGeometry = this.graphContainer.getCellGeometry(affectedCell).clone();
		newCellGeometry.x = change.value.x;
		newCellGeometry.y = change.value.y;
		this.graphContainer.getModel().setGeometry(affectedCell, newCellGeometry);
		// this is broken now!!!
	}
	
	private updateEdgeGeometry(affectedCell: mxCell, change: ChangeRecord) {
		// affectedCell.geometry.sourcePoint
		console.log("updateEdgeGeometry");
		console.log(affectedCell);
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

