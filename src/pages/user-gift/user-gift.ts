import { Component } from '@angular/core';
import { NavController,Events } from 'ionic-angular';
import { NetworkService } from '../../providers/network-service';
import { FieldsBuilder, RoomLiveField } from '../../providers/network-config';
@Component({
  selector: 'page-user-gift',
  templateUrl: 'user-gift.html'
})
export class UserGiftPage {
  mLoading: boolean = true;
  constructor(public navCtrl: NavController, private networkService: NetworkService,private events:Events) { }

  ionViewDidEnter() {
    this.networkService.requestGetUserSendGiftHistory("2016-11-01", "2017-11-01", '0-25', "asc"
      , FieldsBuilder.builder().addFirst(RoomLiveField.talent_name)
        .add(RoomLiveField.talent_title)
        .add(RoomLiveField.talent_avatar)
        .add(RoomLiveField.talent_nick_name).build()
    ).then(data => {     
      this.mLoading = false;
    }, error => {
      this.mLoading = false;
    });


  
    this.events.unsubscribe("user:back");
    this.events.subscribe("user:back", () => {
      this.onClickBack();
    });
  
  }
  onClickBack() {
    this.navCtrl.pop();
  }

}
