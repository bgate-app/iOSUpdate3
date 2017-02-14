import {UserPreview} from './config';

export class UserSendGift {
    user: UserPreview;
    gift: Gift;
    count: number;
    constructor() {
        this.user = UserPreview.createUser();
        this.gift = new Gift();
        this.count = 1;
    }
}


export class Gift {
    id: number;
    name: string;
    avatar: string;
    state: number;
    description: string;
    price: number;
    image_src: string;

    constructor() {
        this.id = -1;
        this.name = "Quà tặng";
        this.avatar = "assets/common/default_gift.png";
        this.state = 1;
        this.description = "";
        this.price = 50;
        this.image_src = '';
    }
}
export class GiftPage {
    gifts: Array<Gift>;
    max_size: number = 8;
    constructor() {
        this.gifts = [];
    }
    public available(): boolean {
        return this.gifts.length < this.max_size;
    }
    add(gift: Gift) {
        this.gifts.push(gift);
    }
}
export class GiftManager {
    gifts: Array<Gift> = [];
    pages: Array<GiftPage> = [];
    constructor() { }
    hasGift() {
        return this.gifts.length > 0;
    }
    onResponseListGifts(data) {
        this.gifts = [];
        this.pages = [];
        this.pages.push(new GiftPage());

        for (let i = 0; i < data.content.length; i++) {
            let gift = new Gift();
            let giftItem = data.content[i];
            gift.id = giftItem.id;
            gift.avatar = giftItem.icon;
            gift.name = giftItem.name;
            gift.price = giftItem.price;
            gift.image_src = giftItem.image_src;
            this.gifts.push(gift);

            if (!this.pages[this.pages.length - 1].available()) this.pages.push(new GiftPage());
            this.pages[this.pages.length - 1].add(gift);

        }


    }

    getGiftByID(id: number): Gift {
        for (let gift of this.gifts) {
            if (id == gift.id) return gift;
        }
        return new Gift();
    }
    getGiftByName(name: string): Gift {
        for (let gift of this.gifts) {
            if (name == gift.name) return gift;
        }
        return new Gift();
    }
}


