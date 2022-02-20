import { Injectable } from "@angular/core";
import { ActionType, ChangeRecord, Dimension, PropertyType, RelationshipType } from "src/models/DiagramModel";

@Injectable()
export class EditorFormatHandler{
	addEdgeStyles(graph: mxGraph)
	{
		let dashPattern = '12 4';
		let  edgeStyleDefualt = graph.getStylesheet().getDefaultEdgeStyle();
		edgeStyleDefualt[mxConstants.STYLE_STARTSIZE] = 12;
		edgeStyleDefualt[mxConstants.STYLE_ENDSIZE] = 12;

		// Realization  - - -|>
		let realizationStyle = mxUtils.clone(edgeStyleDefualt);
		realizationStyle[mxConstants.STYLE_DASHED] = true;
		realizationStyle[mxConstants.STYLE_DASH_PATTERN] = dashPattern;
		realizationStyle[mxConstants.STYLE_ENDARROW] = mxConstants.ARROW_BLOCK;
		realizationStyle[mxConstants.STYLE_ENDFILL] = false;
		graph.getStylesheet().putCellStyle(
			RelationshipType[RelationshipType.Realization], 
			realizationStyle
			);
		

		// Dependency, - - - >
		let dependencyStyle = mxUtils.clone(edgeStyleDefualt);
		dependencyStyle[mxConstants.STYLE_DASHED] = true;
		dependencyStyle[mxConstants.STYLE_DASH_PATTERN] = dashPattern;
		dependencyStyle[mxConstants.STYLE_ENDARROW] = mxConstants.ARROW_OPEN;
		dependencyStyle[mxConstants.STYLE_ENDFILL] = false;
		graph.getStylesheet().putCellStyle(
			RelationshipType[RelationshipType.Dependency], 
			dependencyStyle
			);

		// Association, -------
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
		aggregationStyle[mxConstants.STYLE_STARTARROW] = mxConstants.ARROW_DIAMOND;
		aggregationStyle[mxConstants.STYLE_ENDFILL] = false;
		graph.getStylesheet().putCellStyle(
			RelationshipType[RelationshipType.Aggregation], 
			aggregationStyle
			);
			
		// Composistion, <X>------ 
		let composistionStyle = mxUtils.clone(edgeStyleDefualt);
		composistionStyle[mxConstants.STYLE_DASHED] = false;
		composistionStyle[mxConstants.STYLE_ENDARROW] = mxConstants.NONE;
		composistionStyle[mxConstants.STYLE_STARTARROW] = mxConstants.ARROW_DIAMOND;
		graph.getStylesheet().putCellStyle(
			RelationshipType[RelationshipType.Composistion], 
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

}