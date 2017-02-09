
enum FloatingState {
    NONE = 0,
    SHOWING,
    FLOATING,
    HIDING,
    DONE
}

class FloatingItem {
    element: HTMLElement;
    state: number;
    vx: number;
    vy: number;
    x: number;
    y: number;
    opacity: number;
    scale: number;
    maxY: number;
    origin_width: number;
    transform : string ;
    constructor(_element: HTMLElement) {
        this.origin_width = 70;
        this.element = _element;
        this.state = FloatingState.NONE;
        this.x = 0;
        this.y = 0;
        this.opacity = 1;
        this.scale = 0.05;
        this.vx = 0;
        this.vy = 0;
        this.maxY = 200;
        this.transform = "";
    }
    getState() {
        return this.state;
    }
    start() {
        this.x = 30;
        this.y = 50;
        this.vy = .5;
        this.scale = 0;
        this.opacity = 1;
        this.vx = (Math.floor(Math.random() * 10) - 20) / 40;
        this.state = FloatingState.SHOWING;
    }
    stop() {
        this.opacity = 0;
        this.apply();
        this.state = FloatingState.NONE;
    }
    isFree() {
        return this.state == FloatingState.NONE;
    }

    update() {
        if (this.state == FloatingState.NONE) return;

        if (this.state == FloatingState.SHOWING) {
            this.doStateShowing();
        } else if (this.state == FloatingState.FLOATING) {
            this.doStateFloating();
        } else if (this.state == FloatingState.HIDING) {
            this.doStateHiding();
        } else if (this.state == FloatingState.DONE) {
            this.stop();
        }
        this.apply();
    }

    doStateShowing() {
        if (this.element == undefined) return;
        this.vx += .005;
        if (this.scale < .3) {
            this.scale = this.scale + 0.01;
        } else {
            this.state = FloatingState.FLOATING;
        }
    }
    doStateFloating() {
        if (this.y < (this.maxY - 80)) {
            this.vx += .01;
        } else {
            this.vx -= .02;
        }
        this.vy += .02;
        if (this.opacity > 0.05) {
            this.opacity -= 0.01;
        }
        if (this.y > this.maxY) {
            this.state = FloatingState.HIDING;
        }
    }
    doStateHiding() {
        this.opacity -= 0.02;
        if (this.scale > .05)
            this.scale -= 0.01;
        this.vx += 0.02;
        this.vy += 0.04;
        if (this.opacity <= 0.05) {
            this.opacity = 0.05;
            this.state = FloatingState.DONE;
            this.y = -1000;
        }
    }
    apply() {
        this.x += this.vx;
        this.y += this.vy;
        this.element.style.opacity = '' + this.opacity;
        this.transform = "translate(" + (-this.x) + "px," + (-this.y) + "px) scale(" + this.scale + ")";
        this.element.style.transform = this.transform;
        this.element.style.webkitTransform = this.transform;
    }
}


export class EffectManager {
    items: Array<FloatingItem> = [];    
    mEnable: boolean = true;
    init() {
        let container = document.getElementById("effect_container");
        for (let i = 0; i < container.childNodes.length; i++) {
            if (container.childNodes[i].nodeType == 1) {
                let element = <HTMLElement>(container.childNodes[i]);
                let item = new FloatingItem(element);
                this.items.push(item);
            }
        }
    }
    public resume() {
        this.mEnable = true;
    }
    public stopAll() {
        this.mFrame = 0;
        for (let item of this.items) {
            item.stop();
        }
        this.update();
        this.mEnable = false;
    }
    public addHeart() {
        for (let item of this.items) {
            if (item.isFree()) {
                item.start();
                return;
            }
        }
    }


    mFrame = 0;
    public update() {
        if (!this.mEnable) return;
        this.mFrame++;
        if (this.mFrame > 40) {
            this.addHeart();
            this.mFrame = 0;
        }
        for (let i = 0; i < this.items.length; i++) {
            let item = this.items[i];
            item.update();
        }
    }
}
