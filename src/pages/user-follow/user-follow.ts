import { Component } from '@angular/core';
import { NavController, AlertController, Events } from 'ionic-angular';
import { DataService } from '../../providers/data-service';
import { UserPreview } from '../../providers/config';

/**
 * follow_state = 0 : following
 * follow_state = 1 : unfollow
 */
class Follower {
  talent: UserPreview;
  follow_state: number;

  constructor() {
    this.follow_state = 0;
  }
}

@Component({
  selector: 'page-user-follow',
  templateUrl: 'user-follow.html'
})
export class UserFollowPage {
  STATE_FOLLOWING: number = 0;
  STATE_UNFOLLOW: number = 1;
  mFollowings: Array<Follower> = [];
  mLoading: boolean = true;
  constructor(public navCtrl: NavController,
    private alertController: AlertController,
    public mDataService: DataService, private events: Events) {

  }

  loadData() {
    this.mFollowings = [];
    this.mLoading = false;
    for (let user of this.mDataService.mFollowManager.followings) {
      let follower = new Follower();
      follower.talent = user;
      this.mFollowings.push(follower);
    }
  }
  ionViewDidEnter() {


    this.events.unsubscribe("user:back");
    this.events.subscribe("user:back", () => {
      this.onClickBack();
    });

    setTimeout(() => {
      this.loadData();
    }, 200);
  }
  onClickBack() {
    this.navCtrl.pop();
  }
  getFollowImage(follower: Follower) {
    if (follower.follow_state == this.STATE_FOLLOWING) return "assets/v2/button-yes.png";
    return "assets/v2/button-plus.png";
  }

  onClickToggleFollow(follower: Follower) {

    if (follower.follow_state == this.STATE_UNFOLLOW) {
      this.mDataService.mNetworkService.requestUserFollow(follower.talent.username);
      follower.follow_state = this.STATE_FOLLOWING;
    } else {
      this.showAlertFollow(follower);
    }
  }
  showAlertFollow(follower: Follower) {
    let alert = this.alertController.create({
      message: "Xác nhận hủy theo dõi: " + follower.talent.name,
      buttons: [
        {
          text: "Hủy",
          handler: () => { }
        },
        {
          text: "Xác nhận",
          handler: () => {
            this.mDataService.mNetworkService.requestUserUnFollow(follower.talent.username);
            follower.follow_state = this.STATE_UNFOLLOW;
          }
        }
      ]
    });
    alert.present();
  }
}
