import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';


import { LoadingPage } from '../pages/loading/loading';


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage = LoadingPage;

  constructor(platform: Platform) {
    platform.ready().then(() => {    
      StatusBar.styleDefault();
      Splashscreen.hide();
    });
  }
}
