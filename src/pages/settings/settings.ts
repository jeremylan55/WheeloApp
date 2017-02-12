import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import {AlertController} from 'ionic-angular'
import {Facebook, NativeStorage} from 'ionic-native';
import {IntroPage} from '../intro/intro';

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

  	constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController) {}

  	ionViewDidLoad() {
    		console.log('ionViewDidLoad SettingsPage');
	}
	fbLogout() {
		var nav = this.navCtrl;
		Facebook.logout()
		.then(function(response){
			NativeStorage.remove('user')
			nav.setRoot(IntroPage)
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
