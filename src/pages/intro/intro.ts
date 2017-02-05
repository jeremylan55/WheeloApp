import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { TabsPage } from '../tabs/tabs';

@Component({
  selector: 'page-intro',
  templateUrl: 'intro.html'
})
export class IntroPage {

  sliderOptions: any;

  constructor(public navCtrl: NavController) {

    this.sliderOptions = {
      pager: true
    };

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad IntroPage');
  }

  login(){
    this.navCtrl.setRoot(TabsPage);
  }

  skip() {
    //this.slides.slideTo(2);
  }
  notFistSlide() {
    //jquery('#skip').hide();
  }

}
