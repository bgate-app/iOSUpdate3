import { Component } from '@angular/core';
import { NavController,Events } from 'ionic-angular';

@Component({
  selector: 'page-user-money',
  templateUrl: 'user-money.html'
})
export class UserMoneyPage {

  constructor(public navCtrl: NavController,private events : Events) { }


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
