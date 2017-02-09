import { Component, ViewChild } from '@angular/core';
import { NavController, ToastController, Keyboard } from 'ionic-angular';
import { UserRegisterPage } from '../user-register/user-register';
import { UserHomePage } from '../user-home/user-home';
import { DataService } from '../../providers/data-service';
import { Chaos, ExtParamsKey, NetworkConfig } from '../../providers/network-config';

interface LoginData {
  username: string,
  password: string
}

@Component({
  selector: 'page-login-account',
  templateUrl: 'login-account.html'
})
export class LoginAccountPage {
  @ViewChild('iUsername') iUsername;
  login_data: LoginData = {
    username: '',
    password: ''
  };

  mRequesting = false;
  mCount = 0;
  mText = "Đăng nhập";

  constructor(
    public navCtrl: NavController,
    private mDataService: DataService,
    private toastCtrl: ToastController,
    private keyboard: Keyboard) { }

  mAnimationFrameId = -1;
  ionViewDidEnter() {
    this.scheduleUpdate();
    setTimeout(() => {
      if (!this.keyboard.isOpen()) this.iUsername.setFocus();
    }, 200);
    setTimeout(() => {
      if (!this.keyboard.isOpen()) this.iUsername.setFocus();
    }, 1000);
  }
  ionViewDidLeave() {
    this.unScheduleUpdate();
  }

  public scheduleUpdate() {
    this.onUpdate();
    this.mAnimationFrameId = requestAnimationFrame(() => {
      this.scheduleUpdate();
    });
  }
  public unScheduleUpdate() {
    cancelAnimationFrame(this.mAnimationFrameId);
  }
  onUpdate() {
    if (this.mRequesting) {
      this.mCount++;
      if (this.mCount > 100) {
        this.mCount = 0;
      }
      let idx = Math.floor(this.mCount / 20);
      this.mText = "";
      while (this.mText.length < idx) {
        this.mText += ".";
      }
    }
  }
  isValid() {
    if (this.mRequesting) return false;
    if (this.login_data.username.length == 0) return false;
    if (this.login_data.password.length == 0) return false;
    return true;
  }
  onStartRequest() {
    this.mRequesting = true;
    this.mCount = 0;

  }
  onStopRequest() {
    this.mRequesting = false;
    this.mCount = 0;
    this.mText = "Đăng nhập";
  }


  onClickGoBack() {
    this.navCtrl.pop();
  }
  onCLickForgotPassword() {
    this.showToast("Chức năng đang được phát triển, vui lòng thử lại sau !", 2000);
  }
  onCLickRegister() {
    this.navCtrl.push(UserRegisterPage);
  }

  onClickLogin() {

    if (!this.inValidData() && !this.mRequesting) {
      this.onStartRequest();
      this.mDataService.mNetworkService.requestGetAcessKey(this.login_data.username, this.login_data.password).then(
        data => {
          if (data[ExtParamsKey.STATUS] == 1) {
            this.mDataService.mUser.username = this.login_data.username;
            NetworkConfig.ACESSKEY = data[Chaos.ACCESS_KEY];
            this.mDataService.setItemOnStorage(Chaos.ACCESS_KEY, NetworkConfig.ACESSKEY);
            this.onLoginSuccess();
           // this.mDataService.requestOnesignalUserID();
            this.onStopRequest();
          }
          else {
            this.onStopRequest();
            this.showToast(data[ExtParamsKey.MESSAGE], 2000);
          }
        },
        error => {
          this.onLoginFailed();
        }
      );

    }
  }
  onLoginFailed() {
    this.onStopRequest();
    this.showToast("Đăng nhập thất bại, Vui lòng kiểm tra kết nối !", 2500);
  }

  onLoginSuccess() {
    this.unScheduleUpdate();
    this.navCtrl.setRoot(UserHomePage, {}, {
      animate: true,
      direction: 'forward',
      duration: 400
    });
  }

  inValidData() {
    if (this.login_data.username.length == 0) {
      this.showToast("Tên đăng nhập không được để trống", 2000);
      return true;
    }
    if (this.login_data.password.length == 0) {
      this.showToast("Mật khẩu không được để trống", 2000);
      return true;
    }
    return false;
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
