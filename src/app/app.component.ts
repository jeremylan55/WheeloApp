import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';
import { TabsPage } from '../pages/tabs/tabs';
import { IntroPage } from '../pages/intro/intro';
import { LoadingController } from 'ionic-angular';
import { Storage } from '@ionic/storage';


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: any = TabsPage;
  loader: any;

  constructor(public platform: Platform, public loadingCtrl: LoadingController, public storage: Storage) {
    this.presentLoading();

    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.

      this.storage.get('introShown').then((result) => {

        // if(result){ // force showing of intro everytime app opens.
        //   this.rootPage = TabsPage;
        // } else {
          this.rootPage = IntroPage;
          this.storage.set('introShown', true);
          this.storage.clear();
        //}

        this.loader.dismiss();

      });
      StatusBar.styleDefault();
      Splashscreen.hide();
    });
  }

  presentLoading() {

  this.loader = this.loadingCtrl.create({
    content: "Authenticating..."
  });

  this.loader.present();

  }
}
