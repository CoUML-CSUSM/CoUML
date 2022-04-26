import { Component, Injectable } from "@angular/core";
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
		private _projectDeveloper: ProjectDeveloper,
		private _tokens: UserTokenCatalog,
	){
		console.log("TeamActivityComponent\n", this, "\nwith\n", arguments);
		this._projectDeveloper.subscribe(this);
	}

	initTeam(teamMembers: User[]): void
	 {
		this._team = [];
		teamMembers.forEach((tm)=>{
			if(tm.id != this._user.user.id)
				this.joinTeam(new User(tm.id));
		});
		console.log("team members init\n", teamMembers, this._team);
	}

	joinTeam(user: User): void
	{
		this._team.push( new ActiveUser( user, this._tokens.checkOut()));
	}

	leaveTeam(user: User): void
	{
		let removeUserAtI = this._team.findIndex((u)=>u.user.id == user.id);
		
		let left = this._team.splice(removeUserAtI,1).pop();
		this._tokens.checkIn(left.icon);
	}

	logIn(user: IUser): void
	{
		this._user = new ActiveUser(user,'UMLGRAY');
	}

	logOut(): void
	{
		this._user = new ActiveUser(new NullUser(),'NULL');
		this._team = [];
	}

	isLoggedIn(): boolean
	{
		return !(this._user.user instanceof NullUser)
	}



	getTeamMember(user: IUser): ActiveUser
	{
		return this._team.find((u)=> u.user.id == user.id);
	}

	getUser(): ActiveUser
	{
		return this._user;
	}
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

@Injectable({ providedIn: 'root' })
export class UserTokenCatalog
{

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

	public checkOut():string
	{
		let random = Math.floor(Math.random() * this._chipColors.length);
		let color = this._chipColors[random];
		console.log(random, color);
		this._chipColors.splice(random, 1);
		return color;
	}

	public checkIn(color: string)
	{
		this._chipColors.push(color);
	}
}

