
 public abstract class UMLElement
{
     public string id ;

     IUser editor ;

     Dimension dimension ;

     public void apply (ChangeRecord change) {}

     public void generateCode (ISourceCodeGenerator cg) {}

     public void lock (IUser user) {}

     public void release () {}
}