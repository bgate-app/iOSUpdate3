import { UserSendGift } from '../../providers/gift-service';

export class GiftEffectManager {

    _gift_elements: Array<HTMLElement> = [];

    _gift_element_state = [];

    _gift_requests: Array<UserSendGift> = [];

    onInit() {
        this._gift_elements = [];
        this._gift_elements.push(document.getElementById('mEffect1'));
        this._gift_elements.push(document.getElementById('mEffect2'));
        this._gift_elements.push(document.getElementById('mEffect3'));

        this._gift_element_state = [];
        this._gift_element_state.push(0);
        this._gift_element_state.push(0);
        this._gift_element_state.push(0);
    }
    onStartRoomLive() {
        this._gift_requests = [];
    }

    onUpdate() {
        if (this._gift_requests.length > 0) {
            if (this._gift_elements.length > 0) {
                if (this._gift_element_state[0] == 0 || this._gift_element_state[1] == 0 || this._gift_element_state[2] == 0) {
                    let giftrequest = this._gift_requests.shift();
                    if (this._gift_element_state[0] == 0) {
                        this.showGiftRequest(0, giftrequest);
                        this._gift_element_state[0] = 1;
                    } else if (this._gift_element_state[1] == 0) {
                        this.showGiftRequest(1, giftrequest);
                        this._gift_element_state[1] = 1;
                    } else if (this._gift_element_state[2] == 0) {
                        this.showGiftRequest(2, giftrequest);
                        this._gift_element_state[2] = 1;
                    }
                }
            }
        }
    }


    showGiftRequest(id: number, gift: UserSendGift) {
        let element = this._gift_elements[id];
        let user_avatar = <HTMLImageElement>(element.getElementsByClassName("user-send-gift-avatar")[0]);
        let user_name = <HTMLSpanElement>(element.getElementsByClassName("user-send-gift-name")[0]);
        let gift_avatar = <HTMLImageElement>(element.getElementsByClassName("gift_img")[0]);

        user_avatar.src = gift.user.avatar;
        gift_avatar.src = gift.gift.avatar;
        user_name.innerHTML = gift.user.name + " gửi tặng ";


        element.classList.remove("mGiftEffect-hide");
        element.classList.add("mGiftEffect-show");

        setTimeout(() => {
            element.classList.remove("mGiftEffect-show");
            element.classList.add("mGiftEffect-hide");
        }, 1500);

        setTimeout(() => {
            this._gift_element_state[id] = 0;
        }, 2000);

    }

    addGiftRequest(gift : UserSendGift){
        this._gift_requests.push(gift);
    }
}