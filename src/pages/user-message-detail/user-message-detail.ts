import { Component } from '@angular/core';
import { NavController, Events, NavParams } from 'ionic-angular';
import { DataService } from '../../providers/data-service';
import { Message, MessageStatus } from '../../providers/config';

@Component({
  selector: 'page-user-message-detail',
  templateUrl: 'user-message-detail.html'
})
export class UserMessageDetailPage {
  message: Message;
  mTime = "";
  constructor(public navCtrl: NavController, private events: Events, private mDataService: DataService, private navParams: NavParams) {
    this.message = <Message>this.navParams.get("message");

  }

  calculateTimeString() {
    let date = new Date(this.message.time);

    let hour = date.getHours();
    let minute = date.getMinutes();
    let second = date.getSeconds();

    let day = date.getDay();
    let month = date.getMonth();
    let year = date.getFullYear();

    this.mTime = ((hour < 10) ? ("0" + hour) : hour) + ":" + ((minute < 10) ? ("0" + minute) : minute) + ":" + ((second < 10) ? ("0" + second) : second) + "   " + day + "/" + month + "/" + year;



  }


  ionViewDidEnter() {
    this.events.unsubscribe("user:back");
    this.events.subscribe("user:back", () => {
      this.onClickBack();
    });
    this.calculateTimeString();
    if (this.message.status == MessageStatus.UNREAD) {
      this.mDataService.mNetworkService.requestUserReadMessage(this.message.id).then(
        data => {
          if (data['status'] == 1) this.message.status = MessageStatus.READ;
        }
      );
    }
  }
  onClickBack() {
    this.navCtrl.pop();
  }

}
