import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { UserHomePage } from '../pages/user-home/user-home';
import { LoginPage } from '../pages/login/login';
import { RegisterTalentPage } from '../pages/register-talent/register-talent';
import { LiveStreamPage } from '../pages/live-stream/live-stream';
import { LoadingPage } from '../pages/loading/loading';
import { TalentDetailPage } from '../pages/talent-detail/talent-detail';
import { UserDetailPage } from '../pages/user-detail/user-detail';
import { UserStreamPage } from '../pages/user-stream/user-stream';
import { UserInfoPage } from '../pages/user-info/user-info';
import { LoginAccountPage } from '../pages/login-account/login-account';
import { UserRegisterPage } from '../pages/user-register/user-register';
import { StreamCategoryPage } from '../pages/stream-category/stream-category';
import { SuggestTalentPage } from '../pages/suggest-talent/suggest-talent';
import { TopPage } from '../pages/top/top';
import { UserFanPage } from '../pages/user-fan/user-fan';
import { UserFeedbackPage } from '../pages/user-feedback/user-feedback';
import { UserFollowPage } from '../pages/user-follow/user-follow';
import { UserGiftPage } from '../pages/user-gift/user-gift';
import { UserMoneyPage } from '../pages/user-money/user-money';
import { UserSettingPage } from '../pages/user-setting/user-setting';
import { UserMessagePage } from '../pages/user-message/user-message';
import { UserLevelPage } from '../pages/user-level/user-level';
import { AdsPage } from '../pages/ads/ads';
import { UserMessageDetailPage } from '../pages/user-message-detail/user-message-detail';
import { TestPage } from '../pages/test/test';
import { UserEditPage } from '../pages/user-edit/user-edit';
import { NetworkService } from '../providers/network-service';
import { DataService } from '../providers/data-service';
import { ChatService } from '../providers/chat-service';
import { StreamPlugin } from '../providers/stream-plugin';
import { LazyLoadService } from '../providers/lazyload-service';
import { TalentStreamPage } from '../pages/talent-stream/talent-stream';

@NgModule({
  declarations: [
    MyApp,
    LoadingPage,
    UserHomePage,
    LoginPage,
    RegisterTalentPage,
    LiveStreamPage,
    TalentDetailPage,
    UserDetailPage,
    UserStreamPage,
    UserInfoPage,
    LoginAccountPage,
    UserRegisterPage,
    TopPage,
    StreamCategoryPage,
    SuggestTalentPage,
    UserFanPage,
    UserFeedbackPage,
    UserFollowPage,
    UserGiftPage,
    UserMoneyPage,
    UserSettingPage,
    UserStreamPage,
    UserMessagePage,
    UserLevelPage,
    AdsPage,
    TestPage,
    UserEditPage,
    TalentStreamPage,
    UserMessageDetailPage
  ],
  imports: [
    IonicModule.forRoot(MyApp,{
      iconMode: 'ios',
      pageTransition: 'ios',
      scrollAssist: false,
      scrollPadding: false
    })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp, 
    LoadingPage,
    UserHomePage,
    LoginPage,
    RegisterTalentPage,
    LiveStreamPage,
    TalentDetailPage,
    UserDetailPage,
    UserStreamPage,
    UserInfoPage,
    LoginAccountPage,
    UserRegisterPage,
    TopPage,
    StreamCategoryPage,
    SuggestTalentPage,
    UserFanPage,
    UserFeedbackPage,
    UserFollowPage,
    UserGiftPage,
    UserMoneyPage,
    UserSettingPage,
    UserStreamPage,
    UserMessagePage,
    UserLevelPage,
    AdsPage,
    TestPage,
    UserEditPage,
    TalentStreamPage,
    UserMessageDetailPage
  ],
  providers: [NetworkService, DataService, ChatService, LazyLoadService,StreamPlugin,{provide: ErrorHandler, useClass: IonicErrorHandler}]
})
export class AppModule {}
