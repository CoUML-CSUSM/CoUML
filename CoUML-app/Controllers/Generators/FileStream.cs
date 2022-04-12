
using System.IO;
using System.Text;
namespace CoUML_app.Controllers.Generators
{
    public class FileStreamWriter
    {
        private FileStream stream;
        public FileStreamWriter(string filePath)
        {
            stream = System.IO.File.Create(filePath);
        }

        public void Write(string line)
        {
            var charBuffer = Encoding.UTF8.GetBytes(line);
            stream.Write(charBuffer, 0, charBuffer.Length);
        }
        public void Close()
        {
            stream.Close();
        }
    }
}