import { AfterViewInit, Component as AngularComponent, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Class, AbstractClass, Diagram, DiagramElement, Component, Attribute, Interface, Operation, Relationship, RelationshipType, VisibilityType, ChangeRecord, ActionType, PropertyType, ICollectionIterator, Enumeration, Dimension } from 'src/models/DiagramModel';
import { ProjectDeveloper } from '../controller/project-developer.controller';
import * as EditorFormatHandler  from './editor-format.handler';
import * as EditorNotificationHandler  from './editor-notification.handler';

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

	@ViewChild('graphContainer', { read: ElementRef, static: true })
	public graphContainer: ElementRef<HTMLElement>;

	@ViewChild('toolbarContainer', { read: ElementRef, static: true })
	public toolbarContainer: ElementRef<HTMLElement>;

    private _toolbar: mxToolbar;

	constructor(
		private _projectDeveloper: ProjectDeveloper
	) {
		this._projectDeveloper.subscribe(this);
	}

	ngAfterViewInit(): void {
		this._graph = new mxGraph(this.graphContainer.nativeElement);
		// this._graph.init(this.graphContainer.nativeElement);
		EditorFormatHandler.addEdgeStyles(this._graph);
		EditorFormatHandler.addCellStyles(this._graph);
		EditorFormatHandler.intiLayoutManager(this._graph);

		EditorNotificationHandler.addListeners(
			[
				mxEvent.LABEL_CHANGED,
				mxEvent.CELLS_ADDED,
				mxEvent.START_EDITING, 
				mxEvent.CELL_CONNECTED, 
				mxEvent.EDITING_STOPPED,
				mxEvent.CELLS_MOVED,
				mxEvent. CLICK
			],
			this._graph,
			this
		);
        this._toolbar = new mxToolbar(this.toolbarContainer.nativeElement);
		this.addToolbarItems();

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
		this._graph.getModel().beginUpdate();
		try {
			const parent = this._graph.getDefaultParent();

			let elementIterator: ICollectionIterator<DiagramElement> 
				= this._projectDeveloper._projectDiagram.elements.iterator();
			
			// relationships will be added after all components are added
			let relatioships = []; 
			
			while(elementIterator.hasNext())
			{
				let diagramElement = elementIterator.getNext();

				if(diagramElement instanceof Component){
					let component = this._graph.insertVertex(
						parent,
						diagramElement.id, 
						diagramElement.name, 
						diagramElement.dimension.x, 
						diagramElement.dimension.y, 
						diagramElement.dimension.width, 
						diagramElement.dimension.height,
						diagramElement.constructor.name
					);
					
					if(diagramElement instanceof AbstractClass || diagramElement instanceof Class)
					{
						let attributeIterator: ICollectionIterator<Attribute> = diagramElement.attributes.iterator();

						while(attributeIterator.hasNext())
						{
							let attribute  = attributeIterator.getNext();
							this._graph.insertVertex(
								component,
								attribute.id,
								attribute.name,
								0, 0, 
								diagramElement.dimension.width, 
								diagramElement.dimension.height, 
							)
						}
					}
					if(diagramElement instanceof AbstractClass 
						|| diagramElement instanceof Class
						|| diagramElement instanceof Interface)
					{
						let operatorIterator: ICollectionIterator<Operation> = diagramElement.operations.iterator();

						while(operatorIterator.hasNext())
						{
							let operator  = operatorIterator.getNext();
							this._graph.insertVertex(
								component,
								operator.id,
								operator.name,
								0, 0, 
								diagramElement.dimension.width, 
								diagramElement.dimension.height, 
							)
						}
					}

				}
				else if( diagramElement instanceof Relationship){
						relatioships.push(diagramElement)
				}
			}

			for( let relation  of relatioships)
			{
				// TODO : figure out how to insert an edge that has no source or target 
				this._graph.insertEdge(
					parent, 
					relation.id, 
					relation.attributes.toString(), 
					this._graph.getModel().getCell(relation.source), 
					this._graph.getModel().getCell(relation.target),
					RelationshipType[relation.type]
				);
			}
					
		} finally {
			this._graph.getModel().endUpdate();

			// turn notifications back on
			this._graph.eventsEnabled = true;
		}
	}
	
	public processChange(change: ChangeRecord){
		let affectedCell = this._graph.getModel().getCell(change.id[0]);
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

	addToolbarItems()
	{
		let iconCatalog = new Map();
		iconCatalog.set('editors/images/rectangle.gif', Interface.name);
		iconCatalog.set('editors/images/ellipse.gif', AbstractClass.name);
		iconCatalog.set('editors/images/rhombus.gif', Class.name);
		iconCatalog.set('editors/images/triangle.gif', Enumeration.name);

		iconCatalog.forEach((style, path)=>this.addItemToToolbar(path, style));
	}

	addItemToToolbar(iconPath, style)
	{
		var componentPrototype = new mxCell(null, new mxGeometry(0, 0, 120, 20), style);
		componentPrototype.setVertex(true);
	
		var img = this.dragDrop(componentPrototype, iconPath);
	}

	dragDrop(prototype, image)
	{
		// Function that is executed when the image is dropped on
		// the graph. The cell argument points to the cell under
		// the mousepointer if there is one.
		// floor is used to keep the components to snap to the grid
		var drop = function(graph, evt, cell, x, y)
		{
			graph.stopEditing(false);

			var vertex = graph.getModel().cloneCell(prototype);
			vertex.geometry.x = Math.floor(x / 10) * 10; 
			vertex.geometry.y = Math.floor(y / 10) * 10;
				
			graph.addCell(vertex);
			graph.setSelectionCell(vertex);
		}
		
		// Creates the image which is used as the drag icon (preview)
		var img = this._toolbar.addMode("Drag", image, function(evt, cell)
		{
			var pt = this.graph.getPointForEvent(evt);
			drop(this._graph, evt, cell, pt.x, pt.y);
		});
		
		mxUtils.makeDraggable(img, this._graph, drop);
		
		return img;
	}

	private nest(size: number): number
	{
		// return Math.floor((size * 0.95)/10) * 10;
		return size;
	}
}

