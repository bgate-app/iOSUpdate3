import { UserPreview } from './config';


export class UserService {

    users: any = {};

    findUserByUsername(username: string): UserPreview {
        if (this.users.username == undefined) {
            this.users.username = UserPreview.createUser();
        }
        return <UserPreview>this.users.username;
    }    
    addUser(user: UserPreview) {
        this.users[user.username] = user;
    }
    clean() {
        this.users = {};
    }
    onLoggedOut(){
        this.clean();
    }

}