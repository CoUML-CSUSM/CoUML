
using System;
using System.IO;
using Microsoft.AspNetCore.Mvc;
using System.Net.Http.Headers;
using System.Web;

using Microsoft.AspNetCore.Http;

using CoUML_app.Utility;


namespace CoUML_app.Controllers.Hubs
{
	[ApiController]
	public class DownloadService: ControllerBase
	{
		[HttpGet]
		[Route("downloadZip")]
		public IActionResult GetZipFile(string fileName)
		{
			const string contentType ="application/zip";
			var result = new FileContentResult(System.IO.File.ReadAllBytes( $"{FileUtility.ROOT_DIRECTORY}/Java/{fileName}.zip"), contentType)
			{
				FileDownloadName = $"{fileName}.zip"
			};
			return result;

		}
		[HttpGet]
		[Route("downloadJson")]
		public IActionResult GetJsonFile(string fileName)
		{
			const string contentType ="application/json";
			var result = new FileContentResult(System.IO.File.ReadAllBytes( $"{FileUtility.ROOT_DIRECTORY}/Json/{fileName}"), contentType)
			{
				FileDownloadName = fileName
			};
			return result;

		}

		[HttpPost, DisableRequestSizeLimit]
		[Route("uploadJson")]
		public IActionResult Upload()
		{
			try
			{
				var file = Request.Form.Files[0];
				var folderName = Path.Combine("Upload", "Json");
				var pathToSave = Path.Combine(FileUtility.ROOT_DIRECTORY, folderName);
				if (file.Length > 0)
				{
					var fileName = ContentDispositionHeaderValue.Parse(file.ContentDisposition).FileName.Trim('"');
					var fullPath = Path.Combine(pathToSave, fileName);
					var dbPath = Path.Combine(folderName, fileName);
					using (var stream = new FileStream(fullPath, FileMode.Create))
					{
						file.CopyTo(stream);
					}
					return Ok(new { dbPath });
				}
				else
				{
					return BadRequest();
				}
			}
			catch (Exception ex)
			{
				return StatusCode(500, $"Internal server error: {ex}");
			}
		}
			
	
	}
}