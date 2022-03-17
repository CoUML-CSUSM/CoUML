import { Injectable } from "@angular/core";
import { AbstractClass, ActionType, ChangeRecord, Class, Dimension, Enumeration, Interface, PropertyType, RelationshipType } from "src/models/DiagramModel";

const DASH_PATTERN: string  = '12 4';
const MARGIN: number = 5;
const HEIGHT:number = 30;



export function addCellStyles(graph: mxGraph)
{

	// mxConstants.ENTITY_SEGMENT = 20;
	graph.border = 100;
	graph.autoSizeCellsOnAdd = true;

	let style = graph.getStylesheet().getDefaultVertexStyle();
				style[mxConstants.STYLE_FILLCOLOR] = 'none';
				style[mxConstants.STYLE_STROKECOLOR] = '#fefefe';
				style[mxConstants.STYLE_SHAPE] = mxConstants.SHAPE_RECTANGLE;
				style[mxConstants.STYLE_ALIGN] = mxConstants.ALIGN_LEFT;

	style = [];
	style[mxConstants.STYLE_SHAPE] = mxConstants.SHAPE_SWIMLANE;
	style[mxConstants.STYLE_ALIGN] = mxConstants.ALIGN_CENTER;
	style[mxConstants.STYLE_STARTSIZE] = HEIGHT;
	style[mxConstants.STYLE_FILLCOLOR] = 'none';
	// style[mxConstants.STYLE_FILLCOLOR] = '#ffffff';
	style['childLayout'] = "stackLayout";
	style['horizontalStack'] = 0;
	style['resizeParent'] = 1;
	style[mxConstants.STYLE_RESIZABLE] = '0';
	
	style['marginLeft'] = MARGIN;
	style['marginRight'] = MARGIN;
	style['marginTop'] = MARGIN;
	style['marginBottom'] = MARGIN;
	style['selectable'] = 1;


	style[mxConstants.STYLE_STROKECOLOR] = 'red';
	style[mxConstants.STYLE_FONTSTYLE] = mxConstants.FONT_BOLD;
	graph.getStylesheet().putCellStyle(Class.name, style);

	style = mxUtils.clone(style);
	style[mxConstants.STYLE_STROKECOLOR] = 'yellow';
	style[mxConstants.STYLE_FONTSTYLE] = mxConstants.FONT_ITALIC;
	graph.getStylesheet().putCellStyle(AbstractClass.name, style);

	style = mxUtils.clone(style);
	style[mxConstants.STYLE_STROKECOLOR] = 'green';
	style[mxConstants.STYLE_FONTSTYLE] = mxConstants.FONT_BOLD;
	graph.getStylesheet().putCellStyle(Interface.name, style);

	style = mxUtils.clone(style);
	style[mxConstants.STYLE_STROKECOLOR] = 'blue';
	style[mxConstants.STYLE_FONTSTYLE] = mxConstants.FONT_BOLD;
	graph.getStylesheet().putCellStyle(Enumeration.name, style);

}

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


export function addEdgeStyles(graph: mxGraph)
{
	let  edgeStyleDefualt = graph.getStylesheet().getDefaultEdgeStyle();
	edgeStyleDefualt[mxConstants.STYLE_STARTSIZE] = 12;
	edgeStyleDefualt[mxConstants.STYLE_ENDSIZE] = 12;

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
	associationStyle[mxConstants.STYLE_ENDARROW] = mxConstants.NONE;
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
