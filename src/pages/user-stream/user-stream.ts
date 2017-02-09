import { Component } from '@angular/core';
import { NavController, AlertController, Events } from 'ionic-angular';
import { StreamPlugin } from '../../providers/stream-plugin';
import { UserRole } from '../../providers/config';
import { DataService } from '../../providers/data-service';
export enum RecordingState {
  NONE = 0,
  RECORDING,
  PAUSED
}

@Component({
  selector: 'page-user-stream',
  templateUrl: 'user-stream.html'
})
export class UserStreamPage {

  constructor(
    public navCtrl: NavController,
    private alertCtrl: AlertController,
    private events: Events,
    private mStreamPlugin: StreamPlugin,
    private mDataService: DataService) {
  }


  ionViewDidEnter() {
    let input = document.getElementById("mInputText");
    input.focus();
    this.events.unsubscribe("user:back");
    this.events.subscribe("user:back", () => {
      this.onClickBack();
    });
    if (this.mDataService.isAndroid()) {
      this.mStreamPlugin.init();
      this.mStreamPlugin.startCameraPreview({
        rtmp: 'rtmp://203.162.13.87:1936/live/100016',
        camera_direction: 'front'
      });

      setTimeout(() => {
        let content = document.getElementById("streamContent");
        content.style.background = "transparent";
      }, 500);
    }
  }

  ionViewDidLeave() {
    if(this.mDataService.isAndroid())
    this.mStreamPlugin.stopBroadcast();
  }

  onClickStartStream() {
    let alert = this.alertCtrl.create({
      title: "Chức năng chỉ dành cho talent !",
      subTitle: "Vui lòng đăng kí talent để có thể livestream được.",
      buttons: [
        {
          text: "OK"
        }
      ]
    });
    alert.present();
  }

  onClickBack() {

    this.navCtrl.pop();
  }

}
