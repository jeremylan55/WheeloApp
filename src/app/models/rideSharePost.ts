export class RideSharePost {
	name: string;
	userID: string;
	profilePictureURL: string;
	driver: boolean = true;
	destination: string;
	origin: string;
	depatureTime: string; // formatted dd-hh-mm
	roundTrip: boolean = false;
	locations: Array<any> = [];
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

	
	/*
	* Currently have 7 keywords to look for in a string to identify if the post is from a driver
	* or a rider. This function will check for all 7 key words and count up or down a respective 
	* number. If the final count is postive then we classify the post as a driver post
	* 
	* Naive Bayes machine learning algorithm could also simply be used to acomplish this. Using sklean
	* we could use the Gaussian Naive Bayes classifer for determing if a post is from a driver or not.
	* This will be a second option because sklearn is in python and idk how the fudge I'd be able to port it.
	*
	* We need to find a clever way to classify inconclusive messages, and reduce false positives as this will
	* degrade UX a lot
	*/
	static classifyDriverPost(str){
		var count = 0;
		var driver_regexs = [/driving/i, /\$/, /offering/i, /providing/i];
		var rider_regexs = [/looking/i, /\?/];

		if (driver_regexs[0].test(str)) count += 2;
		if(driver_regexs[1].test(str)) count += 1;
		if (driver_regexs[2].test(str) || driver_regexs[3].test(str)) count += 1;
		if (rider_regexs[0].test(str)) count -= 2;
		if (rider_regexs[1].test(str)) count -= 1;

		if (count > 0) {
			//console.log("DRIVER POST!!! : " + str);
			return 1;	
		}
		if (count < 0) {
			//console.log("RIDER POST!!! : " + str);
			return -1;
		}
		if (count == 0) {
			console.log("INCONCLUSIVE!!! : " + str);
			return 0;
		}

	}

	/*
	*	Find locations within message
	*
	*/
	findLocations() {
		var table = /toronto|markham|waterloo|\sloo|BK|mississauga|scarborough|square one|yorkdale|bk plaza|richmond hill|downtown toronto|stc|pearson|york|ottawa|montreal|london|thornhill|dt toronto|dt|vaughn|fairview mall|fairview|finch station|north york|kingston|hamilton|Laurier/ig
		let re: any;

		while (re = table.exec(this.postText)) {
			this.locations.push(re);
		}		
	}
	/*
	* This function finds the Origin and Destination in a Facebook post, assuming there are both
	* of these things in the post. First, the cities will be found in the post using regex's that search 
	* for common location mentioned on the relevant facebook pages. Then we will use regex's to pinpoint
	* surfical features in the post. The first thing to try is given the two locations we found, we will build
	* a dynamic regular expression that tries to find strings such as "from (loc)", "(loc) ->", "(loc) to",
	* "(loc) -", etc. If a match is found we can assume with relatively high confidence that this location is 
	* an origin. Now, following similar logic if we rotate the location around the preposition we can also assume that 
	* it is the destination. We will also consider that in English, when providing directions, we tend to mention the origin
	* before the destination. If and only if a location has both of the mentioned features of an origin then it will
	* be classified as an origin, and if and only if a location has both of the mentioned features of a destination then
	* it will be classified as a destination.
	*
	* If we still can't classify the locations then we will attribute it to one of the following reasons:
	*    1. We were not able to find the locations in the message in the first place
	*    2. The language the poster used is foreign to us and so the above stated logic fails
	* Therefore we must incorporate some learning method that we can train on data that was classified with the above logic
	* to classify locations in the message and wether a location is an origin or destination.
	*/
	static findOriginDestination(str){
	}
}
