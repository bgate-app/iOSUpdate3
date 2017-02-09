import { Component } from '@angular/core';
import { NavController, NavParams, Events } from 'ionic-angular';
import { DataService } from '../../providers/data-service';
import { Utils } from '../../providers/utils';
import { UserPreview, TalentTopData, RoomLive, RoomLiveStatus } from '../../providers/config';
import { ResponseCode } from '../../providers/network-config';
@Component({
  selector: 'page-talent-detail',
  templateUrl: 'talent-detail.html'
})
export class TalentDetailPage {
  mTalent: UserPreview;
  fans: Array<UserPreview> = [];
  mRoom: RoomLive = null;

  constructor(public navCtrl: NavController,
    private navParams: NavParams,
    private mDataService: DataService,
    private events: Events) {
    this.mTalent = <UserPreview>this.navParams.get("talent");

    if (this.navParams.get("room_live") != null) {
      this.mRoom = <RoomLive>this.navParams.get("room_live");
    } else {
      this.mRoom = new RoomLive();
      this.mRoom.talent = this.mTalent;
      this.mRoom.status = RoomLiveStatus.OFF_AIR;
    }

    while (this.fans.length < 3) this.fans.push(UserPreview.createUser());
  }

  ionViewDidEnter() {
    this.events.unsubscribe("user:back");
    this.events.subscribe("user:back", () => {
      this.onClickBack();
    });
    this.mDataService.requestGetTalentInfo(this.mTalent.username).then(data => {
      this.onTalentInfoResponse(data);
    });
    this.requestTopFan();
  }
  onTalentInfoResponse(data) {
    this.mTalent.money = data.money;
    this.mTalent.point = data.point;
    this.mTalent.level = data.level;
    this.mTalent.phone = data.phone;
    this.mRoom.room_id = data.room_info[0].room_id;
    this.mRoom.poster = data.room_info[0].thumbnail_url;
    if (data.meta != null && data.meta.follows != undefined) {
      this.mTalent.followers = data.meta.follows;
    }
    this.requestRoomInfo();

  }
  requestRoomInfo() {
    this.mDataService.requestRoomLiveInfo(this.mRoom.room_id).then(data => {
      this.onRoomInfoResponse(data);
    }, error => {
      this.onRoomInfoError();
    });
  }

  onRoomInfoResponse(data) {
    this.mRoom.onResponseRoomLive(data);
  }
  onRoomInfoError() {

  }
  onClickRoomStreaming() {

  }

  onClickBack() {
    this.navCtrl.pop();
  }

  getTalentAvatar() {
    return "url(" + this.mTalent.avatar + ")";
  }
  onClickUnFollowTalent() {
    if (this.mTalent.role == 1) {
      this.mDataService.mNetworkService.requestUserUnFollow(this.mTalent.username).then(
        data => {
          if (data['status'] == ResponseCode.SUCCESS) {
            this.mTalent.followed = false;
            this.mTalent.followers -= 1;
          }
        }
      );
    }
  }

  onClickFollowTalent() {
    if (this.mTalent.role == 1) {
      this.mDataService.mNetworkService.requestUserFollow(this.mTalent.username).then(
        data => {
          if (data['status'] == ResponseCode.SUCCESS || data['status'] == 14) {
            this.mTalent.followed = true;
            this.mTalent.followers += 1;
          }
        }
      );
    }
  }

  // =============================== for top =======================================



  getLevelColor(level: number) {
    return Utils.getLevelColor(level);
  }

  private requestTopFan() {
    this.mDataService.mNetworkService.requestTalentTop(this.mTalent.username, 0, 3).then(
      data => {
        if (data['status'] == ResponseCode.SUCCESS) {
          this.onTopFanData(data['content']);
        }
      },
      error => {
        this.onRequestTopFanError();
      }
    );
  }

  onRequestTopFanError() {

  }
  onTopFanData(data) {
    for (let fan of this.fans) {
      fan.username = "undefined";
    }
    let i = 0;
    for (let user of data) {
      if (i < this.fans.length) {
        this.fans[i].username = user.user_name;
        this.fans[i].name = user.title;
        this.fans[i].money = user.money;
        this.fans[i].top_value = user.money_send_gift;
        this.fans[i].level = user.level;
        this.fans[i].avatar = user.avatar;
      }
      i++;
    }
  }



  // ======================================================================
}
