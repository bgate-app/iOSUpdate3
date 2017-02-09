import { Component } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { NavController, NavParams, Events, AlertController, ToastController } from 'ionic-angular';
import { Camera, CameraOptions } from 'ionic-native';
import { DataService } from '../../providers/data-service';
import { User, Default } from '../../providers/config';
import { Utils } from '../../providers/utils';
import { ParamBuilder, NetworkConfig, ResponseCode, UserManagerField } from '../../providers/network-config';

@Component({
  selector: 'page-user-edit',
  templateUrl: 'user-edit.html'
})
export class UserEditPage {
  user: User;
  constructor(private http: Http, public mDataService: DataService, private toastCtrl: ToastController, public navCtrl: NavController, public navParams: NavParams, private events: Events, private alertController: AlertController) {
    this.user = this.mDataService.mUser.clone();
    if (this.user.phone.length == 0) {
      this.user.phone = "Chưa có";
    }
    if (this.user.email.length == 0) {
      this.user.email = "Chưa có";
    }
  }

  ionViewDidEnter() {
    this.events.unsubscribe("user:back");
    this.events.subscribe("user:back", () => {
      this.onClickBack();
    });
  }
  onClickBack() {
    this.navCtrl.pop();
  }

  onClickChangeAvatar() {
    let options: CameraOptions = {
      destinationType: Camera.DestinationType.DATA_URL,
      sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
      targetWidth: 210,
      targetHeight: 210,
      allowEdit: true
    };
    Camera.getPicture(options).then((data) => {
      this.onSelectedAvatarBase64(data);
    });
  }
  onResponseUploadAvatar(data) {
    if (data.status == 1) {
      this.showToast("Cập nhật avatar thành công!");
      this.mDataService.mUser.avatar = data.avatar;
      this.user.avatar = data.avatar;
    } else {
      if (data.message == "MAXIMUM_500KB") {
        this.showToast("Cập nhật avatar thất bại, dung lượng ảnh tối đa 500kb!");
      } else if (data.message == "INVALID_TYPE") {
        this.showToast("Cập nhật avatar thất bại, chỉ chấp nhận ảnh jpeg,jpg,png!");
      }
    }
  }
  onFailedUploadAvatar() {
    this.showToast("Cập nhật avatar thất bại!");
  }
  showToast(message) {
    let toast = this.toastCtrl.create(
      {
        message: message,
        duration: 2000
      }
    );
    toast.present();
  }

  onSelectedAvatarBase64(imagedata) {
    let base64Image = 'data:image/jpeg;base64,' + imagedata;
    let serviceURL = "http://showtimes.vn/user/mobileUploadAvatar";
    let header = new Headers();
    header.append('Content-Type', 'application/x-www-form-urlencoded');
    let params = ParamBuilder.builder().add("access_key", NetworkConfig.ACESSKEY).add("avatar", base64Image).build();
    this.http.post(serviceURL, params, { headers: header })
      .subscribe(
      data => {
        this.onResponseUploadAvatar(data.json());
      },
      err => {
        this.onFailedUploadAvatar();
      });
  }

  onClickChangeCover() {
    this.showToast("Chức năng đang được phát triển, vui lòng thử lại sau !");
  }
  onClickChangeName() {
    let alert = this.alertController.create({
      title: "Chỉnh sửa thông tin",
      message: "Nhập tên hiển thị mới của bạn",
      inputs: [
        {
          name: 'name',
          placeholder: 'Tên hiển thị'
        }
      ],
      buttons: [
        {
          text: "Cancel"
        },
        {
          text: "Ok",
          handler: (data) => {
            this.requestUpdateName(data.name);
          }
        }
      ]
    });
    alert.present();
  }
  onClickChangeSex() {
    let alert = this.alertController.create();
    alert.setTitle("Chọn giới tính của bạn");
    alert.addInput({
      type: 'radio',
      label: Default.USER_SEX,
      value: Default.USER_SEX,
      checked: this.user.sex == Default.USER_SEX
    });
    alert.addInput({
      type: 'radio',
      label: 'Nam',
      value: 'male',
      checked: this.user.sex == 'male'
    });
    alert.addInput({
      type: 'radio',
      label: 'Nữ',
      value: 'female',
      checked: this.user.sex == 'female'
    });
    alert.addButton('Cancel');
    alert.addButton({
      text: 'Ok',
      handler: data => {
        this.requestUpdateSex(data);
      }
    });
    alert.present();
  }
  onClickChangePhone() {
    let alert = this.alertController.create({
      title: "Chỉnh sửa thông tin",
      message: "Nhập số điện thoại của bạn",
      inputs: [
        {
          name: 'phone',
          type: "tel",
          placeholder: 'Số điện thoại'
        }
      ],
      buttons: [
        {
          text: "Cancel"
        },
        {
          text: "Ok",
          handler: (data) => {
            this.requestUpdatePhone(data.phone);
          }
        }
      ]
    });
    alert.present();
  }
  onClickChangeEmail() {
    let alert = this.alertController.create({
      title: "Chỉnh sửa thông tin",
      message: "Nhập địa chỉ email của bạn",
      inputs: [
        {
          name: 'email',
          type: "email",
          placeholder: 'Email'
        }
      ],
      buttons: [
        {
          text: "Cancel"
        },
        {
          text: "Ok",
          handler: (data) => {
            this.requestUpdateEmail(data.email);
          }
        }
      ]
    });
    alert.present();
  }

  onBirthdayChange() {
    if (this.user.birthday != this.mDataService.mUser.birthday) {
      this.requestUpdateBirthday(this.user.birthday);
    }
  }

  requestUpdateName(name: string) {

    if (name.length == 0) {
      this.showToast("Tên hiển thị không hợp lệ !");
      return;
    }
    if (name.length > 12) {
      this.showToast("Tên hiển thị chứa không quá 12 kí tự !");
      return;
    }

    this.mDataService.mNetworkService.requestUpdateUserInfo(UserManagerField.title, name).then(
      data => {
        if (data['status'] == ResponseCode.SUCCESS) {
          this.mDataService.mUser.name = name;
          this.user.name = name;
        } else {
          this.showToast("Cập nhật không thành công");
        }
      },
      error => {
        this.showToast("Vui lòng kiểm tra kết nối !");
      }
    );
  }


  requestUpdateSex(sex: string) {
    if (sex == Default.USER_SEX) {
      return;
    }

    this.mDataService.mNetworkService.requestUpdateUserInfo(UserManagerField.sex, sex).then(
      data => {
        if (data['status'] == ResponseCode.SUCCESS) {
          this.mDataService.mUser.sex = sex;
          this.user.sex = sex;
        } else {
          this.showToast("Cập nhật không thành công");
        }
      },
      error => {
        this.showToast("Vui lòng kiểm tra kết nối !");
      }
    );
  }

  requestUpdatePhone(phone: string) {
    if (!Utils.isValidPhone(phone)) {
      this.showToast("Số điện thoại không hợp lệ");
      return;
    }

    this.mDataService.mNetworkService.requestUpdateUserInfo(UserManagerField.phone, phone).then(
      data => {
        if (data['status'] == ResponseCode.SUCCESS) {
          this.mDataService.mUser.phone = phone;
          this.user.phone = phone;
        } else {
          this.showToast("Cập nhật không thành công");
        }
      },
      error => {
        this.showToast("Vui lòng kiểm tra kết nối !");
      }
    );
  }

  requestUpdateEmail(email: string) {
    if (!Utils.isValidEmail(email)) {
      this.showToast("Email không hợp lệ");
      return;
    }

    this.mDataService.mNetworkService.requestUpdateUserInfo(UserManagerField.email, email).then(
      data => {
        if (data['status'] == ResponseCode.SUCCESS) {
          this.mDataService.mUser.email = this.user.email;
          this.user.email = email;
        } else {
          this.showToast("Cập nhật không thành công");
        }
      },
      error => {
        this.showToast("Vui lòng kiểm tra kết nối !");
      }
    );
  }

  requestUpdateBirthday(birthday: string) {
    this.mDataService.mNetworkService.requestUpdateUserInfo(UserManagerField.birthday, birthday).then(
      data => {
        if (data['status'] == ResponseCode.SUCCESS) {
          this.mDataService.mUser.birthday = this.user.birthday;
          this.user.birthday = birthday;
        } else {
          this.showToast("Cập nhật không thành công");
        }
      },
      error => {
        this.showToast("Vui lòng kiểm tra kết nối !");
      }
    );
  }
}
