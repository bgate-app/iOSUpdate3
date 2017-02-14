import { Injectable } from "@angular/core";
import { CameraPreview, CameraPreviewRect } from 'ionic-native';


export interface MEventListener {
  dispatchEvent(cmd: string, data: any);
}

export interface StreamPlayer {
  createPlayer(object: any);
  reloadStream();
  playStream(url: string);
  playDefaultVideo(url: string);
  stopStream();
  setEventListener(listener: MEventListener);
}
export interface BroadcastOption {
  url: string;
  filter: number;
  audio_enable: boolean;
}
export interface StreamBroadcaster {
  createBroadcaster();
  startCameraPreview();
  stopCameraPreview();
  startBroadcast(successCallback, errorCallback, options: BroadcastOption);
  stopBroadcast();
  stopBroadcastAndPreview();
  switchCamera();
  setFilter(index: number);
  setAudioEnable(enable: boolean);
  setEventListener(listener: MEventListener);
}

export class AndroidStreamPlayer implements StreamPlayer {
  mAiaStream: any;
  mEventListener: MEventListener;
  createPlayer(object: any) {
    if (this.mAiaStream == undefined && window['plugins'] != undefined) {
      this.mAiaStream = window['plugins'].aiaStream;
      this.mAiaStream.initVideoPlayer();
    }
  }
  reloadStream() {
    if (this.mAiaStream == undefined) return;
    return this.mAiaStream.reloadVideo();
  }
  playStream(url: string) {
    return new Promise((resolve, reject) => {
      if (this.mAiaStream == undefined) reject();
      this.mAiaStream.playVideo(url).then(
        success => {
          resolve(success);
          if (this.mEventListener != null) {
            this.mEventListener.dispatchEvent("playing", {});
          }
        },
        error => {
          reject(error);
        }
      );
    });
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
  stopStream() {
    if (this.mAiaStream == undefined) return;
    return this.mAiaStream.stopVideoPlayer();
  }
  setEventListener(listener: MEventListener) {
    this.mEventListener = listener;
  }
}

export class IosStreamPlayer implements StreamPlayer {

  mVideo: HTMLVideoElement;
  mEventListener: MEventListener;
  mLastUrl: string = '';

  createPlayer(object: any) {

    this.mVideo = <HTMLVideoElement>document.getElementById("mVideoElement");
    if (this.mVideo != undefined) {
      this.mVideo.addEventListener("playing", (event) => {
        if (this.mEventListener != null) {
          this.mEventListener.dispatchEvent("playing", {});
        }
      });

      this.mVideo.addEventListener("play", (event) => {
        if (this.mEventListener != null) {
          this.mEventListener.dispatchEvent("play", {});
        }
      });

      this.mVideo.addEventListener("pause", (event) => {
        this.mVideo.load();
        if (this.mEventListener != null) {
          this.mEventListener.dispatchEvent("pause", {});
        }
      });
    }
  }
  reloadStream() {
    this.playStream(this.mLastUrl);
  }
  playStream(url: string) {
    this.mLastUrl = url;
    this.mVideo.src = url;
    this.mVideo.load();
  }
  playDefaultVideo(url: string) {
    this.mLastUrl = url;
    this.mVideo.src = url;
    this.mVideo.load();
  }
  stopStream() {
    this.mLastUrl = "";
    this.mVideo.src = "";
    this.mVideo.load();
  }
  setEventListener(listener: MEventListener) {
    this.mEventListener = listener;
  }
}

export class AndroidStreamBroadcaster implements StreamBroadcaster {
  mEventListener: MEventListener;
  mAiaStream: any;
  createBroadcaster() {
    if (this.mAiaStream == undefined && window['plugins'] != undefined) {
      this.mAiaStream = window['plugins'].aiaStream;
    }
    if (this.mAiaStream == undefined) return;
    return this.mAiaStream.initBroadcast();
  }
  startCameraPreview() {
    return this.mAiaStream.startCameraPreview();
  }
  stopCameraPreview() {
    return this.mAiaStream.stopCameraPreview();
  }
  startBroadcast(successCallback, errorCallback, options: BroadcastOption) {
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
  setEventListener(listener: MEventListener) {
    this.mEventListener = listener;
  }
}
export class IosStreamBroadcaster implements StreamBroadcaster {
  mEventListener: MEventListener;

  createBroadcaster() { }
  startCameraPreview() {
    CameraPreview.setColorEffect("startCameraPreview");
  }
  stopCameraPreview() {
    CameraPreview.setColorEffect("stopCameraPreview");
  }
  startBroadcast(successCallback, errorCallback, options: BroadcastOption) {
    CameraPreview.setColorEffect("startBroadcast|" + options.url);
    successCallback();
  }
  stopBroadcast() {
    CameraPreview.setColorEffect("stopBroadcast");
  }
  stopBroadcastAndPreview() {
    CameraPreview.setColorEffect("stopBroadcastAndPreview");

  }
  switchCamera() {
    CameraPreview.setColorEffect("switchCamera");
  }
  setFilter(index: number) {
    if (index == 1) CameraPreview.setColorEffect("setBeautyOn");
    else CameraPreview.setColorEffect("setBeautyOff");
  }
  setAudioEnable(enable: boolean) {
    if (enable) CameraPreview.setColorEffect("setAudioOn");
    else CameraPreview.setColorEffect("setAudioOff");
  }
  setEventListener(listener: MEventListener) {
    this.mEventListener = listener;
  }
}
@Injectable()
export class AiaStream {
  mPlayer: StreamPlayer;
  mBroadcaster: StreamBroadcaster;
  mAndroidDevice: boolean = false;
  constructor() {
    this.initialize(true);
  }
  /**Khởi tạo các plugin cần thiết */
  initialize(isAndroid: boolean) {
    if (isAndroid) {
      this.mPlayer = new AndroidStreamPlayer();
      this.mBroadcaster = new AndroidStreamBroadcaster();
      this.mAndroidDevice = true;
    } else {
      this.mPlayer = new IosStreamPlayer();
      this.mBroadcaster = new IosStreamBroadcaster();
    }
  }
  createViews() {
    if (this.mAndroidDevice) {
      this.mPlayer.createPlayer({});
      this.mBroadcaster.createBroadcaster();
    }
  }
}