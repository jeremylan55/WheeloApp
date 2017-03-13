import { Component } from '@angular/core';
import { NavController, NavParams, ModalController } from 'ionic-angular';
import { MessagePickerPage } from '../message-picker/message-picker';
import {Facebook, Keyboard, Geolocation} from 'ionic-native';
/*
  Generated class for the Post page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-post',
  templateUrl: 'post.html'
})
export class PostPage {
  rideSharePost = {
    "profilePic" : "",
    "destination" : "test_destination_very_long",
    "arriveTime" : "00:00",
    "location" : "test_location",
    "leaveTime" : "00:00",
    "driverName" : "test_name",
    "postTime" : "Posted yesterday at 9:45 pm",
    "postTitle" : "test_postTitle",
    "postContent" : "test_Driving from Loo to Square One at 12:00 pm. I will be leaving at DC",
    "postPrice" : "15"
	};

  constructor(public navCtrl: NavController, public modalCtrl: ModalController, public navParams: NavParams) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad PostPage');
  }

  // Opens message picker
	// Call openMessagePicker()
	// function onDidDismiss() is run when modal is closed.
	 openMessagePicker() {
		 let messagePicker = this.modalCtrl.create(MessagePickerPage);
		 messagePicker.onDidDismiss(data => {
			 Keyboard.close();
			 if(typeof(data) != "undefined" && data != null) {

			 }
		 });
		 messagePicker.present();
	 }

}
