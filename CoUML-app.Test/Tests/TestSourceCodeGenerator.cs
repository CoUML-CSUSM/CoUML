using Microsoft.VisualStudio.TestTools.UnitTesting;
using System;
using CoUML_app.Controllers.Hubs;
using CoUML_app.Models;
using CoUML_app.Test.Tests.Samples;

namespace CoUML_app.Test.Tests
{
    [TestClass]
    public class TestSourceCodeGenerator
    {
        // Diagram testDiagram = null;
        CoUmlHub hub;
        public TestSourceCodeGenerator()
        {
            hub = new CoUmlHub();
        }

        [TestMethod]
        public void pullTestDiagram()
        {
            var d = hub.LookUp("test");
            Console.WriteLine(d);
            ;
        }
        
    }
}