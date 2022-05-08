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

namespace CoUML_app.Utility
{


	public static class FileUtility
	{
		public const string WORD_PATTERN = @"(\w+)";
		public static FileWriter CreateFile( System.IO.DirectoryInfo directory, string file)
		{
			string filePath = Path.Combine(directory.FullName, file);
			return !System.IO.File.Exists(filePath)? 
				new StreamFileWriter(System.IO.File.Create(filePath))
				: new NullFileWriter(filePath);
		}

		public static Package CreatePackage(string parentFolder, string newFolder)
		{
			string rootDirectory =  Path.Combine(Directory.GetCurrentDirectory(), $"wwwroot/{parentFolder}/");
			string packageRoot =  ToFileName(newFolder);
			string packageDirectory = Path.Combine(rootDirectory,packageRoot);
			return new Package( packageRoot, System.IO.Directory.CreateDirectory(packageDirectory));
		}
		private static string ToFileName(string file)
		{

			MatchCollection words =  Regex.Matches(file, WORD_PATTERN);
			string newFileName = "";
			foreach (Match w in words)
			{
				var word  = w.Value;
				newFileName += char.ToUpper(word[0])+word.Substring(1).ToLower();
			}
			return newFileName+Guid.NewGuid().ToString();
		}

		public static FileStream Download(string zipPath)
		{
 			return new FileStream(zipPath, FileMode.Open, FileAccess.Read);
		}

	}

	public class Package
	{
		public System.IO.DirectoryInfo Directory{ get; set;} = null;
		public FileWriter File{get;set;} = new NullFileWriter();
		private string _root;
		
		public Package(string root, System.IO.DirectoryInfo d)
		{
			_root = root;
			Directory = d;
		}
		public string ZipAndClose()
		{
			File.Close();
			string zipPath = Directory.FullName+".zip";
			ZipFile.CreateFromDirectory(Directory.FullName, zipPath);
			// return zipPath;
			return _root;
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