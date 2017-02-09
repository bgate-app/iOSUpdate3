//
//  LFLivePreview.h
//  LFLiveKit
//
//  Created by 倾慕 on 16/5/2.
//  Copyright © 2016年 live Interactive. All rights reserved.
//

#import <UIKit/UIKit.h>

@interface LFLivePreview : UIView


- (void) startCameraPreview;

- (void) stopCameraPreview;

- (void) switchCamera;

- (void) setAudioOn;

- (void) setAudioOff;

- (void) setBeautyOn;

- (void) setBeautyOff;

- (void) startBroadcast;

- (void) stopBroadcast;

- (void) initialize;

- (void) destroy;


@end
