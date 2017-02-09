import {Injectable} from "@angular/core";

@Injectable()
export class StreamPlugin {
  mAiaStream: any;

  constructor() {

  }
  init() {
    if (this.mAiaStream == undefined && window['plugins'] != undefined) {
      this.mAiaStream = window['plugins'].aiaStream;
    }
  }
  setAudioEnable(mEnable) {
    if (this.mAiaStream == undefined) return;
    return this.mAiaStream.setAudioEnable({
      enable: mEnable
    });
  }
  startCameraPreview(config) {
    this.init();
    if (this.mAiaStream == undefined) return;
    return this.mAiaStream.startCameraPreview(config);
  }

  stopCameraPreview() {
    if (this.mAiaStream == undefined) return;
    return this.mAiaStream.stopCameraPreview({});
  }

  startBroadcast() {
    if (this.mAiaStream == undefined) return;
    return this.mAiaStream.startBroadcast({});
  }

  stopBroadcast() {
    if (this.mAiaStream == undefined) return;
    return this.mAiaStream.stopBroadcast({});
  }

  switchCamera() {
    if (this.mAiaStream == undefined) return;
    return this.mAiaStream.switchCamera({});
  }


  /**For RTMP Player */

  initVideoPlayer() {
    this.init();
    if (this.mAiaStream == undefined) return;
    return this.mAiaStream.initVideoPlayer();
  }
  playDefaultVideo(url: string) {
    return new Promise((resolve, reject) => {
      if (this.mAiaStream == undefined) reject();
      this.mAiaStream.playDefaultVideo(url).then(
        success => {
          resolve(success);
        },
        error => {
          reject(error);
        }
      );
    });
  }

  playVideo(url: string) {
    return new Promise((resolve, reject) => {
      if (this.mAiaStream == undefined) reject();
      this.mAiaStream.playVideo(url).then(
        success => {
          resolve(success);
        },
        error => {
          reject(error);
        }
      );
    });
  }

  reloadVideo() {
    if (this.mAiaStream == undefined) return;
    return this.mAiaStream.reloadVideo();
  }

  stopVideoPlayer() {
    if (this.mAiaStream == undefined) return;
    return this.mAiaStream.stopVideoPlayer();
  }
  stopAll() {
    if (this.mAiaStream == undefined) return;
    return this.mAiaStream.stopAll();
  }

}
