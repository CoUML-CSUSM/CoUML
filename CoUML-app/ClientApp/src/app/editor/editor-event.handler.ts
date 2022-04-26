import { AbstractClass, 
	ActionType, 
	PropertyType, 
	ChangeRecord, 
	UmlElement,
	Component,
	Class, 
	Dimension, Point,
	Enumeration, 
	Interface, 
	Relationship, 
	RelationshipType, 
	Operation, Attribute, ComponentProperty, Enumeral, NullUser } from "src/models/DiagramModel";
import { EditorComponent } from "./editor.component";
import { EditorColors } from "./editor.resources";


 //================================================================================================
 //	add  listeners from the catalog
 //================================================================================================

	const _eventCatalog: Map<mxEvent, (...args: any[]) => any > = new Map();
		_eventCatalog.set(mxEvent.LABEL_CHANGED, labelChanged);
		// _eventCatalog.set(mxEvent.CELLS_ADDED, cellsAdded);
		_eventCatalog.set(mxEvent.START_EDITING, startEditing);
		_eventCatalog.set(mxEvent.EDITING_STOPPED, editingStopped);
		_eventCatalog.set(mxEvent.CELL_CONNECTED, cellConnected);
		_eventCatalog.set(mxEvent.CELLS_MOVED, cellsMoved);
		_eventCatalog.set(mxEvent.CLICK, click);
		_eventCatalog.set(mxEvent.CONNECT, connect);
		// _eventCatalog.set(mxEvent.START, start);
		// _eventCatalog.set(mxEvent.SELECT, newSelect);
		// _eventCatalog.set(mxEvent.END_EDIT, endEdit);

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

	const _colorCatolog: Map<string, string> = new Map();
	_colorCatolog.set('FIRERED', EditorColors.FIRERED);
	_colorCatolog.set('FLAMINGOPINK', EditorColors.FLAMINGOPINK);
	_colorCatolog.set('CANNARYYELLOW', EditorColors.CANNARYYELLOW);
	_colorCatolog.set('BUTTERYELLOW', EditorColors.BUTTERYELLOW);
	_colorCatolog.set('LIMEGREEN', EditorColors.LIMEGREEN);
	_colorCatolog.set('ARCTICBLUE', EditorColors.ARCTICBLUE);
	_colorCatolog.set('CERULEANBLUE', EditorColors.CERULEANBLUE);
	_colorCatolog.set('PURPLE', EditorColors.PURPLE);
	_colorCatolog.set('LIGHTGRAY', EditorColors.LIGHTGRAY);
	_colorCatolog.set('WHITE', EditorColors.WHITE);
   
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
					menu.addItem(title, EDITOR_IMAGES_UML_PAPTH('uml',title), ()=>setRelationType(cell, relationshipType))
						.id = title;
				})
			}
			else if(cell?.umlElement instanceof Component)// menu if user clicks on cell
			{
				_colorCatolog.forEach((hex: string, color: string)=>{
					menu.addItem(
						color,
					EDITOR_IMAGES_UML_PAPTH('colors', color),
					()=>setStyle(cell, hex))
					.id = color;
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

		var setStyle = function(component: mxCell, color: string):void
		{
			editorComponent.updateStyle(component, color);

			editorComponent.stageChange(new ChangeRecord(
				editorComponent.getIdPath(component),
				PropertyType.Dimension,
				ActionType.Style,
				color
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
	const EDITOR_IMAGES_UML_PAPTH = (folder: string, name: string )=> {return `resources/${folder}/${name}.svg`};

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
					&& (parentCell.umlElement instanceof Class // == "CoUML_app.Models.Class"
						|| parentCell.umlElement instanceof AbstractClass //  "CoUML_app.Models.AbstractClass"
						)) ||
					(component instanceof Operation
					&&(parentCell.umlElement instanceof Class //  "CoUML_app.Models.Class"
						|| parentCell.umlElement instanceof AbstractClass //  "CoUML_app.Models.AbstractClass"
						|| parentCell.umlElement instanceof Interface //  "CoUML_app.Models.Interface"
						)) ||
					( component instanceof Enumeral && parentCell.umlElement instanceof Enumeration )//  "CoUML_app.Models.Enumeration")
					)
				{
					console.log("this goes here");
					console.log(component);
					editorComponent.insertProperty(parentCell, component);

				// * * * * * * * * * * * * * * * * * StageChange * * * * * * * * * * * * * * * * * //

					editorComponent.stageChange(new ChangeRecord(
						editorComponent.getIdPath(parentCell),
						component instanceof Operation? 
								PropertyType.Operations: component instanceof Attribute?
								PropertyType.Attribute: PropertyType.Enums,
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
		var img = editorComponent.toolbar.addMode("Drag", EDITOR_IMAGES_UML_PAPTH('uml', image), function(evt, cell)
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
			function(eventSource, eventObject){
				console.log('%c%s', f_alert, "LABEL_CHANGED");
				let affectedCells = eventObject.getProperties().cell;

				//if the cell is an association edge connected to an object, set the datatype of attribute to object
				if(affectedCells.edge && affectedCells.target && affectedCells.style == RelationshipType[RelationshipType.Association])
				{
					let group2IsDataType = /([\+\-\#\~]?\s*\w+)(\:\s*\w*)*(.*)*/i
					let valueTokens = affectedCells.value.match(group2IsDataType);
					if(valueTokens)
					{
						valueTokens[2] = `: ${affectedCells.target.value}`;
						affectedCells.value = `${valueTokens[1]}: ${affectedCells.target.value} ${valueTokens[3] || ""}`;
					}
				}

				//calls internal UML Element
				affectedCells.umlElement.label( affectedCells.value);
				let userEnteredValue = affectedCells.value;
				affectedCells.value = affectedCells.umlElement.toUmlNotation(); 
				// * * * * * * * * * * * * * * * * * StageChange * * * * * * * * * * * * * * * * * //
				editorComponent.stageChange( new ChangeRecord(
					editorComponent.getIdPath(affectedCells),
					PropertyType.Label, 
					ActionType.Label,
					userEnteredValue
				), true);
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
						new Point( cell.geometry.x, cell.geometry.y )
					));
				// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * //
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
					console.log(`update edge`)
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

					if(isConnectioning && affectedEdge.edge.style == RelationshipType[RelationshipType.Association] && affectedEdge.edge.value)
					{
						let group2IsDataType = /([\+\-\#\~]?\s*\w+)(\:\s*\w*)*(.*)*/i
						let valueTokens = affectedEdge.edge.value.match(group2IsDataType);
						valueTokens[2] = `: ${affectedEdge.edge.target.value}`
						affectedEdge.edge.value = `${valueTokens[1]}: ${affectedEdge.edge.target.value} ${valueTokens[3] || ""}`
						// * * * * * * * * * * * * * * * * * StageChange * * * * * * * * * * * * * * * * * //
							editorComponent.stageChange( new ChangeRecord(
								editorComponent.getIdPath(affectedEdge.edge),
								PropertyType.Label, 
								ActionType.Label,
								affectedEdge.edge.value
							), true);
						// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * //
					}

					
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
			// fires When double click on cell to change label
			function(eventSource, eventObject){
				let affectedCells = eventObject.getProperties().cell;
				console.log('%c%s', f_alert, "START_EDITING");
				if(affectedCells.edge)
					affectedCells.value = affectedCells.umlElement?.attribute?.toUmlNotation();
				console.log(affectedCells);
				editorComponent.lock(affectedCells);

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
			function(eventSource, eventObject){
				console.log('%c%s', f_alert, "EDITING_STOPPED");
				console.log(eventSource);
				console.log(eventObject);

				editorComponent.release();
			});
	}


	// /**
	//  * 
	//  * @param graph 
	//  * @param editorComponent 
	//  */
	//  function endEdit(graph: mxGraph, editorComponent: EditorComponent)
	//  {
	// 	 graph.getModel().addListener
	// 	//  graph.addListener
	// 	 (mxEvent.END_EDIT,
	// 		 function(eventSource, eventObject){
	// 			 console.log('%c%s', f_alert, "END_EDIT");
	// 			 console.log(eventSource);
	// 			 console.log(eventObject);
	// 		 });
	//  }
 


	// /**
	//  * 
	//  * @param graph 
	//  * @param editorComponent 
	//  */
	// function start(graph: mxGraph, editorComponent: EditorComponent)
	// {
	// 	graph.addListener(mxEvent.START, 
	// 		// When double click on cell to change label
	// 		function(eventSource, eventObject){
	// 			let affectedCells = eventObject.getProperties().cell;
	// 			console.log('%c%s', f_alert, "START");

	// 			console.log(affectedCells.cell.id);
	// 		});
	// }

	// /**
	//  * 
	//  * @param graph 
	//  * @param editorComponent 
	//  */
	// function cellsAdded(graph: mxGraph, editorComponent: EditorComponent)
	// {
	// 	graph.addListener(mxEvent.CELLS_ADDED, 
	// 		// mxEvent.ADD_CELLS
	// 		function(eventSource, eventObject){
	// 			let affectedCells = eventObject.getProperties().cells;
	// 			console.log('%c%s', f_alert, "CELLS_ADDED ");
	// 			console.log(affectedCells);
	// 		});
	// }
	
	/**
	 * used for Lock unlock event
	 * @param graph 
	 * @param editorComponent 
	 */
	function click(graph: mxGraph, editorComponent: EditorComponent)
	{
		var click = 0;
		graph.addListener(mxEvent.CLICK, 
			// click on object to see its makup.
			function(eventSource, eventObject){
				let affectedCells = eventObject.getProperties().cell;
				console.log('%c%s',f_alert, "mxCell description");
				console.log(affectedCells);
				if(graph.isCellLocked(affectedCells))
					affectedCells = undefined;
				if(affectedCells == undefined )
					graph.clearSelection();
				
				/* puts a little point on the graph so you can see where the user is clicking */
				// if(eventSource.lastMouseX){	
				// 	let x = eventSource.lastMouseX;
				// 	let y = eventSource.lastMouseY;
				// 	let coords = `${click++}:\t(${x},${y})`
				// 	console.log('Location Point %c%s',f_info, coords);
				// 	if(affectedCells == undefined)
				// 		graph.insertVertex(graph.getDefaultParent(), null, coords, x-215, y-65, 5, 5, 'ClickHere');
				// }
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

					// affectedCells.id = relation.id;
					// affectedCells.value = relation.toUmlNotation();
					// affectedCells.style = RelationshipType[relation.type]
					graph.removeCells([affectedCells],true);

				// * * * * * * * * * * * * * * * * * StageChange * * * * * * * * * * * * * * * * * //
					editorComponent.stageChange(new ChangeRecord(
						[graph.getDefaultParent().id],
						PropertyType.Elements,
						ActionType.Insert,
						relation
					), true);
				// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * //

				}
			});
	}


	// /**
	//  * doesnt do anthing yet
	//  * @param graph 
	//  * @param editorComponent 
	//  */
	// function select(graph: mxGraph, editorComponent: EditorComponent)
	// {
	// 	//listener template
	// 	graph.getSelectionModel().addListener(mxEvent.SELECT, 
	// 		// NADA
	// 		function(eventSource, eventObject){
	// 			let affectedCells = eventObject.getProperties().cell;
	// 			console.log('%c%s', f_alert, "mxEvent.SELECT");
	// 			console.log(affectedCells);
	// 		});
	// }

	// function newSelect(graph: mxGraph, editorComponent: EditorComponent)
	// {
	// 	graph.addListener(mxEvent.SELECT, 
	// 		function(eventSource, eventObject){
	// 			console.log(`\n\nmxEvent.SELECT\n ${eventObject}`);
	// 			console.log(eventObject);
				
	// 		});
	// }


	// function template(graph: mxGraph, editorComponent: EditorComponent){
	// 	//listener template
	// 	graph.addListener(mxEvent.FIRED, 
	// 		// NADA
	// 		function(eventSource, eventObject){
	// 			let affectedCells = eventObject.getProperties().cell;
	// 			console.log('%c%s', f_alert, "");
	// 			console.log(affectedCells);
	// 		});
	// }



var f_info = 'width: 100%; background: yellow; color: navy;';
var f_alert = 'text-align: center; width: 100%; background: black; color: red; font-size: 1.5em;';