using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using Microsoft.AspNetCore.SignalR;
using System.Threading.Tasks;
using Newtonsoft.Json;

using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Logging;
using CoUML_app.Utility;
using CoUML_app.Models;
using Attribute = CoUML_app.Models.Attribute;

namespace CoUML_app.Controllers.Generators
{

	public interface ISourceCodeGenerator
	{
		public void CreatePackage(Diagram diagram);
		public void Parse(UmlElement element);
		public void ClosePackage();
	}

	public class JavaCodeGenerator: ISourceCodeGenerator
	{
		private const string LANGUAGE = "Java";
		private Package _package = null;
		private bool isDeclaration = false;
		
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
				case Class:			Parse(element as Class); break;
				case AbstractClass:	Parse(element as AbstractClass); break;
				case Interface:		Parse(element as Interface); break;
				case Enumeration:		Parse(element as Enumeration); break;
				case Operation:		Parse(element as Operation); break;
				case Attribute:		Parse(element as Attribute); break;
				case Enumeral:		Parse(element as Enumeral); break;
				default: break;
			}
		}
		

		public void Parse(Component component)
		{
			_package.File = FileUtility.CreateFile(_package.Directory, component.name+".java");
			if(_package.File.CanWrite())
			{
				isDeclaration = component is Interface;
				ParseHeader(component);
				_package.File.Write("{");
				_package.File.Indent();
				ParseBody(component);
				_package.File.Unindent();
				_package.File.Write("}");
				_package.File.Close();
			}
		}

		private void ParseHeader(Component? component)
		{
			_package.File.WriteLine(new string[] {
				NormalizeVisibility(VisibilityType.Public),
				NormalizeStatic(component.isStatic),
				NormalizeComponentType(component),
				NormalizeComponentName(component.name),
				NormailzeExtend(component.ParentClasses.Iterator()),
				NormalizeImpliment(component.ParentInterfaces.Iterator())
			});
		}

		private void ParseBody(Component component)
		{
			switch(component)
			{
				case Class:
					IterateParse(((Class)component).attribute.Iterator());
					IterateParse(((Class)component).operations.Iterator());
					break;
				case AbstractClass:
					IterateParse(((AbstractClass)component).attribute.Iterator());
					IterateParse(((AbstractClass)component).operations.Iterator());
					break;
				case Interface:
					IterateParse(((Interface)component).operations.Iterator());
					break;
				case Enumeration:
					IterateParse(((Enumeration)component).enums.Iterator());
					break;
			}
			ParseInheritance(component);
		}

		private void ParseInheritance(Component component)
		{
			ICollectionIterator<Component> parentItereator = component.ParentInterfaces.Iterator();
			while(parentItereator.HasNext())
			{
				ParseBody(parentItereator.GetNext());
			}
		}


		public void Parse(Attribute attribute)
		{

			_package.File.WriteLine(new string[] {
				NormalizeVisibility(attribute.visibility),
				NormalizeStatic(attribute.isStatic),
				NormalizeDataType(attribute.type, attribute.multiplicity),
				NormalizePropertyName(attribute.name),
				NormalizeDefualtValue(attribute.defaultValue),
				";",
				NormalizePropertyString(attribute.propertyString)
			});
		}

		public void Parse(Operation operation)
		{

			_package.File.WriteLine(new string[]{
				NormalizeVisibility(operation.visibility),
				NormalizeStatic(operation.isStatic),
				NormalizeDataType(operation.type),
				NormalizePropertyName(operation.name),
				NormalizeParameters(operation.parameters.Iterator()),
				NormalizePropertyString(operation.propertyString),
				isDeclaration? ";":"{}"
			});

		}

		public void Parse(Enumeral enumeral)
		{

			_package.File.WriteLine(new string[]{
				NormalizeEnumeral(enumeral.name)
			});
		}

		private void IterateParse<T>(ICollectionIterator<T> iterator) where T : UmlElement
		{
			while(iterator.HasNext())
				Parse(iterator.GetNext());
		}


		private void Import(Component dependency)
		{
			_package.File.WriteLine(
				$"import {dependency.name};"
			);

		}

		private string? NormailzeExtend(ICollectionIterator<Component> components)
		{
			string extendString = null;
			if(components.HasNext())
			{
				extendString = "extends";
				while(components.HasNext())
					extendString += $" {NormalizeComponentName(components.GetNext().name)}";
			}
			return extendString;
		}

		private string? NormalizeImpliment(ICollectionIterator<Component> components)
		{
			string implimentString = null;
			if(components.HasNext())
			{
				implimentString = "impliments";
				while(components.HasNext())
					implimentString += $" {NormalizeComponentName(components.GetNext().name)}";
			}
			return implimentString;
		}

		private static string? NormalizeVisibility(VisibilityType type)
		{
			switch(type)
			{
				case VisibilityType.Package:	return "package";
				case VisibilityType.Private:	return "private";
				case VisibilityType.Protected:	return "protected";
				case VisibilityType.Public:	 return "public";
				case VisibilityType.LocalScope:
				default:	return null;
			}
		}

		private static string? NormalizeDataType( DataType dataType, Multiplicity multiplicity )
		{
			string? type = dataType.dataType;
			if(!multiplicity.IsSingle())
				type += "[]"; 
			return type;
		}
		private static string? NormalizeDataType(DataType dataType )
		{
			return dataType.dataType;
		}

		private static string? NormalizeStatic(bool isStatic)
		{
			return isStatic? "static": null;
		}

		private static string? NormalizePropertyName(string name)
		{
			return char.ToLower(name[0])+name.Substring(1);
		}
		private static string? NormalizeComponentName(string name)
		{
			return  char.ToUpper(name[0])+name.Substring(1);
		}

		private static string? NormalizeDefualtValue(string defaultValue)
		{
			return defaultValue is null  || defaultValue == "" ? null: "= "+defaultValue;
		}


		private static string? NormalizePropertyString(string propertyString)
		{
			return propertyString is null || propertyString == "" ? null: $"/* {propertyString} */";
		}

		private static string NormalizeParameters(ICollectionIterator<Attribute> parameters)
		{
			string parameterString = "";
			while(parameters.HasNext())
			{
				Attribute p = parameters.GetNext();
				parameterString += $"{NormalizeDataType(p.type)} {NormalizePropertyName(p.name)},";
			}
			return $"({parameterString.Trim(',')})";
		}


		private static string? NormalizeComponentType(Component c)
		{
			switch (c)
			{
				case Class: return "class";
				case AbstractClass: return "abstract class";
				case Interface: return "interface";
				case Enumeration: return "enum";
				default: break;
			}
			return null;
		}

		private static string? NormalizeEnumeral(string enumeral)
		{
			return enumeral.ToUpper()+",";
		}
		// private static string? Normalize(string? )
		// {
		// 	return 
		// }

	}
}