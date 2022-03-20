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

        public int X { get; }
        public int Y { get; }

        public override string ToString() => $"({X}, {Y})";
    }

    enum Tool{
        ClassComponent, AbstractClassComponent, InterfaceComponent, EnumerationComponent, AttributeComponent, OperationComponent, EnumeralComponent, DiagramComponent
    }
    [TestClass]
    public class TestUserInterface
    {
        private IWebDriver _chromeDriver;

        private Dictionary<Tool, IWebElement> _toolBarItems;


        public TestUserInterface()
        {
            new DriverManager().SetUpDriver(new ChromeConfig());
            ChromeOptions options = new ChromeOptions();
            options.AddArguments("--auto-open-devtools-for-tabs");
            this._chromeDriver = new ChromeDriver();
            _chromeDriver.Manage().Timeouts().ImplicitWait = TimeSpan.FromSeconds(5);
        }
        
        private void LoadToolbarItems()
        {
            _toolBarItems = new Dictionary<Tool, IWebElement>();
            _toolBarItems.Add(
                Tool.InterfaceComponent, _chromeDriver.FindElement(By.Id("Interface"))
            );
            _toolBarItems.Add(
                Tool.DiagramComponent, _chromeDriver.FindElement(By.Id("graphContainer"))
            );
        }
        private  void OpenClientConnection()
        {
            _chromeDriver.Navigate().GoToUrl("https://localhost:5001");
        }


        [TestMethod]
        public void Test_One()
        {
            try{
                OpenClientConnection();
                Thread.Sleep(TimeSpan.FromSeconds(1));
                LoadToolbarItems();
                Coords c_IPet = new Coords(245, 115);
                MakeInterface(c_IPet);

            }catch(Exception e ){
                Console.WriteLine(e);
            }finally{
                Thread.Sleep(TimeSpan.FromSeconds(13));
               this._chromeDriver.Close();
            }
            

        }
        public void MakeInterface(Coords componentDestination)
        {
            var interfaceTool = _toolBarItems[Tool.InterfaceComponent];
            var to = _toolBarItems[Tool.DiagramComponent];

            var destingationOffset  =  new Coords(
                componentDestination.X - interfaceTool.Location.X, 
                componentDestination.Y - interfaceTool.Location.Y 
                );

                Console.WriteLine("Y = "+interfaceTool.Location.Y+"=>"+destingationOffset.Y);
                Console.WriteLine("X = "+interfaceTool.Location.X+"=>"+destingationOffset.X);
            var action = new Actions(_chromeDriver);
            action
                // .DragAndDropToOffset(interfaceTool, destingationOffset.X, destingationOffset.Y)
                .MoveToElement(interfaceTool)
                .ClickAndHold()
                .MoveByOffset(destingationOffset.X, destingationOffset.Y)
                .Release()
                .MoveByOffset(-2, 2)
                .DoubleClick()
                .SendKeys("IShape")
                .MoveByOffset(250, -50)
                .Click()
                .Build()
                .Perform();
            
        }
    }

}
