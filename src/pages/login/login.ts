import { Component } from '@angular/core';
import { NavController, ToastController,Events } from 'ionic-angular';
import { UserHomePage } from '../user-home/user-home';
import { LoginAccountPage } from '../login-account/login-account';
import { NetworkService } from '../../providers/network-service';
import { DataService } from '../../providers/data-service';
import {
  Chaos, ExtParamsKey, NetworkConfig
} from '../../providers/network-config';

interface LoginData {
  username: string,
  password: string,
  remember: boolean
}


@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {
  login_data: LoginData = {
    username: '',
    password: '',
    remember: true
  };

  VIEW_SOCIAL: number = 1;
  VIEW_LOGIN: number = 2;
  VIEW_REGISTER: number = 3;

  login_social: boolean = false;
  viewcontrol = {
    type: this.VIEW_SOCIAL
  }
  constructor(public navCtrl: NavController,
    private networkService: NetworkService,
    private mDataService: DataService,
    private events : Events,
    private toastCtrl: ToastController) {

  }

  ionViewDidEnter() {
    this.events.unsubscribe("network:expired");
  }
  onClickShowView(type) {
    if (type == this.VIEW_LOGIN) {
      this.navCtrl.push(LoginAccountPage);
      return;
    }
    this.viewcontrol.type = type;
  }
  onFacebookLoginInfo(user_id, token, username) {
    this.mDataService.mNetworkService.requestGetAcessKeyWithOpenIDFB(user_id, username, '').then(
      data => {
        if (data[ExtParamsKey.STATUS] == 1) {
          NetworkConfig.ACESSKEY = data[Chaos.ACCESS_KEY];
          this.onLoginSuccess();
        }
        else
          this.showToast(data[ExtParamsKey.MESSAGE], 2000);
      }
    );
  }
  /**
   * {"status":"connected","authResponse":{"accessToken":"","expiresIn":"5165816","session_key":true,"sig":"...","userID":"1242367162518765"}}
   */
  onFacebookLoginSuccess(fbData) {
    let fbID = fbData.authResponse.userID;
    this.mDataService.mNetworkService.onLoginFacebookSucces(fbID, fbData.authResponse.accessToken).then(
      data => {
        this.onFacebookLoginInfo(fbID, fbData.authResponse.accessToken, data['name']);
      }
    );
  }
  loginWithFacebook() {
    this.mDataService.mSocialLogin.facebookLogin().then(
      data => {
        this.onFacebookLoginSuccess(data);
      }
    );
  }

  /**   
   * {"email":"bgate.app@gmail.com","idToken":"","userId":"114754726275456658309","displayName":"Bgate App","familyName":"App","givenName":"Bgate","imageUrl":""}
   */

  /**Voi google thi email chinh la id */
  onGoogleLoginSuccess(userdata) {
    this.mDataService.mNetworkService.requestGetAcessKeyWithOpenIDGP(userdata.email, userdata.displayName, userdata.imageUrl, userdata.email).then(
      data => {
        if (data[ExtParamsKey.STATUS] == 1) {
          NetworkConfig.ACESSKEY = data[Chaos.ACCESS_KEY];
          this.onLoginSuccess();
        }
        else {
          this.showToast(data[ExtParamsKey.MESSAGE], 2000);
        }
      }
    );
  }
  onGoogleLoginFailed(data) {
  }

  loginWithGoogle() {
    this.mDataService.mSocialLogin.googleplusLogin().then(
      data => {  
        this.onGoogleLoginSuccess(data);
      },
      error => {        
        this.onGoogleLoginFailed(error);
      }
    );
  }

  onLoginSuccess() {
    this.mDataService.setItemOnStorage(Chaos.ACCESS_KEY, NetworkConfig.ACESSKEY);
    this.navCtrl.setRoot(UserHomePage, {}, {
      animate: true,
      direction: 'forward',
      duration: 400
    });
  }

  showToast(message: string, duration: number, position?: string) {
    let pos = 'bottom';
    if (position == undefined || position == null || position.length == 0) {
      pos = 'top';
    }
    let toast = this.toastCtrl.create({
      message: message,
      duration: duration,
      position: pos
    });
    toast.present();
  }
}
