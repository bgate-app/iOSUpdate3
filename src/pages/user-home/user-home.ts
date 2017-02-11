import { Component, ViewChild } from '@angular/core';
import { NavController, Refresher, Content, ToastController, Events, AlertController, Platform } from 'ionic-angular';
import { UserInfoPage } from '../user-info/user-info';
import { UserStreamPage } from '../user-stream/user-stream';
import { TalentStreamPage } from '../talent-stream/talent-stream';
import { LoginPage } from '../login/login';

import { TopPage } from '../top/top';
import { StreamCategoryPage } from '../stream-category/stream-category';
import { SuggestTalentPage } from '../suggest-talent/suggest-talent';
import { TalentDetailPage } from '../talent-detail/talent-detail';

import { StreamPlugin } from '../../providers/stream-plugin';
import { AiaStream } from '../../providers/aia-stream';
import { PomeloState } from '../../providers/pomelo-service';

import { RoomLive, RoomPage, RefreshState, LoadMoreState, UserPreview, UserRole, Default } from '../../providers/config';
import { DataService } from '../../providers/data-service';
import { LiveStreamPage } from '../live-stream/live-stream';
import { RoomLiveField, Chaos, FieldsBuilder, PomeloCmd, ResponseCode, UserManagerField, NetworkConfig } from '../../providers/network-config';


@Component({
    selector: 'page-user-home',
    templateUrl: 'user-home.html'
})
export class UserHomePage {
    @ViewChild(Content) content: Content;
    VIEW_LOADING: number = -1;
    VIEW_HOME: number = 0;
    VIEW_STREAM: number = 1;
    VIEW_EXPLORE: number = 2;
    VIEW_NOTIFY: number = 3;
    VIEW_USER_INFO: number = 4;
    viewcontrol = {
        type: this.VIEW_LOADING
    };
    mRefresher: Refresher;
    mRefreshState: number = RefreshState.NONE;
    mLoadMoreState: number = LoadMoreState.NONE;
    slide_banner_options = {
        loop: true,
        autoplay: 3000
    };
    mSearchQuery: string = '';


    mRefrestStartTime = 0;
    mEnableExpired: boolean = true;
    mAnimationFrameID: number = -1;
    mShowToastExit = false;

    mHasNotify: boolean = true;
    mEnableDisconnectEvent = false;

    mLastScrollTop: number = 0;
    mScrollElement: HTMLElement;
    mEnableDebug: boolean = false;
    constructor(private mAiaStream : AiaStream,private mStreamPlugin: StreamPlugin, private platform: Platform, private alertController: AlertController, private events: Events, public navCtrl: NavController, public mDataService: DataService, private toastCtrl: ToastController) {
        this.platform.ready().then(() => {
            this.platform.registerBackButtonAction(() => {
                this.events.publish("user:back");
            }, 0);
        });
    }
    log(message: string) {
        if (this.mEnableDebug) {
            console.log("user-home, " + message);
        }
    }

    addEventListenerNetworkExpired() {
        this.events.unsubscribe("network:expired");
        this.events.subscribe("network:expired", () => {
            this.onAccessKeyExpired();
        });
        this.mEnableExpired = true;
    }
    addEventListenerBack() {
        this.events.unsubscribe("user:back");
        this.events.subscribe("user:back", () => {
            if (this.mShowPopupConfirm) {
                this.onClickHidePromotePopup();
            } else if (this.mShowNotify) {
                this.onClickShowNotify(false);
            } else {
                this.onClickBack();
            }
        });
    }
    checkPopupPromote() {
        let popup = document.getElementById("popup_promote");
        if (popup != undefined) {
            popup.style.visibility = this.mDataService.checkConfirmPormote() ? "visible" : 'hidden';
            if (this.mDataService.checkConfirmPormote()) {
                this.doRequestTalents();
                this.mShowPopupConfirm = true;
            }
        }
    }
    ionViewDidEnter() {
        this.mHasNotify = this.mDataService.checkNotify();
        this.addEventListenerNetworkExpired();
        this.addEventListenerBack();
        setTimeout(() => {
            if (this.viewcontrol.type == this.VIEW_LOADING) {
                this.viewcontrol.type = this.VIEW_HOME;
            }
            this.mEnableDisconnectEvent = false;
            this.mDataService.mPomeloService.checkConnectoConnector(this.mDataService.mUser.username, () => {
                this.mEnableDisconnectEvent = true;
            }, () => { });
            if (this.mStreamPlugin.isAvailable()) this.mStreamPlugin.initAll();
        }, 500);
        this.requestUserInfo();
        this.mDataService.requestMessages();
        this.mDataService.requestHomeBanners();
        this.mDataService.requestHomeRoomLives();
        this.start();
        this.checkPopupPromote();
    }

    onClickBack() {
        if (this.mShowToastExit == false) {
            let toast = this.toastCtrl.create({
                message: "Press back again to quit Showtimes",
                duration: 1000
            });
            toast.present();
            this.mShowToastExit = true;
            toast.onDidDismiss(() => {
                this.mShowToastExit = false;
            });
        } else {
            this.platform.exitApp();
        }
    }
    registerBackButton(funtion, piority) {
        this.platform.registerBackButtonAction(funtion, piority);
    }
    onAccessKeyExpired() {
        if (this.mEnableExpired == false) return;
        let alert = this.alertController.create({
            title: "Phiên đăng nhập hết hạn",
            subTitle: "Tài khoản này đã đăng nhập ở một thiết bị khác, vui lòng thử lại sau!",
            buttons: [
                {
                    text: "OK"
                }
            ]
        });
        alert.present();
        alert.onDidDismiss(() => {
            this.logout();
        });
        this.mEnableExpired = false;
    }
    logout() {
        this.events.unsubscribe("network:expired");
        this.mEnableExpired = true;
        this.mDataService.onLoggedOut();
        NetworkConfig.ACESSKEY = '';
        this.mDataService.setItemOnStorage(Chaos.ACCESS_KEY, NetworkConfig.ACESSKEY);
        this.navCtrl.setRoot(LoginPage, {}, {
            animate: true,
            direction: 'back',
            duration: 400
        });
    }
    requestUserInfo() {
        this.mDataService.mNetworkService.requestGetUserInfo().then(
            data => {
                if (data['status'] == ResponseCode.ACCESSKEY_EXPIRED) {
                    this.events.publish("network:expired");
                } else if (data['status'] == ResponseCode.SUCCESS) {
                    this.mDataService.mUser.onResponseUserInfo(data);
                    this.requestTalentRoomInfo();
                }
            }
        );
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
    requestTalentRoomInfo() {
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
                error => {

                }
            );
        }
    }
    public start() {
        let target = this;
        this.mAnimationFrameID = requestAnimationFrame(() => {
            target.onUpdate();
            target.start();
        });
    }
    onUpdate() {
        if (this.mDataService.mPomeloService.mResponses.length > 0) {
            let response = this.mDataService.mPomeloService.mResponses.shift();
            this.onUpdateResponseQueue(response.route, response.params);
        }
        // if (this.mScrolling) {
        //     this.onPageScrolling();
        // }
    }

    ionViewDidLeave() {
        cancelAnimationFrame(this.mAnimationFrameID);
    }

    ngAfterViewInit() {
        this.mScrollElement = this.content.getScrollElement();
        this.content.ionScroll.subscribe((event) => {
            this.onPageScrolling();
        });
        let footer = document.getElementById("footer");
        footer.addEventListener("touchstart", (event) => {
            event.stopPropagation();
        });
        footer.addEventListener("touchmove", (event) => {
            event.stopPropagation();
        });
    }
    doRefresh(refresher) {
        this.mRefresher = refresher;
        this.mRefreshState = RefreshState.REFRESHING;
        this.mRefrestStartTime = Date.now();
        this.requestRefreshContent();
    }

    requestRefreshContent() {
        this.mDataService.mListRoomUserHomeRangeFirst = 0;
        this.mDataService.mNetworkService.requestHotLiveStream('' + this.mDataService.mListRoomUserHomeRangeFirst + '-' + this.mDataService.mRangeGap, Chaos.DESC, RoomLiveField.onair_state,
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
                this.onRefreshData(data);
            }, error => {
                this.onRefreshTimeOut();
            });
    }
    onRefreshTimeOut() {
        if (this.mRefreshState == RefreshState.REFRESHING) {
            this.onRefreshData(undefined);
        }
    }

    doLoadMore() {
        this.requestLoadMore();
        setTimeout(() => {
            this.onLoadMoreTimeOut();
        }, 500);
    }
    requestLoadMore() {
        if (this.mLoadMoreState != LoadMoreState.LOADING) {
            this.mLoadMoreState = LoadMoreState.LOADING;
            this.mDataService.requestHotLiveStream('' + this.mDataService.mListRoomUserHomeRangeFirst + '-' +
                (this.mDataService.mListRoomUserHomeRangeFirst + this.mDataService.mRangeGap), false);
        }
    }

    onLoadMoreTimeOut() {
        if (this.mLoadMoreState == LoadMoreState.LOADING) {
            this.mLoadMoreState = LoadMoreState.NONE;
        }
    }
    /*
    Please update content before call this function
     */
    onRefreshData(data) {
        this.mRefreshState = RefreshState.DONE;
        if (this.mRefresher != undefined) {
            let dt = Date.now() - this.mRefrestStartTime;
            if (dt > 500) {
                this.mRefresher.complete();
                if (data != undefined) {
                    this.mDataService.mListRoomUserHomeRangeFirst += data['content'].length;
                    this.mDataService.mRoomPageManager.onResponseHotLiveStream(data, true);
                }
            } else {
                setTimeout(() => {
                    this.mRefresher.complete();
                    if (data != undefined) {
                        this.mDataService.mListRoomUserHomeRangeFirst += data['content'].length;
                        this.mDataService.mRoomPageManager.onResponseHotLiveStream(data, true);
                    }
                }, 500);
            }
        } else {
            if (data != undefined) {
                this.mDataService.mListRoomUserHomeRangeFirst += data['content'].length;
                this.mDataService.mRoomPageManager.onResponseHotLiveStream(data, true);
            }
        }
    }
    onTouchEnded(event) {
        setTimeout(() => {
            this.doShowScrollTop(false);
        }, 2000);
    }

    onPageScrolling() {
        let scrollBottom = this.mScrollElement.scrollHeight - this.mScrollElement.clientHeight - this.mScrollElement.scrollTop;
        let dy = this.mLastScrollTop - this.mScrollElement.scrollTop;
        this.mLastScrollTop = this.mScrollElement.scrollTop;
        if (dy >= 2) {
            this.doShowFooter(true);
            this.doShowHeader(true);
        } else if (dy <= -2) {
            this.doShowFooter(false);
            if (this.mLastScrollTop > 44) this.doShowHeader(false);
        }
        if (this.mLoadMoreState == LoadMoreState.NONE && scrollBottom <= 50 && dy <= 0 && this.viewcontrol.type == this.VIEW_HOME) {
            this.doLoadMore();
        }
    }

    doShowScrollTop(show: boolean) {
        let ele = document.getElementById("scroll-top-top");
        if (ele != undefined) {
            ele.style.visibility = show ? "visible" : "hidden";
        }
    }

    doShowHeader(show: boolean) {
        let ele = document.getElementById("header");
        if (ele == undefined) return;
        if (show) {
            if (ele.classList.contains("mHeader-hide")) {
                ele.classList.remove("mHeader-hide");
            }
        } else {
            if (!ele.classList.contains("mHeader-hide")) {
                ele.classList.add("mHeader-hide");
            }
        }
    }
    doShowFooter(show: boolean) {
        let ele = document.getElementById("footer");
        if (ele == undefined) return;
        if (show) {
            if (ele.classList.contains("mFooter-hide")) ele.classList.remove("mFooter-hide");
        } else {
            if (!ele.classList.contains("mFooter-hide")) ele.classList.add("mFooter-hide");
        }
    }
    doShowNotify(show: boolean) {

    }

    getBannerImage(banner) {
        return "url(" + banner.image + ")";
    }
    onClickAdsPage() {

    }
    mShowSuggestTalent: boolean = false;
    onClickShowSuggestTalent() {
        this.onClickShowNotify(false);
        if (!this.mShowSuggestTalent) {
            this.mShowSuggestTalent = true;
            setTimeout(() => {
                this.mShowSuggestTalent = false;
                this.navCtrl.push(SuggestTalentPage);
            }, 500);
        }
    }

    onClickScrollToTop() {
        this.content.scrollToTop(400);
        this.doShowHeader(true);
    }
    onClickOpenRoom(room: RoomLive, categoryID: number) {
        this.mDataService.mRoomPageManager.setSelectedCategory(categoryID);
        this.navCtrl.push(LiveStreamPage, {
            room_live: room
        });
    }

    onClickHeaderRefresh() {
        this.onClickScrollToTop();
    }

    onClickShowView(type) {
        if (type == this.VIEW_STREAM) {
             this.navCtrl.push(TalentStreamPage);
            // if (this.mDataService.mUser.role_id == UserRole.TALENT) {
            //     this.navCtrl.push(TalentStreamPage);
            // } else {
            //     this.navCtrl.push(UserStreamPage);
            // }
            // if (this.mDataService.isAndroid()) {
            //     if (this.mDataService.mUser.role_id == UserRole.TALENT) {
            //         this.navCtrl.push(TalentStreamPage);
            //     } else {
            //         this.navCtrl.push(UserStreamPage);
            //     }
            // } else if (this.mDataService.isIOS()) {
            //     this.navCtrl.push(UserStreamPage);
            //  }
            return;
        }
        if (type == this.VIEW_USER_INFO) {
            this.navCtrl.push(UserInfoPage);
            return;
        }
        if (type == this.VIEW_NOTIFY) {
            this.doShowNotify(true);
            return;
        }
        this.viewcontrol.type = type;
        let ele = <HTMLImageElement>document.getElementById("header-title");
        if (type == this.VIEW_EXPLORE) {
            ele.src = "assets/v2/text-explore.png";
            setTimeout(() => {
                this.mDataService.requestRoomOnCategories();
            }, 500);
        } else if (type == this.VIEW_HOME) {
            ele.src = "assets/v2/text-showtime.png";
        }
        this.content.scrollToTop(400);
    }
    getBorderTopItem(index: number) {
        if (index == 0) return "assets/v2/rank1.png";
        if (index == 1) return "assets/v2/rank2.png";
        if (index == 2) return "assets/v2/rank3.png";
        return "assets/v2/rank4.png";
    }

    mShowNotify = false;
    onClickShowNotify(show) {
        this.mShowNotify = show;
        let ele = document.getElementById("view-notify");

        let eleContainer = document.getElementById("view-notify-container");
        if (show) {

            ele.style.visibility = "visible";
            if (!ele.classList.contains("view-notify-show")) ele.classList.add("view-notify-show");
            if (eleContainer.classList.contains("view-notify-container-hide")) eleContainer.classList.remove("view-notify-container-hide");
            setTimeout(() => { this.requestFollowingsInfo(); }, 500);

        } else {
            if (ele.classList.contains("view-notify-show")) ele.classList.remove("view-notify-show");
            setTimeout(() => {
                let ele = document.getElementById("view-notify");
                ele.style.visibility = "hidden";
            }, 200);
            if (!eleContainer.classList.contains("view-notify-container-hide")) eleContainer.classList.add("view-notify-container-hide");
        }
    }



    ///////
    showToast(message: string, duration: number, position?: string) {
        let pos = 'bottom';
        if (position == undefined || position == null || position.length == 0) {
            pos = 'top';
        }
        let toast = this.toastCtrl.create({
            message: message,
            duration: duration,
            position: pos
        });
        toast.present();
    }

    onUpdateResponseQueue(route: string, params: any) {
        this.log("onCmd : " + route);
        if (route.localeCompare(PomeloCmd.IO_ERROR) == 0) {

        } else if (route.localeCompare(PomeloCmd.DISCONNECT) == 0) {
            if (this.mEnableDisconnectEvent) {
                this.mDataService.mPomeloService.mPomeloState = PomeloState.DISCONNECTED;
            }
        } else if (route.localeCompare(PomeloCmd.LEAVE_ROOM) == 0) {
            if (this.mDataService.mPomeloService.mPomeloState != PomeloState.DISCONNECTED) {
                this.mDataService.mPomeloService.mPomeloState = PomeloState.LOGINED;
            }
        }
        else if (route.localeCompare(PomeloCmd.JOIN_ROOM) == 0) {
        }
    }
    onClickShowViewTop() {
        this.navCtrl.push(TopPage);
    }
    onClickShowViewCategory(category: RoomPage) {
        this.navCtrl.push(StreamCategoryPage, {
            'roompage': category
        });
    }


    onFollowingResponse(data) {
        if (data.status != ResponseCode.SUCCESS) return;
        this.mDataService.mFollowManager.onResponseFollowings(data.content);
    }
    mRequestingFollow = true;
    requestFollowingsInfo() {
        this.mDataService.mNetworkService.requestUserFollowings('0-50',
            FieldsBuilder.builder()
                .addFirst(UserManagerField.money)
                .add(UserManagerField.namefield)
                .add(UserManagerField.id)
                .add(UserManagerField.level)
                .add(UserManagerField.user_role)
                .build()).then(
            data => {
                this.onFollowingResponse(data);
                this.mRequestingFollow = false;
            },
            error => {
                this.mRequestingFollow = false;
            });
    }

    onClickTalent(talent: UserPreview) {
        this.onClickShowNotify(false);
        setTimeout(() => {
            this.navCtrl.push(TalentDetailPage, {
                talent: talent,
                from : 'home-page'
            });
        }, 400);
    }

    onClickTopUser(user: UserPreview) { }

    //============== for confirm promote ================

    mTalents: Array<UserPreview> = [];
    mRequestingTalents: boolean = false;
    mSelectedTalentIndex: number = -1;
    mShowPopupConfirm: boolean = false;
    doRequestTalents() {
        this.mShowPopupConfirm = true;
        this.mRequestingTalents = true;
        this.mDataService.mNetworkService.requestTalents('0-50').then(data => {
            this.onResponseTalents(data);
            this.mRequestingTalents = false;
        }, error => {
            this.mRequestingTalents = false;
        });
    }
    onResponseTalents(data) {
        if (data.status == ResponseCode.ACCESSKEY_EXPIRED) {
            this.onAccessKeyExpired();
        }

        if (data.status == ResponseCode.SUCCESS) {
            this.mTalents = [];
            for (let talent of data.content) {
                let user = UserPreview.createTalent();
                user.username = talent.name;
                user.name = talent.title;
                user.setAvatar(talent.avatar);
                user.money = talent.money;
                user.level = talent.level;
                user.point = talent.point;
                user.id = talent.id;
                user.followed = false;
                this.mTalents.push(user);
            }
        }
    }
    getCheckBox(i: number) {
        if (i == this.mSelectedTalentIndex) return "assets/v2/checkbox-select.png";
        return "assets/v2/checkbox-unselect.png";
    }
    onClickSelectedTalent(index: number) {
        this.mSelectedTalentIndex = index;
    }
    onClickHidePromotePopup() {
        this.mShowPopupConfirm = false;
        this.mDataService.enableConfirmPromote(false);
        let popup = document.getElementById("popup_promote");
        if (popup != undefined) {
            popup.style.visibility = 'hidden';
        }
    }
    onClickOtherChannel() {
        let alert = this.alertController.create({
            title: "Bạn biết đến Showtimes kênh khác?",
            inputs: [
                {
                    name: 'channel',
                    placeholder: "Nhập kênh"
                }
            ],
            buttons: [
                {
                    text: "Cancel"
                },
                {
                    text: "OK",
                    handler: (data) => {
                        this.onSubmitOtherChannel(data);

                    }
                }
            ]
        });

        alert.present();
    }
    onSubmitOtherChannel(data) {
        if (data.channel.length == 0) {
            this.showToast("Vui lòng nhập đầy đủ thông tin", 2000);
        } else {
            this.mDataService.mNetworkService.requestUserConfirmPromote(data.channel).then(
                response => {
                    if (response['status'] == 1) {
                        this.showToast("Thông tin của bạn đã được ghi nhận, xin cảm ơn !", 2000);
                    }
                }
            );
            this.onClickHidePromotePopup();
        }

    }
    onClickDone() {
        if (this.mSelectedTalentIndex < 0) {
            this.showToast("Bạn chưa chọn talent!", 2000);
            return;
        }
        if (this.mSelectedTalentIndex >= 0 && this.mSelectedTalentIndex < this.mTalents.length) {
            let talent = this.mTalents[this.mSelectedTalentIndex];
            this.mDataService.mNetworkService.requestUserConfirmPromote(talent.username).then(
                response => {
                    if (response['status'] == 1) {
                        this.showToast("Thông tin của bạn đã được ghi nhận, xin cảm ơn !", 2000);
                    }
                }
            );
            this.onClickHidePromotePopup();
        }
    }
    // ================================
}
