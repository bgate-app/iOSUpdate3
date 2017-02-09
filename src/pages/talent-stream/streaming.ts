import { RoomLive, LiveStreamData } from '../../providers/config';
import { DataService } from '../../providers/data-service';
import { NextStreamManager } from '../live-stream/next-stream';
import { EffectManager } from '../live-stream/heart-effect';
import { GiftEffectManager } from '../live-stream/gift-effects';
import { PomeloState } from '../../providers/pomelo-service';

export class AbstractStream {

    mLiveStreamData: LiveStreamData;

    mGiftEffectManager: GiftEffectManager;

    mEffectManager: EffectManager;

    mNextStreamManager: NextStreamManager;

    mSelfUpdateID: number = -1;

    mDataService: DataService;

    mJoinRoomAfterLeaveRoom: boolean = false;


    constructor(dtService: DataService) {
        this.mDataService = dtService;
        console.log("streaming : constructor");

    }
    onInit() {
        console.log("streaming : onInit");
        this.mLiveStreamData = new LiveStreamData();
        this.mGiftEffectManager = new GiftEffectManager();
        this.mEffectManager = new EffectManager();
        this.mNextStreamManager = new NextStreamManager();
    }

    scheduleUpdate() {
        this.onUpdate();
        this.mSelfUpdateID = requestAnimationFrame(() => {
            this.scheduleUpdate();
        });
    }
    unScheduleUpdate() {
        cancelAnimationFrame(this.mSelfUpdateID);
    }

    onStartRoomLive(room: RoomLive) {


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
    onStopRoomLive() {

    }

    onStreamPlayed() {

    }


    doJoinRoomLive() {
        this.mDataService.mPomeloService.checkConnectoConnector(this.mDataService.mUser.username, () => {
            if (this.mDataService.mPomeloService.mPomeloState == PomeloState.ROOM_JOINED) {
                this.mJoinRoomAfterLeaveRoom = true;
                this.mDataService.mPomeloService.leave_room();
            } else {
                this.mDataService.mPomeloService.join_room(this.mLiveStreamData.roomlive.room_id, '');
            }
        }, () => {

        });
    }
    startRoomLive(room: RoomLive) {
        this.doJoinRoomLive();
        this.mLiveStreamData.reset();
        this.mLiveStreamData.roomlive = room;
        this.mGiftEffectManager.onStartRoomLive();
        this.mNextStreamManager.onStartRoomLive();
        let neigbors = this.mDataService.mRoomPageManager.getNeighborStream(room);
        if (neigbors != undefined) {
            this.mNextStreamManager.setNextLive(neigbors.next);
            this.mNextStreamManager.setPreviousLive(neigbors.previous);
            this.mNextStreamManager.setNextRoomListener((room) => {
                this.startRoomLive(room);
            });
        }
    }

    onUpdateResponseQueue(route: string, data: any) {
    }


}


