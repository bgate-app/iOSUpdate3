import { Component } from '@angular/core';
import { NavController, Events } from 'ionic-angular';
import { DataService } from '../../providers/data-service';
import { Message } from '../../providers/config';
import { ResponseCode } from '../../providers/network-config';
import { UserMessageDetailPage } from '../user-message-detail/user-message-detail';


@Component({
  selector: 'page-user-message',
  templateUrl: 'user-message.html'
})
export class UserMessagePage {
  // messages: Array<Message> = [];
  constructor(public navCtrl: NavController, private events: Events, private mDataService: DataService) { }


  ionViewDidEnter() {
    this.events.unsubscribe("user:back");
    this.events.subscribe("user:back", () => {
      this.onClickBack();
    });
    this.requestMessages();
  }
  onClickBack() {
    this.navCtrl.pop();
  }
  onClickMessage(message: Message) {
    this.navCtrl.push(UserMessageDetailPage, {
      message: message
    });
  }

  mLoadingMessages: boolean = true;

  requestMessages() {
    this.mLoadingMessages = true;
    this.mDataService.mNetworkService.requestGetUserMessage('0-20').then(data => {
      if (data['status'] == ResponseCode.SUCCESS) {
        this.mDataService.mMessageManager.onResponseMessages(data['content']);
      }
      this.mLoadingMessages = false;
    }, error => {
      this.mLoadingMessages = false;
    });
  }

  // onResponseMessages(data) {
  //   this.messages = [];
  //   if (data.status == ResponseCode.SUCCESS) {
  //     for (let ms of data.content) {
  //       let message = new Message();
  //       message.onResponseMessage(ms);
  //       this.messages.push(message);
  //     }
  //   }
  // }


}

