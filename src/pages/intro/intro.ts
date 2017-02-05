import { Component } from '@angular/core';
import { NavController,Slides } from 'ionic-angular';
import { TabsPage } from '../tabs/tabs';
import { ViewChild } from '@angular/core';
import jQuery from "jquery";

@Component({
  selector: 'page-intro',
  templateUrl: 'intro.html'
})
export class IntroPage {
  @ViewChild(Slides) slides: Slides;
  sliderOptions: any;

  constructor(public navCtrl: NavController) {
    this.navCtrl = navCtrl;
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
    this.slides.slideTo(2);
  }
  hideSkip() {
    // shows skip button only on first slide.
    console.log('Slide changed');
    let isFirst = this.slides.isBeginning();
    if(isFirst) {
      jQuery('#skip').fadeIn(150);
    }
    else {
      jQuery('#skip').fadeOut(150);
    }

  }

}
