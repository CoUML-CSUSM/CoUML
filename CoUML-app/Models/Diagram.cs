using  System;
using System.Collections.Generic;
using CoUML_app.Controllers.Generators;
using CoUML_app.Models;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using CoUML_app.Controllers;
using System.Drawing;

namespace CoUML_app.Models
{

	public abstract class UmlElement
	{
		public string id { get; set; } = Guid.NewGuid().ToString();
		public IUser editor { get; set; } = new NullUser();
		public IDimension dimension { get; set; } = new Dimension(0,0,200,40);
		public Boolean isStatic{ get; set; } = false;

		[JsonIgnore]
		private UmlElement Parent{get; set;}

		public virtual void GenerateCode(ISourceCodeGenerator codeGenerator)
		{
			codeGenerator.Parse(this);
		}

		public abstract void Apply(ChangeRecord change, int index);

		protected bool AppliesToMe(string[] ids)
		{
			return ids[ids.Length-1] == id;
		}

		protected virtual void ApplyLocally(ChangeRecord change)
		{
			switch(change.action)
			{
				case ActionType.Lock: 		Lock((User)change.value);	break;
				case ActionType.Release:	Release();	break;
				case ActionType.Shift: 		dimension.Shift((Point) change.value);	break;
				case ActionType.Style:		dimension.Style((string) change.value);	break;
				case ActionType.Path:		dimension.Path((Point[]) change.value);	break;
				case ActionType.Change:
					switch(change.affectedProperty)
					{
						case PropertyType.IsStatic: isStatic = (Boolean)change.value; break;
					}
					break;
				default: break;							
			}
		}

		protected void Lock(User editor)
		{
			this.editor = editor;
		}

		protected void Release()
		{
			this.editor = new NullUser();
		}

		public virtual void Validate(ref UmlElement parent)
		{
			Parent = parent;
		}
		
	}

	public class Diagram : UmlElement
	{
		public ICollection<UmlElement> elements {get;} = new RelationalCollection<UmlElement>();

		public Diagram(String dId)
		{
			id = dId;
		}
		public Diagram(){}

		override public void GenerateCode(ISourceCodeGenerator codeGenerator)
		{
			codeGenerator.CreatePackage(this);
			var elementIterator = elements.Iterator();
			while(elementIterator.HasNext())
				elementIterator.GetNext().GenerateCode(codeGenerator);
			codeGenerator.ClosePackage();
		}

		public void Apply(ChangeRecord[] changes)
		{
			foreach (var change in changes)
			{
				Apply(change, 0);
			}
		}

		override public void Apply(ChangeRecord change, int depth)
		{
			if(AppliesToMe(change.id))
				ApplyLocally(change);
			else
				elements[change.id[++depth]].Apply(change, depth);
		}

		protected void ApplyLocally(ChangeRecord change)
		{
			switch(change.action)
			{
				case ActionType.Insert: 	elements.Insert((UmlElement)change.value);	break;
				case ActionType.Remove:		elements.Remove((string)change.value); 		break;
				default: base.ApplyLocally(change);
				break;							
			}
		}
		
		override
		public void Validate( ref UmlElement defualtParrent)
		{
			base.Validate(ref defualtParrent);
			var elementIterator = elements.Iterator();

			while(elementIterator.HasNext()){}
				// elementIterator.GetNext().Validate(refthis);
		}

	}
}