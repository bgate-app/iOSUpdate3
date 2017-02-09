import { Component, ViewChild } from '@angular/core';
import { NavController, Events, ToastController } from 'ionic-angular';
import { Utils } from '../../providers/utils';
import { NetworkConfig, Chaos } from '../../providers/network-config';
import { DataService } from '../../providers/data-service';
import { UserHomePage } from '../user-home/user-home';

@Component({
  selector: 'page-user-register',
  templateUrl: 'user-register.html'
})
export class UserRegisterPage {
  @ViewChild('iUsername') iUsername;
  @ViewChild('iPassword') iPassword;
  @ViewChild('iConfirm') iConfirm;  
  @ViewChild('iEmail') iEmail;

  register_data = {
    username: '',
    password: '',
    confirm: '',
    name: '',
    email: ''
  };

  mRequesting = false;
  mCount = 0;
  mText = "Đăng ký";
  mAnimationFrameId = -1;
  mTouchEnable = true;
  constructor(private mDataService: DataService, private toastCtrl: ToastController, public navCtrl: NavController, private events: Events) { }

  ionViewDidEnter() {
    this.events.unsubscribe("user:back");
    this.events.subscribe("user:back", () => {
      this.onClickGoBack();
    });
    this.scheduleUpdate();
    setTimeout(() => {
      this.iUsername.setFocus();
    }, 200);
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
    if (this.register_data.username.length == 0) return false;
    if (this.register_data.password.length == 0) return false;
    if (this.register_data.confirm.length == 0) return false;
    if (this.register_data.password != this.register_data.confirm) return false;
    // if (this.register_data.name.length == 0) return false;
    if (this.register_data.email.length == 0) return false;

    return true;
  }
  onStartRequest() {
    this.mRequesting = true;
    this.mCount = 0;

  }
  onStopRequest() {
    this.mRequesting = false;
    this.mCount = 0;
    this.mText = "Đăng ký";
  }
  isInValidUsername() {
    if (this.register_data.username.length == 0) return true;
    if (Utils.isValidUsername(this.register_data.username)) return false;
    return true;
  }

  isInvalidPassword() {
    return this.register_data.password.length < 6;
  }

  isInvalidConfirmPassword() {
    return this.register_data.confirm != this.register_data.password;
  }

  isInvalidName() {
    return this.register_data.name.length == 0;
  }
  isInvalidEmail() {
    if (this.register_data.email.length == 0) return true;
    return !Utils.isValidEmail(this.register_data.email);
  }
  onClickRegister() {
    if (this.mRequesting) return;
    if (!this.mTouchEnable) return;
    this.mTouchEnable = false;
    setTimeout(() => {
      this.mTouchEnable = true;
    }, 1000);
    if (this.isInValidUsername()) {
      if (this.register_data.username.length > 0) {
        this.showToast("Tên đăng nhập ít nhất 6 chữ số và không được chứa kí tự đặc biệt !", 1000);
        setTimeout(() => {
          this.iUsername.setFocus();
        }, 1200);
      } else {
        this.iUsername.setFocus();
      }
      return;
    }
    if (this.isInvalidPassword()) {
      if (this.register_data.password.length > 0) {
        this.showToast("Mật khẩu chứa ít nhất 6 ký tự", 1000);
        setTimeout(() => {
          this.iPassword.setFocus();
        }, 1200);
      } else {
        this.iPassword.setFocus();
      }
      return;
    }

    if (this.isInvalidConfirmPassword()) {
      if (this.register_data.confirm.length > 0) {
        this.showToast("Mật khẩu không khớp nhau", 1000);
        setTimeout(() => {
          this.iConfirm.setFocus();
        }, 1200);
      } else {
        this.iConfirm.setFocus();
      }
      return;
    }

    if (this.isInvalidEmail()) {
      if (this.register_data.email.length > 0) {
        this.showToast("Email không hợp lệ", 1000);
        setTimeout(() => {
          this.iEmail.setFocus();
        }, 1200);
      } else {
        this.iEmail.setFocus();
      }
      return;
    }




    this.onStartRequest();
    this.mDataService.mNetworkService.requestRegister(this.register_data.username, this.register_data.password, this.register_data.email).then(
      data => {
        this.onRegisterResponse(data);

      }, error => {
        this.showToast("Vui lòng kiểm tra kết nối !", 2000);
        this.onStopRequest();
      });
  }
  onGetAccesskeyResponse(data) {
    if (data.status == 1) {
      this.mDataService.mUser.username = this.register_data.username;
      NetworkConfig.ACESSKEY = data[Chaos.ACCESS_KEY];
      this.mDataService.setItemOnStorage(Chaos.ACCESS_KEY, NetworkConfig.ACESSKEY);
      this.onLoginSuccess();
     // this.mDataService.requestOnesignalUserID();
    }
    else {
      this.showToast(data.message, 2000);
    }
    this.onStopRequest();
  }
  onRegisterResponse(data) {
    if (data.status == 1) {

      this.mDataService.mNetworkService.requestGetAcessKey(this.register_data.username, this.register_data.password).then(
        response => {
          this.onGetAccesskeyResponse(response);
        },
        error => {
          this.onStopRequest();
          this.onClickGoBack();
        }
      );
    } else {
      this.onStopRequest();
      this.showToast(data.message, 2000);
    }
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
  onLoginSuccess() {
    this.unScheduleUpdate();
    this.navCtrl.setRoot(UserHomePage, {}, {
      animate: true,
      direction: 'forward',
      duration: 400
    });
  }
  onClickGoBack() {
    this.unScheduleUpdate();
    this.navCtrl.pop();
  }
}
