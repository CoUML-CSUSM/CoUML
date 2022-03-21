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

        public const int Grid = 40;

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

    [TestClass]
    public class TestUserInterface
    {
        private IWebDriver _chromeDriver;

        private Dictionary<string, IWebElement> _toolBarItems;


        public TestUserInterface()
        {
            new DriverManager().SetUpDriver(new ChromeConfig());
            ChromeOptions options = new ChromeOptions();
            options.AddArguments("--auto-open-devtools-for-tabs");
            _chromeDriver = new ChromeDriver();
            _chromeDriver.Manage().Timeouts().ImplicitWait = TimeSpan.FromSeconds(5);
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
        }


        [TestMethod]
        public void IntegrationTest_1()
        {
            // try{
                OpenClientConnection();
                Thread.Sleep(TimeSpan.FromSeconds(1));
                LoadToolbarItems();

                // create IPet interface
                Coords c_IPet = new Coords(245, 115);
                DragAndDrop(_toolBarItems[Tool.Interface], c_IPet);
                ChangeLabel(c_IPet, "IPet");

                // //add Operation
                // Coords c_IPet_Opp1 = new Coords(
                //     c_IPet.X + 5, c_IPet.Y + 10
                // );
                // DragAndDrop(_toolBarItems[Tool.Operation], c_IPet_Opp1);
                // c_IPet_Opp1.Y += Tool.Grid * 1;
                // ChangeLabel(c_IPet_Opp1, "+ play(toy: Exersize, duration: number): boolean");
                // Thread.Sleep(TimeSpan.FromSeconds(1));

                // //add Operation
                // Coords c_IPet_Opp2 = new Coords(
                //     c_IPet.X + 5, c_IPet.Y + 10
                // );
                // DragAndDrop(_toolBarItems[Tool.Operation], c_IPet_Opp2);
                // c_IPet_Opp2.Y += Tool.Grid * 2;
                // ChangeLabel(c_IPet_Opp2, "+ feed(chow: Kibble, amount: number): boolean");

                // //add abstracClass
                // Coords c_SiCat = new Coords(245, 405);
                // DragAndDrop(_toolBarItems[Tool.AbstractClass], c_SiCat);
                // ChangeLabel(c_SiCat, "StandarIssueCat");

                // DrawEdge(c_SiCat, c_IPet, Tool.Generalization);


            // }catch(Exception e ){
            //     Console.WriteLine(e);
            // }finally{
            //     Thread.Sleep(TimeSpan.FromSeconds(13));
            //    this._chromeDriver.Close();
            // }
            

        }

        private void DrawEdge( Coords source, Coords target, string edgeType)
        {
            source = ConnectableCenter(source);
            target = ConnectableCenter(target);
            var offsetTo_Target = CalculateOffset(source, target);

            var midpoint = TestHelper.CalculateMidPoint(source, target);
            var offsetTo_midpoint = CalculateOffset(target, midpoint);


            var action  = NewActionsAtCoords(source);
            action
                .ClickAndHold()
                .MoveByOffset(offsetTo_Target.X, offsetTo_Target.Y)
                .Release()
                .MoveByOffset(offsetTo_midpoint.X, offsetTo_midpoint.Y)
                .ContextClick()
                .MoveToElement(_chromeDriver.FindElement(By.Id(edgeType)))
                .Click()
                .Build()
                .Perform();
                        
            
        }
        public void DragAndDrop(IWebElement source, Coords componentDestination)
        {

            var destinationOffset  =  CalculateOffset(source, componentDestination);

            var action = new Actions(_chromeDriver);
            action
                .MoveToElement(source)
                .ClickAndHold()
                .MoveByOffset(destinationOffset.X, destinationOffset.Y)
                .Release()
                .Build()
                .Perform();
            
        }

        public void ChangeLabel(Coords component, string label)
        {
            var action = NewActionsAtCoords(component);
            action
                // .MoveByOffset(8, 8)
                .DoubleClick()
                .SendKeys("label")
                // .MoveByOffset(20, -50)
                // .Click()
                .Build()
                .Perform();
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
            var offset = CalculateOffset(source, here);

            return new Actions(_chromeDriver)
                .MoveToElement(source)
                .MoveByOffset(offset.X, offset.Y);
        }
    }

    static class TestHelper
    {
        public static Coords CalculateOffset(Coords source, Coords target)
        {
            var delta = new Coords(
                target.X - source.X, 
                target.Y - source.Y
            );

            Console.WriteLine(
                "Calculating Offset\n"
                +   "Source +-> Delta ==> Target\n"
                +   $"X {source.X:n} +-> {delta.X:n} ==> {target.X:n}\n"
                +   $"Y {source.Y:n} +-> {delta.Y:n} ==> {target.Y:n}\n"
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
