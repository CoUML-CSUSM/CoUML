
using System;
using System.Text;
using System.IO;
using Microsoft.AspNetCore.Mvc;
using System.IO.Compression;


namespace CoUML_app.Controllers.Hubs
{
	[ApiController]
	public class DownloadService
	{
		[HttpGet]
		[Route("download")]
		public FileStream GetZipFile(string fileName)
		{
			string rootDirectory =  Path.Combine(Directory.GetCurrentDirectory(), $"wwwroot/Java");
			// It can be zip file or pdf but we need to change contentType respectively
			const string contentType ="application/zip";
			// var result = new FileContentResult(System.IO.File.ReadAllBytes( $"wwwroot/Java/{fileName}.zip"), contentType)
			// {
			// 	// It can be zip file or pdf but we need to change the extension respectively
			// 	FileDownloadName = $"{fileName}.zip"
			// };

			// return result;

			string packageDirectory = Path.Combine(rootDirectory,fileName+".zip");

			return new FileStream(packageDirectory, FileMode.Open, FileAccess.Read);
		}
	
	}
}