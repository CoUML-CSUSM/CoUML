import { AfterViewInit, Component as AngularComponent, ElementRef, OnInit, ViewChild, HostListener } from '@angular/core';
import { User, Class, AbstractClass, Diagram,  Component, Attribute, Interface, Operation, Relationship, RelationshipType, VisibilityType, ChangeRecord, ActionType, PropertyType, ICollectionIterator, Enumeration, Dimension, DEFUALT_DIMENSION, NullUser, ComponentProperty, UmlElement, Enumeral } from 'src/models/DiagramModel';
import { ProjectDeveloper } from '../controller/project-developer.controller';
import * as EditorFormatHandler  from './editor-format.handler';
import * as EditorEventHandler  from './editor-event.handler';

const DELETE = 46;
const BACKSPACE = 8;

// (function(){
// 	})();


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

	editorOverlay: mxCellOverlay;

	_activeEditCell: mxCell = null;

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
		this.editorOverlay = new mxCellOverlay(
			new mxImage('editors/images/overlays/user3.png', 24, 24), "locked by other user");
			

	}

	


	/** frame controls */

	canvasHeight: number;
    canvasWidth: number;

	toolbarWidth: number = 212;
	accentColor: string = '#EFEFEF';
	
	@HostListener('window:resize', ['$event'])
	onResize(event?) {
		this.canvasHeight = window.innerHeight;
		this.canvasWidth = window.innerWidth - this.toolbarWidth;
	}
	/*************************** */

	// key handler
	_editorKeyHandler: mxKeyHandler;

	/**
	 * configure the graph
	 */
	ngAfterViewInit(): void {

		//init graph div
		this._graph = new mxGraph(this.graphContainer.nativeElement);
		this._graph.setDropEnabled(true); // ability to drag elements as groups
	



		EditorFormatHandler.addEdgeStyles(this._graph);
		EditorFormatHandler.addCellStyles(this._graph);
		EditorFormatHandler.initLayoutManager(this._graph);

		EditorEventHandler.addListeners(
			[
				mxEvent.LABEL_CHANGED,
				mxEvent.CELLS_ADDED,
				mxEvent.START_EDITING, 
				mxEvent.EDITING_STOPPED,
				mxEvent.CELL_CONNECTED, 
				mxEvent.EDITING_STOPPED,
				mxEvent.CELLS_MOVED,
				mxEvent.CLICK,
				mxEvent.SELECT,
				mxEvent.CONNECT,
			],
			this._graph,
			this
		);
		
		//special context menu on graph
		mxEvent.disableContextMenu(this.graphContainer.nativeElement);
		EditorEventHandler.addContextMenu( this._graph, this);

		//init toolbar div
        this._toolbar = new mxToolbar(this.toolbarContainer.nativeElement);
		EditorEventHandler.addToolbarItems(
			[Class, AbstractClass, Interface, Enumeration, Attribute, Operation, Enumeral],
			this
		);

		// Key binding
		// Adds handling of return and escape keystrokes for editing
		this._editorKeyHandler = new mxKeyHandler(this._graph);
		this._editorKeyHandler.bindKey(DELETE, ()=>this.deleteCell()); 
		this._editorKeyHandler.bindKey(BACKSPACE, ()=>this.deleteCell()); 

		//get test diagram
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
		this._graph.eventsEnabled = false;
		this._graph.setConnectable(true);

		this._graph.getDefaultParent().id = this._projectDeveloper._projectDiagram.id;

		this._graph.isCellLocked = function(cell: mxCell)
		{
			// if* the cell has an overlay *then* somone is using it and the cell is locked
			return cell?.overlays?.length > 0 || false;
		}

		// this._graph.iscellS
		this._graph.getModel().beginUpdate();
		try {

			let elementIterator: ICollectionIterator<UmlElement> 
				= this._projectDeveloper._projectDiagram.elements.iterator();
			
			// relationships will be added after all components are added
			let relatioships = []; 
			
			while(elementIterator.hasNext())
			{
				let element = elementIterator.getNext();

				if(element instanceof Component){
					let graphComponent =  this.insertComponent(element);

					//todo: lock cells on draw & release on close
					// if(element.editor instanceof User)
						// this.updateCellLock(graphComponent);
				}
				else if( element instanceof Relationship)
						relatioships.push(element);

				
			}

			for( let element  of relatioships)
				this.insertRelationship(element);
					
		} finally {
			this._graph.getModel().endUpdate();
			this._graph.eventsEnabled = true;
		}
	}
	
	public insertComponent(component: Component):mxCell {

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
				this.insertProperty(graphComponent, attributeIterator.getNext()) ;
		}
		if(component instanceof AbstractClass 
			|| component instanceof Class
			|| component instanceof Interface)
		{
			let operatorIterator: ICollectionIterator<Operation> = component.operations.iterator();

			while(operatorIterator.hasNext())
				this.insertProperty(graphComponent, operatorIterator.getNext()) ;
				
		}

		if(component instanceof Enumeration)
		{
			let enumIterator: ICollectionIterator<Enumeral> = component.enums.iterator();

			while(enumIterator.hasNext())
				this.insertProperty(graphComponent, enumIterator.getNext()) ;
				
		}


		return graphComponent;
	}


	insertProperty(parent: mxCell, property: UmlElement): mxCell
	{
		return this._graph.insertVertex(
			parent,
			property.id,
			property.toUmlNotation(),
			0, 0, 0, 0,
			property.constructor.name
		);
	}

	private insertRelationship(relation: Relationship): mxCell
	{	
		var edge = new mxCell(
			relation.toUmlNotation(), 
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
	  
		return this._graph.addCell(edge);

	}


	public processChange(change: ChangeRecord){
		let affectedCell = change.id.length>1? this._graph.getModel().getCell(change.id[change.id.length-1]): null;

		switch(change.action){
			case ActionType.Change:
				switch(change.affectedProperty){
					case PropertyType.Name:
						case PropertyType.Label:	this.updateLabelValue(affectedCell, change); break;
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
							this.insertRelationship(change.value);
						else
							this.insertComponent(change.value);
						break;
					case PropertyType.Attributes:
					case PropertyType.Operations:
					case PropertyType.Enums:
						this.insertProperty(affectedCell, change.value);
						break;
				}
				break;
			case ActionType.Remove:
				affectedCell = this._graph.getModel().getCell(change.value);
				this._graph.removeCells([affectedCell], false);
			case ActionType.Lock:
			case ActionType.Release:
				this.updateCellLock(affectedCell); break;
			case ActionType.Label: this.updateLabelValue(affectedCell, change); break;

		}
		this._graph.validateCell(affectedCell, this._graph);
		this._graph.refresh();
	}

	private updateCellLock(affectedCell: mxCell)
	{
		if (!this._graph.isCellLocked(affectedCell))
		{
			// Sets the overlay for the cell in the graph
			this._graph.addCellOverlay(affectedCell, this.editorOverlay);
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
		this._graph.getModel().valueForCellChanged(
			affectedCell,
			this._projectDeveloper._projectDiagram.at(change.id).toUmlNotation()
		);
	}

	release()
	{

		console.log("-----release----")
		console.log(this._activeEditCell);

		if(this._activeEditCell)
			this.stageChange(new ChangeRecord(
				this.getIdPath(this._activeEditCell),
				PropertyType.Editor,
				ActionType.Release,
				new NullUser()
			));
		this._activeEditCell = null;
	}

	lock(cell?: mxCell)
	{
		console.log("-----lock----")
		console.log(cell);

		this.release();
		this._activeEditCell = cell;

		this.stageChange(new ChangeRecord(
			this.getIdPath(cell),
			PropertyType.Editor,
			ActionType.Lock,
			this._projectDeveloper._editor
		));

	}

	getIdPath(x: mxCell): string[]
	{
		let ids = [];
		do{
			ids.unshift(x.id)
			x = x.parent;
		}while(x.parent)

		console.log(`id path =  ${ids}`)
		return ids;
	}

	deleteCell(){
		//delete function
		let currentSelection = this._graph.getSelectionCell();

		if(currentSelection){

			// pointer to item being deleted

			//[ diagram-id, comp-id]
			let deleteIdPath = this.getIdPath(currentSelection); 
			//property-id
			let deleteId = deleteIdPath.pop();


			this._graph.removeCells([currentSelection], false);
			this.stageChange( new ChangeRecord(
				deleteIdPath,
				PropertyType.Elements,	///**** */
				ActionType.Remove,
				deleteId
			));
		}
	}

}

