import { Injectable } from "@angular/core";

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
  isAvailable() {
    return this.mAiaStream != null;
  }
  initAll() {
    this.init();
    return this.mAiaStream.initAll();
  }
  initBroadcast() {
    return this.mAiaStream.initBroadcast();
  }

  startCameraPreview() {
    return this.mAiaStream.startCameraPreview();
  }
  stopCameraPreview() {
    return this.mAiaStream.stopCameraPreview();
  }
  startBroadcast(successCallback, errorCallback, options) {
    this.mAiaStream.startBroadcast(successCallback, errorCallback, options);
  }
  stopBroadcast() {
    return this.mAiaStream.stopBroadcast();
  }
  stopBroadcastAndPreview() {
    return this.mAiaStream.stopBroadcastAndPreview();
  }
  switchCamera() {
    return this.mAiaStream.switchCamera();
  }
  setFilter(index: number) {
    return this.mAiaStream.setFilter({
      filter: index
    });
  }
  setAudioEnable(enable: boolean) {
    return this.mAiaStream.setAudioEnable({
      audio_enable: enable
    });
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
