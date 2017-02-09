
import { Injectable } from '@angular/core';

export class Emotion {
    id: number;
    name: string;
    avatar: string;
    html: string;

    constructor() {
        this.id = -1;
        this.name = "default";
        this.avatar = "assets/common/default_emotion.png";
        this.html = ("<img class=\"chat_fan_emoticon\" src=\"" + "assets/common/default_emotion.png\">");
    }
}
@Injectable()
export class ChatService {

    emotions = {
        "(angry-1)": {
            "id": 0,
            "name": "(angry-1)",
            "html": ("<img class=\"chat_fan_emoticon\" src=\"assets/emotion_1/angry-1.png\">"),
            "avatar": "assets/emotion_1/angry-1.png"
        },
        "(angry)": {
            "id": 1,
            "name": "(angry)",
            "html": ("<img class=\"chat_fan_emoticon\" src=\"assets/emotion_1/angry.png\">"),
            "avatar": "assets/emotion_1/angry.png"
        },
        "(bored-1)": {
            "id": 2,
            "name": "(bored-1)",
            "html": ("<img class=\"chat_fan_emoticon\" src=\"assets/emotion_1/bored-1.png\">"),
            "avatar": "assets/emotion_1/bored-1.png"
        },
        "(bored-2)": {
            "id": 3,
            "name": "(bored-2)",
            "html": ("<img class=\"chat_fan_emoticon\" src=\"assets/emotion_1/bored-2.png\">"),
            "avatar": "assets/emotion_1/bored-2.png"
        },
        "(bored)": {
            "id": 4,
            "name": "(bored)",
            "html": ("<img class=\"chat_fan_emoticon\" src=\"assets/emotion_1/bored.png\">"),
            "avatar": "assets/emotion_1/bored.png"
        },
        "(confused-1)": {
            "id": 5,
            "name": "(confused-1)",
            "html": ("<img class=\"chat_fan_emoticon\" src=\"assets/emotion_1/confused-1.png\">"),
            "avatar": "assets/emotion_1/confused-1.png"
        },
        "(confused)": {
            "id": 6,
            "name": "(confused)",
            "html": ("<img class=\"chat_fan_emoticon\" src=\"assets/emotion_1/confused.png\">"),
            "avatar": "assets/emotion_1/confused.png"
        },
        "(crying-1)": {
            "id": 7,
            "name": "(crying-1)",
            "html": ("<img class=\"chat_fan_emoticon\" src=\"assets/emotion_1/crying-1.png\">"),
            "avatar": "assets/emotion_1/crying-1.png"
        },
        "(crying)": {
            "id": 8,
            "name": "(crying)",
            "html": ("<img class=\"chat_fan_emoticon\" src=\"assets/emotion_1/crying.png\">"),
            "avatar": "assets/emotion_1/crying.png"
        },
        "(embarrassed)": {
            "id": 9,
            "name": "(embarrassed)",
            "html": ("<img class=\"chat_fan_emoticon\" src=\"assets/emotion_1/embarrassed.png\">"),
            "avatar": "assets/emotion_1/embarrassed.png"
        },
        "(emoticons)": {
            "id": 10,
            "name": "(emoticons)",
            "html": ("<img class=\"chat_fan_emoticon\" src=\"assets/emotion_1/emoticons.png\">"),
            "avatar": "assets/emotion_1/emoticons.png"
        },
        "(happy-1)": {
            "id": 11,
            "name": "(happy-1)",
            "html": ("<img class=\"chat_fan_emoticon\" src=\"assets/emotion_1/happy-1.png\">"),
            "avatar": "assets/emotion_1/happy-1.png"
        },
        "(:D)": {
            "id": 12,
            "name": "(:D)",
            "html": ("<img class=\"chat_fan_emoticon\" src=\"assets/emotion_1/happy-1.png\">"),
            "avatar": "assets/emotion_1/happy-1.png"
        },
        "(happy-2)": {
            "id": 13,
            "name": "(happy-2)",
            "html": ("<img class=\"chat_fan_emoticon\" src=\"assets/emotion_1/happy-2.png\">"),
            "avatar": "assets/emotion_1/happy-2.png"
        },
        "(:)))": {
            "id": 14,
            "name": "(:)))",
            "html": ("<img class=\"chat_fan_emoticon\" src=\"assets/emotion_1/happy-2.png\">"),
            "avatar": "assets/emotion_1/happy-2.png"
        },
        "(happy-3)": {
            "id": 15,
            "name": "(happy-3)",
            "html": ("<img class=\"chat_fan_emoticon\" src=\"assets/emotion_1/happy-3.png\">"),
            "avatar": "assets/emotion_1/happy-3.png"
        },
        "(happy-4)": {
            "id": 16,
            "name": "happy-4",
            "html": ("<img class=\"chat_fan_emoticon\" src=\"assets/emotion_1/happy-4.png\">"),
            "avatar": "assets/emotion_1/happy-4.png"
        },
        "(happy)": {
            "id": 17,
            "name": "(happy)",
            "html": ("<img class=\"chat_fan_emoticon\" src=\"assets/emotion_1/happy.png\">"),
            "avatar": "assets/emotion_1/happy.png"
        },
        "(:))": {
            "id": 18,
            "name": "(:))",
            "html": ("<img class=\"chat_fan_emoticon\" src=\"assets/emotion_1/happy.png\">"),
            "avatar": "assets/emotion_1/happy.png"
        },
        "(ill)": {
            "id": 19,
            "name": "(ill)",
            "html": ("<img class=\"chat_fan_emoticon\" src=\"assets/emotion_1/ill.png\">"),
            "avatar": "assets/emotion_1/ill.png"
        },
        "(in-love)": {
            "id": 20,
            "name": "(in-love)",
            "html": ("<img class=\"chat_fan_emoticon\" src=\"assets/emotion_1/in-love.png\">"),
            "avatar": "assets/emotion_1/in-love.png"
        },
        "(kissing)": {
            "id": 21,
            "name": "(kissing)",
            "html": ("<img class=\"chat_fan_emoticon\" src=\"assets/emotion_1/kissing.png\">"),
            "avatar": "assets/emotion_1/kissing.png"
        },
        "(mad)": {
            "id": 22,
            "name": "(mad)",
            "html": ("<img class=\"chat_fan_emoticon\" src=\"assets/emotion_1/mad.png\">"),
            "avatar": "assets/emotion_1/mad.png"
        },
        "(nerd)": {
            "id": 23,
            "name": "(nerd)",
            "html": ("<img class=\"chat_fan_emoticon\" src=\"assets/emotion_1/nerd.png\">"),
            "avatar": "assets/emotion_1/nerd.png"
        },
        "(ninja)": {
            "id": 24,
            "name": "(ninja)",
            "html": ("<img class=\"chat_fan_emoticon\" src=\"assets/emotion_1/ninja.png\">"),
            "avatar": "assets/emotion_1/ninja.png"
        },
        "(quiet)": {
            "id": 25,
            "name": "(quiet)",
            "html": ("<img class=\"chat_fan_emoticon\" src=\"assets/emotion_1/quiet.png\">"),
            "avatar": "assets/emotion_1/quiet.png"
        },
        "(sad)": {
            "id": 26,
            "name": "(sad)",
            "html": ("<img class=\"chat_fan_emoticon\" src=\"assets/emotion_1/sad.png\">"),
            "avatar": "assets/emotion_1/sad.png"
        },
        "(:()": {
            "id": 27,
            "name": "(:()",
            "html": ("<img class=\"chat_fan_emoticon\" src=\"assets/emotion_1/sad.png\">"),
            "avatar": "assets/emotion_1/sad.png"
        },
        "(secret)": {
            "id": 28,
            "name": "(secret)",
            "html": ("<img class=\"chat_fan_emoticon\" src=\"assets/emotion_1/secret.png\">"),
            "avatar": "assets/emotion_1/secret.png"
        },
        "(smart)": {
            "id": 29,
            "name": "(smart)",
            "html": ("<img class=\"chat_fan_emoticon\" src=\"assets/emotion_1/smart.png\">"),
            "avatar": "assets/emotion_1/smart.png"
        },
        "(smile)": {
            "id": 30,
            "name": "(smile)",
            "html": ("<img class=\"chat_fan_emoticon\" src=\"assets/emotion_1/smile.png\">"),
            "avatar": "assets/emotion_1/smile.png"
        },
        "(smiling)": {
            "id": 31,
            "name": "(smiling)",
            "html": ("<img class=\"chat_fan_emoticon\" src=\"assets/emotion_1/smiling.png\">"),
            "avatar": "assets/emotion_1/smiling.png"
        },
        "(surprised-1)": {
            "id": 32,
            "name": "(surprised-1)",
            "html": ("<img class=\"chat_fan_emoticon\" src=\"assets/emotion_1/surprised-1.png\">"),
            "avatar": "assets/emotion_1/surprised-1.png"
        },
        "(surprised)": {
            "id": 33,
            "name": "(surprised)",
            "html": ("<img class=\"chat_fan_emoticon\" src=\"assets/emotion_1/surprised.png\">"),
            "avatar": "assets/emotion_1/surprised.png"
        },
        "(suspicious-1)": {
            "id": 34,
            "name": "(suspicious-1)",
            "html": ("<img class=\"chat_fan_emoticon\" src=\"assets/emotion_1/suspicious-1.png\">"),
            "avatar": "assets/emotion_1/suspicious-1.png"
        },
        "(suspicious)": {
            "id": 35,
            "name": "(suspicious)",
            "html": ("<img class=\"chat_fan_emoticon\" src=\"assets/emotion_1/suspicious.png\">"),
            "avatar": "assets/emotion_1/suspicious.png"
        },
        "(tongue-out-1)": {
            "id": 36,
            "name": "(tongue-out-1)",
            "html": ("<img class=\"chat_fan_emoticon\" src=\"assets/emotion_1/tongue-out-1.png\">"),
            "avatar": "assets/emotion_1/tongue-out-1.png"
        },
        "(tongue-out)": {
            "id": 37,
            "name": "(tongue-out)",
            "html": ("<img class=\"chat_fan_emoticon\" src=\"assets/emotion_1/tongue-out.png\">"),
            "avatar": "assets/emotion_1/tongue-out.png"
        },
        "(unhappy)": {
            "id": 38,
            "name": "(unhappy)",
            "html": ("<img class=\"chat_fan_emoticon\" src=\"assets/emotion_1/unhappy.png\">"),
            "avatar": "assets/emotion_1/unhappy.png"
        },
        "(:(()": {
            "id": 39,
            "name": "(:(()",
            "html": ("<img class=\"chat_fan_emoticon\" src=\"assets/emotion_1/unhappy.png\">"),
            "avatar": "assets/emotion_1/unhappy.png"
        },
        "(wink)": {
            "id": 40,
            "name": "(wink)",
            "html": ("<img class=\"chat_fan_emoticon\" src=\"assets/emotion_1/wink.png\">"),
            "avatar": "assets/emotion_1/wink.png"
        },
        "(heart)": {
            "id": 41,
            "name": "(heart)",
            "html": ("<img class=\"chat_fan_emoticon\" src=\"assets/emotion_1/heart.png\">"),
            "avatar": "assets/emotion_1/heart.png"
        }
    };

    mEmotions = [
        {
            "id": 0,
            "name": "(angry-1)",
            "html": ("<img class=\"chat_fan_emoticon\" src=\"assets/emotion_1/angry-1.png\">"),
            "avatar": "assets/emotion_1/angry-1.png"
        },
        {
            "id": 1,
            "name": "(angry)",
            "html": ("<img class=\"chat_fan_emoticon\" src=\"assets/emotion_1/angry.png\">"),
            "avatar": "assets/emotion_1/angry.png"
        },
        {
            "id": 2,
            "name": "(bored-1)",
            "html": ("<img class=\"chat_fan_emoticon\" src=\"assets/emotion_1/bored-1.png\">"),
            "avatar": "assets/emotion_1/bored-1.png"
        },
        {
            "id": 3,
            "name": "(bored-2)",
            "html": ("<img class=\"chat_fan_emoticon\" src=\"assets/emotion_1/bored-2.png\">"),
            "avatar": "assets/emotion_1/bored-2.png"
        },
        {
            "id": 4,
            "name": "(bored)",
            "html": ("<img class=\"chat_fan_emoticon\" src=\"assets/emotion_1/bored.png\">"),
            "avatar": "assets/emotion_1/bored.png"
        },
        {
            "id": 5,
            "name": "(confused-1)",
            "html": ("<img class=\"chat_fan_emoticon\" src=\"assets/emotion_1/confused-1.png\">"),
            "avatar": "assets/emotion_1/confused-1.png"
        },
        {
            "id": 6,
            "name": "(confused)",
            "html": ("<img class=\"chat_fan_emoticon\" src=\"assets/emotion_1/confused.png\">"),
            "avatar": "assets/emotion_1/confused.png"
        },
        {
            "id": 7,
            "name": "(crying-1)",
            "html": ("<img class=\"chat_fan_emoticon\" src=\"assets/emotion_1/crying-1.png\">"),
            "avatar": "assets/emotion_1/crying-1.png"
        },
        {
            "id": 8,
            "name": "(crying)",
            "html": ("<img class=\"chat_fan_emoticon\" src=\"assets/emotion_1/crying.png\">"),
            "avatar": "assets/emotion_1/crying.png"
        },
        {
            "id": 9,
            "name": "(embarrassed)",
            "html": ("<img class=\"chat_fan_emoticon\" src=\"assets/emotion_1/embarrassed.png\">"),
            "avatar": "assets/emotion_1/embarrassed.png"
        },
        {
            "id": 10,
            "name": "(emoticons)",
            "html": ("<img class=\"chat_fan_emoticon\" src=\"assets/emotion_1/emoticons.png\">"),
            "avatar": "assets/emotion_1/emoticons.png"
        },
        {
            "id": 11,
            "name": "(happy-1)",
            "html": ("<img class=\"chat_fan_emoticon\" src=\"assets/emotion_1/happy-1.png\">"),
            "avatar": "assets/emotion_1/happy-1.png"
        },
        {
            "id": 12,
            "name": "(:D)",
            "html": ("<img class=\"chat_fan_emoticon\" src=\"assets/emotion_1/happy-1.png\">"),
            "avatar": "assets/emotion_1/happy-1.png"
        },
        {
            "id": 13,
            "name": "(happy-2)",
            "html": ("<img class=\"chat_fan_emoticon\" src=\"assets/emotion_1/happy-2.png\">"),
            "avatar": "assets/emotion_1/happy-2.png"
        },
        {
            "id": 14,
            "name": "(:)))",
            "html": ("<img class=\"chat_fan_emoticon\" src=\"assets/emotion_1/happy-2.png\">"),
            "avatar": "assets/emotion_1/happy-2.png"
        },
        {
            "id": 15,
            "name": "(happy-3)",
            "html": ("<img class=\"chat_fan_emoticon\" src=\"assets/emotion_1/happy-3.png\">"),
            "avatar": "assets/emotion_1/happy-3.png"
        },
        {
            "id": 16,
            "name": "happy-4",
            "html": ("<img class=\"chat_fan_emoticon\" src=\"assets/emotion_1/happy-4.png\">"),
            "avatar": "assets/emotion_1/happy-4.png"
        },
        {
            "id": 17,
            "name": "(happy)",
            "html": ("<img class=\"chat_fan_emoticon\" src=\"assets/emotion_1/happy.png\">"),
            "avatar": "assets/emotion_1/happy.png"
        },
        {
            "id": 18,
            "name": "(:))",
            "html": ("<img class=\"chat_fan_emoticon\" src=\"assets/emotion_1/happy.png\">"),
            "avatar": "assets/emotion_1/happy.png"
        },
        {
            "id": 19,
            "name": "(ill)",
            "html": ("<img class=\"chat_fan_emoticon\" src=\"assets/emotion_1/ill.png\">"),
            "avatar": "assets/emotion_1/ill.png"
        },
        {
            "id": 20,
            "name": "(in-love)",
            "html": ("<img class=\"chat_fan_emoticon\" src=\"assets/emotion_1/in-love.png\">"),
            "avatar": "assets/emotion_1/in-love.png"
        },
        {
            "id": 21,
            "name": "(kissing)",
            "html": ("<img class=\"chat_fan_emoticon\" src=\"assets/emotion_1/kissing.png\">"),
            "avatar": "assets/emotion_1/kissing.png"
        },
        {
            "id": 22,
            "name": "(mad)",
            "html": ("<img class=\"chat_fan_emoticon\" src=\"assets/emotion_1/mad.png\">"),
            "avatar": "assets/emotion_1/mad.png"
        },
        {
            "id": 23,
            "name": "(nerd)",
            "html": ("<img class=\"chat_fan_emoticon\" src=\"assets/emotion_1/nerd.png\">"),
            "avatar": "assets/emotion_1/nerd.png"
        },
        {
            "id": 24,
            "name": "(ninja)",
            "html": ("<img class=\"chat_fan_emoticon\" src=\"assets/emotion_1/ninja.png\">"),
            "avatar": "assets/emotion_1/ninja.png"
        },
        {
            "id": 25,
            "name": "(quiet)",
            "html": ("<img class=\"chat_fan_emoticon\" src=\"assets/emotion_1/quiet.png\">"),
            "avatar": "assets/emotion_1/quiet.png"
        },
        {
            "id": 26,
            "name": "(sad)",
            "html": ("<img class=\"chat_fan_emoticon\" src=\"assets/emotion_1/sad.png\">"),
            "avatar": "assets/emotion_1/sad.png"
        },
        {
            "id": 27,
            "name": "(:()",
            "html": ("<img class=\"chat_fan_emoticon\" src=\"assets/emotion_1/sad.png\">"),
            "avatar": "assets/emotion_1/sad.png"
        },
        {
            "id": 28,
            "name": "(secret)",
            "html": ("<img class=\"chat_fan_emoticon\" src=\"assets/emotion_1/secret.png\">"),
            "avatar": "assets/emotion_1/secret.png"
        },
        {
            "id": 29,
            "name": "(smart)",
            "html": ("<img class=\"chat_fan_emoticon\" src=\"assets/emotion_1/smart.png\">"),
            "avatar": "assets/emotion_1/smart.png"
        },
        {
            "id": 30,
            "name": "(smile)",
            "html": ("<img class=\"chat_fan_emoticon\" src=\"assets/emotion_1/smile.png\">"),
            "avatar": "assets/emotion_1/smile.png"
        },
        {
            "id": 31,
            "name": "(smiling)",
            "html": ("<img class=\"chat_fan_emoticon\" src=\"assets/emotion_1/smiling.png\">"),
            "avatar": "assets/emotion_1/smiling.png"
        },
        {
            "id": 32,
            "name": "(surprised-1)",
            "html": ("<img class=\"chat_fan_emoticon\" src=\"assets/emotion_1/surprised-1.png\">"),
            "avatar": "assets/emotion_1/surprised-1.png"
        },
        {
            "id": 33,
            "name": "(surprised)",
            "html": ("<img class=\"chat_fan_emoticon\" src=\"assets/emotion_1/surprised.png\">"),
            "avatar": "assets/emotion_1/surprised.png"
        },
        {
            "id": 34,
            "name": "(suspicious-1)",
            "html": ("<img class=\"chat_fan_emoticon\" src=\"assets/emotion_1/suspicious-1.png\">"),
            "avatar": "assets/emotion_1/suspicious-1.png"
        },
        {
            "id": 35,
            "name": "(suspicious)",
            "html": ("<img class=\"chat_fan_emoticon\" src=\"assets/emotion_1/suspicious.png\">"),
            "avatar": "assets/emotion_1/suspicious.png"
        },
        {
            "id": 36,
            "name": "(tongue-out-1)",
            "html": ("<img class=\"chat_fan_emoticon\" src=\"assets/emotion_1/tongue-out-1.png\">"),
            "avatar": "assets/emotion_1/tongue-out-1.png"
        },
        {
            "id": 37,
            "name": "(tongue-out)",
            "html": ("<img class=\"chat_fan_emoticon\" src=\"assets/emotion_1/tongue-out.png\">"),
            "avatar": "assets/emotion_1/tongue-out.png"
        },
        {
            "id": 38,
            "name": "(unhappy)",
            "html": ("<img class=\"chat_fan_emoticon\" src=\"assets/emotion_1/unhappy.png\">"),
            "avatar": "assets/emotion_1/unhappy.png"
        },
        {
            "id": 39,
            "name": "(:(()",
            "html": ("<img class=\"chat_fan_emoticon\" src=\"assets/emotion_1/unhappy.png\">"),
            "avatar": "assets/emotion_1/unhappy.png"
        },
        {
            "id": 40,
            "name": "(wink)",
            "html": ("<img class=\"chat_fan_emoticon\" src=\"assets/emotion_1/wink.png\">"),
            "avatar": "assets/emotion_1/wink.png"
        },
        {
            "id": 41,
            "name": "(heart)",
            "html": ("<img class=\"chat_fan_emoticon\" src=\"assets/emotion_1/heart.png\">"),
            "avatar": "assets/emotion_1/heart.png"
        }
    ];
    regExp_1 = /:\)\)|:\)|:D|:\(\(|:\(/g;

    regExp_2 = /\(([^)]+)\)/g;


    public init() {


    }

    public filter(content: string): string {

        let s = content;
        let target = this;
        s = s.replace(this.regExp_1, function (matched) {
            var m = target.emotions["(" + matched + ")"];
            if (m !== undefined && m != null) return m.html;
            return matched;
        });
        s = s.replace(this.regExp_2, function (matched) {
            var m = target.emotions[matched];
            if (m !== undefined && m != null) return m.html;
            return matched;
        });  
        return s;
    }
}

