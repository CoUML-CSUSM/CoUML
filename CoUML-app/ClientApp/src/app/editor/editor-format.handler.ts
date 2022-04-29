import { AbstractClass, ActionType, ChangeRecord, Class, Dimension, Enumeration, Interface, PropertyType, RelationshipType } from "src/models/DiagramModel";
import { EditorColors } from "./editor.resources";

const DASH_PATTERN: string  = '12 4';
const MARGIN: number = 5;
const HEIGHT:number = 30;



export function addCellStyles(graph: mxGraph)
{


	//cell styles for diagram component with stereotype
	// <<interface>>, <<enumerations>>
	var base_mxSwimlanePaint = mxSwimlane.prototype.paintSwimlane;
	mxSwimlane.prototype.paintSwimlane = function(c: mxSvgCanvas2D, x, y, w, h)
	{
		base_mxSwimlanePaint.apply(this, arguments);
		if (this.state != null && this.state.cell.style != null && this.state.style['stereotype'])
		{
			c.setStrokeColor(EditorColors.BLACK);
			c.text(w/2, MARGIN/2, w, h, `<<${this.state.style['stereotype']}>>`, 'center', 'top', '','', '', '', 0, '');
		}
		
	}

	graph.border = 100;
	graph.autoSizeCellsOnAdd = true;

	let style = graph.getStylesheet().getDefaultVertexStyle();
				style[mxConstants.STYLE_FILLCOLOR] = 'none';
				style[mxConstants.STYLE_SHAPE] = mxConstants.SHAPE_RECTANGLE;
				style[mxConstants.STYLE_ALIGN] = mxConstants.ALIGN_LEFT;
				style[mxConstants.STYLE_FONTCOLOR] = EditorColors.BLACK;

				
	style = mxUtils.clone(style);
	style[mxConstants.STYLE_FILLCOLOR] = '#FF0000';
	graph.getStylesheet().putCellStyle("ClickHere", style);

	style = [];
	style[mxConstants.STYLE_SHAPE] = mxConstants.SHAPE_SWIMLANE;
	style[mxConstants.STYLE_ALIGN] = mxConstants.ALIGN_CENTER;
	style[mxConstants.STYLE_STARTSIZE] = HEIGHT;
	style[mxConstants.STYLE_FILLCOLOR] = EditorColors.WHITE;
	style['childLayout'] = "stackLayout";
	style['horizontalStack'] = 0;
	style['resizeParent'] = 1;
	style[mxConstants.STYLE_RESIZABLE] = '0';
	style[mxConstants.STYLE_SPACING_BOTTOM] = MARGIN;
	style[mxConstants.STYLE_VERTICAL_ALIGN] =  mxConstants.ALIGN_BOTTOM;
	
	style['marginLeft'] = MARGIN;
	style['marginRight'] = MARGIN;
	style['marginTop'] = MARGIN;
	style['marginBottom'] = MARGIN;
	style['selectable'] = 1;
	style[mxConstants.STYLE_STROKECOLOR] = EditorColors.BLACK;

	style = mxUtils.clone(style);
	style[mxConstants.STYLE_FONTSTYLE] = mxConstants.FONT_ITALIC;
	graph.getStylesheet().putCellStyle("CoUML_app.Models.AbstractClass", style);

	style = mxUtils.clone(style);
	style[mxConstants.STYLE_FONTSTYLE] = mxConstants.DEFAULT_FONTSTYLE;
	graph.getStylesheet().putCellStyle("CoUML_app.Models.Class", style);

	//styles with stereotypes
	style = mxUtils.clone(style);
	style[mxConstants.STYLE_FONTSTYLE] = mxConstants.DEFAULT_FONTSTYLE;
	style[mxConstants.STYLE_STARTSIZE] = HEIGHT * 7/6;
	style['stereotype'] = 'interface';
	graph.getStylesheet().putCellStyle("CoUML_app.Models.Interface", style);

	style = mxUtils.clone(style);
	style[mxConstants.STYLE_FONTSTYLE] = mxConstants.DEFAULT_FONTSTYLE;
	style['stereotype'] = 'enumeration';
	graph.getStylesheet().putCellStyle("CoUML_app.Models.Enumeration", style);



}


export function addEdgeStyles(graph: mxGraph)
{
	//association relation specialty paint
	var base_mxConnectorPaint = mxConnector.prototype.paintEdgeShape;
	mxConnector.prototype.paintEdgeShape = function( c: mxSvgCanvas2D, pts	)
	{

		let includeAtt = this.state?.cell?.edge && this.state.cell.umlElement.type == RelationshipType.Association && this.state.cell.umlElement.attSet ; 

		console.log('%c%s', f_alert, `paintEdgeShape\n Attribute = ${includeAtt}`);
		console.log(this.state?.cell?.edge );
		console.log(this.state.cell.umlElement.type == RelationshipType.Association);
		console.log(this.state.cell.umlElement.attSet);
		
		// if(includeAtt)
		// 	this.state.cell.value = this.state.cell.umlElement.toUmlNotation();

		base_mxConnectorPaint.apply(this, arguments);

		if(includeAtt)
		{
			let mulPT = scaleR(pts[0], pts[1], 35);
			// let mulPT = pts[1];
			// c.setFontBackgroundColor("#FF0000");
			console.log(mulPT);
			console.log(this.state.cell.umlElement);
			console.log(this.state.cell.umlElement.attribute?.multiplicity?.toUmlNotation());
			c.setFontBackgroundColor(EditorColors.WHITE);
			c.text(mulPT.x, mulPT.y, 0, 0, 
				this.state.cell.umlElement.attribute?.multiplicity?.toUmlNotation(),
				'top', 'left', '', '', '', '', 0, ''
				);
		}
	}


	// Overridden to define per-shape connection points
	mxGraph.prototype.getAllConnectionConstraints = function(terminal, source)
	{

		if (terminal != null && terminal.shape != null)
		{
			if (terminal.shape.stencil != null)
			{
				if (terminal.shape.stencil.constraints != null)
				{
					console.log(
						"getAllConnectionConstraints\n",
						"terminal.shape.stencil.constraints != null",
						"\nterminal\n\t",
						terminal,
						"\nsource\n\t",
						source,
					);
					return terminal.shape.stencil.constraints;
				}
			}
			else if (terminal.shape.constraints != null)
			{
				console.log(
					"getAllConnectionConstraints\n",
					"terminal.shape.constraints != null",
					"\nterminal\n\t",
					terminal,
					"\nsource\n\t",
					source,
				);
				return terminal.shape.constraints;
			}
		}

		return null;
	};

	// Defines the default constraints for all shapes
	mxShape.prototype.constraints = [new mxConnectionConstraint(new mxPoint(0.25, 0), true),
		new mxConnectionConstraint(new mxPoint(0.5, 0), true),
		new mxConnectionConstraint(new mxPoint(0.75, 0), true),
		new mxConnectionConstraint(new mxPoint(0, 0.25), true),
		new mxConnectionConstraint(new mxPoint(0, 0.5), true),
		new mxConnectionConstraint(new mxPoint(0, 0.75), true),
		new mxConnectionConstraint(new mxPoint(1, 0.25), true),
		new mxConnectionConstraint(new mxPoint(1, 0.5), true),
		new mxConnectionConstraint(new mxPoint(1, 0.75), true),
		new mxConnectionConstraint(new mxPoint(0.25, 1), true),
		new mxConnectionConstraint(new mxPoint(0.5, 1), true),
		new mxConnectionConstraint(new mxPoint(0.75, 1), true)];

	// Edges have no connection points
	mxPolyline.prototype.constraints = null;

		
	// Specifies the default edge style
	graph.getStylesheet().getDefaultEdgeStyle()['edgeStyle'] = 'orthogonalEdgeStyle';

	let  edgeStyleDefualt = graph.getStylesheet().getDefaultEdgeStyle();
	edgeStyleDefualt[mxConstants.STYLE_STARTSIZE] = 12;
	edgeStyleDefualt[mxConstants.STYLE_ENDSIZE] = 12;
	edgeStyleDefualt[mxConstants.STYLE_STROKECOLOR] = EditorColors.BLACK;
	edgeStyleDefualt[mxConstants.STYLE_LABEL_BACKGROUNDCOLOR] = EditorColors.WHITE;
	edgeStyleDefualt[mxConstants.STYLE_FONTCOLOR] = EditorColors.BLACK;

	// Realization  - - -|>
	let realizationStyle = mxUtils.clone(edgeStyleDefualt);
	realizationStyle[mxConstants.STYLE_DASHED] = true;
	realizationStyle[mxConstants.STYLE_DASH_PATTERN] = DASH_PATTERN;
	realizationStyle[mxConstants.STYLE_ENDARROW] = mxConstants.ARROW_BLOCK;
	realizationStyle[mxConstants.STYLE_ENDFILL] = false;
	graph.getStylesheet().putCellStyle(
		RelationshipType[RelationshipType.Realization], 
		realizationStyle
		);

	// Dependency, - - - >
	let dependencyStyle = mxUtils.clone(edgeStyleDefualt);
	dependencyStyle[mxConstants.STYLE_DASHED] = true;
	dependencyStyle[mxConstants.STYLE_DASH_PATTERN] = DASH_PATTERN;
	dependencyStyle[mxConstants.STYLE_ENDARROW] = mxConstants.ARROW_OPEN;
	dependencyStyle[mxConstants.STYLE_ENDFILL] = false;
	graph.getStylesheet().putCellStyle(
		RelationshipType[RelationshipType.Dependency], 
		dependencyStyle
		);

	// Association, 1-------*
	let associationStyle = mxUtils.clone(edgeStyleDefualt);
	associationStyle[mxConstants.STYLE_DASHED] = false;
	// associationStyle[mxConstants.STYLE_ENDARROW] = mxConstants.NONE;
	associationStyle[mxConstants.STYLE_ENDARROW] = mxConstants.ARROW_OPEN;
	graph.getStylesheet().putCellStyle(
		RelationshipType[RelationshipType.Association], 
		associationStyle
		);

	// Aggregation,<>------ 
	let aggregationStyle = mxUtils.clone(edgeStyleDefualt);
	aggregationStyle[mxConstants.STYLE_DASHED] = false;
	aggregationStyle[mxConstants.STYLE_ENDARROW] = mxConstants.NONE;
	aggregationStyle[mxConstants.STYLE_STARTARROW] = mxConstants.ARROW_DIAMOND_THIN;
	aggregationStyle[mxConstants.STYLE_STARTFILL] = false;
	graph.getStylesheet().putCellStyle(
		RelationshipType[RelationshipType.Aggregation], 
		aggregationStyle
		);
		
	// Composistion, <X>------ 
	let composistionStyle = mxUtils.clone(edgeStyleDefualt);
	composistionStyle[mxConstants.STYLE_DASHED] = false;
	composistionStyle[mxConstants.STYLE_ENDARROW] = mxConstants.NONE;
	composistionStyle[mxConstants.STYLE_STARTARROW] = mxConstants.ARROW_DIAMOND_THIN;
	graph.getStylesheet().putCellStyle(
		RelationshipType[RelationshipType.Composition], 
		composistionStyle
		);

	
	// Generalization, ----|>
	let generalizationStyle = mxUtils.clone(edgeStyleDefualt);
	generalizationStyle[mxConstants.STYLE_DASHED] = false;
	generalizationStyle[mxConstants.STYLE_ENDARROW] = mxConstants.ARROW_BLOCK;
	generalizationStyle[mxConstants.STYLE_ENDFILL] = false;
	graph.getStylesheet().putCellStyle(
		RelationshipType[RelationshipType.Generalization], 
		generalizationStyle
		);
}

/**
 * returns a point that is r distance from point b
 *  along the line between ab
 * @param a 
 * @param b 
 * @param r 
 * @returns 
 */
function scaleR (a: mxPoint, b: mxPoint, r: number): mxPoint
{
	let xdirection = a.x <= b.x ? -1: 1;
	let ydirection = a.y <= b.y ? -1: 1;
	let theta = Math.atan(Math.abs((b.y - a.y)/(b.x - a.x)));
	let point = b.clone();
	point.x += xdirection*(r * Math.cos(theta))|0;
	point.y += ydirection*(r * Math.sin(theta))|0;
	return point;

}
var f_alert = 'text-align: center; width: 100%; background: black; color: red; font-size: 1.5em;';


export function initLayoutManager(graph: mxGraph)
{
	var layoutManager = new mxLayoutManager(graph);
	layoutManager.getLayout = function(cell)
	{
		var style = graph.getCellStyle(cell) as any[];

		if (style['childLayout'] == 'stackLayout')
		{
			var stackLayout = new mxStackLayout(graph, true);
			stackLayout.resizeParentMax = mxUtils.getValue(style, 'resizeParentMax', '1') == '1';
			stackLayout.horizontal = mxUtils.getValue(style, 'horizontalStack', '1') == '1';
			stackLayout.resizeParent = mxUtils.getValue(style, 'resizeParent', '1') == '1';
			stackLayout.resizeLast = mxUtils.getValue(style, 'resizeLast', '0') == '1';
			stackLayout.spacing = style['stackSpacing'] || stackLayout.spacing;
			stackLayout.border = style['stackBorder'] || stackLayout.border;
			stackLayout.marginLeft = style['marginLeft'] || 0;
			stackLayout.marginRight = style['marginRight'] || 0;
			stackLayout.marginTop = style['marginTop'] || 0;
			stackLayout.marginBottom = style['marginBottom'] || 0;
			stackLayout.allowGaps = style['allowGaps'] || 0;
			// stackLayout.fill = true;
			stackLayout.fill = false;

			stackLayout.gridSize = HEIGHT;
			
			return stackLayout;
		}
		else if (style['childLayout'] == 'treeLayout')
		{
			var treeLayout = new mxCompactTreeLayout(graph);
			treeLayout.horizontal = mxUtils.getValue(style, 'horizontalTree', '1') == '1';
			treeLayout.resizeParent = mxUtils.getValue(style, 'resizeParent', '1') == '1';
			treeLayout.groupPadding = mxUtils.getValue(style, 'parentPadding', 20);
			treeLayout.levelDistance = mxUtils.getValue(style, 'treeLevelDistance', 30);
			treeLayout.maintainParentLocation = true;
			treeLayout.edgeRouting = false;
			treeLayout.resetEdges = false;
			
			return treeLayout;
		}
		else if (style['childLayout'] == 'flowLayout')
		{
			var flowLayout = new mxHierarchicalLayout(graph, mxUtils.getValue(style,
				'flowOrientation', mxConstants.DIRECTION_EAST));
			flowLayout.resizeParent = mxUtils.getValue(style, 'resizeParent', '1') == '1';
			flowLayout.parentBorder = mxUtils.getValue(style, 'parentPadding', 20);
			flowLayout.maintainParentLocation = true;
			
			// Special undocumented styles for changing the hierarchical
			flowLayout.intraCellSpacing = mxUtils.getValue(style, 'intraCellSpacing',
				mxHierarchicalLayout.prototype.intraCellSpacing);
			flowLayout.interRankCellSpacing = mxUtils.getValue(style, 'interRankCellSpacing',
				mxHierarchicalLayout.prototype.interRankCellSpacing);
			flowLayout.interHierarchySpacing = mxUtils.getValue(style, 'interHierarchySpacing',
				mxHierarchicalLayout.prototype.interHierarchySpacing);
			flowLayout.parallelEdgeSpacing = mxUtils.getValue(style, 'parallelEdgeSpacing',
				mxHierarchicalLayout.prototype.parallelEdgeSpacing);
			
			return flowLayout;
		}
		else if (style['childLayout'] == 'organicLayout')
		{
			return new mxFastOrganicLayout(graph);
		}
		return null;
	};
}
