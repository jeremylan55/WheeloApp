import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { MyApp } from './app.component';
import { PostPage } from '../pages/post/post';
import { ChatsPage } from '../pages/chats/chats';
import { HomePage } from '../pages/home/home';
import { SettingsPage } from '../pages/settings/settings';
import { TabsPage } from '../pages/tabs/tabs';
import { IntroPage} from '../pages/intro/intro';

@NgModule({
  declarations: [
    MyApp,
    PostPage,
    ChatsPage,
    HomePage,
    SettingsPage,
    TabsPage,
    IntroPage
  ],
  imports: [
    IonicModule.forRoot(MyApp, {
      statusBarPadding: true
    })
  ],
  bootstrap: [IonicApp ],
  entryComponents: [
    MyApp,
    PostPage,
    ChatsPage,
    HomePage,
    SettingsPage,
    TabsPage,
    IntroPage
  ],
  providers: [{provide: ErrorHandler, useClass: IonicErrorHandler}, Storage]
})
export class AppModule {}
