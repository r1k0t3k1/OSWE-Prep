using System;
using System.Diagnostics;
using System.IO;
using System.Xml;
using System.Xml.Serialization;


namespace MultiDeserializer {
  class Program {
    static void Main(string[] args) {
      String xml = File.ReadAllText(args[0]);
      CustomDeserializer(xml);
    }

    static void CustomDeserializer(String myXmlString) {
      var xmlDocument = new XmlDocument();
      xmlDocument.LoadXml(myXmlString);

      foreach(XmlElement xmlElem in xmlDocument.SelectNodes("customRootNode/item")) {
        String typeName = xmlElem.GetAttribute("objectType");
        var serializer = new XmlSerializer(Type.GetType(typeName));
        var reader = new XmlTextReader(new StringReader(xmlElem.InnerXml));
        
        serializer.Deserialize(reader);
      }
    }
  }

  public class ExecCMD {
    private String _cmd;
    public String cmd {
      get { return _cmd; }
      set {
        _cmd = value;
        ExecCommand();
      }
    }

    private void ExecCommand() {
      var myProcess = new Process();
      myProcess.StartInfo.FileName = _cmd;
      myProcess.Start();
      myProcess.Dispose();
    }
  }
}
