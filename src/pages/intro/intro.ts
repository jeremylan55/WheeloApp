import { Component } from '@angular/core';
import { NavController,Slides } from 'ionic-angular';
import { TabsPage } from '../tabs/tabs';
import { ViewChild } from '@angular/core';
import jq from "jquery";
import { Facebook, NativeStorage } from 'ionic-native';

@Component({
  selector: 'page-intro',
  templateUrl: 'intro.html'
})
export class IntroPage {
  	@ViewChild(Slides) slides: Slides;
  	sliderOptions: any;
	FB_APP_ID: number = 418162278535335;

	constructor(public navCtrl: NavController) {
    		this.navCtrl = navCtrl;
    		this.sliderOptions = {
      			pager: true
    		};
  	}

  	ionViewDidLoad() {
    		console.log('ionViewDidLoad IntroPage');
  	}

// Skips the facebook oath and jumps to Home page
// Use this login for DEVELOPMENT ONLY!
// Call this from login()
login(){
  let nav = this.navCtrl;
  nav.setRoot(TabsPage);
}

// Logins to facebook and receive the toekn.
// Use this when deploying.
// Call this from login()
	// login(){
	// 	Facebook.browserInit(this.FB_APP_ID, "v2.8");
	// 	let permissions = new Array();
	// 	let nav = this.navCtrl;
	// 	permissions = ['public_profile'];
  //
	// 	Facebook.login(permissions)
	// 	.then(function(response){
	// 		let userId = response.authResponse.userID;
	// 		let params = new Array();
	// 		let actoken = response.authResponse.accessToken;
	// 		// Get name
	// 		Facebook.api('/me?fields=name', params)
	// 		.then(function(user){
	// 			user.picture = 'https://graph.facebook.com/' + userId + '/picture?type=large';
	// 			NativeStorage.setItem('user',
	// 			{
	// 				name: user.name,
	// 				picture: user.picture,
	// 				userID: userId,
	// 				accessToken: actoken
	// 			})
	// 			.then(function(){
	// 				nav.setRoot(TabsPage);
	// 			}, function(error){
	// 				console.log(error)
	// 			})
	// 		})
	// 	}, function(error){
	// 		console.log(error)
	// 	});
  // }


  skip() {
    this.slides.slideTo(2);
  }
  hideSkip() {
    // shows skip button only on first slide.
    console.log('Slide changed');
    let isFirst = this.slides.isBeginning();
    if(isFirst) {
      jq('#skip').fadeIn(150);
    }
    else {
      jq('#skip').fadeOut(150);
    }

  }

}
