import { Component, ViewChild } from '@angular/core';
import { NavController, AlertController, Events } from 'ionic-angular';
import { StreamPlugin } from '../../providers/stream-plugin';
import { DataService } from '../../providers/data-service';
import { Utils } from '../../providers/utils';
import { ChatService } from '../../providers/chat-service';
import { RoomLive, UserRole, Default, LiveStreamData, ChatSession, ChatSessionType, UserPreview, TalentTopData } from '../../providers/config';
import { ShowData } from './show-data';
import { GiftEffectManager } from '../live-stream/gift-effects';
import { UserSendGift, Gift } from '../../providers/gift-service';
import { PomeloState } from '../../providers/pomelo-service';
import { PomeloCmd, PomeloParamsKey, ResponseCode } from '../../providers/network-config';


import { Keyboard } from 'ionic-native';

export class ChatModule {
  mChatContainer: HTMLElement;
  chats: Array<ChatSession> = [];
  mKeyboardHeight: number = 0;
  constructor() {

  }
  onUpdate() {

  }
  reset() {
    this.chats = [];
  }
  onStartRoomLive() {
    this.reset();
  }

  initElements(id: string) {
    this.mChatContainer = document.getElementById(id);
  }
  floatingChat(floating: boolean) {
    if (floating && screen.width > screen.height) return;
    let ele = document.getElementById("mContentContainer");
    if (ele == undefined) return;
    if (floating) {
      ele.style.bottom = this.mKeyboardHeight + screen.width * 0.22 + "px";
    } else {
      ele.style.bottom = '80px';
    }
  }

  setKeyboardHeight(height) {
    this.mKeyboardHeight = height;
  }

  addSystemMessage(content: string) {
    let systemMessage = new ChatSession();
    systemMessage.content = content;
    systemMessage.type = ChatSessionType.SYSTEM;
    this.addChatSession(systemMessage);
  }

  addChatSession(chat: ChatSession) {
    setTimeout(() => {
      this.mChatContainer.scrollTop = this.mChatContainer.scrollHeight + this.mChatContainer.clientHeight;
    }, 500);
    this.chats.push(chat);
    while (this.chats.length > 20) {
      this.chats.shift();
    }
  }

  addChatSessionOnGift(userSendGift: UserSendGift) {
    let chatSession = new ChatSession();
    chatSession.avatar = userSendGift.user.avatar;
    chatSession.name = userSendGift.user.name;
    chatSession.user_role = userSendGift.user.role;
    chatSession.type = ChatSessionType.GIFT_REQUEST;
    chatSession.content = "Gửi tặng " + this.getGiftOnChatHTML(userSendGift.gift) + " x " + userSendGift.count;
    this.addChatSession(chatSession);
  }
  getGiftOnChatHTML(gift: Gift) {
    return "<img src=" + gift.avatar + " class=\"gift-on-chat\">";
  }
}


export enum StreamState {
  NONE = 0,
  PREVIEWING,
  STREAMING,
  PAUSED,
  STOPPED
}

export class StreamModule {

  mState: StreamState = StreamState.NONE;
  constructor(private mStreamPlugin: StreamPlugin) { }
  startCameraPreview(rtmp: string) {
    if (this.mState != StreamState.PREVIEWING) {
      this.mStreamPlugin.startCameraPreview({
        rtmp: rtmp,
        camera_direction: 'front'
      });
      this.setState(StreamState.PREVIEWING);
    }
  }

  startBroadcast() {
    if (this.mState != StreamState.STREAMING) {
      this.mStreamPlugin.startBroadcast();
      this.setState(StreamState.STREAMING);
    }
  }
  stopBroadcast() {
    this.mStreamPlugin.stopBroadcast();
    this.setState(StreamState.STOPPED);
  }
  switchCamera() {
    this.mStreamPlugin.switchCamera();
  }
  setState(newState: StreamState) {
    this.mState = newState;
  }
}

@Component({
  selector: 'page-talent-stream',
  templateUrl: 'talent-stream.html'
})

export class TalentStreamPage {
  @ViewChild('chatInput') mChatInput;

  NONE: number = 0;
  PREVIEWING: number = 1;
  STREAMING: number = 2;
  PAUSED: number = 3;
  STOPPED: number = 4;

  VIEW_CHAT: number = 1;
  VIEW_SETTING: number = 2;
  VIEW_TOP: number = 3;


  CHAT_TEXT: number = 1;
  CHAT_EMOTION: number = 2;

  mControls = {
    mView: this.NONE,
    mChat: this.CHAT_TEXT
  };

  mAnimationFrameId: number;
  mStreamModule: StreamModule;
  mChatModule: ChatModule;
  mShowData: ShowData;
  mGiftManager: GiftEffectManager;

  mLiveStreamData: LiveStreamData;
  mChatContainer: HTMLElement;
  mChatContent: string = "";

  mJoinRoomAfterLeaveRoom: boolean = false;


  constructor(
    public navCtrl: NavController,
    private alertCtrl: AlertController,
    private events: Events,
    private mStreamPlugin: StreamPlugin,
    private mDataService: DataService,
    private chatService: ChatService) {
    this.mStreamModule = new StreamModule(this.mStreamPlugin);
    this.mShowData = new ShowData();
    this.mLiveStreamData = new LiveStreamData();
    this.mChatModule = new ChatModule();
    this.mGiftManager = new GiftEffectManager();
  }
  unScheduleUpdate() {
    cancelAnimationFrame(this.mAnimationFrameId);
  }

  scheduleUpdate() {
    this.onUpdate();
    this.mAnimationFrameId = requestAnimationFrame(() => {
      this.scheduleUpdate();
    });
  }

  onUpdate() {
    if (this.mDataService.mPomeloService.mResponses.length > 0) {
      let response = this.mDataService.mPomeloService.mResponses.shift();
      this.onUpdateResponseQueue(response.route, response.params);
    }

    this.mChatModule.onUpdate();
    this.mGiftManager.onUpdate();
  }


  ionViewDidEnter() {
    // this.mDataService.mKeyBoardHeight = screen.height / 3;// fix me
    // console.log(this.mDataService.mKeyBoardHeight);
    this.mChatModule.setKeyboardHeight(this.mDataService.mKeyBoardHeight);

    this.events.unsubscribe("user:back");
    this.events.subscribe("user:back", () => {
      this.onClickBack();
    });


    this.mGiftManager.onInit();

    this.mChatModule.initElements("iChatContainer");

    let input = document.getElementById("mInputText");
    if (input != undefined) input.focus();


    this.scheduleUpdate();

    this.mStreamModule.startCameraPreview(this.mDataService.mTalentRoom.mRoom.rtmp_url);

    this.startRoomLive(this.mDataService.mTalentRoom.mRoom);


    // this.enableViewChat(true);

    if (this.mDataService.mKeyBoardHeight == 0) {
      window.addEventListener('native.keyboardshow', (event) => {
        this.onKeyboardShow(event);
      });
    }

    Keyboard.onKeyboardHide().subscribe(() => {
      this.onKeyboardHide();
    });
  }
  onKeyboardHide() {
    if (this.mControls.mView == this.VIEW_CHAT && this.mControls.mChat == this.CHAT_TEXT) {
      this.mControls.mChat = this.CHAT_TEXT;
      this.onClickShowView(this.NONE);
    }
  }

  onKeyboardShow(e) {
    if (e != undefined && e.keyboardHeight != undefined) {
      if (this.mDataService.mKeyBoardHeight == 0) {
        this.mChatModule.setKeyboardHeight(e.keyboardHeight);
        this.mDataService.mKeyBoardHeight = e.keyboardHeight;
        this.mChatModule.floatingChat(true);
        let ele = document.getElementById("mStickerContainer");
        if (ele != undefined) {
          ele.style.height = this.mDataService.mKeyBoardHeight + "px";
        }
        setTimeout(() => { this.mDataService.setItemOnStorage("keyboardheight", this.mDataService.mKeyBoardHeight); }, 1000);

      }
    }
  }

  enableViewChat(enable) {
    let ele = document.getElementById("mStickerContainer");
    if (ele != undefined) {
      ele.style.height = enable ? (this.mDataService.mKeyBoardHeight + "px") : "0px";
    }
  }


  startRoomLive(room: RoomLive) {
    this.mGiftManager.onStartRoomLive();
    this.mChatModule.onStartRoomLive();

    this.mLiveStreamData.reset();
    this.mLiveStreamData.roomlive = room;

    {
      setTimeout(() => {
        this.enableBackground(false);
      }, 500);
      this.checkTalentRoomInfo();
    }

    setTimeout(() => {
      this.mChatModule.addSystemMessage("Live stream lành mạnh,khi nội dung live gồm hút thuốc, thô tục, sex, hở hang đều sẽ bị khóa tài khoản, nhân viên sẽ giám sát tuần tra 24/7! ");
    }, 1000);

    /**Kiểm tra nếu đã join room nào rồi thì leave room*/
    this.tryJoinRoomLive();
  }
  enableBackground(enable: boolean) {
    let content = document.getElementById("streamContent");
    content.style.background = enable ? "" : "transparent";
  }
  tryJoinRoomLive() {
    console.log("try join room ");

    this.mDataService.mPomeloService.checkConnectoConnector(this.mDataService.mUser.username, () => {
      if (this.mDataService.mPomeloService.mPomeloState == PomeloState.ROOM_JOINED) {
        this.mJoinRoomAfterLeaveRoom = true;
        this.mDataService.mPomeloService.leave_room();
        console.log(" request leave room to join room");

      } else {
        this.mDataService.mPomeloService.join_room(this.mLiveStreamData.roomlive.room_id, '');
        console.log("request join room " + this.mDataService.mPomeloService.mPomeloState + " " + this.mLiveStreamData.roomlive.room_id);
      }
    }, () => {
      console.log("cannot check connector");
    });
  }


  checkTalentRoomInfo() {
    if (this.mDataService.mUser.role_id != UserRole.TALENT) return;
    if (this.mDataService.mTalentRoom.mRoom.room_id == Default.ROOM_ID) {
      this.mDataService.mNetworkService.requestTalentInfo(this.mDataService.mUser.username, "").then(
        data => {
          if (data['status'] == ResponseCode.ACCESSKEY_EXPIRED) {
            this.events.publish("network:expired");
          } else if (data['status'] == ResponseCode.SUCCESS) {
            this.onResponseTalentInfo(data);
          }
        },
        error => { }
      );
    }
  }

  onResponseTalentInfo(data) {
    if (data.room_info != undefined) {
      if (data.room_info.length > 0) {
        let room = data.room_info[0];
        this.mDataService.mTalentRoom.onResponseTalentRoom(this.mDataService.mUser, room);
        this.mDataService.requestRoomLiveInfo(this.mDataService.mTalentRoom.mRoom.room_id).then(
          data => {
            if (data['status'] == ResponseCode.ACCESSKEY_EXPIRED) {
              this.events.publish("network:expired");
            } else if (data['status'] == ResponseCode.SUCCESS) {
              this.mDataService.mTalentRoom.mRoom.onResponseTalentRoomInfo(data);
            }
          }
        );
      }
    }
  }


  tryLeaveRoom() {
    if (this.mDataService.mPomeloService.mPomeloState != PomeloState.DISCONNECTED) {
      this.mDataService.mPomeloService.mPomeloState = PomeloState.LOGINED;
      this.mDataService.mPomeloService.leave_room();
    }

  }

  ionViewDidLeave() {
    this.unScheduleUpdate();
    this.tryLeaveRoom();
    this.mStreamModule.stopBroadcast();
  }

  onClickSwitchCamera() {

  }

  onClickStartStream() {
    this.mStreamModule.startBroadcast();
  }
  dialog_showing: boolean = false;
  showConfirmStopStreaming() {
    if (!this.dialog_showing) {
      let confim = this.alertCtrl.create({
        title: "Kết thúc live stream?",
        buttons: [
          {
            text: 'Cancel'
          }, {
            text: 'Ok',
            handler: () => {

              this.stopBroadcast();
              this.tryLeaveRoom();
              this.enableBackground(true);
            }
          }
        ]
      });
      confim.present();
      confim.onDidDismiss(() => {
        this.dialog_showing = false;
      });
      this.dialog_showing = true;

    }

  }

  stopBroadcast() {
    this.mStreamModule.stopBroadcast();
  }
  onClickBack() {
    if (this.mStreamModule.mState != StreamState.STREAMING) {
      this.navCtrl.pop();
    } else {
      this.showConfirmStopStreaming();
    }
  }

  onClickSwapCamera() {
    this.mStreamModule.switchCamera();
  }
  onClickUsers() {

  }

  onClickShowView(type) {
    this.mControls.mView = type;
    if (type == this.VIEW_CHAT) {
      this.mControls.mChat = this.CHAT_TEXT;

      let ele = document.getElementById("mStickerContainer");
      if (ele != undefined) {
        ele.style.height = this.mDataService.mKeyBoardHeight + "px";
      }

      setTimeout(() => {
        this.mChatInput.setFocus();
        this.mChatModule.floatingChat(true);
      }, 100);
    }

    if (type == this.NONE) {
      this.mChatModule.floatingChat(false);
    }

    if (type == this.VIEW_TOP) {
      this.onClickReloadTop();
    }
  }
  onClickChatControl(type) {
    this.mControls.mChat = type;
  }

  onClickEmotion(emotion) {
    this.mChatContent += " " + emotion.name + " ";
  }

  onClickSendChat() {
    if (/\S/.test(this.mChatContent)) {
      let chat = new ChatSession();
      chat.avatar = this.mDataService.mUser.avatar;
      chat.name = this.mDataService.mUser.name;
      chat.user_role = this.mDataService.mUser.role_id;
      chat.content = this.chatService.filter(this.mChatContent);
      this.mChatModule.addChatSession(chat);


      this.mDataService.mPomeloService.requestSendChat(this.mDataService.mUser.role_id, this.mDataService.mUser.avatar, this.mDataService.mUser.username,
        this.mChatContent, this.mDataService.mUser.name, 2, 1,
        this.mLiveStreamData.roomlive.room_id);
    }

    this.mChatContent = "";
    this.onClickShowView(this.NONE);
  }


  onUpdateResponseQueue(route: string, data: any) {

    if (route.localeCompare(PomeloCmd.DISCONNECT) == 0) {
      this.onDisconnected();
    }
    else if (route.localeCompare(PomeloCmd.QUERY_USER_INFO) == 0) {
    }
    else if (route.localeCompare(PomeloCmd.LEAVE_ROOM) == 0) {
      console.log("LEFT ROOM");
      this.mDataService.mPomeloService.mPomeloState = PomeloState.LOGINED;
      if (this.mJoinRoomAfterLeaveRoom) {
        this.mDataService.mPomeloService.join_room(this.mLiveStreamData.roomlive.room_id, "");
        this.mJoinRoomAfterLeaveRoom = false;
      }
    }
    else if (route.localeCompare(PomeloCmd.USER_LEAVE_ROOM) == 0) {
      if (data[PomeloParamsKey.SIZE_USERS] != undefined) {
        this.updateViewElement(data[PomeloParamsKey.SIZE_USERS]);
      }
      this.mLiveStreamData.onUserLeaveRoom(data);
    }
    else if (route.localeCompare(PomeloCmd.LIST_USERS) == 0) {
      let size_users = data[PomeloParamsKey.SIZE_USERS];
      let size_users_spec = data[PomeloParamsKey.SIZE_SPEC];
      this.updateViewElement(size_users + size_users_spec);

      for (let user of data[PomeloParamsKey.USERS]) {
        let userobject = UserPreview.createUser();
        userobject.onResponseListUsersRoomLive(user);
        this.mLiveStreamData.users.push(userobject);
        this.mLiveStreamData.onRoomUser(userobject);
      }
      for (let user of data[PomeloParamsKey.ADMIN]) {
        let userobject = UserPreview.createUser();
        userobject.onResponseListUsersRoomLive(user);
        this.mLiveStreamData.users.push(userobject);
      }

      this.mLiveStreamData.talents.push(this.mLiveStreamData.roomlive.talent);
    }
    else if (route.localeCompare(PomeloCmd.LIST_GIFTS) == 0) {

    }
    else if (route.localeCompare(PomeloCmd.JOIN_ROOM) == 0) {
      console.log("JOINED ROOM");

      this.mDataService.mPomeloService.mPomeloState = PomeloState.ROOM_JOINED;
    }
    else if (route.localeCompare(PomeloCmd.USER_JOIN_ROOM) == 0) {
      if (data[PomeloParamsKey.SIZE_USERS] != undefined) {
        this.updateViewElement(data[PomeloParamsKey.SIZE_USERS]);
      }
      this.mLiveStreamData.onUserJoinRoom(data);
    }
    else if (route.localeCompare(PomeloCmd.SEND_GIFT) == 0) {

    }
    else if (route.localeCompare(PomeloCmd.USER_SEND_GIFT) == 0) {
      let giftRequest: UserSendGift = new UserSendGift();
      giftRequest.user.name = data[PomeloParamsKey.TITLE];
      giftRequest.user.avatar = data[PomeloParamsKey.AVATAR];
      giftRequest.gift = this.mDataService.mGiftManager.getGiftByID(data[PomeloParamsKey.GIFT_ID]);
      this.mGiftManager.addGiftRequest(giftRequest);
      this.mChatModule.addChatSessionOnGift(giftRequest);
      this.mLiveStreamData.roomlive.talent.point = data['talent']['point'];
    }
    else if (route.localeCompare(PomeloCmd.RECEIVE_GIFT) == 0) {

    }
    else if (route.localeCompare('onChat') == 0) {
      if (data[PomeloParamsKey.USERID] != this.mDataService.mUser.username) {
        let chat = new ChatSession();
        if (data[PomeloParamsKey.EXTRAS] != undefined) {
          chat.avatar = data[PomeloParamsKey.EXTRAS][PomeloParamsKey.AVATAR];
          chat.user_role = data[PomeloParamsKey.EXTRAS][PomeloParamsKey.ROLE_ID];
        }
        chat.name = data[PomeloParamsKey.FROM];
        chat.content = this.chatService.filter(data[PomeloParamsKey.CONTENT]);
        this.mChatModule.addChatSession(chat);


      }
    }
    else if (route.localeCompare(PomeloCmd.HISTORY_CHAT) == 0) {
      for (let hisChat of data[PomeloParamsKey.ARRAY]) {
        let chat = new ChatSession();
        if (hisChat[PomeloParamsKey.EXTRAS] != undefined) {
          chat.avatar = hisChat[PomeloParamsKey.EXTRAS][PomeloParamsKey.AVATAR];
          chat.user_role = hisChat[PomeloParamsKey.EXTRAS][PomeloParamsKey.ROLE_ID];
        }
        chat.name = hisChat[PomeloParamsKey.FROM];
        chat.content = this.chatService.filter(hisChat[PomeloParamsKey.CONTENT]);
        this.mChatModule.addChatSession(chat);
      }
    }
    else if (route.localeCompare(PomeloCmd.FOLLOW) == 0) {

    }
    else if (route.localeCompare(PomeloCmd.UNFOLLOW) == 0) {

    }
    else if (route.localeCompare(PomeloCmd.BAN_NICK) == 0) {

    }
    else if (route.localeCompare(PomeloCmd.BANNED) == 0) {

    }
    else if (route.localeCompare(PomeloCmd.IS_FAN) == 0) {

    }
    else if (route.localeCompare(PomeloCmd.GRANT_ADMIN) == 0) {

    }
    else if (route.localeCompare(PomeloCmd.ADMIN_GRANTED) == 0) {

    }
    else if (route.localeCompare(PomeloCmd.UNGRANT_ADMIN) == 0) {

    }
    else if (route.localeCompare(PomeloCmd.ADMIN_UNGRANTED) == 0) {

    }
    else if (route.localeCompare(PomeloCmd.CHANGE_ONAIR_STATE) == 0) {

    }
    else if (route.localeCompare(PomeloCmd.CHANGE_ROOM_STATE) == 0) {

    }
    else if (route.localeCompare(PomeloCmd.LIKE) == 0) {

    }
    else if (route.localeCompare(PomeloCmd.UNLIKE) == 0) {

    }
    else if (route.localeCompare(PomeloCmd.SHARE) == 0) {

    }
  }


  mShowAlertConnected: boolean = false;
  onDisconnected() {
    if (this.mShowAlertConnected) return;
    this.mShowAlertConnected = true;
    this.mDataService.mPomeloService.mPomeloState = PomeloState.DISCONNECTED;
    let alert = this.alertCtrl.create({
      title: 'Oops !',
      message: 'Mất kết nối tới phòng, vui lòng thử lại sau !',
      buttons: [
        {
          text: 'OK',
          handler: () => {
            this.onClickBack();
          }
        }
      ]
    });
    alert.present();
    alert.onDidDismiss(() => {
      this.mShowAlertConnected = false;
    });
  }

  updateViewElement(userview: number) {
    this.mLiveStreamData.roomlive.view = userview;
    let ele = <HTMLSpanElement>document.getElementById('span-view');
    if (ele == undefined) return;
    ele.innerHTML = Utils.nFormatter(this.mLiveStreamData.roomlive.view);
  }


  // =============================== for top =======================================

  TOP_FAN: number = 1;
  TOP_USER: number = 0;
  mTalentTopData: TalentTopData = new TalentTopData();
  filted_users: Array<UserPreview> = [];
  mTopType = this.TOP_USER;
  mLoadingTop: boolean = false;


  onClickShowTopView(type) {
    this.mTopType = type;
    this.onClickReloadTop();
  }
  getLevelColor(level: number) {
    return Utils.getLevelColor(level);
  }

  private requestReloadTop() {
    let type = this.mTopType;
    this.mDataService.mNetworkService.requestTalentTop(this.mLiveStreamData.roomlive.talent.username, type, 20).then(
      data => {
        if (data['status'] == ResponseCode.SUCCESS) {
          this.onReloadTopDone(data['content'], type);
        }
      },
      error => {
        this.onReloadTopError();
      }
    );
  }

  onReloadTopError() {
    this.mLoadingTop = false;
  }
  onReloadTopDone(data, type) {
    this.filted_users = [];
    if (type == this.TOP_FAN) {
      this.mTalentTopData.onTopFan(data);
      this.filted_users = this.mTalentTopData.fans;
    } else if (type == this.TOP_USER) {
      this.mTalentTopData.onTopUser(data);
      this.filted_users = this.mTalentTopData.users;
    }
    this.mLoadingTop = false;
  }
  onClickReloadTop() {
    this.mLoadingTop = true;
    this.requestReloadTop();
  }


  // ======================================================================

}
