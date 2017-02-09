import { Component } from '@angular/core';
import { NavController, Events } from 'ionic-angular';

@Component({
  selector: 'page-ads',
  templateUrl: 'ads.html'
})
export class AdsPage {

  constructor(public navCtrl: NavController, private events: Events) { }
  ionViewDidEnter() {
    this.events.unsubscribe("user:back");
    this.events.subscribe("user:back", () => {
      this.onClickBack();
    });
  }
  onClickBack() {
    this.navCtrl.pop();
  }
}
