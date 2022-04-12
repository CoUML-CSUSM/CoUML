using Microsoft.VisualStudio.TestTools.UnitTesting;
using System;
using CoUML_app.Controllers.Hubs;
using CoUML_app.Controllers.Project;
using CoUML_app.Models;
using CoUML_app.Test.Tests.Samples;

namespace CoUML_app.Test.Tests
{
    [TestClass]
    public class TestSourceCodeGenerator
    {
        // Diagram testDiagram = null;
        protected ProjectController _pc;
        public TestSourceCodeGenerator()
        {
            _pc= new ProjectController();
        }

        [TestMethod]
        public void PullTestDiagram()
        {
            var controlDId= "msTestSampler";
            // _pc.Generate(controlDId);
            var controlD = TestSamples.DiagramDefualt(controlDId);
            _pc.Overwrite(controlDId, DTO.FromDiagram(controlD));
            var testD = _pc.FindDiagram(controlDId);

            Assert.AreEqual(controlD, testD);
            
            // Assert.Fail();
        }
        
    }
}