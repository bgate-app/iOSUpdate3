export class NetworkConfig {

    public static SERVER_SHOWTIME: number = 1;
    public static SERVER_LOCAL: number = 2;
    public static SERVER_TYPE: number = NetworkConfig.SERVER_LOCAL;

    public static MAIN_URL: string = "";
    public static MAIN_HOST: string = "";
    public static MAIN_PORT: string = "";
    public static AVATAR_UPLOAD_URL: string = "http://showtimes.vn/user/mobileUploadAvatar";
    public static CLIENT_KEY: string = "8c24516c23b611420defccf253598412";
    public static SECRET_ENABLE: boolean = true;
    public static LINK_CONFIG: string = "";
    public static DEBUG_RESPONSE: boolean = false;
    public static DEBUG_REQUEST: boolean = false;
    public static VERSION: string = "1.0";
    public static ACESSKEY: string = "";

    public static GATE_CONNECT: string = "gate.gateHandler.queryEntry";
    public static CONNECTOR_LOGIN: string = "connector.entryHandler.login";
    public static CONNECTOR_REGISTER: string = "connector.entryHandler.register";
    public static LOBBY_REQUEST: string = "room.lobbyHandler.";
    public static ROOM_JOIN: string = "room.roomHandler.joinRoom";
    public static ROOM_REQUEST: string = "room.roomHandler.gameRequest";
    public static CHAT_REQUEST: string = "chat.chatHandler.send";
}
export class ResponseCode {
    public static FAILED: number = 0;
    public static SUCCESS: number = 1;
    public static ACCESSKEY_EXPIRED: number = 12;
}


export class Chaos {
    public static ACCESS_KEY: string = "access_key";
    public static SPLIT_PHAY: string = ",";
    public static SPLIT_NGANG = "-";
    public static ASC: string = "asc";
    public static DESC: string = "desc";
}


export class AccountState {
    public static ACTIVE: number = 1;
    public static INACTIVE: number = 0;
    public static BLOCKED: number = -1;
    public static EVER_LOGIN: number = 2;
}

export class UserMessage {
    public static TYPE_USER_SEND: number = 0;
    public static TYPE_ADMIN_SEND: number = 1;
    public static TYPE_PAYMENT: number = 2;
    public static TYPE_GIFT: number = 3;

    public static READ: number = 1;
    public static UNREAD: number = 0;
}

export class RegType {
    public static NORMAL: number = 0;
    public static FACEBOOK: number = 1;
    public static GOOGLEPLUS: number = 2;
}

export class UserRole {
    public static NORMAL: number = 0;
    public static TALENT: number = 1;
}

export class UserMoneyTraceType {
    public static SEND_GIFT: number = 1;
    public static CARD_EXCHANGE: number = 2;
}

export class TopTypeConfig {
    public static DAY: string = "day";
    public static MONTH: string = "month";
    public static YEAR: string = "year";
}

export class UserManagerField {
    public static id: string = "id";
    public static namefield: string = "name";
    public static title: string = "title";
    public static avatar: string = "avatar";
    public static password: string = "password";
    public static money: string = "money";
    public static platform: string = "platform";
    public static reg_type: string = "reg_type";
    public static phone: string = "phone";
    public static version: string = "version";
    public static gen_date: string = "gen_date";
    public static last_login: string = "last_login";
    public static device_name: string = "device_name";
    public static device_id: string = "device_id";
    public static last_device: string = "last_device";
    public static secret_key: string = "secret_key";
    public static account_state: string = "account_state";
    public static online_state: string = "online_state";
    public static po: string = "point";
    public static user_role: string = "user_role";
    public static address: string = "address";
    public static cmtnd: string = "cmtnd";
    public static province: string = "province";
    public static full_name: string = "full_name";
    public static email: string = "email";
    public static blast: string = "blast";
    public static cover: string = "cover";
    public static sex: string = "sex";
    public static birthday: string = "birthday";
    public static level: string = "level";
}

export class RoomLiveField {
    public static room_id: string = "room_id";
    public static talent_name: string = "talent_name";
    public static talent_title: string = "talent_title";
    public static talent_avatar: string = "talent_avatar";
    public static talent_full_name: string = "talent_full_name";
    public static talent_nick_name: string = "talent_nick_name";
    public static hls_url: string = "hls_url";
    public static room_state: string = "room_state";
    public static onair_state: string = "onair_state";
    public static number_users: string = "number_users";
    public static room_name: string = "room_name";
    public static room_description: string = "room_description";
    public static thumbnail_url: string = "thumbnail_url";
    public static create_time: string = "create_time";
    public static last_update: string = "last_update";
    public static cat_id: string = "cat_id";
    public static rtmp_url: string = "rtmp_url";
    public static total_view: string = "total_view";
    public static rtsp_url: string = "rtsp_url";
    public static room_type: string = "room_type";
}

export class PomeloCmd {



    public static LOBBY: string = "lobby.";
    public static ROOM: string = "room.";
    public static NOTIFY_ALL: string = "notify_all";
    public static USER_INFO: string = "user_info";
    public static UPDATE_INFO: string = "update_info";
    public static JOIN_ROOM: string = "join_room";
    public static LEAVE_ROOM: string = "leave_room";
    public static DISCONNECT: string = "disconnect";
    public static IO_ERROR: string = "io-error";
    public static SEND_GIFT: string = "send_gift";
    public static LIST_USERS: string = "list_users";
    public static LIST_GIFTS: string = "list_gifts";
    public static ROOM_INFO: string = "room_info";
    public static USER_JOIN_ROOM: string = "user_join_room";
    public static USER_SEND_GIFT: string = "user_send_gift";
    public static USER_LEAVE_ROOM: string = "user_leave_room";
    public static RECEIVE_GIFT: string = "receive_gift";
    public static HISTORY_CHAT: string = "history_chat";
    public static FOLLOW: string = "follow";
    public static UNFOLLOW: string = "unfollow";
    public static IS_FAN: string = "is_fan";
    public static BAN_NICK: string = "ban_nick";
    public static BANNED: string = "banned";
    public static GRANT_ADMIN: string = "grant_admin";
    public static UNGRANT_ADMIN: string = "ungrant_admin";
    public static ADMIN_GRANTED: string = "admin_granted";
    public static ADMIN_UNGRANTED: string = "admin_ungranted";
    public static CHANGE_ONAIR_STATE: string = "change_onair_state";
    public static CHANGE_ROOM_STATE: string = "change_room_state";
    public static LIKE: string = "like";
    public static UNLIKE: string = "unlike";
    public static SHARE: string = "share";
    public static QUERY_USER_INFO: string = "query_user_info";
}

export class Cmd {
    public static CLIENT_CONFIG: string = "app/client_config";
    public static USER_LOGIN: string = "user/login";
    public static USER_REGISTER: string = "user/register";
    public static USER_GET_ACCESSKEY: string = "user/access_token/account";
    public static USER_GET_OPENID: string = "user/access_token/openid";
    public static USER_INFO: string = "user/info";
    public static GIFT_LIST: string = "gifts/list"
    public static USER_UPDATE_INFO: string = "user/update_info";
    public static USER_MESSAGES: string = "user/messages";
    public static USER_MESSAGES_READ: string = "user/message/read";
    public static USER_MESSAGES_DELETE: string = "user/message/delete";
    public static USER_CHANGE_PASS: string = "user/change_password";
    public static USER_HISTORY_SEND_GIFT: string = "user/history/send_gift";
    public static USER_HISTORY_PAYMENT: string = "user/history/payment";
    public static USER_FOLLOWING: string = "user/following";
    public static USER_FOLLOW: string = "user/follow";
    public static USER_UNFOLLOW: string = "user/unfollow";
    public static USER_CONFIRM_PROMOTE: string = "user/confirm_user_promote";
    public static TALENT_LIST: string = "talent/list";
    public static TALENT_SEARCH: string = "talent/search";
    public static TALENT_INFO: string = "talent/info";
    public static TALENT_TOP_USER_SEND_GIFT: string = "talent/top_user_send_gift";
    public static ROOM_CATEGORIES: string = "room/categories";
    public static APP_BANNERS: string = "app/banners";
    public static ROOM_LIST: string = "room/list";
    public static ROOM_INFO: string = "room/";
    public static TOP_USER_SEND_GIFT: string = "top/user/send_gift";
    public static TOP_USER_RECEIVE_GIFT: string = "top/talent/receive_gift";
    public static UPDATE_PUSH_UID: string = "user/update_pushuid";
}

export class PomeloParamsKey {
    // ======================COMMON=========================    
    public static USER: string = "user";


    public static TABLE_INFO: string = "table_info";
    public static NOTIFY_ALL: string = "notify_all";

    // COMMON
    public static TYPE: string = "type";
    public static ID: string = "id";














    public static UID: string = "uid";
    public static SUCCESS: string = "success";
    public static MESSAGE: string = "messsage";
    public static X: string = "x";
    public static Y: string = "y";
    public static POSITION: string = "position";
    public static SIGN: string = "sign";
    public static COIN: string = "coin";
    public static ARRAY: string = "array";
    public static FIELD: string = "field";
    public static VALUE: string = "value";
    public static ROOM: string = "room";
    public static BANNER_TEXT: string = "banner_text";












    public static BANNER_LINK: string = "banner_link";
    public static PAYMENT_METHOD: string = "payment_method";
    public static PAYMENT_PERMISSION: string = "payment_permission";
    public static CASHOUT_PERMISSION: string = "cashout_permission";
    public static REASON: string = "reason";
    public static SESSION_ID: string = "session_id";


    // USER KEY
    public static NAME: string = "name";
    public static USER_NAME: string = "user_name";
    public static TITLE: string = "title";
    public static SEAT: string = "seat";
    public static AVATAR: string = "avatar";
    public static IS_HOST: string = "is_host";
    public static LEVEL: string = "level";
    public static MONEY: string = "money";
    public static POINT: string = "point";
    public static PARTNER: string = "partner";
    public static DEVICE_ID: string = "device_id";
    public static LOGIN_TYPE: string = "login_type";
    public static PASSWORD: string = "password";
    public static ROOM_NAME: string = "roomName";
    public static VERSION: string = "version";
    public static PLATFORM: string = "platform";
    public static DEVICE_NAME: string = "device_name";
    public static PHONE: string = "phone";
    public static SECRET_KEY: string = "secret_key";
    public static ADMIN_GRANTED: string = "admin_granted";

    // ROOM KEY
    public static DELTA_MONEY: string = "delta_money";
    public static MONEY_CHANGE: string = "money_change";













    public static TIMESTAMP: string = "timestamp";
    public static TABLE_FEE: string = "table_fee";
    public static TIME: string = "time";
    public static RANK: string = "rank";
    public static INDEX: string = "index";
    public static START: string = "start";








    public static FROM: string = "from";
    public static SCOPE: string = "scope";
    public static CONTENT: string = "content";




    public static KIND: string = "kind";
    public static USERID: string = "userId";
    public static ROOMID: string = "roomId";
    public static ROOM_STATE: string = "room_state";


    public static GIFT_ID: string = "gift_id";
    public static GIFT_TYPE: string = "gift_type";
    public static GIFT_TIME_EFFECT: string = "gift_time_effect";


    public static DES: string = "des";
    public static GIFT: string = "item";
    public static EXTRAS: string = "extras";
    public static GIFT_STATE: string = "item_state";

    public static OFFSET: string = "offset";
    public static OFFSET_X: string = "offset_x";
    public static OFFSET_Y: string = "offset_y";
    public static OFFSET_TIME: string = "offset_time";

    public static TIME_LIFE: string = "time_life";

    public static STATE: string = "state";
    public static CARD_AMOUNT: string = "card_amount";
    public static MONEY_IN_GAME: string = "money_in_game";
    public static CARD: string = "card";


    public static TELCO: string = "telco";
    public static EXCHANGE_RATE: string = "exchange_rate";
    public static CARD_SERIAL: string = "card_code";
    public static CARD_PIN: string = "card_pin";
    public static GIFT_INFO: string = "gift_info";
    public static FEE: string = "fee";
    public static PROVIDER: string = "provider";
    public static CARD_RECHARGE: string = "card_recharge";
    public static GIFT_EXCHANGE: string = "gift_exchange";
    public static START_DIRECT: string = "start_direct";
    public static EDITION_ID: string = "edition_id";
    public static RULE_CASHOUT: string = "rule_cashout";

    public static GOLD: string = "gold";
    public static BUILD_ID: string = "build_id";

    public static SIZE_USERS: string = "size_users";
    public static SIZE_SPEC: string = "size_spec";


    public static PAGE: string = "page";
    public static SIZE: string = "size";
    public static META: string = "meta";
    public static USERS: string = "users";
    public static TALENT: string = "talent";
    public static NUMBER: string = "number";
    public static STREAM_URL: string = "stream_url";
    public static ADMIN: string = "admin";
    public static HLS_URL: string = "hls_url";
    public static RTMP_URL: string = "rtmp_url";
    public static ROLE_ID: string = "role_id";
    public static AD_PERMISSION: string = "ad_permission";
    public static POINT_CHANGE: string = "point_change";
    public static ONAIR_STATE: string = "onair_state";
    public static VALUE_SHARE: string = "value_share";
    public static VALUE_LIKE: string = "value_like";
}

export class ExtParamsKey {
    // ================================================
    // COMMON
    // ================================================
    public static RESULT: string = "result";
    public static MESSAGE: string = "message";
    public static STATUS: string = "status";
    public static USER: string = "user";
    public static USER_NAME: string = "user_name";

    public static PASSWORD: string = "password";
    public static SIGN: string = "sign";
    public static ACCESS_KEY: string = "access_key";
    public static OPENID: string = "openid";
    public static TITLE: string = "title";
    public static AVATAR: string = "avatar";
    public static DEVICE_NAME: string = "device_name";
    public static DEVICE_ID: string = "device_id";
    public static PLATFORM: string = "platform";
    public static VERSION: string = "version";
    public static EMAIL: string = "email";
    public static REG_TYPE: string = "reg_type";
    public static FIELD: string = "field";
    public static ID: string = "id";
    public static RANGE: string = "range";
    public static TYPE: string = "type";
    public static CONTENT: string = "content";
    public static USER_SENT: string = "user_sent";
    public static TIME: string = "time";
    public static META: string = "meta";
    public static COUNT: string = "count";
    public static OLD_PASS: string = "old_pass";
    public static NEW_PASS: string = "new_pass";
    public static TIME_START: string = "time_start";
    public static TIME_END: string = "time_end";
    public static ORDERING: string = "ordering";
    public static ROOM_ID: string = "room_id";
    public static MONEY_BEFORE: string = "money_before";
    public static MONEY_AFTER: string = "money_after";
    public static AMOUNT: string = "amount";
    public static MONEY_CHANGE: string = "money_change";
    public static CODE: string = "code";
    public static SERIAL: string = "serial";
    public static TELCO: string = "telco";
    public static FOLLOWING: string = "following";
    public static TALENT_NAME: string = "talent_name";
    public static EXCHANGE_RATE: string = "exchange_rate";
    public static SHOW: string = "show";
    public static ROOM_INFO: string = "room_info";
    public static TALENT_INFO: string = "talent_info";
    public static IMAGE: string = "image";
    public static ORDER_FIELD: string = "order_field";
    public static KEYWORD: string = "keyword";
    public static TOP_VALUE: string = "top_value";
}

export class ParamBuilder_Inroom {
    params = {};
    constructor() {

    }
    public static builder() {
        return new ParamBuilder_Inroom();
    }
    public add(key, value) {
        this.params[key] = value;
        return this;
    }
    public build() {
        return this.params;
    }
}

export class ParamBuilder {
    items = [];
    constructor() {

    }
    public static builder() {
        return new ParamBuilder();
    }
    public add(key, value) {
        let item =
            {
                key: key,
                value: value
            };
        this.items.push(item);
        return this;
    }
    public build() {
        let params: string = '';
        for (var i = 0; i < this.items.length; i++) {
            params += this.items[i].key + '=' + this.items[i].value;
            if (i != this.items.length - 1) {
                params += '&';
            }
        }
        return params;
    }
}

export class FieldsBuilder {
    fields = "";
    constructor() {

    }
    public static builder() {
        return new FieldsBuilder();
    }
    public addFirst(field) {
        this.fields += field;
        return this;
    }

    public add(field) {
        this.fields += ','
        this.fields += field;
        return this;
    }

    public build() {
        return this.fields;
    }
}

export class ResponsePomelo {
    route = '';
    params = {};
    constructor(route: string, params: any) {
        this.route = route;
        this.params = params;
        //console.log("route: " + route + "\nparams: " + JSON.stringify(params));
    }

}



