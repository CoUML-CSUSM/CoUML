import { AfterViewInit, Component as AngularComponent, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Class, AbstractClass, Diagram, DiagramElement, Component, Attribute, Interface, Operation, Relationship, RelationshipType, VisibilityType, ChangeRecord, ActionType, PropertyType, ICollectionIterator, Enumeration } from 'src/models/DiagramModel';
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

	public draw() {
		this.graphContainer = new mxGraph(this.container.nativeElement);
		var thisEditorComponentContext = this; 
		this.graphContainer.getModel().beginUpdate();


		// on change label event 
		this.graphContainer.addListener(mxEvent.LABEL_CHANGED,
			function(eventSource, eventObject){
				console.log('%c\t\t%s\t\t', 'font-size: 16pt; background: #222; color: #bada55', "LABEL_CHANGED");
				let affectedCells = eventObject.getProperties();
				// let id = eventObject.getProperties().cell.id;
				// let newValue = eventObject.getProperties().value;

				thisEditorComponentContext.stageChange( new ChangeRecord(
					[affectedCells.cell.id],
					PropertyType.Name, 
					ActionType.Change,
					affectedCells.value
				));
		});

		this.graphContainer.startEditing = function(mouseEvent){
			console.log('%c\t\t%s\t\t', 'font-size: 16pt; background: #222; color: #bada55', "startEditing");
			console.log(arguments);
			mxGraph.prototype.startEditing.apply(this, arguments);
		};

		this.graphContainer.addListener(mxEvent.CELLS_MOVED,
			function(eventSource, eventObject){
				let affectedCells = eventObject.getProperties();
				console.log('%c\t\t%s\t\t', 'font-size: 16pt; background: #222; color: #bada55', "cellsMoved");

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
					{
						dx: affectedCells.dx,
						dy: affectedCells.dy,
						disconnected: affectedCells.disconnected, 
					}
				));
			});

		this.graphContainer.stopEditing = function(cancel){
			console.log('%c\t\t%s\t\t', 'font-size: 16pt; background: #222; color: #bada55', "stopEditing");
			console.log(arguments);
			mxGraph.prototype.stopEditing.apply(this, arguments);
			// thisEditorComponentContext.commitStagedChanges();
		};



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
	
			for( let relation  of relatioshipsLast)
			{
				this.graphContainer.insertEdge(
					parent, 
					relation.id, 
					relation.attributes.toString(), 
					this.graphContainer.getModel().getCell(relation.from), 
					this.graphContainer.getModel().getCell(relation.to), 
				);
			}
					
		} finally {
			this.graphContainer.getModel().endUpdate();
		}
	}
	
	update(change: ChangeRecord){
		let affectedCell = this.graphContainer.getModel().getCell(change.id[0]);
		switch(change.action){
			case ActionType.Change:
				this.graphContainer.getModel().setValue(
					affectedCell,
					change.value
				);
				break;

			case ActionType.Shift:
				let absoluteDeminsions = this._projectDeveloper._projectDiagram.elements.get(change.id[0]).dimension;
				let newCellGeometry = this.graphContainer.getCellGeometry(affectedCell).clone();
				newCellGeometry.x = absoluteDeminsions.x;
				newCellGeometry.y = absoluteDeminsions.y;
				this.graphContainer.getModel().setGeometry(affectedCell, newCellGeometry);
				break;
		}
	}

	//***************************************************/

	public open()
	{
		this._projectDeveloper.open(this.diagramId);
	}

}

