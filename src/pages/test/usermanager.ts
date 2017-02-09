import { UserPreview, RoomLive } from '../../providers/config';

class ObjectManager {
    users: any;
    talents: any;
    rooms: any;
    getUser(username: string): UserPreview {
        if (this.users[username] != undefined) return this.users[username];
        return UserPreview.createUser();
    }

    getTalent(username: string): UserPreview {
        if (this.talents[username] != undefined) return this.talents[username];
        return UserPreview.createTalent();
    }

    getRoom(id): RoomLive {
        if (this.rooms[id] != undefined) return this.rooms[id];
        return new RoomLive();
    }

}