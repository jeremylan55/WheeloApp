import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import {AlertController} from 'ionic-angular'
import {Facebook, NativeStorage} from 'ionic-native';
import {IntroPage} from '../intro/intro';
import {App} from 'ionic-angular';

/*
  Generated class for the Settings page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
	selector: 'page-settings',
	templateUrl: 'settings.html'
})
export class SettingsPage {
	user: any;
	userReady: boolean = false;

  	constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController, public appCtrl: App) {}

  	ionViewDidLoad() {
    		console.log('ionViewDidLoad SettingsPage');
	}

	ionViewCanEnter(){
		let env = this;
		NativeStorage.getItem('user')
		.then(function (data){
			env.user = {
				name: data.name,
				picture: data.picture
			};
			env.userReady = true;
		}, function(error){
			console.log(error);
		});
	}
	
	fbLogout() {
		var env = this;
		Facebook.logout()
		.then(function(response){
			NativeStorage.remove('user');
			env.appCtrl.getRootNav().setRoot(IntroPage);
		}, function(error){
			console.log(error)
		});
	}


	doLogout() {
		let confirmLogout = this.alertCtrl.create({
			title: 'Are you sure you want to Logout?',
			buttons: [
				{
					text: 'Cancel',
					handler: () => {
						console.log('Logout Canceled');
					}
				},
				{
					text: 'Logout',
					handler: () => {
						this.fbLogout();
					}
				}
			]
		});
		confirmLogout.present();
	}
}
