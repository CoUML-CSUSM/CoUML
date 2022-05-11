using System;
using System.IO;
using System.Text;
using System.Collections.Specialized;
using System.Linq;
using Microsoft.AspNetCore.SignalR;
using System.Threading.Tasks;
using Newtonsoft.Json;

using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Logging;
using System.IO.Compression;
using System.Text.RegularExpressions;
using System.Threading;

namespace CoUML_app.Utility
{


	public static class FileUtility
	{
		public const string WORD_PATTERN = @"(\w+)";
		public static string ROOT_DIRECTORY =  Path.Combine(Directory.GetCurrentDirectory(), $"wwwroot/");
		public static FileWriter CreateFile( System.IO.DirectoryInfo directory, string file)
		{
			string filePath = Path.Combine(directory.FullName, file);
			return !System.IO.File.Exists(filePath)? 
				new StreamFileWriter(System.IO.File.Create(filePath))
				: new NullFileWriter(filePath);
		}

		public static Package CreatePackage(string parentFolder, string newFolder)
		{
			string packageDirectory = Path.Combine(ROOT_DIRECTORY,$"{parentFolder}/{ToUniqueFileName(newFolder)}");
			return new Package(packageDirectory);
		}
		
		private static string ToUniqueFileName(string file)
		{

			MatchCollection words =  Regex.Matches(file, WORD_PATTERN);
			string newFileName = "";
			foreach (Match w in words)
			{
				var word  = w.Value;
				newFileName += char.ToUpper(word[0])+word.Substring(1).ToLower();
			}
			newFileName += "__";
			newFileName += Guid.NewGuid().ToString().Substring(0, 4);
			return newFileName;
		}

		public static FileStream Download(string zipPath)
		{
 			return new FileStream(zipPath, FileMode.Open, FileAccess.Read);
		}

		public static void AsyncDelete(FileSystemInfo directory, byte seconds)
		{
			new Thread(()=>{
				Thread.Sleep(seconds*1000);
				try
				{
					if(directory is DirectoryInfo)
						((DirectoryInfo)directory).Delete(true);
					else
						directory.Delete();
					// System.IO.Directory.Delete(directory,true);
				}
				catch (System.Exception e)
				{
					Console.WriteLine(e);
				}
			}).Start();
		}

		public static string SaveAsJson( string diagramName, string json )
		{	
			DirectoryInfo jsonPackage = new DirectoryInfo(Path.Combine(ROOT_DIRECTORY,"Json"));
			
			string jsonFile = ToUniqueFileName(diagramName)+".json";
			FileInfo jsonFileInfo = new FileInfo(Path.Combine(jsonPackage.FullName, jsonFile));

			FileWriter jsonFileWriter = FileUtility.CreateFile(jsonPackage, jsonFile);
			jsonFileWriter.Write(json);
			jsonFileWriter.Close();

			FileUtility.AsyncDelete(jsonFileInfo, 10);
			return jsonFile;
		}

	}


	public class Package
	{
		public System.IO.DirectoryInfo Directory{ get; set;} = null;
		public FileWriter File{get;set;} = new NullFileWriter();
		
		public Package(string directory)
		{
			Directory = System.IO.Directory.CreateDirectory(directory);
		}

		
		public string ZipAndClose()
		{
			File.Close();
			string zipPath = Directory.FullName+".zip";
			ZipFile.CreateFromDirectory(Directory.FullName, zipPath);
			FileUtility.AsyncDelete(Directory, 2);
			FileUtility.AsyncDelete(new FileInfo(zipPath), 5);
			return Directory.Name;
		}
	}

	public abstract class FileWriter
	{
		private const byte TABSIZE = 4;
		public virtual void Write(string line){}
		public virtual void WriteLine(string line){}
		public virtual void WriteLine(string[] line){}
		public virtual void WriteLine(){}
		public virtual void Close(){}
		public virtual bool CanWrite(){ return false;}

		private byte indentLevel = 0;
		public void Indent() { if(indentLevel<255) ++indentLevel;}
		public void Unindent(){ if(indentLevel>0) --indentLevel; }

		protected string Indentation {get{
			return new String(' ', indentLevel*TABSIZE);
		}}
		protected byte[] ToByteArray(string s)
		{
			return Encoding.UTF8.GetBytes(s);
		}
	}

	public class StreamFileWriter: FileWriter
	{
		private FileStream Stream;
		public StreamFileWriter(FileStream file)
		{
			Stream = file;
		}

		override
		public void Write(string line)
		{
			Stream.Write(ToByteArray(line));
		}

		override
		public void WriteLine(string line)
		{
			line = Environment.NewLine+Indentation+line+Environment.NewLine;
			Write(line);
		}

		override
		public void WriteLine(string[] words)
		{
			string line = "";
			foreach (var word in words)
			{
				if(word is not null)
					line += " "+word;
			}
			line = Environment.NewLine+Indentation+line+Environment.NewLine;
			Write(line);
		}
		override
		public void WriteLine()
		{
			Write(Environment.NewLine);
		}

		override
		public void Close()
		{
			// Stream.Flush();
			Stream.Close();
			Stream.Dispose();
		}

		override
		public bool CanWrite()
		{
			return Stream.CanWrite;
		}
	}

	public class NullFileWriter: FileWriter
	{
		public NullFileWriter(string filePath)
		{
			Console.WriteLine("Could not cereate file at ", filePath);
		}
		public NullFileWriter(){}
	}


}