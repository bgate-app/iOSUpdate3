import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import { Cmd, ExtParamsKey, ParamBuilder, NetworkConfig, UserManagerField, FieldsBuilder } from './network-config';
import { UserDevice } from './config';
import { Md5 } from 'ts-md5/dist/md5';



@Injectable()
export class NetworkService {
    mDevice: UserDevice;
    constructor(public http: Http) {

    }
    setUserDevice(userDevice: UserDevice) {
        this.mDevice = userDevice;
    }

    public checkNetwork() {
        return new Promise((success, error) => {
            this.http.get('https://www.google.com', {})
                .subscribe(
                data => {
                    success(true);
                },
                err => {
                    error(false);
                }
                );
        });
    }

    ////////////////HTTP/////////////////////////////
    public get(cmd: string, params: string) {
        params = params.replace(" ", "%20");
        let serviceURL = NetworkConfig.MAIN_URL + cmd;
        if (params.length > 0) {
            serviceURL += "?" + params;
        }
        let header = new Headers();
        if (NetworkConfig.DEBUG_REQUEST) {
            console.log("Request Get: " + serviceURL);
        }
        header.append('Content-Type', 'application/x-www-form-urlencoded; charset=utf-8');
        return new Promise((success, error) => {
            this.http.get(serviceURL, { headers: header })
                .subscribe(
                data => {
                    if (NetworkConfig.DEBUG_RESPONSE) {
                        console.log(data);
                    }
                    success(data.json());
                },
                err => {
                    error(err.json());
                });
        });

    }
    public post(cmd: string, params: string) {
        let serviceURL = NetworkConfig.MAIN_URL + cmd;
        let header = new Headers();
        header.append('Content-Type', 'application/x-www-form-urlencoded; charset=utf-8');
        if (NetworkConfig.DEBUG_REQUEST) {
            console.log("Request Post: " + serviceURL + "   Params : " + params);
        }
        return new Promise((success, error) => {
            this.http.post(serviceURL, params, { headers: header })
                .subscribe(
                data => {
                    if (NetworkConfig.DEBUG_RESPONSE) {
                        console.log(data);
                    }
                    success(data.json());
                },
                err => {
                    error(err.json());
                });
        });
    }

    getFace(url) {
        let header = new Headers();
        header.append('Content-Type', 'application/x-www-form-urlencoded; charset=utf-8');

        return new Promise((success, error) => {
            this.http.get(url, { headers: header })
                .subscribe(
                data => { success(data.json()); },
                err => { error(err.json()); }
                );
        });

    }

    onLoginFacebookSucces(userid, token) {
        let url = 'https://graph.facebook.com/v2.7/' + userid + '?access_token=' + token;
        let header = new Headers();
        header.append('Content-Type', 'application/x-www-form-urlencoded; charset=utf-8');

        return new Promise((success, error) => {
            this.http.get(url, { headers: header })
                .subscribe(
                data => { success(data.json()); },
                err => { error(err.json()); }
                );
        });
    }
    public requestGetClientConfig(client_id: string, package_name: string) {
        return this.post(Cmd.CLIENT_CONFIG, ParamBuilder.builder()
            .add("client_id", client_id)
            .add("package_name", package_name)
            .build());
    }

    public requestRegister(username: string, password: string, email: string) {
        return this.post(Cmd.USER_REGISTER, ParamBuilder.builder()
            .add(ExtParamsKey.USER_NAME, username)
            .add(ExtParamsKey.PASSWORD, password)
            .add(ExtParamsKey.EMAIL, email)
            .add(ExtParamsKey.PLATFORM, this.mDevice.platform)
            .add(ExtParamsKey.DEVICE_ID, this.mDevice.device_id)
            .add(ExtParamsKey.DEVICE_NAME, this.mDevice.device_name)
            .add(ExtParamsKey.VERSION, NetworkConfig.VERSION)
            .add(ExtParamsKey.SIGN, Md5.hashStr(username + password + NetworkConfig.CLIENT_KEY))
            .build());
    }

    public requestLogin() {
        return this.post(Cmd.USER_LOGIN, ParamBuilder.builder()
            .add(ExtParamsKey.VERSION, NetworkConfig.VERSION)
            .add(ExtParamsKey.DEVICE_ID, this.mDevice.device_id)
            .add(ExtParamsKey.DEVICE_NAME, this.mDevice.device_name)
            .add(ExtParamsKey.ACCESS_KEY, NetworkConfig.ACESSKEY)
            .add(ExtParamsKey.SIGN, Md5.hashStr(NetworkConfig.ACESSKEY + NetworkConfig.CLIENT_KEY))
            .build());
    }

    public requestGetAcessKey(username: string, password: string) {

        return this.post(Cmd.USER_GET_ACCESSKEY, ParamBuilder.builder()
            .add(ExtParamsKey.USER_NAME, username)
            .add(ExtParamsKey.PASSWORD, password)
            .add(ExtParamsKey.SIGN, Md5.hashStr(username + password + NetworkConfig.CLIENT_KEY))
            .build());
    }

    public requestGetAcessKeyWithOpenIDFB(userid: string, title: string, email: string) {
        let openID = "fb_" + userid;
        return this.post(Cmd.USER_GET_OPENID, ParamBuilder.builder()
            .add(ExtParamsKey.OPENID, openID)
            .add(ExtParamsKey.TITLE, title)
            .add(ExtParamsKey.AVATAR, "https://graph.facebook.com/" + userid + "/picture?width=100&height=100")
            .add(ExtParamsKey.REG_TYPE, 1)
            .add(ExtParamsKey.EMAIL, email)
            .add(ExtParamsKey.VERSION, NetworkConfig.VERSION)
            .add(ExtParamsKey.DEVICE_ID, this.mDevice.device_id)
            .add(ExtParamsKey.DEVICE_NAME, this.mDevice.device_name)
            .add(ExtParamsKey.PLATFORM, this.mDevice.platform)
            .add(ExtParamsKey.SIGN, Md5.hashStr(openID + NetworkConfig.CLIENT_KEY))
            .build());
    }

    public requestGetAcessKeyWithOpenIDGP(userid: string, title: string, avatar: string, email: string) {
        return this.post(Cmd.USER_GET_OPENID, ParamBuilder.builder()
            .add(ExtParamsKey.OPENID, userid)
            .add(ExtParamsKey.TITLE, title)
            .add(ExtParamsKey.AVATAR, avatar)
            .add(ExtParamsKey.REG_TYPE, 2)
            .add(ExtParamsKey.EMAIL, email)
            .add(ExtParamsKey.VERSION, NetworkConfig.VERSION)
            .add(ExtParamsKey.DEVICE_ID, this.mDevice.device_id)
            .add(ExtParamsKey.DEVICE_NAME, this.mDevice.device_name)
            .add(ExtParamsKey.PLATFORM, this.mDevice.platform)
            .add(ExtParamsKey.SIGN, Md5.hashStr(userid + NetworkConfig.CLIENT_KEY))
            .build());
    }
    public requestGetUserInfo() {
        return this.get(Cmd.USER_INFO, ParamBuilder.builder()
            .add(ExtParamsKey.ACCESS_KEY, NetworkConfig.ACESSKEY)
            .add(ExtParamsKey.SIGN, Md5.hashStr(NetworkConfig.ACESSKEY + NetworkConfig.CLIENT_KEY))
            .build());
    }
    // public requestGetUserInfo(field: string) {
    //     return this.get(Cmd.USER_INFO, ParamBuilder.builder()
    //         .add(ExtParamsKey.ACCESS_KEY, NetworkConfig.ACESSKEY)
    //         .add(ExtParamsKey.FIELD, field)
    //         .add(ExtParamsKey.SIGN, Md5.hashStr(NetworkConfig.ACESSKEY + NetworkConfig.CLIENT_KEY))
    //         .build());
    // }

    public requestGetGiftList() {
        return this.get(Cmd.GIFT_LIST, ParamBuilder.builder()
            .build());
    }

    public requestUpdateUserInfo(field: string, content: any) {
        return this.post(Cmd.USER_UPDATE_INFO, ParamBuilder.builder()
            .add(field, content)
            .add(ExtParamsKey.ACCESS_KEY, NetworkConfig.ACESSKEY)
            .build());
    }

    public requestUploadAvatar(path: string) {
        let header = new Headers();

        header.append('Content-Type', 'application/x-www-form-urlencoded; charset=utf-8');
        //header.append('X-access_key', '43662d9cb4a5ed12e31514568ad20f59');
        return new Promise((success, error) => {
            this.http.post(NetworkConfig.AVATAR_UPLOAD_URL, ParamBuilder.builder()
                .add(ExtParamsKey.ACCESS_KEY, NetworkConfig.ACESSKEY)
                .add('avatar', path)
                .build(), { headers: header })
                .subscribe(
                data => {
                    if (NetworkConfig.DEBUG_RESPONSE) {
                        console.log(data.json());
                    }
                    success(data.json());
                },
                err => error(err.json())
                );
        });
    }
    public requestGetUserMessage(range: string) {
        return this.get(Cmd.USER_MESSAGES, ParamBuilder.builder()
            .add(ExtParamsKey.RANGE, range)
            .add(ExtParamsKey.ACCESS_KEY, NetworkConfig.ACESSKEY)
            .build());
    }

    public requestUserReadMessage(id: number) {
        return this.post(Cmd.USER_MESSAGES_READ, ParamBuilder.builder()
            .add(ExtParamsKey.ID, id)
            .add(ExtParamsKey.ACCESS_KEY, NetworkConfig.ACESSKEY)
            .build());
    }

    public requestUserDeleteMessage(id: number) {
        return this.post(Cmd.USER_MESSAGES_DELETE, ParamBuilder.builder()
            .add(ExtParamsKey.ID, id)
            .add(ExtParamsKey.ACCESS_KEY, NetworkConfig.ACESSKEY)
            .build());
    }

    public requestUserChangePassword(oldpass: string, newpass: string) {
        return this.post(Cmd.USER_MESSAGES_READ, ParamBuilder.builder()
            .add(ExtParamsKey.OLD_PASS, oldpass)
            .add(ExtParamsKey.NEW_PASS, newpass)
            .add(ExtParamsKey.SIGN, Md5.hashStr(NetworkConfig.CLIENT_KEY + newpass))
            .build());
    }

    public requestGetUserSendGiftHistory(timestart: string, timeend: string, range: string, ordering: string, field: String) {
        return this.get(Cmd.USER_HISTORY_SEND_GIFT, ParamBuilder.builder()
            .add(ExtParamsKey.TIME_START, timestart)
            .add(ExtParamsKey.TIME_END, timeend)
            .add(ExtParamsKey.RANGE, range)
            .add(ExtParamsKey.ORDERING, ordering)
            .add(ExtParamsKey.FIELD, field)
            .add(ExtParamsKey.ACCESS_KEY, NetworkConfig.ACESSKEY)
            .build());
    }

    public requestGetUserPaymentHistory(timestart: string, timeend: string, range: string, ordering: string) {
        return this.get(Cmd.USER_HISTORY_PAYMENT, ParamBuilder.builder()
            .add(ExtParamsKey.TIME_START, timestart)
            .add(ExtParamsKey.TIME_END, timeend)
            .add(ExtParamsKey.RANGE, range)
            .add(ExtParamsKey.ORDERING, ordering)
            .build());
    }
    public requestUserFollowings(range: string, field: string) {
        return this.get(Cmd.USER_FOLLOWING, ParamBuilder.builder()
            .add(ExtParamsKey.RANGE, range)
            .add(ExtParamsKey.FIELD, field)
            .add(ExtParamsKey.ACCESS_KEY, NetworkConfig.ACESSKEY)
            .build());
    }
    public requestListTalentFollowing(range: string) {
        return this.get(Cmd.USER_FOLLOWING, ParamBuilder.builder()
            .add(ExtParamsKey.RANGE, range)
            .add(ExtParamsKey.ACCESS_KEY, NetworkConfig.ACESSKEY)
            .build());
    }

    public requestUserFollow(talent_name: string) {
        return this.post(Cmd.USER_FOLLOW, ParamBuilder.builder()
            .add(ExtParamsKey.TALENT_NAME, talent_name)
            .add(ExtParamsKey.ACCESS_KEY, NetworkConfig.ACESSKEY)
            .build());
    }

    public requestUserUnFollow(talent_name: string) {
        return this.post(Cmd.USER_UNFOLLOW, ParamBuilder.builder()
            .add(ExtParamsKey.TALENT_NAME, talent_name)
            .add(ExtParamsKey.ACCESS_KEY, NetworkConfig.ACESSKEY)
            .build());
    }

    public requestTalentList(ordering: string, orderfield: string, range: string, field: string) {
        return this.get(Cmd.TALENT_LIST, ParamBuilder.builder()
            .add(ExtParamsKey.ORDERING, ordering)
            .add(ExtParamsKey.ORDER_FIELD, orderfield)
            .add(ExtParamsKey.RANGE, range)
            .add(ExtParamsKey.FIELD, field)
            .build());
    }

    public requestTalentSearch(keyword: string, field: string) {
        return this.get(Cmd.TALENT_SEARCH, ParamBuilder.builder()
            .add(ExtParamsKey.KEYWORD, keyword)
            .add(ExtParamsKey.FIELD, field)
            .add(ExtParamsKey.SIGN, Md5.hashStr(keyword + NetworkConfig.CLIENT_KEY))
            .build());
    }




    public requestTalentInfo(talent_name: string, field: string) {
        return this.get(Cmd.TALENT_INFO, ParamBuilder.builder()
            .add(ExtParamsKey.TALENT_NAME, talent_name)
            .add(ExtParamsKey.FIELD, field)
            .add(ExtParamsKey.ACCESS_KEY, NetworkConfig.ACESSKEY)
            .add(ExtParamsKey.SIGN, Md5.hashStr(talent_name + NetworkConfig.CLIENT_KEY))
            .build());
    }

    public requestCategories() {
        return this.get(Cmd.ROOM_CATEGORIES, ParamBuilder.builder()
            .build());
    }
    public requestAppBanners() {
        return this.get(Cmd.APP_BANNERS, ParamBuilder.builder()
            .build());
    }

    public requestHotLiveStream(range: string, ordering: string, orderfield: string, field: string) {
        return this.get(Cmd.ROOM_LIST, ParamBuilder.builder()
            .add(ExtParamsKey.RANGE, range)
            .add('cat_id', -1)
            .add(ExtParamsKey.ORDERING, ordering)
            .add(ExtParamsKey.ORDER_FIELD, orderfield)
            .add(ExtParamsKey.FIELD, field)
            .build());
    }

    public requestListRoomStream(range: string, ordering: string, orderfield: string, field: string, category?: number, onair?: number) {
        if (category && !onair) {

            return this.get(Cmd.ROOM_LIST, ParamBuilder.builder()
                .add('cat_id', category)
                .add(ExtParamsKey.ORDERING, ordering)
                .add(ExtParamsKey.ORDER_FIELD, orderfield)
                .add(ExtParamsKey.RANGE, range)
                .add(ExtParamsKey.FIELD, field)
                .build());
        }
        else if (!category && onair) {
            return this.get(Cmd.ROOM_LIST, ParamBuilder.builder()
                .add('onair_state', onair)
                .add(ExtParamsKey.ORDERING, ordering)
                .add(ExtParamsKey.ORDER_FIELD, orderfield)
                .add(ExtParamsKey.RANGE, range)
                .add(ExtParamsKey.FIELD, field)
                .build());
        }
        else if (category && onair) {
            return this.get(Cmd.ROOM_LIST, ParamBuilder.builder()
                .add('cat_id', category)
                .add('onair_state', onair)
                .add(ExtParamsKey.ORDERING, ordering)
                .add(ExtParamsKey.ORDER_FIELD, orderfield)
                .add(ExtParamsKey.RANGE, range)

                .add(ExtParamsKey.FIELD, field)
                .build());
        }
        return this.get(Cmd.ROOM_LIST, ParamBuilder.builder()
            .add(ExtParamsKey.ORDERING, ordering)
            .add(ExtParamsKey.ORDER_FIELD, orderfield)
            .add(ExtParamsKey.RANGE, range)
            .add(ExtParamsKey.FIELD, field)
            .build());
    }


    public requestRoomInfo(room_id: string, field: string) {
        return this.get(Cmd.ROOM_INFO + room_id, ParamBuilder.builder()
            .add(ExtParamsKey.FIELD, field)
            .add(ExtParamsKey.ACCESS_KEY, NetworkConfig.ACESSKEY)
            .build());
    }


    public requestTopUserSendGift(type: string) {
        return this.get(Cmd.TOP_USER_SEND_GIFT, ParamBuilder.builder()
            .add(ExtParamsKey.TYPE, type)
            .add(ExtParamsKey.SIGN, Md5.hashStr(type + NetworkConfig.CLIENT_KEY))
            .build());
    }
    public requestTalents(range: string) {
        return this.get(Cmd.TALENT_LIST, ParamBuilder.builder()
            .add(ExtParamsKey.ORDERING, 'desc')
            .add(ExtParamsKey.ORDER_FIELD, UserManagerField.po)
            .add(ExtParamsKey.RANGE, range)
            .add(ExtParamsKey.FIELD, FieldsBuilder.builder()
                .addFirst(UserManagerField.namefield)
                .add(UserManagerField.id)
                .add(UserManagerField.title)
                .add(UserManagerField.avatar)
                .add(UserManagerField.money)
                .add(UserManagerField.level)
                .add(UserManagerField.po)
                .build()
            ).build());
    }
    public requestTopTalentSuggest() {
        return this.get(Cmd.TALENT_LIST, ParamBuilder.builder()
            .add(ExtParamsKey.ORDERING, 'desc')
            .add(ExtParamsKey.ORDER_FIELD, UserManagerField.po)
            .add(ExtParamsKey.RANGE, "0-20")
            .add(ExtParamsKey.FIELD, FieldsBuilder.builder()
                .addFirst(UserManagerField.namefield)
                .add(UserManagerField.id)
                .add(UserManagerField.title)
                .add(UserManagerField.avatar)
                .add(UserManagerField.money)
                .add(UserManagerField.level)
                .add(UserManagerField.po)
                .build()
            ).build());
    }

    public requestTopTalentRecieveGift(type: string) {
        return this.get(Cmd.TOP_USER_RECEIVE_GIFT, ParamBuilder.builder()
            .add(ExtParamsKey.TYPE, type)
            .add(ExtParamsKey.SIGN, Md5.hashStr(type + NetworkConfig.CLIENT_KEY))
            .build());
    }

    public requestTalentTop(talentName: string, type: number, count: number) {
        return this.get(Cmd.TALENT_TOP_USER_SEND_GIFT, ParamBuilder.builder()
            .add(ExtParamsKey.TYPE, type)
            .add(ExtParamsKey.COUNT, count)
            .add(ExtParamsKey.TALENT_NAME, talentName)
            .add(ExtParamsKey.ACCESS_KEY, NetworkConfig.ACESSKEY)
            .add(ExtParamsKey.SIGN, Md5.hashStr(talentName + count + type + NetworkConfig.CLIENT_KEY))
            .build());
    }

    public requestUpdatePushUID() {
        return this.post(Cmd.UPDATE_PUSH_UID, ParamBuilder.builder()
            .add(ExtParamsKey.ACCESS_KEY, NetworkConfig.ACESSKEY)
            .add(ExtParamsKey.ID, "NetworkConfig.ONESIGNAL_CLIENTID")
            .add(ExtParamsKey.SIGN, Md5.hashStr("NetworkConfig.ONESIGNAL_CLIENTID" + NetworkConfig.CLIENT_KEY))
            .build());
    }

    requestUserConfirmPromote(code: string) {
        return this.post(Cmd.USER_CONFIRM_PROMOTE, ParamBuilder.builder()
            .add(ExtParamsKey.ACCESS_KEY, NetworkConfig.ACESSKEY)
            .add(ExtParamsKey.CODE, code)
            .add(ExtParamsKey.SIGN, Md5.hashStr(code + NetworkConfig.CLIENT_KEY))
            .build());
    }
}
