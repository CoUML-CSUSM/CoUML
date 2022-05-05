using System;
using System.Collections.Generic;
using System.IO;
using System.Collections.Specialized;
using System.Linq;
using Microsoft.AspNetCore.SignalR;
using System.Threading.Tasks;
using Newtonsoft.Json;

using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Logging;
using CoUML_app.Utility;
using CoUML_app.Models;

namespace CoUML_app.Controllers.Generators
{

	public interface ISourceCodeGenerator
	{
		public void CreatePackage(Diagram diagram);
		public void Parse(UmlElement element);
		public void Parse(Class umlClass);
		public void Parse(Models.Attribute umlAttribute);
		// public void Parse(Models.Operation umlOpperation);
		public void ClosePackage();
	}

	public class JavaCodeGenerator: ISourceCodeGenerator
	{
		private const string LANGUAGE = "Java";
		private Package _package = null;
		
		public void CreatePackage(Diagram diagram)
		{
			if(_package is null)
				_package = FileUtility.CreatePackage(LANGUAGE, diagram.id);
			else{/*TODO: Create and enter a sub directory*/}
			
		}

		public void ClosePackage()
		{
			//TODO Close package and move backout of directory
		}
		
		public void Parse(UmlElement element)
		{
			switch(element)
			{
				case Class: Parse(element as Class); break;
				default: break;
			}
		}
		

		public void Parse(Class umlClass)
		{
			_package.File = FileUtility.CreateFile(_package.Directory, umlClass.name+".java");
			if(_package.File.CanWrite())
			{

				ImportDependencies(umlClass.Dependencies.Iterator());
				_package.File.Write($"public class {umlClass.name}");
				Extends(umlClass.ParentClasses.Iterator());
				Impliments(umlClass.ParentInterfaces.Iterator());
				_package.File.Write($"{{");
				_package.File.Indent();
				Iterate((Models.ICollectionIterator<UmlElement>)umlClass.attribute.Iterator(), Parse);
				Iterate((Models.ICollectionIterator<UmlElement>)umlClass.operations.Iterator());
				_package.File.Unindent();
				_package.File.Write($"}}");
				_package.File.Close();
			}
		}

		public void Parse(Models.Attribute attribute)
		{
			if(_package.File.CanWrite())
			{
				_package.File.WriteLine(
					( attribute.visibility==null? "" : $"{GetVisibility(attribute.visibility)} " )+
					$"{attribute.type.dataType}" +
					$"{attribute.name}" +
					$"// {attribute.propertyString}");
			}
		}

		public void Parse(Models.Operation operation)
		{
			if(_package.File.CanWrite())
			{
				_package.File.WriteLine(
					( operation.visibility==null? "" : $"{GetVisibility(operation.visibility)} " )+
					$"{operation.type.dataType}" +
					$"{operation.name}" +
					$"// {operation.propertyString}");
			}
		}

		public void Iterate(Models.ICollectionIterator<UmlElement> iterator, )
		{}
		public void Iterate(Models.ICollectionIterator<UmlElement> iterator)
		{
			while(iterator.HasNext())
				iterator.GetNext().GenerateCode(this);
		}

		private void ImportDependencies(Models.ICollectionIterator<Models.Component> dependencies)
		{
			if(_package.File.CanWrite())
				while(dependencies.HasNext())
				{	
					Component comp = dependencies.GetNext();
					_package.File.WriteLine(
						$"import {comp.name};"
					);
				}
		}

		private void Extends(Models.ICollectionIterator<Models.Component> components)
		{
			if(components.HasNext() && _package.File.CanWrite())
			{
				_package.File.Write($" extends");
				while(components.HasNext())
					_package.File.Write($" {components.GetNext().name}");
			}
		}

		private void Impliments(Models.ICollectionIterator<Models.Component> components)
		{
			if(components.HasNext() && _package.File.CanWrite())
			{
				_package.File.Write($" implement");
				while(components.HasNext())
					_package.File.Write($" {components.GetNext().name}");
			}
		}

		private String GetVisibility(VisibilityType type)
		{
			switch(type)
			{
				case VisibilityType.Package:	return "package";
				case VisibilityType.Private:	return "private";
				case VisibilityType.Protected:	return "protected";
				case VisibilityType.Public:	 return "public";
				case VisibilityType.LocalScope:
				default:	return "";
			}
		}

	}
}