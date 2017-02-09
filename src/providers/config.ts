import { RoomLiveField } from './network-config';
import { Device } from 'ionic-native';
export class Default {
    public static USER_AVATAR: string = "assets/common/default_avatar.png";
    public static USER_COVER: string = "assets/common/default_cover.jpg";
    public static TALENT_COVER: string = "assets/common/default_cover.jpg";
    public static LIVE_COVER: string = "assets/common/default_room.png";
    public static USER_BIRTHDAY: string = "2000-06-06";
    public static USER_SEX: string = "Bí mật";
    public static ROOM_ID: string = "undefined_room";
}
export class Filter {
    name: string;
    id: number;
    preview: string;
}
export class FilterManager {
    mSelectedIndex: number = 0;
    filters: Array<Filter> = [
        { id: 0, name: "SkinWhiten", preview: "assets/filters/beauty.png" },
        // { id: 1, name: "Beauty", preview: "assets/filters/beauty.png" },
        { id: 2, name: "WhiteCat", preview: "assets/filters/whitecat.png" },
        { id: 3, name: "Fairy Tale", preview: "assets/filters/fairytale.png" },
        { id: 4, name: "BlackCat", preview: "assets/filters/blackcat.png" },
        { id: 5, name: "Romance", preview: "assets/filters/romance.png" },
        { id: 6, name: "Sakura", preview: "assets/filters/sakura.png" },
        { id: 7, name: "Amaro", preview: "assets/filters/amoro.jpg" },
        { id: 8, name: "Walden", preview: "assets/filters/walden.jpg" },
        { id: 9, name: "Antique", preview: "assets/filters/antique.png" },
        { id: 10, name: "Calm", preview: "assets/filters/calm.png" },
        { id: 11, name: "Brannan", preview: "assets/filters/brannan.jpg" },
        { id: 12, name: "Brooklyn", preview: "assets/filters/brooklyn.jpg" },
        { id: 13, name: "EarlyBird", preview: "assets/filters/earlybird.jpg" },
        { id: 14, name: "Freud", preview: "assets/filters/freud.jpg" },
        { id: 15, name: "Hefe", preview: "assets/filters/hefe.jpg" },
        { id: 16, name: "Hudson", preview: "assets/filters/hudson.jpg" },
        { id: 17, name: "Inkwell", preview: "assets/filters/inkwell.jpg" },
        { id: 18, name: "Kevin", preview: "assets/filters/kevin.jpg" },
        // { id: 19, name: "Lomo", preview: "assets/filters/lomo.jpg" },
        { id: 20, name: "N1977", preview: "assets/filters/1977.jpg" },
        { id: 21, name: "Nashville", preview: "assets/filters/nashville.jpg" },
        { id: 22, name: "Pixar", preview: "assets/filters/piaxr.jpg" },
        { id: 23, name: "Rise", preview: "assets/filters/rise.jpg" },
        { id: 24, name: "Sierra", preview: "assets/filters/sierra.jpg" },
        { id: 25, name: "Sutro", preview: "assets/filters/sutro.jpg" },
        { id: 26, name: "Toastero", preview: "assets/filters/toastero.jpg" },
        { id: 27, name: "Valencia", preview: "assets/filters/valencia.jpg" },
        { id: 28, name: "Xproii", preview: "assets/filters/walden.jpg" },
        { id: 29, name: "Evergreen", preview: "assets/filters/warm.png" },
        { id: 30, name: "Healthy", preview: "assets/filters/healthy.png" },
        { id: 31, name: "Cool", preview: "assets/filters/cool.png" },
        { id: 32, name: "Emerald", preview: "assets/filters/emerald.png" },
        { id: 33, name: "Latte", preview: "assets/filters/latte.png" },
        { id: 34, name: "Warm", preview: "assets/filters/warm.png" },
        { id: 35, name: "Tender", preview: "assets/filters/tender.png" },
        { id: 36, name: "Sweets", preview: "assets/filters/sweets.png" },
        { id: 37, name: "Nostalgia", preview: "assets/filters/nostalgia.png" },
        { id: 38, name: "Sunrise", preview: "assets/filters/sunrise.png" },
        { id: 39, name: "Sunset", preview: "assets/filters/sunset.png" },
        { id: 40, name: "Crayon", preview: "assets/filters/crayon.jpg" },
        { id: 41, name: "Sketch", preview: "assets/filters/sketch.png" },
    ];

    setSelectedFilter(id) {
        this.mSelectedIndex = id;
    }
}
export class UserSetting {
    mRecieveNotify: boolean = true;
}
export class UserDevice {
    device_id: string;
    device_name: string;
    platform: string;
    mRealDevice: boolean = true;
    mAndroidDevice: boolean = false;
    mIOSDevice: boolean = true;


    constructor() {
        this.device_id = "device_id";
        this.device_name = "device_name";
        this.platform = "iOS";

        // if (Device.platform == null) {
        //     this.mRealDevice = false;
        //     this.mAndroidDevice = false;
        //     this.mIOSDevice = true;
        // }

    }
    isRealDevice() {
        return this.mRealDevice;
    }
    onPlatformReady() {
        if (this.isRealDevice()) {
            this.device_name = Device.model;
            this.device_id = Device.uuid;
            this.platform = Device.platform;

            this.mAndroidDevice = this.platform.toLowerCase() == "android";
            this.mIOSDevice = this.platform.toLowerCase() == "ios";
        }
    }
    setDeviceName(device_name: string) {
        this.device_name = device_name;
    }
    setDeviceId(device_id: string) {
        this.device_id = device_id;
    }

    isAndroid() {
        return this.mAndroidDevice;
    }
    isIos() {
        return this.mIOSDevice;
    }
}


export enum Direction {
    CENTER, TOP, TOP_RIGHT, RIGHT, BOTTOM_RIGHT, BOTTOM, BOTTOM_LEFT, LEFT, TOP_LEFT
}
export enum ChatSessionType {
    SYSTEM = 0, USER, GIFT_REQUEST
}
export enum RefreshState {
    NONE = 0, REFRESHING, DONE
}
export enum LoadMoreState {
    NONE = 0, LOADING, DONE
}
export enum LoginType {
    NONE = -1, ACCOUNT = 0, FACEBOOK = 1, GOOGLE = 2
}
export enum PlatformType {
    WINDOW_PHONE, ANDROID, IOS, DESKTOP, WEB
}
export enum RoomLiveState {
    BLOCK = 0, UNBLOCK = 1
}
export enum RoomLiveStatus {
    OFF_AIR = 0, ON_AIR = 1
}
export enum UserRole {
    USER = 0, TALENT, ADMIN
}

export class UserPreview {
    id: string;
    username: string;
    name: string;
    avatar: string;
    money: number;
    gift: number
    level: number;
    point: number;
    status: string;
    like: number;
    role: number;
    top_value: number;
    followed: boolean;
    followers: number;
    coupon: number;
    cover: string;
    birthday: string;
    sex: string;
    phone: string;
    private constructor() {

    }
    setAvatar(ava) {
        if (ava != undefined && ava.length > 0) this.avatar = ava;
    }
    public static createUser(): UserPreview {
        let user = new UserPreview();
        user.id = 'undefined';
        user.name = 'ST User';
        user.username = "undefined";
        user.status = "Live your style";
        user.avatar = Default.USER_AVATAR;
        user.cover = Default.USER_COVER;
        user.money = 0;
        user.gift = 0;
        user.level = 0;
        user.like = 0;
        user.role = UserRole.USER;
        user.top_value = 0;
        user.point = 0;
        user.followed = false;
        user.followers = 0;
        user.sex = Default.USER_SEX;
        user.birthday = Default.USER_BIRTHDAY;
        user.phone = "";
        return user;
    }
    public static createTalent(): UserPreview {
        let user = new UserPreview();
        user.id = 'undefined';
        user.username = "undefined";
        user.name = 'ST Talent';
        user.status = "Live your style";
        user.avatar = Default.USER_AVATAR;
        user.cover = Default.USER_COVER;
        user.money = 0;
        user.gift = 0;
        user.level = 0;
        user.like = 0;
        user.role = UserRole.TALENT;
        user.top_value = 0;
        user.point = 0;
        user.followed = false;
        user.followers = 0;
        user.sex = Default.USER_SEX;
        user.birthday = Default.USER_BIRTHDAY;
        user.phone = "";
        return user;
    }
    public onResponseListUsersRoomLive(user) {
        this.name = user.title;
        this.username = user.name;
        this.money = user.money;
        this.role = user.role_id;
        this.level = user.level;
        this.setAvatar(user.avatar);
    }

    onResponseTalentLiveStreamInfo(data) {
        this.point = data.point;
        this.money = data.money;
        this.level = data.level;
        this.followers = data.meta.follows;
    }

    cloneFromUser(user: User) {
        this.id = '' + user.id;
        this.name = user.name;
        this.username = user.username;
        this.status = user.status;
        this.setAvatar(user.avatar);
        this.cover = user.cover;
        this.money = user.money;
        this.gift = user.gift;
        this.level = user.level;
        this.like = user.like;
        this.role = user.role_id;
        this.top_value = 0;
        this.point = user.point;
        this.followed = false;
        this.followers = 0;
        this.sex = user.sex;
        this.birthday = user.birthday;
        this.phone = user.phone;
    }
}

export class TalentTopData {
    users: Array<UserPreview> = [];
    fans: Array<UserPreview> = [];

    onTopFan(data) {
        this.fans = [];
        for (let user of data) {
            let u = UserPreview.createUser();
            u.username = user.user_name;
            u.name = user.title;
            u.money = user.money;
            u.top_value = user.money_send_gift;
            u.level = user.level;
            u.setAvatar(user.avatar);
            this.fans.push(u);
        }
    }
    onTopUser(data) {
        this.users = [];
        for (let user of data) {
            let u = UserPreview.createUser();
            u.username = user.user_name;
            u.name = user.title;
            u.money = user.money;
            u.top_value = user.money_send_gift;
            u.level = user.level;
            u.setAvatar(user.avatar);
            this.users.push(u);
        }
    }
}

export class TopData {
    users_day: Array<UserPreview> = [];
    talents_day: Array<UserPreview> = [];
    users_month: Array<UserPreview> = [];
    talents_month: Array<UserPreview> = [];
    users_year: Array<UserPreview> = [];
    talents_year: Array<UserPreview> = [];
    constructor() {

    }
    getUserPreviews() {
        return this.users_year.filter((item, index) => {
            return index < 6;
        });
    }
    getTalentPreviews() {
        return this.talents_year.filter((item, index) => {
            return index < 6;
        });
    }

    public onUserDayData(data) {
        this.users_day = [];
        for (let dt of data) {
            let user = UserPreview.createUser();
            user.setAvatar(dt.avatar);
            user.name = dt.title;
            user.money = dt.money;
            user.top_value = dt.top_value;
            user.username = dt.name;
            this.users_day.push(user);
        }
    }

    public onUserMonthData(data) {
        this.users_month = [];
        for (let dt of data) {
            let user = UserPreview.createUser();
            user.setAvatar(dt.avatar);
            user.name = dt.title;
            user.money = dt.money;
            user.top_value = dt.top_value;
            user.username = dt.name;
            this.users_month.push(user);
        }
    }

    public onUserYearData(data) {
        this.users_year = [];
        for (let dt of data) {
            let user = UserPreview.createUser();
            user.setAvatar(dt.avatar);
            user.name = dt.title;
            user.money = dt.money;
            user.top_value = dt.top_value;
            user.username = dt.name;
            this.users_year.push(user);
        }
    }

    public onTalentDayData(data) {
        this.talents_day = [];
        for (let dt of data) {
            let talent = UserPreview.createTalent();
            talent.setAvatar(dt.avatar);
            talent.level = dt.level;
            talent.name = dt.title;
            talent.point = dt.point;
            talent.top_value = dt.point;
            talent.username = dt.name;
            this.talents_day.push(talent);
        }
    }

    public onTalentMonthData(data) {
        this.talents_month = [];
        for (let dt of data) {
            let talent = UserPreview.createTalent();
            talent.setAvatar(dt.avatar);
            talent.level = dt.level;
            talent.name = dt.title;
            talent.point = dt.point;
            talent.top_value = dt.point;
            talent.username = dt.name;
            this.talents_month.push(talent);
        }
    }

    public onTalentYearData(data) {
        this.talents_year = [];
        for (let dt of data) {
            let talent = UserPreview.createTalent();
            talent.setAvatar(dt.avatar);
            talent.level = dt.level;
            talent.name = dt.title;
            talent.point = dt.point;
            talent.top_value = dt.point;
            talent.username = dt.name;
            this.talents_year.push(talent);
        }
    }
}

export class RoomLive {
    room_id: string;
    name: string;
    talent: UserPreview;
    view: number;
    poster: string;
    create_time: number;
    state: number;
    status: number;
    rtsp_url: string;
    rtmp_url: string;
    hls_url: string;
    default_video: string;
    constructor() {
        this.room_id = Default.ROOM_ID;
        this.name = 'noname';
        this.talent = UserPreview.createTalent();
        this.view = 0;
        this.poster = Default.LIVE_COVER;
        this.create_time = 0;
        this.state = RoomLiveState.UNBLOCK;
        this.status = RoomLiveStatus.OFF_AIR;
        this.rtsp_url = "";
        this.hls_url = "";
        this.rtmp_url = "";
        this.default_video = "";
    }

    /**Badlogic : đồng bộ kết quả dữ liệu room live từ nodejs */
    onResponseRoomInfo(data) {
        if (data.default_video == undefined || data.default_video.length == 0) return;
        this.default_video = data.default_video;
    }
    /**Badlogic : đồng bộ kết quả dữ liệu room live  */
    onResponseHotRoomLive(data) {
        this.talent.username = data[RoomLiveField.talent_name];
        this.talent.name = data[RoomLiveField.talent_title];
        this.talent.setAvatar(data[RoomLiveField.talent_avatar]);

        this.room_id = data[RoomLiveField.room_id];
        this.name = data[RoomLiveField.room_name];
        this.view = data[RoomLiveField.number_users];
        this.poster = data[RoomLiveField.thumbnail_url];
        this.create_time = data[RoomLiveField.create_time];
        this.hls_url = data[RoomLiveField.hls_url];
        this.rtsp_url = data[RoomLiveField.rtsp_url];
        this.rtmp_url = data[RoomLiveField.rtmp_url];
        this.status = data[RoomLiveField.onair_state];
    }

    /**Badlogic : đồng bộ kết quả dữ liệu room live  */
    onResponseRoomLive(data) {
        this.talent.username = data[RoomLiveField.talent_name];
        this.talent.name = data[RoomLiveField.talent_title];
        this.talent.setAvatar(data[RoomLiveField.talent_avatar]);

        this.room_id = data[RoomLiveField.room_id];
        this.name = data[RoomLiveField.room_name];
        this.view = data[RoomLiveField.number_users];
        this.poster = data[RoomLiveField.thumbnail_url];
        this.create_time = data[RoomLiveField.create_time];
        this.hls_url = data[RoomLiveField.hls_url];
        this.rtsp_url = data[RoomLiveField.rtsp_url];
        this.rtmp_url = data[RoomLiveField.rtmp_url];
        this.status = data[RoomLiveField.onair_state];
    }

    onResponseTalentRoomInfo(data) {
        this.talent.username = data[RoomLiveField.talent_name];
        this.talent.name = data[RoomLiveField.talent_title];
        this.talent.setAvatar(data[RoomLiveField.talent_avatar]);

        this.name = data[RoomLiveField.room_name];
        this.view = data[RoomLiveField.number_users];
        this.poster = data[RoomLiveField.thumbnail_url];
        this.create_time = data[RoomLiveField.create_time];
        this.hls_url = data[RoomLiveField.hls_url];
        this.rtsp_url = data[RoomLiveField.rtsp_url];
        this.rtmp_url = data[RoomLiveField.rtmp_url];
        this.status = data[RoomLiveField.onair_state];
    }
}

export class RoomPage {
    id: number;
    name: string;
    rooms: Array<RoomLive>;
    constructor() {
        this.id = -1;
        this.name = "noname";
        this.rooms = [];
    }
    getRoomsPreview() {
        return this.rooms.filter((item, index) => {
            return index < 4;
        });

    }
}

export class User {
    id: number;
    avatar: string;
    cover: string;
    name: string;
    email: string;
    level: number;
    money: number;
    like: number;
    gift: number;
    point: number;
    status: string;
    role_id: number;
    state: number;
    follows: Array<UserPreview>;
    login_type: LoginType;
    platform: PlatformType;
    version: number;
    device_name: string;
    device_id: string;
    partner: string;
    username: string;
    password: string;
    account_type: number;
    coupon: number;
    birthday: string;
    sex: string;
    phone: string;

    constructor() {
        this.reset();
    }
    setAvatar(ava) {
        if (ava != undefined && ava.length > 0) this.avatar = ava;
    }
    public clone(): User {
        let user = new User();
        user.account_type = this.account_type;
        user.id = this.id;
        user.setAvatar(this.avatar);
        user.cover = this.cover;
        user.name = this.name;
        user.level = this.level;
        user.money = this.money;
        user.like = this.like;
        user.gift = this.gift;
        user.point = this.point;
        user.status = this.status;
        user.role_id = this.role_id;
        user.state = this.state;
        user.follows = this.follows;
        user.login_type = this.login_type;
        user.platform = this.platform;
        user.version = this.version;
        user.device_name = this.device_name;
        user.device_id = this.device_id;
        user.partner = this.partner;
        user.password = this.password;
        user.email = this.email;
        user.coupon = this.coupon;
        user.birthday = this.birthday;
        user.sex = this.sex;
        user.phone = this.phone;
        return user;

    }
    private reset() {
        this.account_type = 0;
        this.id = 0;
        this.avatar = Default.USER_AVATAR;
        this.cover = Default.USER_COVER;
        this.name = "Showtimes";
        this.level = 0;
        this.money = 0;
        this.like = 0;
        this.gift = 0;
        this.point = 0;
        this.status = "Live your style";
        this.role_id = -1;
        this.state = -1;
        this.follows = [];
        this.login_type = LoginType.NONE;
        this.platform = PlatformType.DESKTOP;
        this.version = 1;
        this.device_name = "PC";
        this.device_id = "Coder5560";
        this.partner = "default";
        this.password = '';
        this.email = "";
        this.coupon = 0;
        this.birthday = Default.USER_BIRTHDAY;
        this.sex = Default.USER_SEX;
        this.phone = "";
    }
    onResponseUserInfo(data) {

        this.status = data.status;
        this.account_type = data.reg_type;
        this.state = data.account_state;
        this.id = data.id;
        this.point = data.point;
        this.name = data.title;
        this.role_id = data.user_role;
        this.level = data.level;
        this.username = data.name;
        this.money = data.money;
        if (data.sex != undefined) this.sex = data.sex;
        if (data.phone != undefined) this.phone = data.phone;
        if (data.cover != undefined) this.cover = data.cover;
        if (data.email != undefined) this.email = data.email;
        if (data.coupon != undefined) this.coupon = data.coupon;
        this.setAvatar(data.avatar);

    }
    onLoggedOut() {
        this.reset();
    }
}


/**  type == 0 : Hệ thống gửi ; type == 1 : user gửi , type == 2 : GIFT_REQUEST */
export class ChatSession {
    user_role: number;
    name: string;
    avatar: string;
    content: string;
    type: number;
    constructor() {
        this.type = 1;
        this.user_role = 0;
        this.name = "Guest";
        this.avatar = Default.USER_AVATAR;
        this.content = "Bạn hát hay quá";
    }
    setAvatar(ava) {
        if (ava != undefined && ava.length > 0) {
            this.avatar = ava;
        }
    }
}


export class LiveStreamData {
    roomlive: RoomLive;
    is_liked: boolean;
    is_fan: boolean;
    chats: Array<ChatSession>;
    new_users: Array<UserPreview>;
    users: Array<UserPreview>;
    admins: Array<UserPreview>;
    talents: Array<UserPreview>;
    user: UserPreview;
    constructor() {
        this.is_liked = false;
        this.is_fan = false;
        this.chats = [];
        this.users = [];
        this.admins = [];
        this.talents = [];
        this.new_users = [];
        this.user = UserPreview.createUser();
        this.roomlive = new RoomLive();
    }

    reset() {
        this.is_liked = false;
        this.is_fan = false;
        this.chats = [];
        this.users = [];
        this.admins = [];
        this.talents = [];
        this.new_users = [];
    }
    setRoomLive(room: RoomLive) {
        this.reset();
        this.roomlive = room;
    }
    onRoomUser(data) {
        if (this.new_users.length > 12) this.new_users.pop();
        let user = UserPreview.createUser();
        user.username = data.username;
        user.name = data.name;
        user.setAvatar(data.avatar);
        user.money = data.money;
        user.role = data.role;
        this.new_users.unshift(user);
    }
    onUserJoinRoom(data) {
        this.onUserLeaveRoom(data);
        if (this.new_users.length > 12) this.new_users.pop();
        let user = UserPreview.createUser();
        user.username = data.name;
        user.name = data.title;
        user.setAvatar(data.avatar);
        user.money = data.money;
        user.role = data.role_id;
        this.new_users.unshift(user);
    }
    onUserLeaveRoom(data) {
        let index = 0;
        for (let user of this.new_users) {
            if (user.username == data.name) {
                this.new_users.splice(index, 1);
                return;
            }
            index++;
        }
    }
}



// for message 

export enum MessageType {
    NORMAL = 1, ADMIN, USER_FAN, TALENT_2T, FAN_POST, PAYMENT
}

export enum MessageStatus {
    UNREAD = 0, READ
}

export class Message {
    id: number;
    status: number;
    type: number;
    content: string;
    title: string;
    sender_avatar: string;
    sender_name: string;
    sender_username: string;
    time: number;
    time_str: string;

    constructor() {
        this.id = -1;
        this.status = MessageStatus.UNREAD;
        this.content = "";
        this.type = MessageType.NORMAL;
        this.title = "Message";
        this.sender_avatar = Default.USER_AVATAR;
        this.sender_name = "user";
        this.sender_username = "undefined";
        this.time = 1483326033297;
        this.setTime(this.time);
    }
    setTime(t: number) {
        this.time = t;
        let date = new Date(this.time);
        let currentDate = new Date(Date.now());

        if (date.toDateString() === currentDate.toDateString()) {
            let hour = date.getHours();
            let minute = date.getMinutes();
            this.time_str = ((hour < 10) ? ("0" + hour) : hour) + ":" + ((minute < 10) ? ("0" + minute) : minute);
        } else {
            this.time_str = date.toLocaleDateString();
        }
    }

    onResponseMessage(data) {
        this.id = data.id;
        this.status = data.status;
        this.time = data.time;
        this.content = data.content;
        this.type = data.type;
        this.title = data.title;
        this.sender_avatar = data.us_avatar;
        this.sender_name = data.us_title;
        this.sender_username = data.user_sent;
        this.setTime(this.time);
    }

}
