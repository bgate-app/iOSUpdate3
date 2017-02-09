
import { Direction, RoomLive } from '../../providers/config';


export class NextStreamManager {
    mElement: HTMLElement;
    dy: number = 0;
    lastY: number = 0;
    startY: number = 0;
    mTransformY: number = 0;
    capture: boolean = false;
    direction: number = Direction.TOP; /** direction = 0 : up  ||   direction =1  : down */

    mTarget: number = 0;
    mNextLive: RoomLive = new RoomLive();
    mPreviousLive: RoomLive = new RoomLive();
    mSwitchStream: boolean = false;
    mEnableInput: boolean = true;
    vy: number = 0;
    mListener;
    constructor() { }

    setNextRoomListener(listener) {
        this.mListener = listener;
    }
    initInput() {
        this.mElement = document.getElementById('next-stream');
    }
    setNextLive(room: RoomLive) {
        this.mNextLive = room;
    }
    setPreviousLive(room: RoomLive) {
        this.mPreviousLive = room;
    }
    onTouchStart(touch: Touch) {
        if (!this.mEnableInput) return;
        this.startY = touch.clientY;
        this.lastY = touch.clientY;
        this.dy = 0;
    }
    transformNextStreamPoster(y: number) {
        if (this.mElement != undefined) {
            this.mElement.style.transform = "translateY(" + y + "px)";
            this.mElement.style.webkitTransform = "translateY(" + y + "px)";
        }
    }
    close(force: boolean): boolean {
        if (force) {
            this.transformNextStreamPoster(this.mTarget);
        } else {
            this.vy = 0.4 * (this.mTarget - this.mTransformY);
            if (this.vy > 0 && this.vy < .2) this.vy = .2;
            if (this.vy < 0 && this.vy > -.2) this.vy = -.2;
            this.mTransformY += this.vy;
            if (Math.abs(this.mTarget - this.mTransformY) < .5) {
                this.mTransformY = this.mTarget;
                this.transformNextStreamPoster(this.mTransformY);
                return true;
            }
            this.transformNextStreamPoster(this.mTransformY);
        }
        return false;
    }

    onTouchMove(touch: Touch) {
        if (!this.mEnableInput) return;
        this.dy = touch.clientY - this.lastY;
        this.lastY = touch.clientY;
        if (!this.capture) {
            if (Math.abs(this.dy) > 8) {
                this.capture = true;
                this.mElement.style.visibility = "visible";
                if (this.dy > 0) {
                    this.direction = Direction.TOP;
                    this.mElement.style.top = -screen.height + "px";
                    this.mElement.style.backgroundImage = "url(" + this.mPreviousLive.poster + ")";
                } else {
                    this.direction = Direction.BOTTOM;
                    this.mElement.style.top = screen.height + "px";
                    this.mElement.style.backgroundImage = "url(" + this.mNextLive.poster + ")";
                }
            }
        }

        if (this.capture) {
            this.mTransformY = (touch.clientY - this.startY);
            this.transformNextStreamPoster(this.mTransformY);
        }
    }
    onTouchEnded(touch: Touch): RoomLive {
        if (!this.mEnableInput) return;
        if (this.capture) {
            this.mEnableInput = false;
            this.capture = false;
            this.mTarget = 0;
            if (this.direction == Direction.BOTTOM && this.dy < 0) {
                this.mSwitchStream = true;
                this.mTarget = -screen.height;
                return this.mNextLive;
            }

            if (this.direction == Direction.TOP && this.dy > 0) {
                this.mTarget = screen.height;
                this.mSwitchStream = true;
                return this.mPreviousLive;
            }
        }

        return undefined;
    }

    onUpdate() {
        if (!this.mEnableInput) {
            if (this.close(false)) {
                this.mEnableInput = true;
                this.mElement.style.visibility = "hidden";
                if (this.mSwitchStream) {
                    if (this.mListener != undefined) {
                        if (this.direction == Direction.TOP) {
                            this.mListener(this.mPreviousLive);
                        } else if (this.direction == Direction.BOTTOM) {
                            this.mListener(this.mNextLive);
                        }
                    }
                    this.mSwitchStream = false;
                }
            }
        }
    }

    onStartRoomLive() {
        if (this.mElement != undefined) {
            this.mElement.style.top = "0px";
            this.mElement.style.visibility = "hidden";
        }
    }
}