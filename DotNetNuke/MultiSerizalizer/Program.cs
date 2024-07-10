using System;
using System.IO;
using System.Xml;
using System.Xml.Serialization;


namespace MultiSerializer {
	class Program {
		static void Main(string[] args) {
      String text = args[0];
      int myClass = Int32.Parse(args[1]);

      if (myClass == 1) {
        var myText = new MyFirstConsoleText();
        myText.text = text;
        CustomSerializer(myText);
      } else {
        var myText = new MySecondConsoleText();
        myText.text = text;
        CustomSerializer(myText);
      }
		}

    static void CustomSerializer(Object myObj) {
      var xmlDocument = new XmlDocument();
      XmlElement xmlElement = xmlDocument.CreateElement("customRootNode");
      xmlDocument.AppendChild(xmlElement);

      XmlElement xmlElement2 = xmlDocument.CreateElement("item");
      xmlElement2.SetAttribute("objectType", myObj.GetType().AssemblyQualifiedName);
      
      var xmlDocument2 = new XmlDocument();
      var xmlSerializer = new XmlSerializer(myObj.GetType());
      
      var writer = new StringWriter();
      xmlSerializer.Serialize(writer, myObj);
      xmlDocument2.LoadXml(writer.ToString());

      xmlElement2.AppendChild(xmlDocument.ImportNode(xmlDocument2.DocumentElement, true));
      
      xmlElement.AppendChild(xmlElement2);

      File.WriteAllText("../xmls/Multi.xml", xmlDocument.OuterXml);
    }
	}

	public class MyFirstConsoleText
	{
			private String _text;

			public String text
			{
					get { return _text; }
					set { _text = value; Console.WriteLine("My first console text class says: " + _text); }
			}
	}

	public class MySecondConsoleText
	{
			private String _text;

			public String text
			{
					get { return _text; }
					set { _text = value; Console.WriteLine("My second console text class says: " + _text); }
			}
	}
}
