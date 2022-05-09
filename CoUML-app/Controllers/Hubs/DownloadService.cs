
using System;
using System.Text;
using System.IO;
using Microsoft.AspNetCore.Mvc;
using System.IO.Compression;
using CoUML_app.Utility;
using System;
using System.Collections.Generic;
using System.Xml;
using System.Text;
using System.Web;
using System.IO;
using System.Drawing;
using System.Drawing.Imaging;
using System.Drawing.Drawing2D;


namespace CoUML_app.Controllers.Hubs
{
	[ApiController]
	public class DownloadService
	{
		[HttpGet]
		[Route("download")]
		public IActionResult GetZipFile(string fileName)
		{
			const string contentType ="application/zip";
			var result = new FileContentResult(System.IO.File.ReadAllBytes( $"{FileUtility.ROOT_DIRECTORY}/Java/{fileName}.zip"), contentType)
			{
				FileDownloadName = $"{fileName}.zip"
			};
			return result;

		}

		// [HttpPost]
		// [Route("export")]
		// public void ProcessRequest (HttpContext context)
		// {
		// 	string xml = HttpUtility.UrlDecode(context.Request.Params["xml"]);
		// 	string width = context.Request.Params["w"];
		// 	string height = context.Request.Params["h"];
		// 	string bg = context.Request.Params["bg"];
		// 	string filename = context.Request.Params["filename"];
		// 	string format = context.Request.Params["format"];

		// 	if (filename != null)
		// 	{
		// 		filename = HttpUtility.UrlDecode(filename);
		// 	}

		// 	if (xml != null && width != null && height != null && bg != null
		// 		&& filename != null && format != null)
		// 	{
		// 		Color? background = (bg != null && !bg.Equals(mxConstants.NONE)) ? ColorTranslator.FromHtml(bg) : (Color?)null;
		// 		Image image = mxUtils.CreateImage(int.Parse(width), int.Parse(height), background);
		// 		Graphics g = Graphics.FromImage(image);
		// 		g.SmoothingMode = SmoothingMode.HighQuality;
		// 		mxSaxOutputHandler handler = new mxSaxOutputHandler(new mxGdiCanvas2D(g));
		// 		handler.Read(new XmlTextReader(new StringReader(xml)));
				
		// 		if (filename.Length == 0)
		// 		{
		// 		filename = "export." + format;
		// 		}

		// 		context.Response.ContentType = "image/" + format;
		// 		context.Response.AddHeader("Content-Disposition",
		// 			"attachment; filename=" + filename);

		// 		MemoryStream memStream = new MemoryStream();
		// 		image.Save(memStream, ImageFormat.Png);
		// 		memStream.WriteTo(context.Response.OutputStream);

		// 		context.Response.StatusCode = 200; /* OK */
		// 	}
		// 	else
		// 	{
		// 		context.Response.StatusCode = 400; /* Bad Request */
		// 	}
		// }

		// public bool IsReusable
		// {
		// 	// Return false in case your Managed Handler cannot be reused for another request.
		// 	// Usually this would be false in case you have some state information preserved per request.
		// 	get { return true; }
		// }

			
	
	}
}