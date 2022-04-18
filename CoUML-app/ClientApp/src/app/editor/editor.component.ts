import { AfterViewInit, Component as AngularComponent, ElementRef, OnInit, ViewChild, HostListener } from '@angular/core';
import { TYPE, User, Class, AbstractClass, Diagram,  Component, Attribute, Interface, Operation, Relationship, RelationshipType, VisibilityType, ChangeRecord, ActionType, PropertyType, ICollectionIterator, Enumeration, Dimension, DEFUALT_DIMENSION, NullUser, ComponentProperty, UmlElement, Enumeral, IUser } from 'src/models/DiagramModel';
import { ProjectDeveloper } from '../controller/project-developer.controller';
import * as EditorFormatHandler  from './editor-format.handler';
import * as EditorEventHandler  from './editor-event.handler';
import { Event } from 'jquery';


const DELETE = 46;
const BACKSPACE = 8;

/**
 * https://github.com/typed-mxgraph/typed-mxgraph
 */
@AngularComponent({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.styles.css'],
})
export class EditorComponent implements AfterViewInit{

	private _graph: mxGraph;

	// editorOverlay: mxCellOverlay;

	_activeEditCell: mxCell = null;

	@ViewChild('graphContainer', { read: ElementRef, static: true })
	public graphContainer: ElementRef<HTMLElement>;

	@ViewChild('toolbarContainer', { read: ElementRef, static: true })
	public toolbarContainer: ElementRef<HTMLElement>;

	constructor(
		private _projectDeveloper: ProjectDeveloper
	) {
		console.log("EditorComponent\n", this, "\nwith\n", arguments);
		this._projectDeveloper.subscribe(this);
		this.onResize();
	}

    	private _toolbar: mxToolbar;
	get isDiagramSet()
	{
		return this._projectDeveloper.isDiagramSet();
	}

	get toolbar(){ return this._toolbar;}
	get graph(){return this._graph;}


	/** frame controls */

	canvasHeight: number;
	canvasWidth: number;

	toolbarWidth: number = 215;
	
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
	ngAfterViewInit(): void 
	{
		this.initGraph();
		this.initToolbar();
	}

	initGraph()
	{

		this._graph = new mxGraph(this.graphContainer.nativeElement);
		this._graph.setDropEnabled(true); // ability to drag elements as groups

		// UML styles
		EditorFormatHandler.addEdgeStyles(this._graph);
		EditorFormatHandler.addCellStyles(this._graph);
		EditorFormatHandler.initLayoutManager(this._graph);

		//user events
		EditorEventHandler.addListeners(
			[
				mxEvent.LABEL_CHANGED,
				mxEvent.CELLS_ADDED,
				mxEvent.START_EDITING, 
				mxEvent.EDITING_STOPPED,
				mxEvent.CELL_CONNECTED, 
				mxEvent.CELLS_MOVED,
				mxEvent.CLICK,
				mxEvent.SELECT,
				mxEvent.CONNECT,
				// mxEvent.END_EDIT,
			],
			this._graph,
			this
		);

		//special context menu on graph
		mxEvent.disableContextMenu(this.graphContainer.nativeElement);
		EditorEventHandler.addContextMenu( this._graph, this);

		// Key binding
		// Adds handling of return and escape keystrokes for editing
		this._editorKeyHandler = new mxKeyHandler(this._graph);
		this._editorKeyHandler.bindKey(DELETE, ()=>this.deleteCell()); 
		this._editorKeyHandler.bindKey(BACKSPACE, ()=>this.deleteCell()); 

		/**
		 * set callback that a cell is locked if it has an ovelay,
		 * a cell has an overlau if it has an user
		 */
		this._graph.isCellLocked = function(cell: mxCell)
		{
			// if* the cell has an overlay *then* somone is using it and the cell is locked
			return cell?.overlays?.length > 0 || false;
		}

		// this.editorOverlay = new mxCellOverlay(
		// 	new mxImage('editors/images/overlays/user3.png', 24, 24), "locked by other user");
		
		let baseIsValidDropTarget = this._graph.isValidDropTarget;
		this._graph.isValidDropTarget = function (cell: mxCell, cells: mxCell[], evt: Event){
			return this.isDiagramSet? baseIsValidDropTarget(cell, cells, evt): false;
		}
		
	}

	initToolbar()
	{
		//init toolbar div
		this._toolbar = new mxToolbar(this.toolbarContainer.nativeElement);
		EditorEventHandler.addToolbarItems(
			[Class, AbstractClass, Interface, Enumeration, Attribute, Operation, Enumeral],
			this
		);
	}
		
	/**
	 * stage the change initiated by the user
	 * @param change 
	 */
	public stageChange(change: ChangeRecord, updateSelf: boolean = false): void
	{
		//console.log(`GRAPH EVENT---------Change Staged-------\n${change.toString()}`);

		this._projectDeveloper.stageChange(change, updateSelf);
	}

	/**Draw ********************************************************************************** */
	/**
	 * template to draw diagram
	 * @param projectDiagram  Diagram to be drawn
	 */
	public draw(projectDiagram: Diagram) 
	{
		this.clearGraph();
		//turn off notifications before drawing new graph 
		this._graph.eventsEnabled = false;

		//enable green edge creationsion function
		this._graph.setConnectable(true);

		//set defualt parrent id to diagram id
		this._graph.getDefaultParent().id = projectDiagram.id;

		this._graph.getModel().beginUpdate();
		try {

			let elementIterator: ICollectionIterator<UmlElement> 
				= projectDiagram.elements.iterator();
			
			// relationships will be added after all components are added
			let relatioships = []; 
			
			while(elementIterator.hasNext())
			{
				let element = elementIterator.getNext();

				if( element instanceof Relationship)
						relatioships.push(element);
				else if(element instanceof Component){
					this.insertComponent(element);
					//todo: lock cells on draw & release on close
					// if(element.editor instanceof User)
						// this.updateCellLock(graphComponent);
				}
				
			}

			for( let element  of relatioships)
				this.insertRelationship(element).umlElement = element;
					
		} finally {
			this._graph.getModel().endUpdate();
			this._graph.eventsEnabled = true;
		}
	}
	
	public insertComponent(component: Component):mxCell 
	{

		console.log("this._graph.insertVertex");

		let graphComponent = this._graph.insertVertex(
			this._graph.getDefaultParent(),
			component.id, 
			component.name, 
			component.dimension.x, 
			component.dimension.y, 
			component.dimension.width, 
			component.dimension.height,
			component[TYPE]
		);

		this.updateStyle(graphComponent, component.dimension.fillColor);
		
		if(component instanceof AbstractClass || component instanceof Class)
		{
			let attributeIterator: ICollectionIterator<Attribute> = component.attribute.iterator();

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

		graphComponent.umlElement = component;
		return graphComponent;
	}


	public insertProperty(parent: mxCell, property: UmlElement): mxCell
	{
		let propertyGraphComponent =  this._graph.insertVertex(
			parent,
			property.id,
			property.toUmlNotation(),
			0, 0, 0, 0,
			property.constructor.name
		);
		propertyGraphComponent.umlElement = property;
		return propertyGraphComponent;
	}

	public insertRelationship(relation: Relationship): mxCell
	{	
		var edge = new mxCell(
			relation.toUmlNotation(), 
			new mxGeometry(0, 0, 0, 0), 
			RelationshipType[relation.type]);
		edge.edge = true;
		edge.id = relation.id
		edge.geometry.relative = true;
		edge.style = RelationshipType[relation.type];
		edge.umlElement = relation;
		
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

	/* **************************************************************************************** */
	public processChange(change: ChangeRecord)
	{
		let affectedCell = this._graph.getModel().getCell(change.id[change.id.length-1]);
		// console.log(`---------PROCESSINGCHANGE-------
		// ${ActionType[change.action]} . ${PropertyType[change.affectedProperty]}
		// ${change.id}
		// value-> ${change.value}`);
		// console.log(affectedCell);

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
					case PropertyType.Attribute:
					case PropertyType.Operations:
					case PropertyType.Enums:
						this.insertProperty(affectedCell, change.value);
						break;
				}
				break;
			case ActionType.Remove:
				this.removeCell(this._graph.getModel().getCell(change.value)); break;
			case ActionType.Lock:
				this.updateLockCell(affectedCell, change.value); break;
			case ActionType.Release:
				this.updateReleaseCell(affectedCell); break;
			case ActionType.Label: this.updateLabelValue(affectedCell, change); break;

			case ActionType.Style: this.updateStyle(affectedCell, change.value); break;

		}
		this._graph.validateCell(affectedCell, this._graph);
		this._graph.refresh();
	}


	updateStyle(affectedCell: mxCell, color: any) {
		this._graph.setCellStyles(mxConstants.STYLE_FILLCOLOR, color, [affectedCell])
		this._graph.refresh();
	}

	/** Lock/Release ****************************************************************************
	 * place or remove overlay lock on cell
	 * @param affectedCell 
	 * @param change change.actiorn is Lock or Release
	 */
	private _lockedCellLogs: Map<string, mxCellOverlay> = new Map<string, mxCellOverlay>();

	private updateReleaseCell(affectedCell: mxCell)
	{
		this._graph.removeCellOverlay(affectedCell, this._lockedCellLogs.get(affectedCell.id));
	}

	updateLockCell(affectedCell: mxCell, user: IUser)
	{
		let activeteam = this._projectDeveloper._teamActivity.getTeamMember(user); 
		this._lockedCellLogs.set(affectedCell.id, 
			this._graph.addCellOverlay(affectedCell, new mxCellOverlay( new mxImage(
				activeteam.iconFilePath, 36, 24), 
				activeteam.user.id 
			)));
	}
	/* **************************************************************************************** */


	/** Geometry ********************************************************************************
	 * change the shape of a cell
	 * @param affectedCell 
	 * @param change 
	 */
	private updateCellGeometry(affectedCell: mxCell, change: ChangeRecord) 
	{
		let newCellGeometry = this._graph.getCellGeometry(affectedCell).clone();
		newCellGeometry.x = change.value.x;
		newCellGeometry.y = change.value.y;
		this._graph.getModel().setGeometry(affectedCell, newCellGeometry);
	}
	/* **************************************************************************************** */

	/** EDGE *********************************************************************************
	 * change the shape of an edge
	 * @param affectedEdge 
	 * @param change 
	 */
	private updateEdgeGeometry(affectedEdge: mxCell, change: ChangeRecord) 
	{
		let isSource = !(change.value.height);
		
		let point = isSource?
			new mxPoint(change.value.x, change.value.y):
				new mxPoint(change.value.width, change.value.height);

		let newEdgeGeometry = affectedEdge.getGeometry().clone();
		newEdgeGeometry.setTerminalPoint(point, isSource);

		this._graph.getModel().setGeometry(affectedEdge, newEdgeGeometry);
	}
	
	/**
	 * change the edge connection ponts
	 * @param affectedEdge 
	 * @param change 
	 */
	private updateEdgeConnections(affectedEdge: mxCell, change: ChangeRecord) 
	{
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
	/* **************************************************************************************** */

	/**
	 * change the value of a label
	 * @param affectedCell 
	 * @param change 
	 */
	private updateLabelValue(affectedCell: mxCell, change: ChangeRecord)
	{
		console.log("-----UPDATELABEL----")
		console.log(affectedCell);
		this._graph.getModel().valueForCellChanged(
			affectedCell,
			affectedCell.umlElement.toUmlNotation()
		);
	}

	private removeCell(cellToBeRemoved: mxCell)
	{
		this._graph.removeCells([cellToBeRemoved], false);
	}

// ============================================================================================
// user actiorn controls lock, release, delete ================================================
// ============================================================================================

	/**
	 * fires a cell release change record for the cell of the current active cell
	 */
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

	/**
	 * fires a cell lock change record, release the current active cell, and sets the current active cell
	 * @param cell the cell that the user would like to lock
	 */
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
			this._projectDeveloper._teamActivity.getUser().user 
		));
	}

	/**
	 * fires a delete action for the current active cell
	 */
	deleteCell(){
		//delete function
		let currentSelection = this._graph.getSelectionCell();

		if(currentSelection){

			// pointer to item being deleted

			//[ diagram-id, comp-id]
			let deleteIdPath = this.getIdPath(currentSelection); 
			//property-id
			let deleteId = deleteIdPath.pop();


			this.removeCell(currentSelection);
			this.stageChange( new ChangeRecord(
				deleteIdPath,
				PropertyType.Elements, 
				ActionType.Remove,
				deleteId
			));
		}
	}

	clearGraph()
	{
		this._graph.selectAll(this._graph.getDefaultParent(), true);
		this._graph.removeCells(this._graph.getSelectionCells(), true);
	}

	/**
	 * friend function to get the full path from the root parent to the cell
	 */
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

}

