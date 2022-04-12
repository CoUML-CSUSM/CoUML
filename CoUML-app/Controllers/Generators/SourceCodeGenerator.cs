using System;
using System.IO;
using System.Collections.Specialized;
using System.Linq;
using Microsoft.AspNetCore.SignalR;
using System.Threading.Tasks;
using Newtonsoft.Json;

using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Logging;
using CoUML_app.Models;

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
        string _packageDirectory = null;
        FileStreamWriter _sourceCodeFileStream  = null;
        
        public void CreatePackage(Diagram diagram)
        {
            string rootDirectory =  Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/Java/");
            _packageDirectory = Path.Combine(rootDirectory, diagram.id);
            System.IO.Directory.CreateDirectory(_packageDirectory);
        }
        public void ClosePackage()
        {

        }
        
        public void Parse(UmlElement element)
        {
            switch(element)
            {
                case Class: ParseClass(element as Class); break;
                default: break;
            }
        }
        

        public void ParseClass(Class classModel)
        {
            string sourceCodeFile = Path.Combine(_packageDirectory, classModel.name+".java");
            if(!System.IO.File.Exists(sourceCodeFile))
            {
                _sourceCodeFileStream = new FileStreamWriter(sourceCodeFile);

                _sourceCodeFileStream.Write($"public class {classModel.name} {{");
                var ats = classModel.attribute.Iterator();
                while(ats.HasNext())
                    ats.GetNext().GenerateCode(this);
                var ops = classModel.operations.Iterator();
                while(ops.HasNext())
                    ops.GetNext().GenerateCode(this);

                _sourceCodeFileStream.Write($"}}");
                _sourceCodeFileStream.Close();
                _sourceCodeFileStream = null;
            }
            else
            {
                Console.WriteLine("File \"{0}\" already exists.", sourceCodeFile);
                return;
            }
        }

        public void ParseAttribute(Models.Attribute attribute)
        {
            if(IsWritng())
            {
                _sourceCodeFileStream.Write(
                    ( attribute.visibility==null? "" : $"{GetVisibility(attribute.visibility)} " )+
                    $"{attribute.type.dataType}" +
                    $"{attribute.name}" +
                    $"// {attribute.propertyString}");
            }
        }

        public void Iterate(Models.ICollectionIterator<ComponentProperty> iterator)
        {
            while(iterator.HasNext())
                iterator.GetNext().GenerateCode(this);
        }

        private Boolean IsWritng()
        {
            return !(_sourceCodeFileStream == null);
        }

        private String GetVisibility(VisibilityType type)
        {
            switch(type)
            {
                case VisibilityType.Package:    return "package";
                case VisibilityType.Private:    return "private";
                case VisibilityType.Protected:  return "protected";
                case VisibilityType.Public:     return "public";
                case VisibilityType.LocalScope:
                default:                        return "";
            }
        }

    }
}