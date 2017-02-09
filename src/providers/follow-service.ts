import { UserPreview, RoomLive } from './config';


export class FollowManager {
    followings: Array<UserPreview> = [];
    followers: Array<UserPreview> = [];
    mRooms: Array<RoomLive> = [];

    constructor() {

    }
    cleanRoom() {
        this.mRooms = [];
    }
    /**@data : Mảng các talent được follows */
    onResponseFollowings(data) {
        this.followings = [];
        for (let tl of data) {
            let talent = UserPreview.createTalent();
            talent.username = tl.name;
            talent.name = tl.title;
            talent.avatar = tl.avatar;
            talent.point = tl.point;
            talent.level = tl.level;
            this.followings.push(talent);
        }
    }
    /**@data : Mảng các users đang follows mình */
    onResponseFollowers(data) {
        this.followers = [];
        for (let us of data) {
            let user = UserPreview.createUser();
            user.username = user.username;
            user.name = us.title;
            user.avatar = us.avatar;
            user.point = us.point;
            user.id = us.id;
            this.followers.push(user);
        }
    }
}