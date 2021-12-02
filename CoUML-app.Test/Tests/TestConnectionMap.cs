using Microsoft.VisualStudio.TestTools.UnitTesting;
using System;
using CoUML_app.Controllers.Hubs;

namespace Test.ConnectionMap
{
	[TestClass]
	public class TestConnectionMap
	{
		private ConnectionMap<int, char> t_connectionMap_int_char;

		public TestConnectionMap()
		{
			t_connectionMap_int_char = new ConnectionMap<int, char>();
		}

		[TestMethod]
		public void Add_N_SizeEqualsN()
		{
			Random r = new Random();

			int n = 10;
			for (int i = 0; i < n; i++)
			{
				t_connectionMap_int_char.Add(i,(char)r.Next(256));
			}
			Assert.AreEqual(t_connectionMap_int_char.Count,n);

			Assert.IsTrue(t_connectionMap_int_char.IsConnected(1));
			Assert.IsTrue(t_connectionMap_int_char.Remove(1));
			Assert.IsFalse(t_connectionMap_int_char.IsConnected(1));
			Assert.IsFalse(t_connectionMap_int_char.IsConnected(11));
		}
	}
}
/**
From Directory:
/Users/smurph/Documents/CoUML/CoUML/CoUML-app

run dotnet test ../CoUML-app.Test/CoUML-app.Test.csproj  
../CoUML-app.Test/CoUML-app.Test.csproj 
 
 links:
https://www.automatetheplanet.com/mstest-cheat-sheet/

*/