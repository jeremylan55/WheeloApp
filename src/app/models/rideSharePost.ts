export class RideSharePost {
	name: string;
	userID: number;
	profilePictureURL: string;
	driver: boolean = true;
	destination: string;
	origin: string;
	depatureTime: string; // formatted dd-hh-mm
	roundTrip: boolean = false;

	constructor(public postText: string , public id: string, public updated_time: string){}

	setName(name){
		this.name = name;
	}

	setUserID(id){
		this.userID = id;
	}

	setProfilePictureURL(url){
		this.profilePictureURL = url;
	}

	setDestination(dest) {
		this.destination = dest;
	}

	setOrigin(origin) {
		this.origin = origin;
	}

	static classifyDriverPost(str){}
	static findOrigin(str){}
	static findDestination(str){}
}
