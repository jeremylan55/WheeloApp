import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';

/*
  Generated class for the ListPicker page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-list-picker',
  templateUrl: 'list-picker.html'
})
export class ListPickerPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, public view: ViewController) {
  }
  items = this.navParams.get('userParams');

  ionViewDidLoad() {
    console.log('ionViewDidLoad ListPickerPage');
  }

  closeListPicker() {
    this.view.dismiss();
  }

}
