import { AfterViewInit, Component as AngularComponent, ElementRef, OnInit, ViewChild, HostListener } from '@angular/core';
import { Class, AbstractClass, Diagram, DiagramElement, Component, Attribute, Interface, Operation, Relationship, RelationshipType, VisibilityType, ChangeRecord, ActionType, PropertyType, ICollectionIterator, Enumeration, Dimension, DEFUALT_DIMENSION, NullUser } from 'src/models/DiagramModel';
import { ProjectDeveloper } from '../controller/project-developer.controller';
import * as EditorFormatHandler  from './editor-format.handler';
import * as EditorEventHandler  from './editor-event.handler';

/**
 * https://github.com/typed-mxgraph/typed-mxgraph
 */
@AngularComponent({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  providers: [ProjectDeveloper]
})
export class EditorComponent implements AfterViewInit{

	private _graph: mxGraph;
	diagram_description: string;
	diagramId: string;

	_currentSelection: mxCell = null;

	@ViewChild('graphContainer', { read: ElementRef, static: true })
	public graphContainer: ElementRef<HTMLElement>;

	@ViewChild('toolbarContainer', { read: ElementRef, static: true })
	public toolbarContainer: ElementRef<HTMLElement>;

    private _toolbar: mxToolbar;

	get toolbar(){ return this._toolbar;}
	get graph(){return this._graph;}

	constructor(
		private _projectDeveloper: ProjectDeveloper
	) {
		this._projectDeveloper.subscribe(this);
		this.onResize();
	}



	/** frame controls */

	canvasHeight: number;
    canvasWidth: number;

	toolbarWidth: number = 200;
	
	@HostListener('window:resize', ['$event'])
	onResize(event?) {
	this.canvasHeight = window.innerHeight;
	this.canvasWidth = window.innerWidth - this.toolbarWidth;
	}
	/*************************** */



	ngAfterViewInit(): void {

		//init graph div
		this._graph = new mxGraph(this.graphContainer.nativeElement);
		EditorFormatHandler.addEdgeStyles(this._graph);
		EditorFormatHandler.addCellStyles(this._graph);
		EditorFormatHandler.intiLayoutManager(this._graph);

		EditorEventHandler.addListeners(
			[
				mxEvent.LABEL_CHANGED,
				mxEvent.CELLS_ADDED,
				mxEvent.START_EDITING, 
				mxEvent.CELL_CONNECTED, 
				mxEvent.EDITING_STOPPED,
				mxEvent.CELLS_MOVED,
				mxEvent.CLICK,
				mxEvent.CONNECT,
				mxEvent.START,
				mxEvent.SELECT,
			],
			this._graph,
			this
		);
		
		mxEvent.disableContextMenu(this.graphContainer.nativeElement);
		this.addContextMenu()

		//init toolbar div
        this._toolbar = new mxToolbar(this.toolbarContainer.nativeElement);
		EditorEventHandler.addToolbarItems(
			[Class, AbstractClass, Interface, Enumeration],
			this
		);

		//get test diagram
		setTimeout(()=>	this._projectDeveloper.open(this.diagramId), 500);
	}

	private addContextMenu()
	{
		let editorComponent = this;
		this._graph.popupMenuHandler.factoryMethod = function(menu, cell, evt)
		{
			console.log(cell)
			if(cell.edge)
			{
				menu.addItem('Dependency', null, ()=>editorComponent.setRelationType(cell, RelationshipType.Dependency));
				menu.addItem('Association', null, ()=>editorComponent.setRelationType(cell, RelationshipType.Association));
				menu.addItem('Aggregation', null, ()=>editorComponent.setRelationType(cell, RelationshipType.Aggregation));
				menu.addItem('Composistion', null, ()=>editorComponent.setRelationType(cell, RelationshipType.Composistion));
				menu.addItem('Generalization', null, ()=>editorComponent.setRelationType(cell, RelationshipType.Generalization));
				menu.addItem('Realization', null, ()=>editorComponent.setRelationType(cell, RelationshipType.Realization));
				
			}
			
		};
	}

	setRelationType(edge: mxCell, relationType: RelationshipType):void
	{
		edge.style = RelationshipType[relationType];
		this._graph.refresh();

		this.stageChange(new ChangeRecord(
			[edge.id],
			PropertyType.Type,
			ActionType.Change,
			relationType
		));
	}

	stageChange(change: ChangeRecord)
	{
		console.log("change staged")
		console.log(change);
		this._projectDeveloper.stageChange(change);
	}


	
	public draw() {
		//turn off notifications before drawing new graph 
		this._graph.eventsEnabled = false;
		this._graph.setConnectable(true);

		this._graph.isCellLocked = function(cell)
		{
			return this.getCellStyle(cell)['selectable'] == 0;
		}

		// this._graph.iscellS
		this._graph.getModel().beginUpdate();
		try {

			let elementIterator: ICollectionIterator<DiagramElement> 
				= this._projectDeveloper._projectDiagram.elements.iterator();
			
			// relationships will be added after all components are added
			let relatioships = []; 
			
			while(elementIterator.hasNext())
			{
				let diagramElement = elementIterator.getNext();

				if(diagramElement instanceof Component){
					this.insertCell(diagramElement)
				}
				else if( diagramElement instanceof Relationship){
						relatioships.push(diagramElement)
				}
			}

			for( let relation  of relatioships)
			{
				this.insertEdge(relation);
			}
					
		} finally {
			this._graph.getModel().endUpdate();
			this._graph.eventsEnabled = true;
		}
	}
	
	private insertCell(component: Component) {


		console.log("this._graph.insertVertex");


		let graphComponent = this._graph.insertVertex(
			this._graph.getDefaultParent(),
			component.id, 
			component.name, 
			component.dimension.x, 
			component.dimension.y, 
			component.dimension.width, 
			component.dimension.height,
			component.constructor.name
		);
		
		if(component instanceof AbstractClass || component instanceof Class)
		{
			let attributeIterator: ICollectionIterator<Attribute> = component.attributes.iterator();

			while(attributeIterator.hasNext())
			{
				let attribute  = attributeIterator.getNext();
				this._graph.insertVertex(
					graphComponent,
					attribute.id,
					attribute.name,
					0, 0, 
					component.dimension.width, 
					component.dimension.height, 
				)
			}
		}
		if(component instanceof AbstractClass 
			|| component instanceof Class
			|| component instanceof Interface)
		{
			let operatorIterator: ICollectionIterator<Operation> = component.operations.iterator();

			while(operatorIterator.hasNext())
			{
				let operator  = operatorIterator.getNext();
				this._graph.insertVertex(
					graphComponent,
					operator.id,
					operator.name,
					0, 0, 
					component.dimension.width, 
					component.dimension.height, 
				)
			}
		}
	}

	private insertEdge(relation: Relationship)
	{	
		var edge = new mxCell(
			relation.attributes.toString(), 
			new mxGeometry(0, 0, 0, 0), 
			RelationshipType[relation.type]);
		edge.edge = true;
		edge.id = relation.id
		edge.geometry.relative = true;
		edge.style = RelationshipType[relation.type];
		
		if(relation.source)
			edge.setTerminal(this._graph.getModel().getCell(relation.source), true);
		else
			edge.geometry.setTerminalPoint(new mxPoint(relation.dimension.x, relation.dimension.y), true); //source

		if(relation.target)
			edge.setTerminal(this._graph.getModel().getCell(relation.target), false);
		else
			edge.geometry.setTerminalPoint(new mxPoint(relation.dimension.width, relation.dimension.height), false); //target
	  
		edge = this._graph.addCell(edge);

	}


	public processChange(change: ChangeRecord){
		let affectedCell = change.id? this._graph.getModel().getCell(change.id.pop()): null;

		switch(change.action){
			case ActionType.Change:
				switch(change.affectedProperty){
					case PropertyType.Name:	this.updateLabelValue(affectedCell, change); break;
					case PropertyType.Dimension: this.updateEdgeGeometry(affectedCell,change); break;
					case PropertyType.Target:
						case PropertyType.Source: this.updateEdgeConnections(affectedCell,change); break;
					case PropertyType.Type:
						affectedCell.style = RelationshipType[change.value];
						this._graph.refresh();
						break;
				}
				break;

			case ActionType.Shift:
				this.updateCellGeometry(affectedCell, change);
				break;
			
			case ActionType.Insert:
				switch(change.affectedProperty){
					case PropertyType.Elements:
						if(change.value instanceof Relationship)
							this.insertEdge(change.value);
						else
							this.insertCell(change.value);
						break;
				}
				break;
			case ActionType.Lock:
			case ActionType.Release:
				this.updateCellLock(affectedCell,change); break;
		}
	}

	private updateCellLock(affectedCell: mxCell, change: ChangeRecord)
	{
		let isSelectable = (change.value instanceof NullUser || change.value.id == this._projectDeveloper._editor.id);
		this._graph.toggleCellStyle('selectable', isSelectable, affectedCell);

		var overlays = this._graph.getCellOverlays(affectedCell);
						
		if (!isSelectable)
		{
			// Creates a new overlay with an image and a tooltip
			var overlay = new mxCellOverlay(
				new mxImage('editors/images/overlays/user3.png', 16, 16),
				`locked by: ${change.value.id}`);

			// Sets the overlay for the cell in the graph
			this._graph.addCellOverlay(affectedCell, overlay);
		}
		else
		{
			this._graph.removeCellOverlays(affectedCell);
		}
	}

	private updateCellGeometry(affectedCell: mxCell, change: ChangeRecord) {
		let newCellGeometry = this._graph.getCellGeometry(affectedCell).clone();
		newCellGeometry.x = change.value.x;
		newCellGeometry.y = change.value.y;
		this._graph.getModel().setGeometry(affectedCell, newCellGeometry);
	}
	
	private updateEdgeGeometry(affectedEdge: mxCell, change: ChangeRecord) {
		let isSource = !(change.value.height);
		
		let point = isSource?
			new mxPoint(change.value.x, change.value.y):
				new mxPoint(change.value.width, change.value.height);

		let newEdgeGeometry = affectedEdge.getGeometry().clone();
		newEdgeGeometry.setTerminalPoint(point, isSource);

		this._graph.getModel().setGeometry(affectedEdge, newEdgeGeometry);
	}

	private updateEdgeConnections(affectedEdge: mxCell, change: ChangeRecord) {
		let isSource = change.affectedProperty == PropertyType.Source;
		if(!change.value)	
		{// disconnecting
			affectedEdge.removeFromTerminal(isSource);

		}else
		{// connecting
			let affectedCell = this._graph.getModel().getCell(change.value);
			this._graph.getModel().setTerminal( affectedEdge, affectedCell, isSource );
		}

	}

	private updateLabelValue(affectedCell: mxCell, change: ChangeRecord)
	{
		this._graph.getModel().setValue(
			affectedCell,
			change.value
		);
	}

	releaseLock(newSelection: mxCell)
	{
		console.log("-----releaseLock----")
		console.log(newSelection);
		// if should release
		if(this._currentSelection != null) // something is currently locked
		{

			this.stageChange(new ChangeRecord(
				[this._currentSelection.id],
				PropertyType.Editor,
				ActionType.Release,
				new NullUser()
			));
			this._currentSelection = null;
		}
		if(newSelection){
			if (newSelection.style == undefined)
				newSelection = newSelection.parent // if attribute lock parent comp
			this._currentSelection = newSelection;
			this.stageChange(new ChangeRecord(
				[this._currentSelection.id],
				PropertyType.Editor,
				ActionType.Lock,
				this._projectDeveloper._editor
			));

		}
	}





}

