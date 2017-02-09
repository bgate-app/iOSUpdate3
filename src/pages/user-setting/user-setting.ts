import { Component } from '@angular/core';
import { NavController, Events } from 'ionic-angular';
import { LoginPage } from '../login/login';
import { NetworkConfig, Chaos } from '../../providers/network-config';
import { DataService } from '../../providers/data-service';
@Component({
  selector: 'page-user-setting',
  templateUrl: 'user-setting.html'
})
export class UserSettingPage {

  constructor(public navCtrl: NavController, private mDataService: DataService, private events: Events) { }


  ionViewDidEnter() {
    this.events.unsubscribe("user:back");
    this.events.subscribe("user:back", () => {
      this.onClickBack();
    });
  }

  onClickBack() {
    this.navCtrl.pop();
  }
  onClickLogout() {
    this.events.unsubscribe("network:expired");
    this.mDataService.onLoggedOut();
    NetworkConfig.ACESSKEY = '';
    this.mDataService.setItemOnStorage(Chaos.ACCESS_KEY, NetworkConfig.ACESSKEY);
    this.navCtrl.setRoot(LoginPage, {}, {
      animate: true,
      direction: 'back',
      duration: 400
    });
  }
  onSettingNotifyChange(){
   // console.log("on setting notify change "+ this.mDataService.mUserSetting.mRecieveNotify);
    
  }
}
