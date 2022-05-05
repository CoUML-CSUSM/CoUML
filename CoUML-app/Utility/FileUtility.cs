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

namespace CoUML_app.Utility
{


	public static class FileUtility
	{
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
			string packageDirectory = Path.Combine(rootDirectory, newFolder);
			return new Package( System.IO.Directory.CreateDirectory(packageDirectory));
		}
	}

	public class Package
	{
		public System.IO.DirectoryInfo Directory{ get; set;} = null;
		public FileWriter File{get;set;} = new NullFileWriter();
		
		public Package(System.IO.DirectoryInfo d)
		{
			Directory = d;
		}

	}

	public abstract class FileWriter
	{
		private const byte TABSIZE = 4;
		public abstract void Write(string line);
		public abstract void WriteLine(string line);
		public abstract void Close();
		public abstract bool CanWrite();

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
			byte[] charBuffer = ToByteArray(Indentation+line);
			Stream.Write(charBuffer, 0, charBuffer.Length);
		}

		override
		public void Close()
		{
			Stream.Flush();
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
		override
		public void Write(string line) { }
		override
		public void WriteLine(string line) { }
		override
		public void Close() { }

		override
		public bool CanWrite()
		{
			return false;
		}
		public NullFileWriter(string filePath)
		{
			Console.WriteLine("Could not cereate file at ", filePath);
		}
		public NullFileWriter(){}
	}


}