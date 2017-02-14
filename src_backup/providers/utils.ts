export class Utils {
    public static reg_phone = /^[0-9+]{6,12}$/;
    public static reg_username = /^[A-Za-z0-9_-]{6,20}$/;
    public static reg_email = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    public static isValidUsername(username) {
        return this.reg_username.test(username);
    }
    public static isValidPhone(phone) {
        return this.reg_phone.test(phone);
    }
    public static isValidEmail(email) {
        return this.reg_email.test(email);
    }

    public static clamp(value: number, min: number, max: number): number {
        if (value < min) return min;
        if (value > max) return max;
        return value;
    }
    public static nFormatter(num: number) {
        let isNegative = false
        if (num < 0) {
            isNegative = true
        }
        num = Math.abs(num)
        let formattedNumber = '';
        if (num >= 1000000000) {
            formattedNumber = (num / 1000000000).toFixed(1).replace(/\.0$/, '') + 'G';
        } else if (num >= 1000000) {
            formattedNumber = (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
        } else if (num >= 1000) {
            formattedNumber = (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
        } else {
            formattedNumber = num + '';
        }
        if (isNegative) { formattedNumber = '-' + formattedNumber }
        return formattedNumber;
    }

    public static getLevelColor(level: number) {
        if (level < 10) return "#097f42";
        if (level < 20) return "#00796a";
        if (level < 30) return "#007a85";
        if (level < 40) return "#0077bb";
        if (level < 50) return "#3167d4";
        if (level < 60) return "#683cad";
        if (level < 70) return "#9e2aaf";
        if (level < 80) return "#c54805";
        if (level < 90) return "#cb3d2f";
        return "d61b5f";
    }
   public static getSexIcon(sex: string) {
        if (sex === "male") {
            return "assets/v2/icon-male.png";
        } else if (sex === "female") {
            return "assets/v2/icon-female.png";
        }
        return "assets/v2/icon-sexunknown.png";
    }


}