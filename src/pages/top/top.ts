import { Component } from '@angular/core';
import { NavController, Events } from 'ionic-angular';
import { DataService } from '../../providers/data-service';
import { NetworkService } from '../../providers/network-service';
import { ResponseCode } from '../../providers/network-config';
import { UserPreview } from '../../providers/config';

@Component({
    selector: 'page-top',
    templateUrl: 'top.html'
})
export class TopPage {
    TALENT: number = 0;
    FAN: number = 1;

    DAY: number = 0;
    MONTH: number = 1;
    YEAR: number = 2;

    viewcontrol = {
        type: this.TALENT,
        time: this.MONTH,
    };
    filtered_datas: Array<UserPreview> = [];
    mLoading = true;

    constructor(private events: Events, public navCtrl: NavController, public networkService: NetworkService, public dataService: DataService) {

    }
    ionViewDidEnter() {
        this.events.unsubscribe("user:back");
        this.events.subscribe("user:back", () => {
            this.onClickBack();
        });
        this.onClickReloadList();
    }
    onClickBack() {
        this.navCtrl.pop();
    }
    getTimeString(): string {
        if (this.viewcontrol.time == this.MONTH) return "month";
        if (this.viewcontrol.time == this.YEAR) return "year";
        return "day";
    }
    private requestReload() {
        // hàm này cập nhật lại danh sách, ném vào filtered_datas. data được filter từ dataService.mTopData dựa theo viewcontrol.

        let type = this.viewcontrol.type;
        let time = this.viewcontrol.time;
        if (this.viewcontrol.type == this.TALENT) {
            this.networkService.requestTopTalentRecieveGift(this.getTimeString()).then(
                data => {
                    this.onReloadDone(type, time, data);
                }, error => {
                    this.onReloadError();
                });
        } else {
            this.networkService.requestTopUserSendGift(this.getTimeString()).then(
                data => {
                    this.onReloadDone(type, time, data);
                }, error => {
                    this.onReloadError();
                });
        }
    }

    onReloadError() {
        this.mLoading = false;
    }
    onClickShowView(type) {
        this.viewcontrol.type = type;
        this.onClickReloadList();
    }
    onClickShowSubView(time) {
        this.viewcontrol.time = time;
        this.onClickReloadList();
    }
    onReloadDone(type, time, data) {
        this.mLoading = false;
        this.filtered_datas = [];
        if (data.status != ResponseCode.SUCCESS) return;
        if (type == this.TALENT && time == this.DAY) {
            this.dataService.mTopData.onTalentDayData(data.content);
            this.filtered_datas = this.dataService.mTopData.talents_day;
        }
        if (type == this.TALENT && time == this.MONTH) {
            this.dataService.mTopData.onTalentMonthData(data.content);
            this.filtered_datas = this.dataService.mTopData.talents_month;
        }
        if (type == this.TALENT && time == this.YEAR) {
            this.filtered_datas = this.dataService.mTopData.talents_year;
            this.dataService.mTopData.onTalentYearData(data.content);
        }

        if (type == this.FAN && time == this.DAY) {
            this.dataService.mTopData.onUserDayData(data.content);
            this.filtered_datas = this.dataService.mTopData.users_day;
        }
        if (type == this.FAN && time == this.MONTH) {
            this.dataService.mTopData.onUserMonthData(data.content);
            this.filtered_datas = this.dataService.mTopData.users_month;
        }
        if (type == this.FAN && time == this.YEAR) {
            this.dataService.mTopData.onUserYearData(data.content);
            this.filtered_datas = this.dataService.mTopData.users_year;
        }
    }
    onClickReloadList() {
        this.mLoading = true;
        this.requestReload();
    }

    onClickFollow(talent: UserPreview) {
        console.log("on click follow : " + JSON.stringify(talent));

    }
}

