import { Facebook, GooglePlus } from 'ionic-native';

export class SocialLogin {

    constructor() {

    }

    public facebookLogin() {
        return new Promise((resolve, reject) => {
            Facebook.login(['email'])
                .then(
                (response) => {
                    resolve(response);
                })
                .catch(
                (error) => {
                });
        });
    }

    public getFacebookUserProfile() {
        return new Promise((resolve, reject) => {
            Facebook.getLoginStatus()
                .then(
                response => {
                    resolve(response);
                })
                .catch(
                error => {
                    reject(error);
                });
        });
    }

    public facebookLogout() {
        return new Promise((resolve, reject) => {
            Facebook.logout()
                .then(
                response => {
                    resolve(response);
                })
                .catch(
                error => {
                    reject(error);
                });
        });
    }
    public googleplusLogin() {
        return new Promise((resolve, reject) => {
            GooglePlus.login({
                "webClientId": '717950871911-3vu3pa7c6upq2m69kafpshtg0ruu536o.apps.googleusercontent.com',
                "offline": true
            })
                .then(
                response => {
                    resolve(response);
                })
                .catch(
                error => {
                    reject(error);
                });
        });
    }

    public googleplusLogout() {
        return new Promise((resolve, reject) => {
            GooglePlus.logout()
                .then(
                response => {
                    resolve(response);
                })
                .catch(
                error => {
                    reject(error);
                });
        });
    }

}