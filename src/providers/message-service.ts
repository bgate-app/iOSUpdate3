import {  Message, MessageStatus } from './config';


export class MessageManager {
    messages: Array<Message> = [];
    has_new_messages: boolean = false;

    constructor() {

    }
    onResponseMessages(data) {
        this.messages = [];
        this.has_new_messages = false;
        for (let ms of data) {
            let message = new Message();
            message.onResponseMessage(ms);
            if (message.status == MessageStatus.UNREAD) {
                this.has_new_messages = true;
            }
            this.messages.push(message);
        }
    }
}