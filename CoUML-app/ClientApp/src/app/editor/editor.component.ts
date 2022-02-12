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

	_changes: ChangeRecord[] = [];

	recordChange(change: ChangeRecord)
	{
		this._changes.push(change);
		this._projectDeveloper.makeChanges(this._changes);
	}

	myBoo(x){console.log('%c\t\t%s\t\t', 'font-size: 16pt; background: #222; color: #bada55', x);}

	/*

	this["DiagramEditorChanges"].makeChanges([]);
	
	*/

	public draw() {
		this.graphContainer = new mxGraph(this.container.nativeElement);
		// this.graphContainer["_projectDeveloper"] = this._projectDeveloper;
		var EditorComponent = this;
		this.graphContainer.getModel().beginUpdate();


		// on change label event 
		this.graphContainer.labelChanged = function(cell, newValue){
			console.log("cell");
			console.log(cell);
			console.log("newValue");
			console.log(newValue);
			
			if (newValue != null){
				mxGraph.prototype.labelChanged.apply(this, arguments);
				EditorComponent.recordChange( new ChangeRecord(
					[cell.id],
					PropertyType.Name, 
					ActionType.Change,
					newValue
				));
			}
			return null;
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
		this.graphContainer.getModel().setValue(
			this.graphContainer.getModel().getCell(change.id[0]),
			change.value
		);
	}

	//***************************************************/

	public open()
	{
		this._projectDeveloper.open(this.diagramId);
	}

	public makeTestChange()
	{	
		let changes: ChangeRecord[] = [];

		// class
		let c: Class  =  new Class("Triangle");
		let a: Attribute = new Attribute();
		a.visibility = VisibilityType.Private;
		a.type = {dataType: "double"};
		c.attributes.insert(a);

		// c impliments i
		let r: Relationship = new Relationship();
		r.type = RelationshipType.Realization;
		r.fromCompnent(c);
		r.to = this._projectDeveloper.__parentId;

		// make relation
		c.relations.insert(r.id)

		let me  =  new Operation();
		me.isStatic  = false;
		me.name = "delete";
		me.visibility = VisibilityType.Public;

		// changes.push(new ChangeRecord(
		// 	null,
		// 	PropertyType.Elements,
		// 	ActionType.Insert,
		// 	c
		// ),
		// new ChangeRecord(
		// 	null,
		// 	PropertyType.Elements,
		// 	ActionType.Insert,
		// 	r
		// ),
		// new ChangeRecord(
		// 	[this._projectDeveloper.__parentId],
		// 	PropertyType.Relations,
		// 	ActionType.Insert,
		// 	r.id
		// ),
		// new ChangeRecord(
		// 	[this._projectDeveloper.__parentId],
		// 	PropertyType.Operations,
		// 	ActionType.Insert,
		// 	me
		// )
		// );

		this._projectDeveloper.makeChanges(changes)
	}
}

