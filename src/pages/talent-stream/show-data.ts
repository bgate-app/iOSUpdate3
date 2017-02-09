import {Default} from '../../providers/config'
export class ShowData {
    talent_name: string;
    room_id: string;
    duration: number;
    duration_str: string;
    point: number;
    gift: number;
    share: number;
    like: number;
    view: number;
    state: number;
    poster : string;


    constructor() {
        this.talent_name = "undefined";
        this.room_id = "undefined";
        this.duration = 0;
        this.point = 0;
        this.point = 0;
        this.gift = 0;
        this.share = 0;
        this.like = 0;
        this.view = 0;
        this.state = 0;
        this.poster = Default.LIVE_COVER;
        this.setDuration(this.duration);
    }
    setDuration(seconds: number) {
        this.duration = seconds;
        let hh = Math.floor(seconds / 3600);
        let mm = Math.floor((seconds - hh * 3600) / 60);
        let ss = Math.floor(seconds % 60);
        this.duration_str = (hh < 10 ? "0" : "") + hh + ":" + (mm < 10 ? "0" : "") + mm + ":" + (ss < 10 ? "0" : "") + ss;
    }
}