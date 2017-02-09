import { Component } from '@angular/core';
import { NavController, NavParams,Events } from 'ionic-angular';
import { NetworkService } from '../../providers/network-service';
@Component({
  selector: 'page-user-detail',
  templateUrl: 'user-detail.html'
})
export class UserDetailPage {
  username: string = "";
  constructor(
    public navCtrl: NavController,
    private navParams: NavParams,
    private networkServce: NetworkService,
    private events : Events) {
    this.username = this.navParams.get("username");   
  }

  ionViewDidEnter() {     
    this.events.unsubscribe("user:back");
    this.events.subscribe("user:back", () => {
      this.onClickBack();
    });
  }
  onClickBack(){
    this.navCtrl.pop();
  }

}
