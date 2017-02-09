import { Injectable } from '@angular/core';
import { User, TopData, RoomLive, UserDevice,UserSetting } from './config';
import { RoomManager } from './room-pages-manager';
import { SocialLogin } from './social-login';
import { GiftManager } from './gift-service';
import { FollowManager } from './follow-service';
import { NativeStorage } from 'ionic-native';
import { NetworkService } from './network-service';
import { PomeloService } from './pomelo-service';
import { MessageManager } from './message-service';
import { UserService } from './user-service';
import { RoomLiveField, Chaos, FieldsBuilder, UserManagerField, ExtParamsKey, NetworkConfig } from './network-config';


export class TalentRoom {
  mRoom: RoomLive = new RoomLive();

  onResponseTalentRoom(talent: User, room) {
    this.mRoom.room_id = room.room_id;
    this.mRoom.poster = room.thumbnail_url;
    this.mRoom.talent.cloneFromUser(talent);
  }
  onLoggedOut() {    
    this.mRoom = new RoomLive();
  }
}

@Injectable()
export class DataService {
  mUserService : UserService = new UserService();
  mUserSetting : UserSetting = new UserSetting();
  mDevice: UserDevice = new UserDevice();
  mUser: User = new User();
  mTalentRoom: TalentRoom = new TalentRoom();
  mSocialLogin: SocialLogin = new SocialLogin();
  mGiftManager: GiftManager = new GiftManager();
  mRoomPageManager = new RoomManager();
  mNetworkService: NetworkService;
  mPomeloService: PomeloService;
  mMessageManager: MessageManager = new MessageManager();
  mTopData: TopData = new TopData();
  mFollowManager = new FollowManager();
  mBanners = ["assets/banner/banner4.jpg"];
  mListRoomUserHomeRangeFirst: number = 0;
  mRangeGap: number = 5;
  mKeyBoardHeight: number = 0;
  mConfirmPromote: number = -1;

  constructor() {

  }
  initialize(networkservice: NetworkService, pomeloService: PomeloService) {
    this.mPomeloService = pomeloService;
    this.mNetworkService = networkservice;
    NetworkConfig.ACESSKEY = "";
    this.getItemOnStorage("keyboardheight").then(data => {
      this.mKeyBoardHeight = parseInt(data);
    });
    this.getItemOnStorage(Chaos.ACCESS_KEY).then(
      data => {
        NetworkConfig.ACESSKEY = data;
      }, error => {
      });
    this.getItemOnStorage("pomelo_connector").then(data => {
        this.mPomeloService.onExistConnector(data);
    },error=>{
        this.mPomeloService.onNotExistConnector();
    });
    this.mDevice.onPlatformReady();
    this.mNetworkService.setUserDevice(this.mDevice);
    this.mPomeloService.setUserDevice(this.mDevice);
    this.requestLoadConfig();
  }
  requestLoadConfig() {    
    NetworkConfig.VERSION = "1.3";
    if (NetworkConfig.SERVER_TYPE == NetworkConfig.SERVER_LOCAL) {
      NetworkConfig.MAIN_URL = "http://125.212.192.94:8080/showtimes_app/ws/";
      NetworkConfig.MAIN_HOST = "125.212.192.94";
      NetworkConfig.MAIN_PORT = "3014";
    } else if (NetworkConfig.SERVER_TYPE == NetworkConfig.SERVER_SHOWTIME) {
      NetworkConfig.MAIN_URL = "http://api.showtimes.vn/ws/";
      NetworkConfig.MAIN_HOST = "node.showtimes.vn";
      NetworkConfig.MAIN_PORT = "3014";
    }
  }

  isAndroid() {
    return this.mDevice.isAndroid();
  }
    isIOS() {
    return this.mDevice.isIos();
  }

  checkNotify(): boolean {
    if (this.mMessageManager.has_new_messages) return true;
    return false;
  }
  enableConfirmPromote(enable: boolean) {
    this.mConfirmPromote = enable ? 0 : -1;
  }
  addConfirmPromote() {
    if (this.mConfirmPromote >= 0) this.mConfirmPromote++;
  }
  checkConfirmPormote(): boolean {
    return this.mConfirmPromote >= 3;
  }

  requestTalentInfo(username: string) {
    return this.mNetworkService.requestTalentInfo(username, FieldsBuilder.builder().add(UserManagerField.money).add(UserManagerField.po).build());
  }
  requestUserInfoAPI() {
    if (this.mNetworkService == undefined) return;
    this.mNetworkService.requestGetUserInfo().then(
      data => {
        this.mUser.onResponseUserInfo(data);
      }
    );
  }
  requestMessages() {
    this.mNetworkService.requestGetUserMessage('0-20').then(data => {
      if (data['status'] == 1) {
        this.mMessageManager.onResponseMessages(data['content']);
      }
    });
  }
  requestGiftInfo() {
    if (this.mGiftManager.hasGift()) return;
    this.mNetworkService.requestGetGiftList().then(
      data => {
        this.mGiftManager.onResponseListGifts(data);
      }
    )
  }
  requestHomeBanners() {
    if (this.mNetworkService == undefined) return;
    if (this.mBanners.length > 2) return;
    this.mNetworkService.requestAppBanners().then(
      data => {
        let content = data[ExtParamsKey.CONTENT];
        if (content != undefined) {
          this.mBanners = content;
        }
      }
    );
  }
  requestFollowRooms(){
    


  }
  requestHomeRoomLives() {
    if (this.mNetworkService == undefined) return;
    if (this.mRoomPageManager.mRooms.length == 0) {
      this.mListRoomUserHomeRangeFirst = 0;
      this.requestHotLiveStream('' + this.mListRoomUserHomeRangeFirst + '-' + this.mRangeGap, true);
    }
  }

  requestAllRooms() {
    for (let page of this.mRoomPageManager.mPages) {
      this.mNetworkService.requestListRoomStream('0-5', Chaos.DESC, RoomLiveField.onair_state,
        FieldsBuilder.builder()
          .addFirst(RoomLiveField.room_id)
          .add(RoomLiveField.room_name)
          .add(RoomLiveField.talent_name)
          .add(RoomLiveField.thumbnail_url)
          .add(RoomLiveField.hls_url)
          .add(RoomLiveField.rtsp_url)
          .add(RoomLiveField.room_state)
          .add(RoomLiveField.onair_state)
          .add(RoomLiveField.number_users)
          .add(RoomLiveField.create_time)
          .build(), page.id).then(
        data => {
          this.mRoomPageManager.onResponsePageLiveStream(page.id, data, true);
        }
        );
    }
  }


  requestLiveCategories() {
    if (this.mNetworkService == undefined) return;
    this.mNetworkService.requestCategories().then(
      data => {
        this.mRoomPageManager.onResponseRoomPageCategories(data, true);
      }
    );
  }

  requestLiveCategoriesWithRooms() {
    if (this.mNetworkService == undefined) return;
    this.mNetworkService.requestCategories().then(
      data => {
        this.mRoomPageManager.onResponseRoomPageCategories(data, true);
        this.requestRoomOnCategories();
      }
    );
  }
  requestRoomOnCategories() {
    if (this.mRoomPageManager.mPages.length == 0) {
      this.requestLiveCategoriesWithRooms();
      return;
    }
    if (this.mRoomPageManager.hasRoomCategory()) return;

    for (let page of this.mRoomPageManager.mPages) {
      this.mNetworkService.requestListRoomStream('0-10', Chaos.DESC, RoomLiveField.room_id,
        FieldsBuilder.builder()
          .addFirst(RoomLiveField.room_id)
          .add(RoomLiveField.room_name)
          .add(RoomLiveField.talent_name)
          .add(RoomLiveField.thumbnail_url)
          .add(RoomLiveField.hls_url)
          .add(RoomLiveField.rtsp_url)
          .add(RoomLiveField.rtmp_url)
          .add(RoomLiveField.room_state)
          .add(RoomLiveField.onair_state)
          .add(RoomLiveField.number_users)
          .add(RoomLiveField.create_time)
          .build(), page.id).then(
        data => {
          this.mRoomPageManager.onResponsePageLiveStream(page.id, data, true);
        }
        );
    }
  }
  requestRoomLiveInfo(room_id: string) {
    return this.mNetworkService.requestRoomInfo(room_id,
      FieldsBuilder.builder()
        .addFirst(RoomLiveField.room_id)
        .add(RoomLiveField.room_name)
        .add(RoomLiveField.talent_name)
        .add(RoomLiveField.thumbnail_url)
        .add(RoomLiveField.hls_url)
        .add(RoomLiveField.rtsp_url)
        .add(RoomLiveField.rtmp_url)
        .add(RoomLiveField.room_state)
        .add(RoomLiveField.onair_state)
        .add(RoomLiveField.number_users)
        .add(RoomLiveField.create_time)
        .build());
  }
  requestHotLiveStream(range: string, clearData: boolean) {
    this.mNetworkService.requestHotLiveStream(range, Chaos.DESC, RoomLiveField.onair_state,
      FieldsBuilder.builder()
        .addFirst(RoomLiveField.room_id)
        .add(RoomLiveField.room_name)
        .add(RoomLiveField.talent_name)
        .add(RoomLiveField.thumbnail_url)
        .add(RoomLiveField.hls_url)
        .add(RoomLiveField.rtsp_url)
        .add(RoomLiveField.rtmp_url)
        .add(RoomLiveField.room_state)
        .add(RoomLiveField.onair_state)
        .add(RoomLiveField.number_users)
        .add(RoomLiveField.create_time)
        .build()).then(
      data => {
        this.mListRoomUserHomeRangeFirst += data['content'].length;
        this.mRoomPageManager.onResponseHotLiveStream(data, clearData);
        //this.mRoomPageManager.onResponseRoomsLiveStream(this.mUserService,data, clearData);
      }
      );
  }

  public requestTopTalentRecieveGiftByYear() {
    this.mNetworkService.requestTopTalentRecieveGift("year").then(
      data => {
        if (data['status'] == 1) {
          this.mTopData.onTalentYearData(data['content']);
        }
      }
    );
  }

  public requestTopTalentSuggest() {
    return this.mNetworkService.requestTopTalentSuggest();
  }

  public setItemOnStorage(key: string, data) {
    NativeStorage.remove(key);
    NativeStorage.setItem(key, data);
  }
  public getItemOnStorage(key: string) {
    return NativeStorage.getItem(key);
  }
  public removeItemOnStorage(key: string) {
    return NativeStorage.remove(key);
  }


  public requestGetTalentInfo(talent_name: string) {
    return this.mNetworkService.requestTalentInfo(talent_name, FieldsBuilder.builder()
      .add(UserManagerField.money)
      .add(UserManagerField.level)
      .add(UserManagerField.po)
      .add(UserManagerField.phone)
      .add(UserManagerField.blast)
      .add(UserManagerField.namefield)
      .build());
  }



  onLoggedOut() {
    this.mTalentRoom.onLoggedOut();
    this.mUser.onLoggedOut();
    this.mUserService.onLoggedOut();
    if (this.mPomeloService != undefined) this.mPomeloService.onLoggedOut();
    this.enableConfirmPromote(false);
  }
}



