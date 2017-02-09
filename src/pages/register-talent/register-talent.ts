import { Component } from '@angular/core';
import { NavController,Events } from 'ionic-angular';
class RegisterData {
  username: string;
  cmtnd: string;
  address: string;
  birthday: string;
  gender: number;
  phone: string;
  facebook: string;
  youtube: string;
  category: string;
  agreement: boolean;

  constructor() {
    this.username = '';
    this.cmtnd = '';
    this.birthday = '';
    this.gender = 0;
    this.phone = '';
    this.facebook = '';
    this.youtube = '';
    this.category = '';
    this.agreement = false;
  }
}


@Component({
  selector: 'page-register-talent',
  templateUrl: 'register-talent.html'
})
export class RegisterTalentPage {
  mRegisterData: RegisterData = new RegisterData();
  constructor(public navCtrl: NavController,private events : Events) { }

  ionViewDidEnter() {
    this.events.unsubscribe("user:back");
    this.events.subscribe("user:back", () => {
      this.onClickGoBack();
    });
  }
  onClickToggleAgreement() {
    this.mRegisterData.agreement = !this.mRegisterData.agreement;
  }
  onClickRegister() {
    if (this.mRegisterData.agreement) {

    }
  }
  onClickGoBack() {
    this.navCtrl.pop();
    // this.navCtrl.setRoot(UserProfilePage, {}, {
    //   animate: true,
    //   direction: 'back',
    //   duration: 300
    // });
  }
}
