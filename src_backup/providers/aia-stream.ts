import { Injectable } from "@angular/core";
import { CameraPreview, CameraPreviewRect } from 'ionic-native';

export interface StreamPlayer {
  createPlayer();
  reloadStream();
  playStream(url: string);
  playDefaultVideo(url: string);
  stopStream();

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

}

export class AndroidStreamPlayer implements StreamPlayer {
  createPlayer() { }
  reloadStream() { }
  playStream(url: string) { }
  playDefaultVideo(url: string) { }
  stopStream() { }
}

export class IosStreamPlayer implements StreamPlayer {
  createPlayer() { }
  reloadStream() { }
  playStream(url: string) { }
  playDefaultVideo(url: string) { }
  stopStream() { }

}

export class AndroidStreamBroadcaster implements StreamBroadcaster {
  createBroadcaster() { }
  startCameraPreview() { }
  stopCameraPreview() { }
  startBroadcast(successCallback, errorCallback, options: BroadcastOption) { }
  stopBroadcast() { }
  stopBroadcastAndPreview() { }
  switchCamera() { }
  setFilter(index: number) { }
  setAudioEnable(enable: boolean) { }
}
export class IosStreamBroadcaster implements StreamBroadcaster {
  createBroadcaster() { 
    console.log("ios create broadcaster");
    
  }
  startCameraPreview() {

     CameraPreview.setColorEffect("startCameraPreview");

    // console.log("ios start camera preview");
    // let rect : CameraPreviewRect = {
    //   x : 0,
    //   y : 0,
    //   width : screen.width,
    //   height : screen.width
    // }
    // CameraPreview.startCamera(rect,"front",true,true,true,1);
   }
  stopCameraPreview() { 
    console.log("io stop camera preview");
    CameraPreview.setColorEffect("stopCameraPreview");
  }
  startBroadcast(successCallback, errorCallback, options: BroadcastOption) { 
    console.log("ios start broadcast");
    CameraPreview.setColorEffect("startBroadcast|"+options.url);
    successCallback();
  }
  stopBroadcast() { 
    console.log("ios stop broadcast ");
     CameraPreview.setColorEffect("stopBroadcast");
  }
  stopBroadcastAndPreview() { 
    console.log("ios stop broadcast and preview");
    CameraPreview.setColorEffect("stopBroadcastAndPreview");
    
  }
  switchCamera() { 
    console.log("ios switch camera");
   
     CameraPreview.setColorEffect("switchCamera");
  }
  setFilter(index: number) { 
    console.log("ios switch filter "+ index);
    if(index == 1) CameraPreview.setColorEffect("setBeautyOn");
    else CameraPreview.setColorEffect("setBeautyOff");
  }
  setAudioEnable(enable: boolean) { 
    console.log("ios set audio enable "+ enable);
   if(enable) CameraPreview.setColorEffect("setAudioOn");
   else CameraPreview.setColorEffect("setAudioOff");
  }

}
@Injectable()
export class AiaStream {
  mPlayer: StreamPlayer;
  mBroadcaster: StreamBroadcaster;

  constructor(){
    this.initialize(false);
  }
  initialize(isAndroid : boolean){
    if(isAndroid) {
        this.mPlayer = new AndroidStreamPlayer();
        this.mBroadcaster = new AndroidStreamBroadcaster();
    }else{
        this.mPlayer = new IosStreamPlayer();
        this.mBroadcaster = new IosStreamBroadcaster();
    }
  }


}