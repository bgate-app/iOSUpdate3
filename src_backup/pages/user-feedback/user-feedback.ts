import { Component } from '@angular/core';
import { NavController,Events } from 'ionic-angular';

/*
  Generated class for the UserFeedback page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-user-feedback',
  templateUrl: 'user-feedback.html'
})
export class UserFeedbackPage {

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
