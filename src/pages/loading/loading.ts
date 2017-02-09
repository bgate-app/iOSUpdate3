import { Component } from '@angular/core';
import { NavController, Platform } from 'ionic-angular';
import { LoginPage } from '../login/login';
import { LazyLoadService } from '../../providers/lazyload-service';
import { DataService } from '../../providers/data-service';
import { PomeloService } from '../../providers/pomelo-service';
import { NetworkService } from '../../providers/network-service';
import { ExtParamsKey, NetworkConfig, ResponsePomelo, PomeloCmd } from '../../providers/network-config';
import { UserHomePage } from '../user-home/user-home';


@Component({
  selector: 'page-loading',
  templateUrl: 'loading.html'
})
export class LoadingPage {

  constructor(public navCtrl: NavController,
    private lazyloadService: LazyLoadService,
    private mDataService: DataService,
    private networkService: NetworkService,
    private platform: Platform
  ) {
    this.platform.ready().then(
      () => {
        this.onPlatformReady();
      }
    );
  }
  onPlatformReady() {
    let pomeloService = new PomeloService();
    pomeloService.addPomeloListeners();
    this.mDataService.initialize(this.networkService, pomeloService);
    this.mDataService.requestGiftInfo();
    this.mDataService.requestHomeBanners();
    this.mDataService.requestHotLiveStream('' + this.mDataService.mListRoomUserHomeRangeFirst + '-' + this.mDataService.mRangeGap, true);
    this.mDataService.requestTopTalentRecieveGiftByYear();
  }
  ionViewDidEnter() {  
    setTimeout(() => {
      this.doAutoLogin();
    }, 1000);
    this.lazyloadService.loadImages();
  }
  doAutoLogin() {
    if (NetworkConfig.ACESSKEY != '') {
      this.networkService.requestLogin().then(
        data => {
          if (data[ExtParamsKey.STATUS] == 1) {
            this.mDataService.mUser.username = data['user_name'];
            this.mDataService.mUser.role_id = data['user_role'];
            let showPopup = data['show_popup_promote'];
            if (showPopup != undefined && showPopup == true) {
              this.mDataService.enableConfirmPromote(true);
            }
            this.onLoginSuccess();
          }
          else {
            this.onNotExistAccessKey();
          }
        },
        error => {
          this.onNotExistAccessKey();
        });
    }
    else {
      this.onNotExistAccessKey();
    }
  }

  onNotExistAccessKey() {
    this.navCtrl.setRoot(LoginPage, {}, {
      animate: false
    });
  }

  onLoginSuccess() {
    this.navCtrl.setRoot(UserHomePage, {}, {
      animate: true,
      direction: 'forward',
      duration: 400
    });
  }
}
