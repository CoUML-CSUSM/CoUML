import { AfterViewInit, Component as AngularComponent, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Class, AbstractClass, Diagram, DiagramElement, Component, Attribute, Interface, Operation, Relationship, RelationshipType, VisibilityType, ChangeRecord, ActionType, PropertyType, ICollectionIterator, Enumeration, Dimension } from 'src/models/DiagramModel';
import { ProjectDeveloper } from '../controller/project-developer.controller';
import { EditorFormatHandler } from './editor-format.handler';
import { EditorNotificationHandler } from './editor-notification.handler';

/**
 * https://github.com/typed-mxgraph/typed-mxgraph
 */
@AngularComponent({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  providers: [ProjectDeveloper, EditorFormatHandler, EditorNotificationHandler]
})
export class EditorComponent implements AfterViewInit{

	private _graphContainer: mxGraph;
	diagram_description: string;
	diagramId: string;

	@ViewChild('container', { read: ElementRef, static: true })
	public container: ElementRef<HTMLElement>;


	constructor(
		private _projectDeveloper: ProjectDeveloper, 
		private _formatHandler: EditorFormatHandler,
		private _notificationHandler: EditorNotificationHandler
	) {
		this._projectDeveloper.subscribe(this);
	}

	ngAfterViewInit(): void {
		this._graphContainer = new mxGraph(this.container.nativeElement);
		this._formatHandler.addEdgeStyles(this._graphContainer);
		this._notificationHandler.addListeners(
			[
				mxEvent.LABEL_CHANGED,
				mxEvent.CELLS_ADDED,
				mxEvent.START_EDITING, 
				mxEvent.CELL_CONNECTED, 
				mxEvent.EDITING_STOPPED,
				mxEvent.CELLS_MOVED
			],
			this._graphContainer,
			this
		);
		setTimeout(()=>	this._projectDeveloper.open(this.diagramId), 500);
	}

	stageChange(change: ChangeRecord)
	{
		console.log("change staged")
		console.log(change);
		this._projectDeveloper.stageChange(change);
	}

	
	public draw() {
		//turn off notifications before drawing new graph 
		this._graphContainer.eventsEnabled = false;
		this._graphContainer.getModel().beginUpdate();
		try {
			const parent = this._graphContainer.getDefaultParent();

			let elementIterator: ICollectionIterator<DiagramElement> 
				= this._projectDeveloper._projectDiagram.elements.iterator();
			
			// relationships will be added after all components are added
			let relatioships = []; 
			
			while(elementIterator.hasNext())
			{
				let diagramElement = elementIterator.getNext();

				if(diagramElement instanceof Component)
					this._graphContainer.insertVertex(
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
				this._graphContainer.insertEdge(
					parent, 
					relation.id, 
					relation.attributes.toString(), 
					this._graphContainer.getModel().getCell(relation.source), 
					this._graphContainer.getModel().getCell(relation.target),
					RelationshipType[relation.type]
				);
			}
					
		} finally {
			this._graphContainer.getModel().endUpdate();

			// turn notifications back on
			this._graphContainer.eventsEnabled = true;
		}
	}
	
	public processChange(change: ChangeRecord){
		let affectedCell = this._graphContainer.getModel().getCell(change.id[0]);
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
		let newCellGeometry = this._graphContainer.getCellGeometry(affectedCell).clone();
		newCellGeometry.x = change.value.x;
		newCellGeometry.y = change.value.y;
		this._graphContainer.getModel().setGeometry(affectedCell, newCellGeometry);
	}
	
	private updateEdgeGeometry(affectedEdge: mxCell, change: ChangeRecord) {
		let isSource = !(change.value.height);
		
		let point = isSource?
			new mxPoint(change.value.x, change.value.y):
				new mxPoint(change.value.width, change.value.height);

		let newEdgeGeometry = affectedEdge.getGeometry().clone();
		newEdgeGeometry.setTerminalPoint(point, isSource);

		this._graphContainer.getModel().setGeometry(affectedEdge, newEdgeGeometry);
	}

	private updateEdgeConnections(affectedEdge: mxCell, change: ChangeRecord) {
		let isSource = change.affectedProperty == PropertyType.Source;
		if(!change.value)	
		{// disconnecting
			affectedEdge.removeFromTerminal(isSource);

		}else
		{// connecting
			let affectedCell = this._graphContainer.getModel().getCell(change.value);
			this._graphContainer.getModel().setTerminal( affectedEdge, affectedCell, isSource );
		}

	}

	private updateLabelValue(affectedCell: mxCell, change: ChangeRecord)
	{
		this._graphContainer.getModel().setValue(
			affectedCell,
			change.value
		);
	}
}

