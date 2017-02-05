import { Component } from '@angular/core';

import { HomePage } from '../home/home';
import { PostPage } from '../post/post';
import { ChatsPage } from '../chats/chats';
import { SettingsPage} from '../settings/settings'

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {
  // this tells the tabs component which Pages
  // should be each tab's root Page
  tab1Root: any = HomePage;
  tab2Root: any = ChatsPage;
  tab3Root: any = SettingsPage;

  constructor() {

  }
}
