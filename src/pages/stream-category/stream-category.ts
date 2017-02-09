import { Component } from '@angular/core';
import { NavController, NavParams, Events } from 'ionic-angular';
import { RoomPage, RoomLive } from '../../providers/config';
import { DataService } from '../../providers/data-service';
import { NetworkService } from '../../providers/network-service';
import { LiveStreamPage } from '../live-stream/live-stream';
@Component({
  selector: 'page-stream-category',
  templateUrl: 'stream-category.html'
})
export class StreamCategoryPage {
  mRoomPage: RoomPage = new RoomPage();
  constructor(public events: Events, public navCtrl: NavController, private navParams: NavParams, private mDataService: DataService, private networkService: NetworkService) {
    this.mRoomPage = this.navParams.get('roompage');
  }
  createDataTest() {
    this.mRoomPage.rooms = [];
    while (this.mRoomPage.rooms.length < 20) {
      this.mRoomPage.rooms.push(new RoomLive());
    }
  }
  ionViewDidEnter() {
    //this.createDataTest();

    this.events.unsubscribe("user:back");
    this.events.subscribe("user:back", () => {
      this.onClickBack();
    });
  }

  onClickBack() {
    this.navCtrl.pop();
  }
  onClickOpenRoom(room: RoomLive) {
    this.mDataService.mRoomPageManager.setSelectedCategory(this.mRoomPage.id);
    this.navCtrl.push(LiveStreamPage, {
      room_live: room
    });
  }
}
