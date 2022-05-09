import { Canvg } from 'canvg';
import html2canvas from 'html2canvas';
import { saveAs } from 'file-saver';
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

	// export function createAnImage(graph: mxGraph){
	// 	let graphElement =  document.getElementById('graphContainer');

	// 	let xml: XMLDocument = createXmlDocument(graph);
	// 	console.log("\nxmlDocument\n\n",xml)

	// 	html2canvas(graphElement).then(function(canvas) {
	// 		//Downloads canvas image
	// 		var dt = canvas.toDataURL('image/png');
	// 		/* Change MIME type to trick the browser to downlaod the file instead of displaying it */
	// 		dt = dt.replace(/^data:image\/[^;]*/, 'data:application/octet-stream');
		    
	// 		/* In addition to <a>'s "download" attribute, you can define HTTP-style headers */
	// 		dt = dt.replace(/^data:application\/octet-stream/, 'data:application/octet-stream;headers=Content-Disposition%3A%20attachment%3B%20filename=Canvas.png');
		    
	// 		const win = window.open(dt, '_blank');
	// 	    });
	// }

	const IMG_PATTERN = /(<image .*?\<\/image>)/g;
	export function createAnSVG(graph: mxGraph){

		try {
			let graphElement =  document.getElementsByTagName('svg');
			let svg: SVGSVGElement = graphElement.length==1? graphElement[0]:undefined;

			console.log(
				"\ngraphElement\n\n", graphElement,
				"\nsvg\n\n", svg);

			if(svg)
			{
				// remove imgs and add style 
				let svgString: string = svg.outerHTML.replace(IMG_PATTERN, '').replace("<svg", "<svg xmlns=\"http://www.w3.org/2000/svg\"");


				let svgFileContent = '<?xml version="1.0" encoding="UTF-8" standalone="no"?>\n';
				svgFileContent += '<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">\n';
				svgFileContent += svgString;
				
				const blob = new Blob([svgFileContent], {type: 'image/svg+xml'});
				saveAs(blob, graph.getDefaultParent().id+".svg");

				SVG2PNG(svg, function(canvas) { // Arguments: SVG element, callback function.
					var base64 = canvas.toDataURL("image/png"); // toDataURL return DataURI as Base64 format.
					generateLink('SVG2PNG-01.png', base64).click(); // Trigger the Link is made by Link Generator and download.
				    });
			}
			
		} catch (error) {
			console.log(error);
		}
		
	}
	function generateLink(fileName, data) {
		var link = document.createElement('a');
		link.download = fileName;
		link.href = data;
		return link;
	    }

	export async function createAnImageB(svg: SVGSVGElement)
	{

		const canvas = document.querySelector('canvas');
		const ctx = canvas.getContext('2d');
		  let v = await Canvg.from(ctx, svg.outerHTML);
		
		  // Start SVG rendering with animations and mouse handling.
		  v.start();

	}

	function SVG2PNG(svg, callback) {
		var canvas = document.createElement('canvas'); // Create a Canvas element.
		var ctx = canvas.getContext('2d'); // For Canvas returns 2D graphic.
		var data = svg.outerHTML; // Get SVG element as HTML code.
		new Canvg(ctx, data); // Render SVG on Canvas.
		callback(canvas); // Execute callback function.
	}

	// function createXmlDocument(graph): XMLDocument {
	// 	const xmlDocument = mxUtils.createXmlDocument();
	// 	const root = (xmlDocument.createElementNS != null) ? xmlDocument.createElementNS(mxConstants.NS_SVG, 'svg') : xmlDocument.createElement('svg');
	// 	if (xmlDocument.createElementNS == null) {
	// 	    root.setAttribute('xmlns', mxConstants.NS_SVG);
	// 	    root.setAttribute('xmlns:xlink', mxConstants.NS_XLINK);
	// 	} else {
	// 	    root.setAttributeNS('http://www.w3.org/2000/xmlns/', 'xmlns:xlink', mxConstants.NS_XLINK);
	// 	}
	// 	const bounds = graph.getGraphBounds();
	// 	root.setAttribute('width', (bounds.x + bounds.width + 4) + 'px');
	// 	root.setAttribute('height', (bounds.y + bounds.height + 4) + 'px');
	// 	root.setAttribute('version', '1.1');
	// 	xmlDocument.appendChild(root);
	// 	return xmlDocument;
	//   }

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