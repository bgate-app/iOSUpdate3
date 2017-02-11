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

- (void) setAudio : (bool) enable;

- (void) setBeauty : (bool) enable;

- (void) startBroadcast : (NSString*) url;

- (void) stopBroadcast;

- (void) initialize;

- (void) destroy;


@end
