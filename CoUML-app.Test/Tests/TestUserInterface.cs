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
            Console.WriteLine("Loading Toolbar Items");
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
            Thread.Sleep(TimeSpan.FromSeconds(8));
        }


        [TestMethod]
        public void IntegrationTest_1()
        {
            try{
                OpenClientConnection();
                LoadToolbarItems();


                Coords iPet = Build(
                    new Coords(200, 200), 
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

                DrawEdge(dog, iPet, Tool.Generalization);
                // Delete(c_IPet);



            }catch(Exception e ){
                Console.WriteLine(e);
            }finally{
            //     Thread.Sleep(TimeSpan.FromSeconds(25));
            //    _chromeDriver.Close();
            }
            Assert.Fail();
        }

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

        private void DrawEdge( Coords source, Coords target, string edgeType)
        {
            var offsetTo_Target = CalculateOffset(source, target);

            var midpoint = TestHelper.CalculateMidPoint(source, target);


            var action  = NewActionsAtCoords(source);
            action
                .Click()
                .MoveByOffset(160, 40)
                .ClickAndHold()
                .MoveByOffset(offsetTo_Target.X, offsetTo_Target.Y)
                .Release()
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

        private Coords CalculateOffset(IWebElement source, Coords componentTarget)
        {
            return TestHelper.CalculateOffset(
                new Coords(source.Location.X, source.Location.Y), componentTarget);
        }
        public Coords CalculateOffset(Coords source, Coords target)
        {
            return TestHelper.CalculateOffset(source, target);
        }

        public Coords ConnectableCenter(Coords elem)
        {
            return new Coords(
                elem.X + Tool.Std_Width/2,
                elem.Y + Tool.Std_Heght/2
            );
        }

        public Actions NewActionsAtCoords(Coords here)
        {
            var source = _toolBarItems[Tool.Reference];
            Console.WriteLine(source);
            var offset = CalculateOffset(source, here);

            return new Actions(_chromeDriver)
                .MoveToElement(source)
                .MoveByOffset(offset.X, offset.Y)
                .Click();
        }
    }

    static class TestHelper
    {
        public static System.TimeSpan DELAY_TIME = TimeSpan.FromMilliseconds(100);
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
