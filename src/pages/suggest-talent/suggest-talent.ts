import { Component } from '@angular/core';
import { NavController,Events } from 'ionic-angular';
import { UserPreview } from '../../providers/config';
import { ResponseCode } from '../../providers/network-config';
import { DataService } from '../../providers/data-service';
import { NetworkService } from '../../providers/network-service';
@Component({
  selector: 'page-suggest-talent',
  templateUrl: 'suggest-talent.html'
})
export class SuggestTalentPage {
  talents: Array<UserPreview> = [];
  mRequesting: boolean = true;
  constructor(
    public navCtrl: NavController,
    public mDataService: DataService,
    public mNetworkService: NetworkService,
    private events : Events
  ) { }

  ionViewDidEnter() {
     this.doRequestData();
    this.events.unsubscribe("user:back");
    this.events.subscribe("user:back", () => {
      this.onClickBack();
    });
  }
  doRequestData() {
    this.mRequesting = true;
    this.mNetworkService.requestTopTalentSuggest().then(data => {
      this.onResponseTalents(data);
      this.mRequesting = false;
    }, error => {
      this.mRequesting = false;
      console.log("suggest talent error " + JSON.stringify(error));
    });
  }
  onResponseTalents(data) {
    let followings = this.mDataService.mFollowManager.followings;
    console.log(followings);
    console.log("ahuuh");

    if (data.status == ResponseCode.SUCCESS) {
      this.talents = [];
      for (let talent of data.content) {
        let user = UserPreview.createTalent();
        user.username = talent.name;
        user.name = talent.title;
        user.avatar = talent.avatar;
        user.money = talent.money;
        user.level = talent.level;
        user.point = talent.point;
        user.id = talent.id;
        user.followed = false;
        for (let followed of followings) {
          if (followed.username == user.username) {
            user.followed = true;
            break;
          }
        }
        this.talents.push(user);
      }
    }
  }
  getCheckBox(talent: UserPreview) {
    if (talent.followed) return "assets/v2/checkbox-select.png";
    return "assets/v2/checkbox-unselect.png";
  }
  onClickToggleFollow(talent: UserPreview) {
    if (talent.followed == true) {
      talent.followed = false;
      this.mNetworkService.requestUserUnFollow(talent.username);
    } else {
      talent.followed = true;
      this.mNetworkService.requestUserFollow(talent.username);
    }
  }
  onClickBack() {
    this.navCtrl.pop();
  }
  onClickDone() {
    this.navCtrl.pop();
  }

}
