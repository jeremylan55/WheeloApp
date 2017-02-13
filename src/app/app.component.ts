import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';
import { TabsPage } from '../pages/tabs/tabs';
import { IntroPage } from '../pages/intro/intro';
import { LoadingController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { NativeStorage } from 'ionic-native';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: any;// = TabsPage;
  loader: any;

  constructor(public platform: Platform, public loadingCtrl: LoadingController, public storage: Storage) {
    // this.presentLoading();
	let env = this;
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
	NativeStorage.getItem('user')
	.then(function(data){
		// User has previsouly logged in
		// so we will skip intro page and login page and go straight to postPage})
		env.rootPage = TabsPage;
	}, function(error){
		// User never logged in
		// so show login page
		env.rootPage = IntroPage;
	});
	// this.loader.dismiss();
	Splashscreen.hide();
	StatusBar.styleDefault();
    });
    }

  // presentLoading() {
  //
  // this.loader = this.loadingCtrl.create({
  //   content: "Authenticating..."
  // });
  //
  // this.loader.present();
  //
  // }
}
// this.storage.get('introShown').then((result) => {

        // if(result){ // force showing of intro everytime app opens.
        //   this.rootPage = TabsPage;
        // } else {
       //   this.rootPage = IntroPage;
	 // this.storage.set('introShown', true);
	 // this.storage.clear();
        //}
