import { Component } from "@angular/core";
import { ProjectDeveloper } from "src/app/controller/project-developer.controller";
import { CoUmlHubService } from "src/app/service/couml-hub.service";
import { User, IUser, NullUser } from "src/models/DiagramModel";

@Component({
	selector: "app-team-activity",
	templateUrl: "team-activity.component.html",
	styleUrls: ["./team-activity.component.css"],
})
export class TeamActivityComponent {
	_team: ActiveUser[] = [];
	_user: ActiveUser = new ActiveUser(new NullUser(),'NULL');


	constructor(
		// private _projectDeveloper: ProjectDeveloper,
	){
		console.log("Constructing this", this, "\nwith\n", arguments);
		// this._projectDeveloper.subscribe(this);
	}

	init(teamMemebers: User[]) {
		this._team = [];
		teamMemebers.forEach((tm)=>{
			if(tm.id != this._user.user.id)
				this.join(tm)
		});
	}

	join(user: User)
	{
		this._team.push( new ActiveUser( user, this.colorCheckOut()));
	}

	leave(user: User)
	{
		let removeUserAtI = this._team.findIndex((u)=>u.user.id == user.id);
		
		let left = this._team.splice(removeUserAtI,1).pop();
		this.colorCheckIn(left.icon);
	}

	login(user: IUser)
	{
		this._user = new ActiveUser(user,'UMLGRAY');
	}

	logout()
	{
		this._user = new ActiveUser(new NullUser(),'NULL');
	}

	isLoggedIn(): boolean
	{
		return !(this._user instanceof NullUser)
	}

	private colorCheckOut():string
	{
		let random = Math.floor(Math.random() * this._chipColors.length);
		let color = this._chipColors[random];
		console.log(random, color);
		this._chipColors.splice(random, 1);
		return color;
	}

	private colorCheckIn(color: string)
	{
		this._chipColors.push(color);
	}

	getteam(user: IUser): ActiveUser
	{
		return this._team.find((u)=> u.user.id == user.id);
	}

	getUser(): ActiveUser
	{
		return this._user;
	}
	

	private _chipColors: string[]=[
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
	user: IUser;
	_icon: string ;
	get iconFilePath()
	{
		return `resources/icons/users/${this._icon}.svg`
	}
	get icon(): string
	{
		return this._icon;
	}
	constructor(user: IUser, color: string)
	{
		this._icon = color;
		this.user = user;
	}
}

