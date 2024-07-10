using System.IO;
using System.Xml.Serialization;
using SerializeTest;

namespace DesirializeTest {
  class Program {
    static void Main(string[] args) {
      var fileStream = new FileStream(args[0], FileMode.Open, FileAccess.Read);
      var streamReader = new StreamReader(fileStream);
      var serializer = new XmlSerializer(typeof(MyConsoleText));
      serializer.Deserialize(streamReader);
    }
  }
}
