import { stringify } from "querystring";
import { AbstractClass, 
	ActionType, 
	PropertyType, 
	ChangeRecord, 
	UmlElement,
	Component,
	Class, 
	Dimension, 
	Enumeration, 
	Interface, 
	Relationship, 
	RelationshipType, 
	Operation, Attribute, ComponentProperty, Enumeral, NullUser } from "src/models/DiagramModel";
import { EditorComponent } from "./editor.component";


 //================================================================================================
 //	add  listeners from the catalog
 //================================================================================================

	const _eventCatalog: Map<mxEvent, (...args: any[]) => any > = new Map();
		_eventCatalog.set(mxEvent.LABEL_CHANGED, labelChanged);
		_eventCatalog.set(mxEvent.CELLS_ADDED, cellsAdded);
		_eventCatalog.set(mxEvent.START_EDITING, startEditing);
		_eventCatalog.set(mxEvent.CELL_CONNECTED, cellConnected);
		_eventCatalog.set(mxEvent.EDITING_STOPPED, editingStopped);
		_eventCatalog.set(mxEvent.CELLS_MOVED, cellsMoved);
		_eventCatalog.set(mxEvent.CLICK, click);
		_eventCatalog.set(mxEvent.CONNECT, connect);
		_eventCatalog.set(mxEvent.START, start);
		_eventCatalog.set(mxEvent.SELECT, newSelect);

	/**
	 * applies the indecated event listerns
	 * @param events The type of envents that need to be monitored using mxEvent
	 * @param graph the mxgraph
	 * @param editorComponent the editor component that will recieve notifications via stageChange function
	 */
	export function addListeners(events: mxEvent[], graph: mxGraph, editorComponent: EditorComponent): void
	{
		events.forEach(event =>{
			_eventCatalog.get(event).call(null, graph, editorComponent)
		});
	}


 //================================================================================================
 //	context menue for Relations
 //================================================================================================
	const _relationtypeCatolog: Map<RelationshipType, string> = new Map();
	_relationtypeCatolog.set(RelationshipType.Dependency, 'Dependency');
	_relationtypeCatolog.set(RelationshipType.Association, 'Association');	
	_relationtypeCatolog.set(RelationshipType.Aggregation, 'Aggregation'); 
	_relationtypeCatolog.set(RelationshipType.Composition, 'Composition');	
	_relationtypeCatolog.set(RelationshipType.Generalization, 'Generalization');
	_relationtypeCatolog.set(RelationshipType.Realization, 'Realization');
	
   
	/**
	 * creates a context menu for setting the relation type of an edge
	 * @param graph 
	 * @param editorComponent 
	 */
	export function addContextMenu(graph: mxGraph, editorComponent: EditorComponent): void
	{
		graph.popupMenuHandler.factoryMethod = function(menu, cell, evt)
		{
			console.log(cell)
			if(cell?.edge)// menu if user clicks on edge
			{
				_relationtypeCatolog.forEach((title: string, relationshipType: RelationshipType)=>{
					menu.addItem(title,		EDITOR_IMAGES_UML_PAPTH(title),	()=>setRelationType(cell, relationshipType)).id = title;
				})
			}
		};

		var setRelationType = function(edge: mxCell, relationType: RelationshipType):void
		{
			edge.style = RelationshipType[relationType];
			graph.refresh();

			editorComponent.stageChange(new ChangeRecord(
				editorComponent.getIdPath(edge),
				PropertyType.Type,
				ActionType.Change,
				relationType
			));
		}
	}

 //================================================================================================
 //	Toolbar, drag and drop
 //================================================================================================
	const _prototypeCatalog: Map<any, string > = new Map();
	//iconCatalog.set(prototype, wwwroot/ <<path>>);
	_prototypeCatalog.set( Interface, 'Interface', );
	_prototypeCatalog.set( AbstractClass, 'Abstract');
	_prototypeCatalog.set( Class, 'Class');
	_prototypeCatalog.set( Enumeration, 'Enumeration');
	_prototypeCatalog.set( Attribute, 'Attribute');
	_prototypeCatalog.set( Operation, 'Operation');
	_prototypeCatalog.set( Enumeral, 'Enumeral');

	const EDITOR_IMAGES_UML_PAPTH = (name: string )=> {return `editors/images/uml/${name}.svg`};
	/**
	 * 
	 * @param items the types of items to be included in the toolbar
	 * @param editorComponent 
	 */
	export function addToolbarItems(items: any[], editorComponent: EditorComponent): void
	{
		items.forEach( item =>{
			dragDrop(item, _prototypeCatalog.get(item), editorComponent);
		});	
	}

	/**
	 * Function the fires when a new component is deagged from the toolbar to the diagram
	 * @param prototype the component type (class name) that the tool bar item represents
	 * @param image location of representitive image
	 * @param editorComponent 
	 */
	function dragDrop(prototype, image:  string, editorComponent: EditorComponent)
		: HTMLImageElement |HTMLButtonElement
	{
		// Function that is executed when the image is dropped on
		// the graph. The cell argument points to the cell under
		// the mousepointer if there is one.
		// floor is used to keep the components to snap to the grid
		var drop = function(graph: mxGraph, evt, parentCell, x, y)
		{
			graph.stopEditing(false);

			console.log('%c%s', f_alert, "DRAGDROP");
			console.log(parentCell) //return null if empty space, otherwise cell

			let component = new prototype(); //creates new compnent object of approrate type
			if(component instanceof Component) //if adding new component
			{
				component.dimension.x =   Math.floor(x / 10) * 10;
				component.dimension.y =   Math.floor(y / 10) * 10;

				// graph.setSelectionCell(vertex);
				editorComponent.insertComponent(component);

			// * * * * * * * * * * * * * * * * * StageChange * * * * * * * * * * * * * * * * * //
				editorComponent.stageChange(new ChangeRecord(
					[graph.getDefaultParent().id],
					PropertyType.Elements,
					ActionType.Insert,
					component
				));
			// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * //
			}
			else if(parentCell)//if adding property to component
			{
				var style = graph.getCellStyle(parentCell) as any[];
				while(style['childLayout'] != 'stackLayout' )
				{
					parentCell = parentCell.parent;
					style = graph.getCellStyle(parentCell) as any[];
				}
				
				console.log(parentCell);
				//does this acctualy go here?
				if((component instanceof Attribute 
					&& (parentCell.style == Class.name 
						|| parentCell.style == AbstractClass.name 
						)) ||
					(component instanceof Operation
					&&(parentCell.style == Class.name 
						|| parentCell.style == AbstractClass.name 
						|| parentCell.style == Interface.name 
						)) ||
					( component instanceof Enumeral && parentCell.style == Enumeration.name)
					)
				{
					console.log("this goes here");

					editorComponent.insertProperty(parentCell, component);

				// * * * * * * * * * * * * * * * * * StageChange * * * * * * * * * * * * * * * * * //
					editorComponent.stageChange(new ChangeRecord(
						editorComponent.getIdPath(parentCell),
						component instanceof Operation? 
								PropertyType.Operations: component instanceof Attribute?
								PropertyType.Attributes: PropertyType.Enums,
						ActionType.Insert,
						component
					));
				// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * //
				} else
				{
					console.log(`${component.constructor.name} type object does NOT go here`);
				}
			}
		}
		
		// Creates the image which is used as the drag icon (preview)
		var img = editorComponent.toolbar.addMode("Drag", EDITOR_IMAGES_UML_PAPTH(image), function(evt, cell)
		{
			var pt = editorComponent.graph.getPointForEvent(evt, true);
			drop(editorComponent.graph, evt, cell, pt.x, pt.y);
		});
		img.id = image;
		mxUtils.makeDraggable(img, editorComponent.graph, drop);
		
		return img;
	}


 //================================================================================================
 //	listeners
 //================================================================================================
	/**
	 * function that fires when a lable changes
	 * @param graph 
	 * @param editorComponent 
	 */
	function labelChanged(graph: mxGraph, editorComponent: EditorComponent)
	{
		graph.addListener(mxEvent.LABEL_CHANGED,
			// on change label event 
			function(eventSource, eventObject){
				console.log('%c%s', f_alert, "LABEL_CHANGED");
				let affectedCells = eventObject.getProperties().cell;

				// * * * * * * * * * * * * * * * * * StageChange * * * * * * * * * * * * * * * * * //
				editorComponent.stageChange( new ChangeRecord(
					editorComponent.getIdPath(affectedCells),
					PropertyType.Label, 
					ActionType.Label,
					affectedCells.value
				));
				// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * //
		});
	}


	/**
	 * 
	 * @param graph 
	 * @param editorComponent 
	 */
	function cellsMoved(graph: mxGraph, editorComponent: EditorComponent)
	{
		graph.addListener(mxEvent.CELLS_MOVED,
			// on cell move event
			function(eventSource, eventObject){
				let affectedCells: mxCell[] = eventObject.getProperties().cells;

				console.log('%c%s', f_alert, "CELLS_MOVED");
				console.log(affectedCells);

				for( let cell of affectedCells)
				// * * * * * * * * * * * * * * * * * StageChange * * * * * * * * * * * * * * * * * //
					editorComponent.stageChange(new ChangeRecord(
						editorComponent.getIdPath(cell),
						PropertyType.Dimension,
						ActionType.Shift,
						{ // new absolute location
							x: cell.geometry.x,
							y: cell.geometry.y,
						}
					));
				// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * //
			});
	}

	/**
	 * 
	 * @param graph 
	 * @param editorComponent 
	 */
	function editingStopped(graph: mxGraph, editorComponent: EditorComponent)
	{
		graph.addListener(mxEvent.EDITING_STOPPED,
			//
			function(eventSource, eventObject){
				console.log('%c%s', f_alert, "EDITING_STOPPED");

				editorComponent.release();
			});
	}

	/**
	 * triggers when users make changes to existing edges/relations
	 * @param graph 
	 * @param editorComponent 
	 */
	function cellConnected(graph: mxGraph, editorComponent: EditorComponent)
	{
		graph.addListener(mxEvent.CELL_CONNECTED, 
			//event when  edge is connected or disconeccted from a cell
			function(eventSource, eventObject){
				let affectedEdge = eventObject.getProperties();
				
				
				console.log('%c%s', f_alert, "CELL_CONNECTED");
				console.log(`edge: ${affectedEdge.edge.id}\nsource(from): ${affectedEdge.edge.source?.id}\ntarget(to): ${affectedEdge.edge.target?.id}`);

				if( isUuid(affectedEdge.edge.id)){
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
					// * * * * * * * * * * * * * * * * * StageChange * * * * * * * * * * * * * * * * * //
						editorComponent.stageChange(new ChangeRecord(
								editorComponent.getIdPath(affectedEdge.edge),
								affecedProperty,
								ActionType.Change,
								value
							));
					// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * //

					// move edge point if disconnected
					// set the location of the disconected end
					if(isDisconnectioning || isMovingTerminal)
					// * * * * * * * * * * * * * * * * * StageChange * * * * * * * * * * * * * * * * * //
						editorComponent.stageChange( new ChangeRecord(
							editorComponent.getIdPath(affectedEdge.edge),
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
						));
					// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * //
				}
		});
			
	}

	/**
	 * 
	 * @param id 
	 * @returns 
	 */
	function isUuid(id: string):boolean
	{ 
		//TODO: better way to validate id
		let uuidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
		return uuidRegex.test(id);
	}

	/**
	 * 
	 * @param graph 
	 * @param editorComponent 
	 */
	function startEditing(graph: mxGraph, editorComponent: EditorComponent)
	{
		graph.addListener(mxEvent.START_EDITING, 
			// When double click on cell to change label
			function(eventSource, eventObject){
				let affectedCells = eventObject.getProperties().cell;
				console.log('%c%s', f_alert, "START_EDITING");

				console.log(affectedCells);
				editorComponent.lock(affectedCells);

			});
	}


	/**
	 * 
	 * @param graph 
	 * @param editorComponent 
	 */
	function start(graph: mxGraph, editorComponent: EditorComponent)
	{
		graph.addListener(mxEvent.START, 
			// When double click on cell to change label
			function(eventSource, eventObject){
				let affectedCells = eventObject.getProperties().cell;
				console.log('%c%s', f_alert, "START");

				console.log(affectedCells.cell.id);
			});
	}

	/**
	 * 
	 * @param graph 
	 * @param editorComponent 
	 */
	function cellsAdded(graph: mxGraph, editorComponent: EditorComponent)
	{
		graph.addListener(mxEvent.CELLS_ADDED, 
			// mxEvent.ADD_CELLS
			function(eventSource, eventObject){
				let affectedCells = eventObject.getProperties().cells;
				console.log('%c%s', f_alert, "CELLS_ADDED ");
				console.log(affectedCells);
			});
	}
	
	/**
	 * used for Lock unlock event
	 * @param graph 
	 * @param editorComponent 
	 */
	function click(graph: mxGraph, editorComponent: EditorComponent)
	{
		var click = 0;
		// TODO: need to come up with a better way to lock items.
		graph.addListener(mxEvent.CLICK, 
			// click on object to see its makup.
			function(eventSource, eventObject){
				let affectedCells = eventObject.getProperties().cell;
				console.log('%c%s',f_alert, "mxCell description");
				console.log(affectedCells);
				if(eventSource.lastMouseX){	
					let x = eventSource.lastMouseX;
					let y = eventSource.lastMouseY;
					let coords = `${click++}:\t(${x},${y})`
					console.log('%c%s',f_info, coords);
					// graph.insertVertex(graph.getDefaultParent(), null, coords, x-212, y-64, 10, 10, 'ClickHere');
				}
				if(graph.isCellLocked(affectedCells))
					affectedCells = undefined;
				if(affectedCells == undefined )
					graph.clearSelection();
				
			});
	}

	/**
	 * function that fires when a new edge/relation is drawn between 2 compnents
	 * @param graph 
	 * @param editorComponent 
	 */
	function connect(graph: mxGraph, editorComponent: EditorComponent)
	{
		//listener for new connections
		graph.connectionHandler.addListener(mxEvent.CONNECT, 
			function(eventSource, eventObject){
				let affectedCells = eventObject.getProperties('cell').cell;
				console.log('%c%s', f_alert, "connectionHandler.CONNECT");
				console.log(affectedCells);

				if(affectedCells.edge)
				{
					//new relationship
					let relation = new Relationship();
					relation.source = affectedCells.source.id;
					relation.target = affectedCells.target?.id; // may be null

					relation.dimension = new Dimension(
						affectedCells.geometry.x,
						affectedCells.geometry.y,
						affectedCells.geometry.targetPoint?.x | affectedCells.geometry.width,
						affectedCells.geometry.targetPoint?.y| affectedCells.geometry.height,
					);

					relation.type = affectedCells.style | RelationshipType.Association;

					affectedCells.id = relation.id;
					affectedCells.value = relation.attributes;
					affectedCells.style = RelationshipType[relation.type]

				// * * * * * * * * * * * * * * * * * StageChange * * * * * * * * * * * * * * * * * //
					editorComponent.stageChange(new ChangeRecord(
						[graph.getDefaultParent().id],
						PropertyType.Elements,
						ActionType.Insert,
						relation
					));
				// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * //

				}
			});
	}


	/**
	 * doesnt do anthing yet
	 * @param graph 
	 * @param editorComponent 
	 */
	function select(graph: mxGraph, editorComponent: EditorComponent)
	{
		//listener template
		graph.getSelectionModel().addListener(mxEvent.SELECT, 
			// NADA
			function(eventSource, eventObject){
				let affectedCells = eventObject.getProperties().cell;
				console.log('%c%s', f_alert, "mxEvent.SELECT");
				console.log(affectedCells);
			});
	}

	function newSelect(graph: mxGraph, editorComponent: EditorComponent)
	{
		graph.addListener(mxEvent.SELECT, 
			function(eventSource, eventObject){
				console.log(`\n\nmxEvent.SELECT\n ${eventObject}`);
				console.log(eventObject);
				
			});
	}


	function template(graph: mxGraph, editorComponent: EditorComponent){
		//listener template
		graph.addListener(mxEvent.FIRED, 
			// NADA
			function(eventSource, eventObject){
				let affectedCells = eventObject.getProperties().cell;
				console.log('%c%s', f_alert, "");
				console.log(affectedCells);
			});
	}



var f_info = 'width: 100%; background: yellow; color: navy;';
var f_alert = 'text-align: center; width: 100%; background: black; color: red; font-size: 1.5em;';