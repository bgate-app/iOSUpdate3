import { Component, ViewChild } from '@angular/core';
import { Events, NavController, NavParams, Platform, AlertController, ToastController, Slides, ModalController } from 'ionic-angular';
import { UserPreview, ChatSession, UserRole } from '../../providers/config';
import { Utils } from '../../providers/utils';
import { RoomLive, LiveStreamData, ChatSessionType, RoomLiveStatus, TalentTopData } from '../../providers/config';
import { DataService } from '../../providers/data-service';
import { ChatService } from '../../providers/chat-service';
import { Gift, UserSendGift } from '../../providers/gift-service';
import { SocialSharing, Keyboard } from 'ionic-native';
import { PomeloCmd, PomeloParamsKey, ResponseCode } from '../../providers/network-config';
import { PomeloState } from '../../providers/pomelo-service';

import { ScreenOrientation } from 'ionic-native';
import { NextStreamManager } from './next-stream';
import { EffectManager } from './heart-effect';
import { GiftEffectManager } from './gift-effects';

import { StreamPlugin } from '../../providers/stream-plugin';

import { TalentDetailPage } from '../talent-detail/talent-detail';
@Component({
    selector: 'page-live-stream',
    templateUrl: 'live-stream.html'
})
export class LiveStreamPage {
    @ViewChild('mySlider') slider: Slides;
    @ViewChild('chatInput') mChatInput;

    VIEW_NONE: number = 0;
    VIEW_SHARE: number = 1;
    VIEW_USER: number = 2;
    VIEW_CHAT: number = 3;
    VIEW_GIFT: number = 4;
    VIEW_USER_INFO: number = 5;
    VIEW_SETTING: number = 6;
    VIEW_TOP: number = 7;

    ROLE_USER: number = 0;
    ROLE_TALENT: number = 1;
    ROLE_ADMIN: number = 2;
    CHAT_TEXT: number = 0;
    CHAT_EMOTION: number = 1;
    STREAM_STATE_STREAMING: number = 0;
    STREAM_STATE_ENDED: number = 1;

    mLiveStreamData: LiveStreamData = new LiveStreamData();

    mSlidesGiftOptions = {
        pager: true
    };

    mSelectedGiftID = -1;

    viewcontrol = {
        user: UserRole.USER,
        type: this.VIEW_NONE,
        chat: this.CHAT_TEXT
    };

    mChatContent: string = "";

    mGiftEffectManager: GiftEffectManager = new GiftEffectManager();

    mEnableDisconnectEvent = false;

    mAnimationFrameID: number = -1;

    mEffectManager: EffectManager = new EffectManager();

    mKeyboardHeight = 0;

    mNextStreamManager: NextStreamManager = new NextStreamManager();

    mLoadingStream: boolean = true;

    mJoinRoomAfterLeaveRoom: boolean = false;

    mGiftWidth: string = "25vw";

    mEnableDebug: boolean = false;

    mVideo: HTMLVideoElement;

    constructor(
        public navCtrl: NavController,
        private mDataService: DataService,
        private platform: Platform,
        public chatService: ChatService,
        private alertController: AlertController,
        private navParams: NavParams,
        private toastCtrl: ToastController,
        private mStreamPlugin: StreamPlugin,
        private events: Events,
        private modalCtrl: ModalController) {
        this.mLiveStreamData.roomlive = this.navParams.get("room_live");
        if (this.mDataService.mKeyBoardHeight == 0) {
            this.mKeyboardHeight = screen.height / 3;
        } else {
            this.mKeyboardHeight = this.mDataService.mKeyBoardHeight;
        }

    }
    log(message: string) {
        if (this.mEnableDebug) {
            console.log("live-stream, " + message);
        }
    }
    // ========================= for self update ===================
    public scheduleUpdate() {
        let target = this;
        this.mAnimationFrameID = requestAnimationFrame(() => {
            target.onUpdate();
            target.scheduleUpdate();
        });
    }

    public unScheduleUpdate() {
        cancelAnimationFrame(this.mAnimationFrameID);
    }
    onUpdate() {
        this.mGiftEffectManager.onUpdate();
        if (this.mDataService.mPomeloService.mResponses.length > 0) {
            let response = this.mDataService.mPomeloService.mResponses.shift();
            this.onUpdateResponseQueue(response.route, response.params);
        }
        this.mEffectManager.update();
        this.mNextStreamManager.onUpdate();
    }

    public onLeft() {
        if (this.mDataService.isAndroid()) this.mStreamPlugin.stopVideoPlayer();
        this.mEffectManager.stopAll();
        this.unScheduleUpdate();
    }
    getStreamPoster() {
        return "url(" + this.mLiveStreamData.roomlive.poster + ")";
    }


    createInput() {
        this.mNextStreamManager.initInput();
        let ele = document.getElementById("live-stream-page-content");
        ele.addEventListener('touchmove', (event) => {
            if (this.viewcontrol.type == this.VIEW_NONE) {
                this.mNextStreamManager.onTouchMove(event.touches[0]);
                event.stopPropagation();
            }
        });
        ele.addEventListener('touchstart', (event) => {
            if (this.viewcontrol.type == this.VIEW_NONE) {
                this.mNextStreamManager.onTouchStart(event.touches[0]);
            }
        });
        ele.addEventListener('touchend', (event) => {
            if (this.viewcontrol.type == this.VIEW_NONE) {
                this.mNextStreamManager.onTouchEnded(event.touches[0]);
            }
        });
        let ele2 = document.getElementById("iChatContainer");
        ele2.addEventListener('touchstart', (event) => {
            event.stopPropagation();
        });
        ele2.addEventListener('touchmove', (event) => {
            event.stopPropagation();
        });
        ele2.addEventListener('touchend', (event) => {
            event.stopPropagation();
        });

        let ele3 = document.getElementById("userscontainer");
        ele3.addEventListener('touchstart', (event) => {
            event.stopPropagation();
        });
        ele3.addEventListener('touchmove', (event) => {
            event.stopPropagation();
        });
    }


    //=========================== for live stream========================
    /*Check xem đã khởi tạo view cho video hay chưa, nếu chưa thì khởi tạo*/
    initVideoPlayer() {
        if (this.mDataService.isAndroid()) {
            this.mStreamPlugin.initVideoPlayer();
        } else if (this.mDataService.isIOS()) {
            if (this.mVideo == undefined) {
                this.mVideo = <HTMLVideoElement>document.getElementById("mVideoElement");
                if (this.mVideo != undefined) {
                    this.mVideo.addEventListener("playing", (event) => {
                        this.onStreamPlayed();
                    });

                    this.mVideo.addEventListener("play", (event) => { });

                    this.mVideo.addEventListener("pause", (event) => {
                        this.mVideo.load();
                    });
                    this.mVideo.onloadeddata = () => { }
                }
            }
        }
    }


    stopVideo() {
        if (this.mDataService.isAndroid()) {
            this.mStreamPlugin.stopVideoPlayer();
        } else if (this.mDataService.isIOS()) {
            this.mVideo.src = "";
            this.mVideo.load();
        }
    }
    /**Call when start new room live */
    playVideoStream() {
        if (this.mDataService.isAndroid()) {
            this.mStreamPlugin.playVideo(this.mLiveStreamData.roomlive.rtmp_url).then(
                data => {
                    this.onStreamPlayed();
                },
                error => { }
            );
        } else if (this.mDataService.isIOS()) {
            if (this.mVideo != undefined) {
                this.mVideo.src = this.mLiveStreamData.roomlive.hls_url;
                this.mVideo.load();
                this.log("play video " + this.mLiveStreamData.roomlive.hls_url);
            } else {
                this.stopVideo();
            }
        }
    }
    /**Call when start new room live and room is not streaming*/
    playVideoStreamDefault() {
        if (this.mDataService.isAndroid()) {
            this.mStreamPlugin.playVideo(this.mLiveStreamData.roomlive.default_video).then(
                data => {
                    this.onStreamPlayed();
                },
                error => { }
            );
        } else if (this.mDataService.isIOS()) {
            if (this.mVideo != undefined) {
                this.mVideo.src = this.mLiveStreamData.roomlive.default_video;
                this.mVideo.load();
                this.log("play default video " + this.mLiveStreamData.roomlive.hls_url);

            } else {
                this.stopVideo();
            }
        }

    }



    reloadVideo() {
        if (this.mDataService.isAndroid()) {
            this.mStreamPlugin.reloadVideo();
        } else if (this.mDataService.isIOS()) {
            if (this.mVideo != undefined && this.mLiveStreamData.roomlive.status == RoomLiveStatus.ON_AIR) {
                this.mVideo.src = this.mLiveStreamData.roomlive.hls_url;
                this.mVideo.load();
            }
        }
    }
    resetNextStreamElement() {
        let nextStream = document.getElementById("next-stream");
        if (nextStream != undefined) {
            nextStream.style.top = "0px";
            nextStream.style.visibility = "hidden";
        }
        let neigbors = this.mDataService.mRoomPageManager.getNeighborStream(this.mLiveStreamData.roomlive);
        if (neigbors != undefined) {
            this.mNextStreamManager.setNextLive(neigbors.next);
            this.mNextStreamManager.setPreviousLive(neigbors.previous);
            this.mNextStreamManager.setNextRoomListener((room) => {
                this.startRoomLive(room);
            });
        }
    }
    isOnAir() {
        return this.mLiveStreamData.roomlive.status == RoomLiveStatus.ON_AIR;
    }
    checkOffAir() {
        if (this.mLiveStreamData.roomlive.status == RoomLiveStatus.OFF_AIR && !this.mToastShowing) {
            this.showToast("Kênh này hiện không trực tuyến!", 1000, "bottom");
        }
        return this.mLiveStreamData.roomlive.status == RoomLiveStatus.OFF_AIR;
    }
    startRoomLive(room: RoomLive) {
        this.mDataService.mPomeloService.clearResponses();
        this.doJoinRoomLive();
        this.mLoadingStream = true;
        this.mLiveStreamData.setRoomLive(room);
        this.mGiftEffectManager.onStartRoomLive();
        this.showVideoPoster(true);
        this.resetNextStreamElement();
        this.showBubbleHeart(false);
        this.requestUpdateTalentPoint();
        this.mDataService.addConfirmPromote();

        if (this.isOnAir()) {
            this.playVideoStream();
            this.showChat(true);
            setTimeout(() => {
                this.addSystemMessage("Live stream lành mạnh,khi nội dung live gồm hút thuốc, thô tục, sex, hở hang đều sẽ bị khóa tài khoản, nhân viên sẽ giám sát tuần tra 24/7! ");
            }, 1000);
        } else {
            this.showChat(false);
        }

    }

    doJoinRoomLive() {
        this.mEnableDisconnectEvent = false;
        this.mDataService.mPomeloService.checkConnectoConnector(this.mDataService.mUser.username, () => {
            this.mEnableDisconnectEvent = true;
            if (this.mDataService.mPomeloService.mPomeloState == PomeloState.ROOM_JOINED) {
                this.mJoinRoomAfterLeaveRoom = true;
                this.mDataService.mPomeloService.leave_room();
            } else {
                this.mDataService.mPomeloService.join_room(this.mLiveStreamData.roomlive.room_id, '');
            }
        }, () => {

        });
    }
    onStreamPlayed() {
        if (this.isOnAir()) {
            if (this.viewcontrol.type == this.VIEW_NONE) this.showBubbleHeart(true);
            this.mEffectManager.resume();
        } else {
            this.showToastBottom("Kênh này hiện không trực tuyến !", 2000);
        }
        this.mLoadingStream = false;
        if (this.mDataService.isAndroid()) this.showPageBackground(false);
        this.showVideoPoster(false);
    }

    requestUpdateTalentPoint() {
        this.mLiveStreamData.roomlive.talent.point = 0;
        this.mDataService.requestGetTalentInfo(this.mLiveStreamData.roomlive.talent.username).then(
            data => {
                if (data['status'] == 12) {
                    this.events.publish("network:expired");
                } else {
                    if (this.mLiveStreamData.roomlive.talent.username == data['name']) {

                        this.mLiveStreamData.roomlive.talent.onResponseTalentLiveStreamInfo(data);
                    }
                }
            },
        );
    }
    //================== add Events =================
    addEventListenerBack() {
        this.events.unsubscribe("user:back");
        this.events.subscribe("user:back", () => {
            this.onClickBack();
        });
    }
    addEventListenerKeyboard() {
        Keyboard.onKeyboardHide().subscribe(() => {
            this.onKeyboardHide();
        });
        window.addEventListener('native.keyboardshow', (event) => {
            this.onKeyboardShow(event);
        });
    }
    // =========================== Keyboard Events ==========================
    onKeyboardShow(e) {
        if (e != undefined && e.keyboardHeight != undefined) {
            this.mKeyboardHeight = e.keyboardHeight;
            if (this.mDataService.mKeyBoardHeight == 0) {
                this.mDataService.mKeyBoardHeight = this.mKeyboardHeight;
                setTimeout(() => { this.mDataService.setItemOnStorage("keyboardheight", this.mKeyboardHeight); }, 1000);
            }
        }

        let ele = document.getElementById("mStickerContainer");
        ele.style.height = this.mKeyboardHeight + "px";
        this.floatingChat(true);
    }

    onKeyboardHide() {
        if (this.viewcontrol.type == this.VIEW_CHAT && this.viewcontrol.chat == this.CHAT_TEXT) {
            this.viewcontrol.chat = this.CHAT_TEXT;
            this.onClickShowView(this.VIEW_NONE);
        }
    }

    // ====================== View Life cycle ================
    ionViewDidEnter() {
        this.initVideoPlayer();
        this.addEventListenerBack();
        this.addEventListenerKeyboard();
        this.mGiftEffectManager.onInit();
        this.startRoomLive(this.mLiveStreamData.roomlive);
        this.mDataService.requestGiftInfo();
        setTimeout(() => {
            this.createInput();
            this.mEffectManager.init();
        }, 1000);
        this.unScheduleUpdate();
        this.scheduleUpdate();
    }

    ionViewWillLeave() {
        if (this.mDataService.mPomeloService.mPomeloState != PomeloState.DISCONNECTED) {
            this.mDataService.mPomeloService.mPomeloState = PomeloState.LOGINED;
            this.mDataService.mPomeloService.leave_room();
        }
        this.onLeft();
        ScreenOrientation.unlockOrientation();
    }

    updateViewers(userview: number) {
        this.mLiveStreamData.roomlive.view = userview;
        let ele = <HTMLSpanElement>document.getElementById('span-view');
        if (ele == undefined) return;
        ele.innerHTML = Utils.nFormatter(this.mLiveStreamData.roomlive.view);
    }


    //=======================For Chat=========================================
    addSystemMessage(content: string) {
        let systemMessage = new ChatSession();
        systemMessage.content = content;
        systemMessage.type = ChatSessionType.SYSTEM;
        this.addChatSession(systemMessage);
    }

    addChatSession(chat: ChatSession) {
        setTimeout(() => {
            let ele = document.getElementById('iChatContainer');
            if (ele != undefined) {
                ele.scrollTop = ele.scrollHeight + ele.clientHeight;
            }
        }, 500);
        this.mLiveStreamData.chats.push(chat);
        if (this.mLiveStreamData.chats.length > 30) {
            this.mLiveStreamData.chats.shift();
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

    getStreamView() {
        return Utils.nFormatter(this.mLiveStreamData.roomlive.view);
    }


    showFooter(show) {
        let ele = document.getElementById('iFooter');
        if (ele == undefined) return;
        if (show) {
            if (ele.classList.contains("mFooterHide")) ele.classList.remove('mFooterHide');
        } else {
            if (!ele.classList.contains("mFooterHide")) ele.classList.add('mFooterHide');
        }
    }

    showViewGift(show) {
        if (show) {
            setTimeout(() => {
                let ele = document.getElementById('view-gift');
                if (ele != undefined) {
                    ele.classList.add('view-gift-show');
                }
            }, 100);
        } else {
            let ele = document.getElementById('view-gift');
            if (ele != undefined) {
                ele.classList.remove('view-gift-show');
            }
        }
    }

    showChat(show) {
        let ele = document.getElementById('iChatContainer');
        if (ele == undefined) return;
        ele.style.visibility = show ? 'visible' : 'hidden';
    }
    floatingChat(floating: boolean) {
        if (floating && !this.isPortraitMode()) return;
        let ele = document.getElementById('mContentContainer');
        if (ele == undefined) return;
        if (floating) {
            ele.style.transform = "translate3d(0, " + (-this.mKeyboardHeight) + "px, 0)";
            ele.style.webkitTransform = "translate3d(0, " + (-this.mKeyboardHeight) + "px, 0)";
        } else {
            ele.style.transform = "translate3d(0, 0, 0)";
            ele.style.webkitTransform = "translate3d(0, 0, 0)";
        }
    }
    showBubbleHeart(show: boolean) {
        let ele = document.getElementById("effect-views");
        if (ele != undefined) {
            ele.style.visibility = show ? "visible" : "hidden";
        }
    }
    onSlideChanged() {
        if (this.viewcontrol.type == this.VIEW_NONE)
            this.showBubbleHeart(this.slider.getActiveIndex() == 0);
    }


    onClickFollowHost() {
        this.enableFollowButton(false);
        this.mDataService.mNetworkService.requestUserFollow(this.mLiveStreamData.roomlive.talent.username).then(
            data => {
                if (data['status'] == ResponseCode.SUCCESS) {
                    this.mLiveStreamData.roomlive.talent.followed = true;
                    this.showToast("Bạn đã theo dõi " + this.mLiveStreamData.roomlive.talent.name + " thành công", 2000, "bottom");
                } else {
                    this.showToast(data['message'], 2000, 'bottom');
                }
            }, error => {
                this.showToast("Theo dõi thất bại.", 2000, 'bottom');
            }
        );
    }

    onClickCloseChat() {
        if (this.viewcontrol.type != this.VIEW_CHAT) return;
        Keyboard.close();
        this.viewcontrol.chat = this.CHAT_TEXT;
        this.onClickShowView(this.VIEW_NONE);
    }
    onClickChatControl(type) {
        this.viewcontrol.chat = type;
    }
    onClickEmotion(emotion) {
        this.mChatContent += (" " + emotion.name + " ");
    }
    onClickInputChat() {
        let ele = document.getElementById("mStickerContainer");
        ele.style.height = this.mKeyboardHeight + "px";
        this.viewcontrol.chat = this.CHAT_TEXT;
        Keyboard.show();
    }
    onClickSendChat() {
        if (/\S/.test(this.mChatContent)) {
            let chat = new ChatSession();
            chat.avatar = this.mDataService.mUser.avatar;
            chat.name = this.mDataService.mUser.name;
            chat.user_role = this.mDataService.mUser.role_id;
            chat.content = this.chatService.filter(this.mChatContent);
            this.addChatSession(chat);

            this.mDataService.mPomeloService.requestSendChat(this.mDataService.mUser.role_id, this.mDataService.mUser.avatar, this.mDataService.mUser.username,
                this.mChatContent, this.mDataService.mUser.name, 2, 1,
                this.mLiveStreamData.roomlive.room_id);
        }
        this.mChatContent = "";
        this.viewcontrol.chat = this.CHAT_TEXT;
        this.onClickShowView(this.VIEW_NONE);
    }
    onInputChatChange() {
        let chatInput = document.getElementById("mChatInput");
        if (chatInput == undefined || chatInput == null) return;
        this.mChatContent = chatInput.innerHTML;
    }
    isPortraitMode() {
        if (this.mDataService.isAndroid()) {
            return screen.height > screen.width;
        } else {
            return ScreenOrientation.orientation == "portrait" || ScreenOrientation.orientation == "portrait-primary" || ScreenOrientation.orientation == "portrait-secondary";
        }
    }
    reUpdateGiftWidth() {
        this.mGiftWidth = this.isPortraitMode() ? "25vw" : "12.5vw";
    }
    onClickShowView(view_type) {
        if (this.checkOffAir()) return;

        if (view_type == this.VIEW_SHARE) {
            SocialSharing.share(this.mLiveStreamData.roomlive.name, this.mLiveStreamData.roomlive.talent + " - Showtimes.vn", "", 'http://showtimes.vn/phong/' + this.mLiveStreamData.roomlive.room_id);
            return;
        }
        this.viewcontrol.type = view_type;
        if (view_type == this.VIEW_GIFT) {
            this.showChat(false);
            this.showFooter(false);
            this.showViewGift(true);
            this.showBubbleHeart(false);
            this.reUpdateGiftWidth();
        }

        if (view_type == this.VIEW_USER) {
            this.showChat(false);
            this.showFooter(false);
            this.showBubbleHeart(false);
        }
        if (view_type == this.VIEW_CHAT) {
            this.onClickShowViewChat();
            this.showBubbleHeart(false);
        }
        if (view_type == this.VIEW_SETTING) {
            Keyboard.close();
        }

        if (view_type == this.VIEW_TOP) {
            this.showFooter(false);
            this.mTopType = this.TOP_USER;
            this.onClickReloadTop();
        }
        if (view_type == this.VIEW_NONE) {
            this.showChat(true);
            this.showFooter(true);
            this.showViewGift(false);
            this.floatingChat(false);
            this.showBubbleHeart(true);
        }
    }
    onClickAddHeart() {
        this.mEffectManager.addHeart();
    }
    onClickLikeStream() {
        this.onClickShowView(this.VIEW_NONE);
        this.mDataService.mPomeloService.like();
    }
    onClickReloadStream() {
        this.onClickShowView(this.VIEW_NONE);
        this.reloadVideo();
    }
    onClickRotateScreen() {
        if (this.checkOffAir()) return;

        if (this.isPortraitMode()) {
            ScreenOrientation.lockOrientation('landscape');
        } else {
            ScreenOrientation.lockOrientation('portrait');
        }
        this.floatingChat(false);
        this.onClickShowView(this.VIEW_NONE);
    }
    onClickShowViewChat() {
        this.showFooter(false);
        this.floatingChat(true);
        this.mChatContent = "";
        this.mChatInput.setFocus();
        setTimeout(() => { this.mChatInput.setFocus(); }, 100);
    }
    onClickShowUserInfoOnChat(chatSession: ChatSession) {

    }
    onClickShowUserInfo(user: UserPreview) {
        this.mLiveStreamData.user = user;
        this.viewcontrol.type = this.VIEW_USER_INFO;
    }
    getSexIcon(sex) {
        return Utils.getSexIcon(sex);
    }

    onClickShowHostInfo() {
        if (this.checkOffAir()) return;
        this.mLiveStreamData.user = this.mLiveStreamData.roomlive.talent;
        this.viewcontrol.type = this.VIEW_USER_INFO;
    }

    onClickChangeViewUser(type) {
        this.viewcontrol.user = type;
    }

    onClickSendGift() {
        if (this.mDataService.mUser.money <= 0) {
            this.notifyNotEnoughMoney("Vui lòng nạp thêm tiền để thực hiện chức năng này");
            return;
        }
        if (this.mSelectedGiftID != 1) {
            this.mDataService.mPomeloService.send_gift(this.mSelectedGiftID, 1);
        }

    }
    showPageBackground(show) {
        let content = document.getElementById("live-stream-page-content");
        if (content != undefined) {
            content.style.backgroundColor = show ? "black" : "transparent";
        }
    }
    showVideoPoster(show) {
        let ele = document.getElementById("videoposter");
        if (ele != undefined) {
            ele.style.visibility = show ? "visible" : "hidden";
            if (show) ele.style.backgroundImage = this.getStreamPoster();
        }
    }
    onClickBack() {
        if (this.viewcontrol.type != this.VIEW_NONE) {
            this.onClickShowView(this.VIEW_NONE);
        } else {
            this.showVideoPoster(true);
            this.navCtrl.pop();
        }
    }
    onClickToggleLike() {
        if (!this.mLiveStreamData.is_liked)
            this.mDataService.mPomeloService.like();
        else
            this.mDataService.mPomeloService.unlike();
    }

    onClickSelectedGift(gift: Gift) {
        if (this.mSelectedGiftID == gift.id) {
            this.mSelectedGiftID = -1;
        } else {
            this.mSelectedGiftID = gift.id;
        }
    }

    notifyNotEnoughMoney(message) {
        let alert = this.alertController.create({
            title: "Opps !",
            subTitle: message,
            buttons: ['OK']
        });
        alert.present();
    }
    mToastShowing: boolean = false;
    showToast(message: string, duration: number, position?: string) {
        this.mToastShowing = true;
        let pos = position;
        if (position == undefined || position == null || position.length == 0) {
            pos = "top";
        }
        let toast = this.toastCtrl.create({
            message: message,
            duration: duration,
            position: pos
        });
        toast.present();
        toast.onDidDismiss(() => {
            this.mToastShowing = false;
        });
    }
    showToastBottom(message: string, duration: number) {
        this.mToastShowing = true;
        let toast = this.toastCtrl.create({
            message: message,
            duration: duration
        });
        toast.present();
        toast.onDidDismiss(() => {
            this.mToastShowing = false;
        });
    }

    onDisconnected() {
        this.mDataService.mPomeloService.mPomeloState = PomeloState.DISCONNECTED;
        this.mDataService.mNetworkService.checkNetwork().then(
            data => {
                this.log("Còn kết nối");
                let alert = this.alertController.create({
                    title: 'Oops !',
                    message: 'Tài khoản này đã đăng nhập ở một thiết bị khác!',
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
            },
            error => {
                this.log("Mất kết nối");
                let alert = this.alertController.create({
                    title: 'Oops !',
                    message: 'Mất kết nối, vui lòng kiểm tra kết nối mạng!',
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
            }
        );


    }
    onClickFollowTalent() {
        if (this.mLiveStreamData.user.role == 1) {
            this.mDataService.mNetworkService.requestUserFollow(this.mLiveStreamData.user.username).then(
                data => {
                    if (data['status'] == ResponseCode.SUCCESS || data['status'] == 14) {
                        if (this.mLiveStreamData.user.username == this.mLiveStreamData.roomlive.talent.username)
                            this.enableFollowButton(false);
                        this.mLiveStreamData.user.followed = true;
                    }
                }
            );
        }
    }
    onClickUser(user: UserPreview) {
        if (user.role == UserRole.TALENT) {
            this.onClickShowView(this.VIEW_NONE);
            setTimeout(() => {
                let modal = this.modalCtrl.create(TalentDetailPage, {
                    talent: user,
                    room_live: this.mLiveStreamData.roomlive
                });
                modal.present();
                modal.onDidDismiss(() => {
                    this.onModalTalentInfoDismiss();
                });
            }, 100);
        }
    }
    onModalTalentInfoDismiss() {
        setTimeout(() => {
            this.enableFollowButton(!this.mLiveStreamData.roomlive.talent.followed);
        }, 200);

    }
    onClickUnFollowTalent() {
        if (this.mLiveStreamData.user.role == 1) {
            this.mDataService.mNetworkService.requestUserUnFollow(this.mLiveStreamData.user.username).then(
                data => {
                    if (data['status'] == ResponseCode.SUCCESS) {
                        if (this.mLiveStreamData.user.username == this.mLiveStreamData.roomlive.talent.username) this.enableFollowButton(true);
                        this.mLiveStreamData.user.followed = false;
                    }
                }
            );
        }
    }

    enableFollowButton(enable: boolean) {
        let follow2 = document.getElementById("follow2");
        if (follow2 != undefined) {
            follow2.style.height = enable ? "46px" : "0px";
        }

        let element = document.getElementById("follow-button");
        if (element == undefined) return;
        if (enable) {
            element.style.width = "24px";
        } else {
            element.style.width = "0px";
        }
    }

    onUpdateResponseQueue(route: string, data: any) {
        this.log("cmd : " + route);
        if (route.localeCompare(PomeloCmd.IO_ERROR) == 0) {

        } else if (route.localeCompare(PomeloCmd.DISCONNECT) == 0) {
            this.onDisconnected();
        } else if (route.localeCompare(PomeloCmd.USER_INFO) == 0) {

        } else if (route.localeCompare(PomeloCmd.QUERY_USER_INFO) == 0) {

        }
        else if (route.localeCompare(PomeloCmd.LEAVE_ROOM) == 0) {
            this.mDataService.mPomeloService.mPomeloState = PomeloState.LOGINED;
            if (this.mJoinRoomAfterLeaveRoom) {
                this.mDataService.mPomeloService.join_room(this.mLiveStreamData.roomlive.room_id, "");
                this.mJoinRoomAfterLeaveRoom = false;
            }
        }
        else if (route.localeCompare(PomeloCmd.USER_LEAVE_ROOM) == 0) {
            if (data[PomeloParamsKey.SIZE_USERS] != undefined) {
                this.updateViewers(data[PomeloParamsKey.SIZE_USERS]);
            }
            this.mLiveStreamData.onUserLeaveRoom(data);
        }
        else if (route.localeCompare(PomeloCmd.LIST_USERS) == 0) {
            let size_users = data[PomeloParamsKey.SIZE_USERS];
            let size_users_spec = data[PomeloParamsKey.SIZE_SPEC];
            this.updateViewers(size_users + size_users_spec);

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
        else if (route.localeCompare(PomeloCmd.ROOM_INFO) == 0) {
            this.mLiveStreamData.roomlive.onResponseRoomInfo(data);
            if (!this.isOnAir()) {
                this.playVideoStreamDefault();
                this.showToast("Kênh này hiện không trực tuyến", 2000);
            }
        }
        else if (route.localeCompare(PomeloCmd.JOIN_ROOM) == 0) {
            this.mDataService.mPomeloService.mPomeloState = PomeloState.ROOM_JOINED;
            this.mDataService.mPomeloService.room_info();

        }
        else if (route.localeCompare(PomeloCmd.USER_JOIN_ROOM) == 0) {
            if (data[PomeloParamsKey.SIZE_USERS] != undefined) {
                this.updateViewers(data[PomeloParamsKey.SIZE_USERS]);
            }
            this.mLiveStreamData.onUserJoinRoom(data);
        }
        else if (route.localeCompare(PomeloCmd.SEND_GIFT) == 0) {
            if (data[PomeloParamsKey.SUCCESS]) {
                let giftRequest: UserSendGift = new UserSendGift();
                giftRequest.user.name = this.mDataService.mUser.name;
                giftRequest.user.avatar = this.mDataService.mUser.avatar;
                giftRequest.gift = this.mDataService.mGiftManager.getGiftByID(this.mSelectedGiftID);
                this.mGiftEffectManager.addGiftRequest(giftRequest);
                this.mDataService.mUser.money = data[PomeloParamsKey.MONEY];
                this.addChatSessionOnGift(giftRequest);
                this.mLiveStreamData.roomlive.talent.point = data['talent']['point'];
            }
            else {
                this.showToast(data[PomeloParamsKey.MESSAGE], 2000);
            }
        }
        else if (route.localeCompare(PomeloCmd.USER_SEND_GIFT) == 0) {
            let giftRequest: UserSendGift = new UserSendGift();
            giftRequest.user.name = data[PomeloParamsKey.TITLE];
            giftRequest.user.avatar = data[PomeloParamsKey.AVATAR];
            giftRequest.gift = this.mDataService.mGiftManager.getGiftByID(data[PomeloParamsKey.GIFT_ID]);
            this.mGiftEffectManager.addGiftRequest(giftRequest);
            this.addChatSessionOnGift(giftRequest);
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
                this.addChatSession(chat);
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
                this.addChatSession(chat);
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
            // {"value":true,"value_like":false,"value_share":false,"total_like":0,"total_share":0}
            if (data.value == false) {
                this.enableFollowButton(true);
                this.mLiveStreamData.roomlive.talent.followed = false;
            } else {
                this.enableFollowButton(false);
                this.mLiveStreamData.roomlive.talent.followed = true;
            }
            if (data.value_like == true) {
                this.mLiveStreamData.is_liked = true;
            } else {
                this.mLiveStreamData.is_liked = false;
            }
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
            if (data[PomeloParamsKey.SUCCESS]) {
                this.mLiveStreamData.is_liked = true;
                this.addSystemMessage("Bạn đã thích livestream của <strong>" + this.mLiveStreamData.roomlive.talent.name) + "</strong>";
            }
            else this.showToast(data[PomeloParamsKey.MESSAGE], 2000);
        }
        else if (route.localeCompare(PomeloCmd.UNLIKE) == 0) {
            if (data[PomeloParamsKey.SUCCESS]) {
                this.mLiveStreamData.is_liked = false;
            }
            else this.showToast(data[PomeloParamsKey.MESSAGE], 2000);
        }
        else if (route.localeCompare(PomeloCmd.SHARE) == 0) {

        }
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


