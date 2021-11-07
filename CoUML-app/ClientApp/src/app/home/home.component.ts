import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
// import mx from './mxgraph';
// import { mxGraph, mxGraphModel } from 'mxgraph';

/**
 * https://github.com/typed-mxgraph/typed-mxgraph
 */
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})
export class HomeComponent implements AfterViewInit, OnInit{

	private graph: mxGraph;
	private graph2: mxGraph;
	
	@ViewChild('container', { read: ElementRef, static: true })
	public container: ElementRef<HTMLElement>;

	@ViewChild('container2', { read: ElementRef, static: true })
	public container2: ElementRef<HTMLElement>;
	// constructor() {
	// 	if(mx.mxClient.isBrowserSupported()) {
	// 		console.log('Yes! Yes!');
	// 	}

	// 	var graph: mxGraph = new mx.mxGraph(this.container);
	// 	const model: mxGraphModel = graph.getModel();
	// 	model.beginUpdate();
	// 	try {
	// 		graph.insertVertex(graph.getDefaultParent(), '', 'TEST', 0, 0, 100, 100);
	// 	} finally {
	// 		model.endUpdate();
	// 	}
	// }

	public ngAfterViewInit() {
		this.graph2 = new mxGraph(this.container2.nativeElement);
		this.graph2.getModel().beginUpdate();
		this.graph2.labelChanged = function(cell, newValue, trigger)
		{
			console.log("trigger");
			console.log(trigger);
			console.log("cell");
			console.log(cell);
			console.log("newValue");
			console.log(newValue);
			// // var name = (trigger != null) ? trigger.fieldname : null;
			
			if (newValue != null)
			// {
			// 	// Clones the user object for correct undo and puts
			// 	// the new value in the correct field.
			// 	var value = mxUtils.clone(cell.value);
			// 	// value[name] = newValue;
			// 	newValue = value;
				
				mxGraph.prototype.labelChanged.apply(this, arguments);
			// }
			return null;
		};
		try {
			const parent = this.graph2.getDefaultParent();
			const angularVertex = this.graph2.insertVertex(parent, null, "value", 100, 100, 100, 62)
			const mxGraphVertex = this.graph2.insertVertex(parent, null, 'mxGraph', 300, 300, 100, 62)
			this.graph2.insertEdge(parent, null, 'with', angularVertex, mxGraphVertex);
		} finally {
			this.graph2.getModel().endUpdate();
		}
	}


	ngOnInit(): void {
		
		// Checks if the browser is supported

		console.log(`mx.mxClient.isBrowserSupported() = ${mxClient.isBrowserSupported()}`);
		if (!mxClient.isBrowserSupported())
		{
			// Displays an error message if the browser is not supported
			mxUtils.error('Browser is not supported!', 200, false);
		}
		else
		{
			// mxUtils.error('Browser is supported! > ,_, <', 200, false);
			// Creates the graph inside the given container
			this.graph = new mxGraph(this.container.nativeElement);
			this.graph.setHtmlLabels(true);
			
			// Adds handling of return and escape keystrokes for editing
			var keyHandler = new mxKeyHandler(this.graph);
			
			// Helper method that returns the fieldname to be used for
			// a mouse event
			var getFieldnameForEvent = function(cell, evt)
			{
				if (evt != null)
				{
					// Finds the relative coordinates inside the cell
					var point = mxUtils.convertPoint(
							this.graph.container,
							mxEvent.getClientX(evt),
							mxEvent.getClientY(evt)
						);
					var state = this.graph.getView().getState(cell);
					
					if (state != null)
					{
						point.x -= state.x;
						point.y -= state.y;
						
						// Returns second if mouse in second half of cell
						if (point.y > state.height / 2)
						{
							return 'second';
						}
					}
				}
				
				return 'first';
			};
			
			// Returns a HTML representation of the cell where the
			// upper half is the first value, lower half is second
			// value
			this.graph.getLabel = function(cell)
			{
				var table = document.createElement('table');
				table.style.height = '100%';
				table.style.width = '100%';
				
				var body = document.createElement('tbody');
				var tr1 = document.createElement('tr');
				var td1 = document.createElement('td');
				td1.style.textAlign = 'center';
				td1.style.fontSize = '12px';
				td1.style.color = '#774400';
				mxUtils.write(td1, cell.value.first);
				
				var tr2 = document.createElement('tr');
				var td2 = document.createElement('td');
				td2.style.textAlign = 'center';
				td2.style.fontSize = '12px';
				td2.style.color = '#774400';
				mxUtils.write(td2, cell.value.second);
				
				tr1.appendChild(td1);
				tr2.appendChild(td2);
				body.appendChild(tr1);
				body.appendChild(tr2);
				table.appendChild(body);
				
				return table;
			};
			
			// Returns the editing value for the given cell and event
			this.graph.getEditingValue = function(cell, evt)
			{
				let fieldname = getFieldnameForEvent(cell, evt);

				return cell.value[fieldname] || '';
			};
							
			// Sets the new value for the given cell and trigger
			this.graph.labelChanged = function(cell, newValue, trigger)
			{
				console.log("trigger");
				console.log(trigger);
				// var name = (trigger != null) ? trigger.fieldname : null;
				
				if (name != null)
				{
					// Clones the user object for correct undo and puts
					// the new value in the correct field.
					var value = mxUtils.clone(cell.value);
					// value[name] = newValue;
					newValue = value;
					
					mxGraph.prototype.labelChanged.apply(this, arguments);
				}
				return null;
			};
			
			// Sample user objects with 2 fields
			var value = {
				first:'First value',
				second:'Second value'
			}
			
			// Gets the default parent for inserting new cells. This
			// is normally the first child of the root (ie. layer 0).
			var parent = this.graph.getDefaultParent();
							
			// Adds cells to the model in a single step
			this.graph.getModel().beginUpdate();
			try
			{
				var v1 = this.graph.insertVertex(parent, null, value, 100, 60, 120, 80, 'overflow=fill;');
				
			console.log("this.graph");
			console.log(this.graph);
			}
			finally
			{
				// Updates the display
				this.graph.getModel().endUpdate();
			}
		}
	}
}
