using Microsoft.VisualStudio.TestTools.UnitTesting;
using System;
using OpenQA.Selenium;
using OpenQA.Selenium.Chrome;
using WebDriverManager;
using WebDriverManager.DriverConfigs.Impl;
using OpenQA.Selenium.Interactions;
using OpenQA.Selenium.Remote;
using Microsoft.AspNetCore.Authentication.OAuth.Claims;
using System.Collections.Generic;
using System.ComponentModel;
using System.Threading;
using AngleSharp.Common;
using CoUML_app.Test.TestSamples;
/*
FindElement(By.__("<somthing>"));
https://www.toolsqa.com/selenium-webdriver/c-sharp/findelement-and-findelements-commands-in-c/


*/

namespace CoUML_app.Test.Tests
{
    public struct Coords
    {
        public Coords(int x, int y)
        {
            X = x;
            Y = y;
        }

        public int X { get; set; }
        public int Y { get; set; }

        public override string ToString() => $"({X}, {Y})";
    }

    public static class Tool{
        public const string Class = "Class"; 
        public const string AbstractClass = "Abstract";
        public const string Interface = "Interface";
        public const string Enumeration = "Enumeration";
        public const string Attribute = "Attribute";
        public const string Operation = "Operation";
        public const string Enumeral = "Enumeral";
        public const string Diagram = "graphContainer";

        public const string Dependency= "Dependency";	
        public const string Association = "Association";	
        public const string Aggregation = "Aggregation"; 
        public const string Composition = "Composition";	
        public const string Generalization= "Generalization";
        public const string Realization = "Realization";

        public const string Reference = "CoUML_app";

        public const int Grid = 30;

        public const int Std_Width = 200;
        public const int Std_Heght = 30;

        public static readonly string[] All = {
            Class,
            AbstractClass,
            Interface,
            Enumeration,
            Attribute,
            Operation,
            Enumeral,
            Diagram,
            Reference
        };
    }

    public struct DiagramComponent
    {
        public IWebElement Tool{ get; set; }
        public string Description{ get; set; }
        public DiagramComponent(IWebElement tool, string description)
        {
            Tool = tool;
            Description = description;
        }
    }

    [TestClass]
    public class TestUserInterface
    {
        private IWebDriver _chromeDriver;

        private Dictionary<string, IWebElement> _toolBarItems;


        public TestUserInterface()
        {
            new DriverManager().SetUpDriver(new ChromeConfig());
            ChromeOptions options = new ChromeOptions{Proxy = null};
            options.AddArguments("--auto-open-devtools-for-tabs");
            _chromeDriver = new ChromeDriver(options);
            _chromeDriver.Manage().Timeouts().ImplicitWait = TimeSpan.FromSeconds(5);
            _chromeDriver.Manage().Window.Maximize();
        }
        
        private void LoadToolbarItems()
        {
            _toolBarItems = new Dictionary<string, IWebElement>();
            foreach (string tool in Tool.All){
                try{
                    _toolBarItems.Add( tool, _chromeDriver.FindElement(By.Id(tool)));
                }catch(Exception e)
                {
                    Assert.Fail($"Component not found:\t{tool}\n{e}");
                }
            }
        }
        private  void OpenClientConnection()
        {
            _chromeDriver.Navigate().GoToUrl("https://localhost:5001");
            Thread.Sleep(TimeSpan.FromSeconds(1));
        }


        [TestMethod]
        public void IntegrationTest_1()
        {
            try{
                OpenClientConnection();
                GenerateNewDiagram("Animals");
                LoadToolbarItems();


                Coords iPet = Build(
                    new Coords(300, 200), 
                    new DiagramComponent[]{
                        new (_toolBarItems[Tool.Interface], "IPet"),
                        new (_toolBarItems[Tool.Operation], "+ feed(chow: Kibble, amount: number): boolean"),
                        new (_toolBarItems[Tool.Operation], "+ play(): void"),
                    });

                Coords dog = Build(
                    new Coords(200, 450), 
                    new DiagramComponent[]{
                        new (_toolBarItems[Tool.AbstractClass], "Dog"),
                        new (_toolBarItems[Tool.Attribute], "- name: string"),
                        new (_toolBarItems[Tool.Operation], "+ speak():void"),
                        new (_toolBarItems[Tool.Operation], "- scratch( spot: Spot): void"),
                    });

                DrawEdge(dog, iPet, Tool.Realization, 5);

                Coords cat = Build(
                    new Coords(500, 450), 
                    new DiagramComponent[]{
                        new (_toolBarItems[Tool.AbstractClass], "cat"),
                        new (_toolBarItems[Tool.Attribute], "- name: string"),
                        new (_toolBarItems[Tool.Attribute], "- furLength: number"),
                        new (_toolBarItems[Tool.Operation], "+ purr():void"),
                        new (_toolBarItems[Tool.Operation], "+ scratch(): Damage"),
                    });

                DrawEdge(cat, iPet, Tool.Realization, 5);

            }catch(Exception e ){
                Console.WriteLine(e);
            }finally{
                Thread.Sleep(TimeSpan.FromSeconds(2));
               _chromeDriver.Close();
            }
            Assert.Fail();
        }

        [TestMethod]
        public void TestAtributeDescription()
        {
            OpenClientConnection();
            LoadToolbarItems();
            OpenTest();
            // make list of attributes
            List<DiagramComponent> dc = new List<DiagramComponent>();
            dc.Add(new (_toolBarItems[Tool.AbstractClass], "AttributeTest"));
            Random random = new Random();
            for(int i = 0; i < 10; i++)
            {
                dc.Add(new DiagramComponent(_toolBarItems[Tool.Attribute], Inline.ATTRIBUTES[random.Next(Inline.ATTRIBUTES.Length-1)]));
            }

            Coords atClass = Build( new Coords(300, 120), dc.ToArray() );

            Thread.Sleep(TimeSpan.FromSeconds(25));
            _chromeDriver.Close();

        }


        [TestMethod]
        public void TestOpperationDescription()
        {
            OpenClientConnection();
            LoadToolbarItems();
            OpenTest();
            // make list of attributes
            List<DiagramComponent> dc = new List<DiagramComponent>();
            dc.Add(new (_toolBarItems[Tool.Interface], "OperationsTest"));
            Random random = new Random();
            for(int i = 0; i < 10; i++)
            {
                dc.Add(new DiagramComponent(_toolBarItems[Tool.Operation], Inline.OPPERATION[random.Next(Inline.OPPERATION.Length-1)]));
            }

            Coords opInterf = Build( new Coords(500, 120), dc.ToArray() );

            Thread.Sleep(TimeSpan.FromSeconds(25));
            _chromeDriver.Close();

        }

        /// <summary>
        /// builds a single component 
        /// </summary>
        /// <param name="root"></param>
        /// <param name="pieces"></param>
        /// <returns></returns>
        private Coords Build(Coords root, DiagramComponent[] pieces)
        {

            for(int i = 0; i < pieces.Length; i ++)
            {
                DragAndDrop(pieces[i].Tool, root, i>0);
                ChangeLabel((i>0? 
                    new Coords(
                        root.X, root.Y + 13 + Tool.Grid * i
                    )
                :root), pieces[i].Description);
            }
            return root;
        }

        /// <summary>
        /// open test diagram
        /// </summary>
        private void OpenTest()
        {
            new Actions(_chromeDriver)
                .MoveToElement(_chromeDriver.FindElement(By.Id("menuFile")))
                .Click().Build().Perform();
            new Actions(_chromeDriver)
                .MoveToElement(_chromeDriver.FindElement(By.Id("menuFileFetchTest")))
                .Click().Build().Perform();
        }

        private void GenerateNewDiagram(string name)
        {
            new Actions(_chromeDriver)
                .MoveToElement(_chromeDriver.FindElement(By.Id("menuFile")))
                .Click().Build().Perform();
            new Actions(_chromeDriver)
                .MoveToElement(_chromeDriver.FindElement(By.Id("menuFileNew")))
                .Click().Build().Perform();
            new Actions(_chromeDriver)
                .MoveToElement(_chromeDriver.FindElement(By.Id("inputDiagramName")))
                .Click().Build().Perform();

            new Actions(_chromeDriver)
                .SendKeys(name)
                .Click().Build().Perform();

            new Actions(_chromeDriver)
                .MoveToElement(_chromeDriver.FindElement(By.Id("submitDiagramName")))
                .Click().Build().Perform();
            Thread.Sleep(TestHelper.DELAY_TIME);
        }

        /// <summary>
        /// try to draw a relation between 2 comps
        /// </summary>
        /// <param name="source"></param>
        /// <param name="target"></param>
        /// <param name="edgeType"></param>
        /// <param name="targetExtra"></param>
        private void DrawEdge( Coords source, Coords target, string edgeType, int targetExtra)
        {
            var offsetTo_Target = CalculateOffset(source, target);

            NewActionsAtCoords(source)
                .Click()
                .MoveByOffset(160, 40)
                .ClickAndHold()
                .MoveByOffset(offsetTo_Target.X, offsetTo_Target.Y)
                .Release()
                .MoveByOffset(offsetTo_Target.X*-1, offsetTo_Target.Y*-1)
                .Click()
                .Build().Perform();
            Thread.Sleep(TestHelper.DELAY_TIME);

            Coords midPoint = CalculateMidPoint(source, target, targetExtra);
            new Actions(_chromeDriver)
                .MoveByOffset(midPoint.X, midPoint.Y)
                .Click()
                .ContextClick()
                .Build().Perform();
            Thread.Sleep(TestHelper.DELAY_TIME);

            new Actions(_chromeDriver)
                .MoveToElement(_chromeDriver.FindElement(By.Id(edgeType)))
                .Click()
                .MoveByOffset(5,5)
                .Click()
                .Build().Perform();
                        
        }
        public void DragAndDrop(IWebElement source, Coords componentDestination, Boolean childOffset)
        {

            var destinationOffset  =  CalculateOffset(source, componentDestination);

            var action = NewActionsAtCoords(componentDestination);
            action
                .MoveByOffset((destinationOffset.X + (childOffset? 5:0))*-1, (destinationOffset.Y+ (childOffset? 15:0))*-1)
                .MoveToElement(source)
                .ClickAndHold()
                .MoveByOffset(destinationOffset.X + (childOffset? 5:0), destinationOffset.Y+ (childOffset? 15:0))
                .Release()
                .MoveToElement(_toolBarItems[Tool.Reference]).Click()
                .Build()
                .Perform();
            Thread.Sleep(TestHelper.DELAY_TIME);
        }

        public void ChangeLabel(Coords component, string label)
        {
            var action = NewActionsAtCoords(component);
            action
                .MoveByOffset(85, 32)
                .Click()
                .Release().Build().Perform();
            Thread.Sleep(TimeSpan.FromMilliseconds(100));
            action = new Actions(_chromeDriver);
            action
                .DoubleClick()
                .SendKeys(label)
                .MoveByOffset(212, 64).Click()
                .Build().Perform();
            Thread.Sleep(TestHelper.DELAY_TIME);
        }

        public void Delete (Coords component)
        {
            Thread.Sleep(TestHelper.DELAY_TIME);
            var action = NewActionsAtCoords(component);
            action
                .MoveByOffset(85, 25)
                .Click()
                .SendKeys(Keys.Delete)
                .Build().Perform();
        }

        private static Coords CalculateOffset(IWebElement source, Coords componentTarget)
        {
            return TestHelper.CalculateOffset(
                new Coords(source.Location.X, source.Location.Y), componentTarget);
        }
        public static Coords CalculateOffset(Coords source, Coords target)
        {
            return TestHelper.CalculateOffset(source, target);
        }

        private static Coords CalculateMidPoint( Coords source, Coords target, int targetExtras)
        {
            var y = -30;
            return new Coords(
                y*(target.X - source.X)/(target.Y + (Tool.Grid*targetExtras) - source.Y), 
                y // *(source.Y>target.Y? -1:1)
            );
        }
        public Actions NewActionsAtCoords(Coords here)
        {
            var source = _toolBarItems[Tool.Reference];
            var offset = CalculateOffset(source, here);

            return new Actions(_chromeDriver)
                .MoveToElement(source)
                .MoveByOffset(offset.X, offset.Y)
                .Click();
        }
    }

    static class TestHelper
    {
        public static System.TimeSpan DELAY_TIME = TimeSpan.FromMilliseconds(50);
        public static Coords CalculateOffset(Coords source, Coords target)
        {
            var delta = new Coords(
                target.X - source.X, 
                target.Y - source.Y
            );
            return delta;
        }

        public static Coords CalculateMidPoint(Coords a, Coords b)
        {
            return new Coords(
                (a.X+b.X)/2,
                (a.Y+b.Y)/2
            );
        }
    }


}
