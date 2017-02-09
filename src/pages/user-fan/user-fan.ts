import { Component } from '@angular/core';
import { NavController, Events } from 'ionic-angular';

@Component({
  selector: 'page-user-fan',
  templateUrl: 'user-fan.html'
})
export class UserFanPage {
  mLoadingFan: boolean = true;
  constructor(public navCtrl: NavController, private events: Events) { }

  ionViewDidEnter() {
    this.events.unsubscribe("user:back");
    this.events.subscribe("user:back", () => {
      this.onClickBack();
    });
    setTimeout(() => {
      this.mLoadingFan = false;
    }, 1000);
  }

  onClickBack() {
    this.navCtrl.pop();
  }
}
