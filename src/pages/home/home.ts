import { Component } from '@angular/core';
import { NavController, NavParams, ModalController} from 'ionic-angular';
import {NativePageTransitions, NativeTransitionOptions, Facebook, StatusBar, Keyboard, Geolocation} from 'ionic-native';
import {RideSharePost} from '../../app/models/rideSharePost';
import { ListPickerPage } from '../list-picker/list-picker';
import { SearchPage} from '../search/search';
import jq from "jquery";
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

let locations = ["waterloo","toronto","markham", "scarborough", "mississauga", "york", "brampton", "richmond hill", "montreal"];
/*
  Generated class for the Home page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
	selector: 'page-home',
	templateUrl: 'home.html'
})
export class HomePage {
	prevPosts: any; // Url for previous page of posts
	nextPosts: any; // Url for next page of posts
	curRawPosts: Array<any> = []; // Stores array of raw facebook posts. Post object = {message, updated_time, id}
	indexLoaded: number; // The highest index loaded from curRawPosts
	displayedPosts: any; // Posts that ahve been displayed since page last loaded
	maxNumberLoadedPosts: number = 5; // Maximum number of posts that get loaded at a single time
	unknown_type: Array<any> = [];
	myDate: string = this.LocalDate(); // initilize datepicker to current datetime in ISO 8601 format for current timezone.
	today: string = this.myDate.toString(); // limit min value of datepicker to be today's date.
	years: string = this.myDate.slice(0,4).toString()+"," + (Number(this.myDate.slice(0,4).toString())+1).toString();
	userFilters = {
		"type" : "single", // can be "single" or "double"
		"destination" : "",
		"location" : "From",
		"dateTime" : this.myDate.toString(),
		"returningDateTime" : ""
	};
  constructor(public navCtrl: NavController, public navParams: NavParams, public modalCtrl: ModalController, public http: Http) {}

	ionViewDidLoad() {
		let options: NativeTransitionOptions = {
			"direction"      : "left",
			"duration"       :  400, // in milliseconds (ms), default 400
			"iosdelay"       :   60, // ms to wait for the iOS webview to update before animation kicks in, default 60
			"androiddelay"   :  100
		};
		NativePageTransitions.flip(options)
			.then((data) => {

			})
			.catch((err) => {

			});
		this.loadRideShareFeed();
		console.log("TODAY IS :" + this.today);

		Geolocation.getCurrentPosition().then((resp) => {
		 // resp.coords.latitude
		 // resp.coords.longitude
		}).catch((error) => {
		  console.log('Error getting location', error);
		});

	}

	classifyDriver(cnxt, temp) {
		for (let i = 0; i < temp.length; i++) {
			var ret = RideSharePost.classifyDriverPost(temp[i].message);
			if (ret == 0) {
				cnxt.unknown_type.push(temp[i]);
			} else if (ret > 0) {
				cnxt.curRawPosts.push(temp[i]);
			}
		}
	}
	// Call this on inital page load
	// Call this when user explictly requests reload
	// All displayed posts are cleared when this is called
	loadRideShareFeed(){
		let env = this;
		let params = new Array();
		this.displayedPosts = new Array();
		Facebook.api('/225049564330328/feed', params)
		.then(function(rideSharePosts){
			let temp : any  = rideSharePosts.data;
			env.prevPosts = rideSharePosts.paging.previous;
			env.nextPosts = rideSharePosts.paging.next;
			env.indexLoaded = 0;
			env.classifyDriver(env,temp);
			// Now we lazy load first 5 posts to screen
			env.lazyLoadPosts(env.indexLoaded);
		}, function(error){
			console.log(error.message);
		});
	}

	// Use http request to get next page in feed
	getNextPage(){
		var env = this;
		console.log('NEXT URL: ' + env.nextPosts + '\n\n');
		this.http.get(env.nextPosts).map(res => res.json()).subscribe(
			data => {
				var temp : any = data.data;
				if (temp.length == 0) {
					console.log('No more entries');
					return 0;
				}
				env.nextPosts = data.paging.next;
				this.classifyDriver(env,temp);
			}, err => {
				console.log(err.message);
			});
	}
	// Use http request get previous page in feed
	getPrevPage(){
		var env = this;
		console.log('PREVIOUS URL: ' + env.prevPosts + '\n\n');
		this.http.get(env.prevPosts).map(res => res.json()).subscribe(
			data => {
				var temp : any = data.data;
				if (temp.length == 0) {
					console.log('No more entries');
					return 0;
				}
				env.prevPosts = data.paging.previous;
				this.classifyDriver(env,temp);
			}, err => {
				console.log(err.message);
			});
	}

	// Loads the next 5 posts from this.curRawPosts to the screen from the given index in this.curRawPosts
	// Call this from loadRideShareFeed()
	// Call this after scrolling
	lazyLoadPosts(index) {
		let env = this;
		let lst = env.curRawPosts;
		let params = new Array();
		let lastEntry = (env.displayedPosts.length == 0) ? 0 : env.displayedPosts.length - 1;
		let len =  env.curRawPosts.length;
		let post: any;
		console.log('Lazy Loading ...');
		for (let i = index; i < env.maxNumberLoadedPosts || i < len; i++){

			// Append new RideSharePost object to displayed objects
			post = new RideSharePost(lst[i].message, lst[i].id, lst[i].updated_time);
			// label locations here
			post.findLocations();
			env.displayedPosts.push(post);

			// We query facebook for the owner of the facebook post and get their name and userID
			Facebook.api(lst[i].id + '?fields=from', params)
			.then(function(result){

				env.displayedPosts[lastEntry].setUserID(result.from.id);
				env.displayedPosts[lastEntry].setName(result.from.name);

				// We query facebook again to get the poster's profile picture url
				Facebook.api(result.from.id +'?fields=picture', params)
				.then(function(re){

					env.displayedPosts[lastEntry].setProfilePictureURL(re.picture.data.url);
					lastEntry += 1;
				}, function(error){

					console.log('PICTURE: ' + error);
				});

			}, function(error) {
				console.log('USER: ' + error);
			});

		}
		// Update the latest indexLoaded from curRawPosts
		this.indexLoaded = (env.maxNumberLoadedPosts + this.indexLoaded >= len) ? len - 1 : env.maxNumberLoadedPosts + this.indexLoaded;
	}


 // Opens list picker and fill list using array "locations".
 // Call openListPicker(idOfField)
 // function .onDidDismiss(); is run when modal is closed.
  openListPicker(fieldID) {
    let listPicker = this.modalCtrl.create(ListPickerPage, {userParams:locations});
    listPicker.onDidDismiss(data => {
			Keyboard.close();
			if(typeof(data) != "undefined" && data != null) {
				this.showSearchToolbar();
				this.userFilters[fieldID] = data;
				this.refreshSearch();
			}
    });
    listPicker.present();
  }


	showSearchToolbar() {
		StatusBar.styleLightContent();
		jq('#search-container').addClass('animated fadeOutUp fast');
		jq('.tabbar').removeClass('animated fast slideInUp').addClass('animated fast slideOutDown');
		jq('.toolbar-background').addClass('filled');
		jq('ion-toolbar').addClass('big');

		setTimeout(function(){
			jq('#top-container').removeClass('animated fadeOut fast hidden').addClass('animated fast fadeIn');
			jq('#field-container').removeClass('animated fadeOut fast hidden').addClass('animated fast fadeIn');
			jq('#time-container').removeClass('animated fadeOut fast hidden').addClass('animated fast fadeIn');
		},200);
	}

	hideSearchToolbar() {
		StatusBar.styleDefault();
		// this.hideDouble();
		jq('.tabbar').removeClass('animated fast slideOutDown').addClass('animated fast slideInUp');

		jq('#top-container').removeClass('animated fast fadeInDown').addClass('animated fast fadeOut');
		jq('#field-container').removeClass('animated fast fadeIn').addClass('animated fast fadeOut');
		jq('#time-container').removeClass('animated fast fadeInUp').addClass('animated fast fadeOut');


		setTimeout(function(){
			jq('#search-container').removeClass('animated fast fadeOutUp').addClass('animated fast fadeInDown');
			jq('.toolbar-background').removeClass('filled');
			jq('ion-toolbar').removeClass('single big');
			jq('#top-container').addClass('hidden');
			jq('#field-container').addClass('hidden');
			jq('#time-container').addClass('hidden');
		},200);
	}

	toggle() {
		jq('#toggle-container>#selector').toggleClass('double');
		jq('#toggle-container>button').toggleClass('selected');
		if(jq('#toggle-container>#selector').hasClass('double')){
			this.showDouble();
			this.userFilters.type = "double";
			if(this.userFilters.returningDateTime == "")
				this.userFilters.returningDateTime = this.userFilters.dateTime;
		}
		else {
			this.hideDouble();
			this.userFilters.type = "single";
		}
	}

	showDouble() {
		jq('#time-container>#returning').removeClass('hidden');
		jq('#time-container>#going>.caption').removeClass('hidden');
		jq('ion-toolbar').removeClass('single').addClass('double');
	}

	hideDouble() {
		jq('#time-container>#returning').addClass('hidden');
		jq('#time-container>#going>.caption').addClass('hidden');
		jq('ion-toolbar').removeClass('double').addClass('single');
	}

	validateDateTime(fieldID) {
		if(this.userFilters.dateTime > this.userFilters.returningDateTime) {
			if(fieldID == 'going') {
				this.userFilters.returningDateTime = this.userFilters.dateTime;
			}
			if(fieldID == 'returning') {
				this.userFilters.dateTime = this.userFilters.returningDateTime;
			}
		}
	}
	// Refresh search results base filter options in toolbar.
	// Call this from refreshSearch().
	// Is called upon change of filter options.
	refreshSearch() {
		console.log(this.userFilters);
	}

	LocalDate() {
	    var now = new Date(),
	        tzo = -now.getTimezoneOffset(),
	        dif = tzo >= 0 ? '+' : '-',
	        pad = function(num) {
	            var norm = Math.abs(Math.floor(num));
	            return (norm < 10 ? '0' : '') + norm;
	        };
	    return now.getFullYear()
	        + '-' + pad(now.getMonth()+1)
	        + '-' + pad(now.getDate())
	        + 'T' + pad(now.getHours())
	        + ':' + pad(now.getMinutes())
	        + ':' + pad(now.getSeconds())
	        + dif + pad(tzo / 60)
	        + ':' + pad(tzo % 60);
	}

}
