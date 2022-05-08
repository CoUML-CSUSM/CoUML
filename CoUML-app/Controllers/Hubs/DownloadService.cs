
using System;
using System.Text;
using System.IO;
using Microsoft.AspNetCore.Mvc;
using System.IO.Compression;
using CoUML_app.Utility;


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
	
	}
}