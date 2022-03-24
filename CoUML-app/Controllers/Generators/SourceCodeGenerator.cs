using System;
using System.IO;
using System.Collections.Generic;
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
        string packageDirectory = null;
        public void CreatePackage(Diagram diagram)
        {
            string rootDirectory =  Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/Java/");
            packageDirectory = Path.Combine(rootDirectory, diagram.id);
            System.IO.Directory.CreateDirectory(packageDirectory);
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
            string sourceCodeFile = Path.Combine(packageDirectory, classModel.name+".java");
            if(!System.IO.File.Exists(sourceCodeFile))
            {
                FileStreamWriter sourceCodeFileStream = new FileStreamWriter(sourceCodeFile);
                sourceCodeFileStream.Write($"public class {classModel.name}");
                sourceCodeFileStream.Close();

            }
            else
            {
                Console.WriteLine("File \"{0}\" already exists.", sourceCodeFile);
                return;
            }

        }


    }
}