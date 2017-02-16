import { Component } from '@angular/core';
import { NavController, NavParams, ModalController} from 'ionic-angular';
import {NativePageTransitions, NativeTransitionOptions, Facebook, StatusBar} from 'ionic-native';
import {RideSharePost} from '../../app/models/rideSharePost';
import { ListPickerPage } from '../list-picker/list-picker';
import { SearchPage} from '../search/search';
import jq from "jquery";
let locations = ["toronto","markham", "scarborough", "mississauga", "york", "brampton", "richmond hill", "montreal"];
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
	curRawPosts: any; // Stores array of raw facebook posts. Post object = {message, updated_time, id}
	indexLoaded: number; // The highest index loaded from curRawPosts
	displayedPosts: any; // Posts that ahve been displayed since page last loaded
	maxNumberLoadedPosts: number = 5; // Maximum number of posts that get loaded at a single time
  constructor(public navCtrl: NavController, public navParams: NavParams, public modalCtrl: ModalController) {}

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
			env.curRawPosts = rideSharePosts.data;
			env.prevPosts = rideSharePosts.paging.previous;
			env.nextPosts = rideSharePosts.paging.next;
			env.indexLoaded = 0;
			// Now we lazy load first 5 posts to screen
			env.lazyLoadPosts(env.indexLoaded);
		}, function(error){
			console.log(error);
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

		console.log('Lazy Loading ...');

		for (let i = index; i < env.maxNumberLoadedPosts || i < env.curRawPosts.length; i++){

			// Append new RideSharePost object to displayed objects
			// TODO: ONLY append posts that are marked as drivers
			env.displayedPosts.push(new RideSharePost(lst[i].message, lst[i].id, lst[i].updated_time));

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
		this.indexLoaded = (env.maxNumberLoadedPosts + this.indexLoaded >= env.curRawPosts.length) ? env.curRawPosts.length - 1 : env.maxNumberLoadedPosts + this.indexLoaded;
	}


 // Opens list picker and fill list using array "locations".
 // Call openListPicker()
 // function .onDidDismiss(); is run when modal is closed.
  openListPicker() {
    let listPicker = this.modalCtrl.create(ListPickerPage, {userParams:locations});
    listPicker.onDidDismiss(data => {
      console.log(data);
			if(typeof(data) != "undefined" && data != null) {
				this.showSearchToolbar();
			}
    });
    listPicker.present();
  }


	showSearchToolbar() {
		StatusBar.styleLightContent();
		jq('#search-container').addClass('animated fadeOut').delay(300).addClass('hidden');
		jq('.toolbar-background').addClass('filled');
		jq('ion-toolbar').addClass('big');
		jq('#top-container').removeClass('animated fadeOut hidden').addClass('animated fadeIn');
		jq('#field-container').removeClass('animated fadeOut hidden').addClass('animated fadeIn');
		jq('#time-container').removeClass('animated fadeOut hidden').addClass('animated fadeIn');
		jq('.tabbar').removeClass('animated fast slideInUp').addClass('animated fast slideOutDown');
	}

	hideSearchToolbar() {
		StatusBar.styleDefault();
		jq('#search-container').removeClass('animated fadeOut hidden').addClass('animated fadeIn');
		jq('.toolbar-background').removeClass('filled');
		jq('ion-toolbar').removeClass('big');
		jq('#top-container').removeClass('animated fadeInDown').addClass('animated fadeOut').delay(300).addClass('hidden');
		jq('#field-container').removeClass('animated fadeIn').addClass('animated fadeOut').delay(300).addClass('hidden');
		jq('#time-container').removeClass('animated fadeInUp').addClass('animated fadeOut').delay(300).addClass('hidden');
		jq('.tabbar').removeClass('animated fast slideOutDown').addClass('animated fast slideInUp');
	}

	toggle(option) {
		console.log(option);
		jq('#toggle-container>button').removeClass('selected');
		jq('button#'+option).addClass('selected');
	}

}
