import { Component } from '@angular/core';
import { NavController, Events } from 'ionic-angular';
import { DataService } from '../../providers/data-service';
import { Utils } from '../../providers/utils';

import { ResponseCode, FieldsBuilder, UserManagerField } from '../../providers/network-config';

import { UserFanPage } from '../user-fan/user-fan';
import { UserFeedbackPage } from '../user-feedback/user-feedback';
import { UserFollowPage } from '../user-follow/user-follow';
import { UserGiftPage } from '../user-gift/user-gift';
import { UserMoneyPage } from '../user-money/user-money';
import { UserSettingPage } from '../user-setting/user-setting';
import { UserMessagePage } from '../user-message/user-message';
import { UserLevelPage } from '../user-level/user-level';
import { UserEditPage } from '../user-edit/user-edit';


@Component({
  selector: 'page-user-info',
  templateUrl: 'user-info.html'
})
export class UserInfoPage {

  constructor(
    public navCtrl: NavController,
    public mDataService: DataService,
    private events: Events
  ) {

  }

  onClickBack() {
    this.navCtrl.pop();
  }
  onFollowingResponse(data) {
    if (data.status == ResponseCode.ACCESSKEY_EXPIRED) {
      this.events.publish("network:expired");
      return;
    }
    if (data.status != ResponseCode.SUCCESS) return;
    this.mDataService.mFollowManager.onResponseFollowings(data.content);
  }

  ionViewDidEnter() {

    this.events.unsubscribe("user:back");
    this.events.subscribe("user:back", () => {
      this.onClickBack();
    });

    this.mDataService.mNetworkService.requestUserFollowings('0-50',
      FieldsBuilder.builder()
        .addFirst(UserManagerField.money)
        .add(UserManagerField.namefield)
        .add(UserManagerField.id)
        .add(UserManagerField.level)
        .add(UserManagerField.user_role)
        .build()).then(
      data => {
        this.onFollowingResponse(data);
      },
      error => {

      }
      )
  }

  getSexIcon() {
    return Utils.getSexIcon(this.mDataService.mUser.sex);
  }

  onClickFan() {
    this.navCtrl.push(UserFanPage);
  }
  onClickFeedBack() {
    this.navCtrl.push(UserFeedbackPage);
  }
  onClickFollow() {
    this.navCtrl.push(UserFollowPage);
  }
  onClickMoney() {
    this.navCtrl.push(UserMoneyPage);
  }
  onClickGift() {
    this.navCtrl.push(UserGiftPage);
  }
  onClickSetting() {
    this.navCtrl.push(UserSettingPage);
  }
  onClickMessage() {
    this.navCtrl.push(UserMessagePage);
  }
  onClickLevel() {
    this.navCtrl.push(UserLevelPage);
  }

  onClickAvatar() {
    this.navCtrl.push(UserEditPage);
  }
}

