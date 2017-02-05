import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import {NativePageTransitions, NativeTransitionOptions} from 'ionic-native';
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

  constructor(public navCtrl: NavController, public navParams: NavParams) {}

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

    console.log('ionViewDidLoad HomePage');
  }

}
