import { Component } from "@angular/core";
import { User } from "src/models/DiagramModel";
@Component({
selector: "app-collaborator-activity",
templateUrl: "collaborator-activity.component.html",
styleUrls: ["./collaborator-activity.component.css"]
})
export class AppComponent {

	collaborators: ActiveUser[] =[]

	join(user: User)
	{
		this.collaborators.push({user: user, color:this.color});
	}

	leave(user: User)
	{
		let removeUserAtI = this.collaborators.findIndex((u)=>u.user.id == user.id);
		let inactiveUser = this.collaborators[removeUserAtI];
		this.collaborators = this.collaborators.splice(removeUserAtI);
		this.VibrantColors.push(inactiveUser.color);
	}

	get color():string
	{
		return this.VibrantColors.shift();
	}

	VibrantColors: string[]=[
		'CRIMSONRED',
		'FIRERED',
		'CANNARYYELLOW',
		'BUTTERYELLOW',
		'BASILGREEN',
		'FERNGREEN',
		'LIMEGREEN',
		'OCEANBLUE',
		'TEALBLUE',
		'BLUE',
		'CERULEANBLUE',
		'ARCTICBLUE',
		'INDIGOBLUE',
		'BLUEBERRYPURPLE',
		'VIOLETPURPLE',
		'PURPLE',
		'FUSIAPINK',
		'FLAMINGOPINK',
	]

}
export class ActiveUser
{
	user: User;
	color: string;
}


