import { Canvg } from 'canvg';
import html2canvas from 'html2canvas';
export namespace EditorExportUtility{

	// export function createAnImage(graph: mxGraph)
	// {
	// 	var xmlDoc = mxUtils.createXmlDocument();
	// 	var root = xmlDoc.createElement('output');
	// 	xmlDoc.appendChild(root);

	// 	var xmlCanvas = new mxXmlCanvas2D(root);
	// 	var imgExport = new mxImageExport();
	// 	imgExport.drawState(graph.getView().getState(graph.model.root), xmlCanvas);

	// 	var bounds = graph.getGraphBounds();
	// 	var w = Math.ceil(bounds.x + bounds.width);
	// 	var h = Math.ceil(bounds.y + bounds.height);

	// 	// var xml = mxUtils.getXml(root);
	// 	var xml = mxUtils.getXml(new mxCodec().encode(graph.getModel()));

	// 	try {
	// 		let xmlRequest  = new mxXmlRequest('/export', `filename=${graph.getDefaultParent().id}.png&format=png&w=${w}&h=${h}&bg=#F9F7ED&xml=${encodeURIComponent(xml)}`,"POST", true, null, null);
	// 		console.log("xml request\n", xmlRequest,
	// 		"\n\ndocument\n", document);
	// 		xmlRequest.simulate(document, '_blank');
			
	// 	} catch (error) {
	// 		console.warn(error);
	// 	}
	// }

	export function createAnImage(graph: mxGraph){
		let graphElement =  document.getElementById('graphContainer');

		html2canvas(graphElement).then(function(canvas) {
			//Downloads canvas image
			var dt = canvas.toDataURL('image/png');
			/* Change MIME type to trick the browser to downlaod the file instead of displaying it */
			dt = dt.replace(/^data:image\/[^;]*/, 'data:application/octet-stream');
		    
			/* In addition to <a>'s "download" attribute, you can define HTTP-style headers */
			dt = dt.replace(/^data:application\/octet-stream/, 'data:application/octet-stream;headers=Content-Disposition%3A%20attachment%3B%20filename=Canvas.png');
		    
			const win = window.open(dt, '_blank');
		    });
	}

	// export function createAnImageB(graph: mxGraph)
	// {
	// 	let v = null;

	// 	window.onload = async () => {

	// 	let canvas = createSvgCanvas(graph);
	// 	canvas.

		// const canvas = document.querySelector('canvas');
		// const ctx = canvas.getContext('2d');
		//   let v = await Canvg.from(ctx, './svgs/1.svg');
		
		//   // Start SVG rendering with animations and mouse handling.
		//   v.start();
		// };
		
		// window.onbeforeunload = () => {
		//   v.stop();
		// };

	// }

	function createSvgCanvas(graph): XMLDocument {
		const svgDoc = mxUtils.createXmlDocument();
		const root = (svgDoc.createElementNS != null) ? svgDoc.createElementNS(mxConstants.NS_SVG, 'svg') : svgDoc.createElement('svg');
		if (svgDoc.createElementNS == null) {
		    root.setAttribute('xmlns', mxConstants.NS_SVG);
		    root.setAttribute('xmlns:xlink', mxConstants.NS_XLINK);
		} else {
		    root.setAttributeNS('http://www.w3.org/2000/xmlns/', 'xmlns:xlink', mxConstants.NS_XLINK);
		}
		const bounds = graph.getGraphBounds();
		root.setAttribute('width', (bounds.x + bounds.width + 4) + 'px');
		root.setAttribute('height', (bounds.y + bounds.height + 4) + 'px');
		root.setAttribute('version', '1.1');
		svgDoc.appendChild(root);
		return svgDoc;
	  }

	// var canvas = document.getElementById('canvas');
	// var ctx = canvas.getContext('2d');

	// var data = '<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200">' +
	// 	'<foreignObject width="100%" height="100%">' +
	// 	'<div xmlns="http://www.w3.org/1999/xhtml" style="font-size:40px">' +
	// 		'<em>I</em> like ' + 
	// 		'<span style="color:white; text-shadow:0 0 2px blue;">' +
	// 		'cheese</span>' +
	// 	'</div>' +
	// 	'</foreignObject>' +
	// 	'</svg>';

	// var DOMURL = window.URL || window.webkitURL || window;

	// var img = new Image();
	// var svg = new Blob([data], {type: 'image/svg+xml;charset=utf-8'});
	// var url = DOMURL.createObjectURL(svg);

	// img.onload = function () {
	// ctx.drawImage(img, 0, 0);
	// DOMURL.revokeObjectURL(url);
	// }

	// img.src = url;
}