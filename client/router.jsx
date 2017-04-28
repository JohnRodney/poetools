import { mount } from 'react-mounter';
import Sarch from '../imports/ui/home';
import StashTab from '../imports/ui/components/stash-tab/stash-tab';
import Home from '../imports/ui/components/search/explicit';

FlowRouter.route('/', {
  name: 'home',
  action() {
    mount(Home);
  },
});

FlowRouter.route('/stash-tab/:accountName', {
  name: 'st',
  action() {
    mount(StashTab);
  },
});

FlowRouter.route('/searchUser/', {
  name: 'search',
  action() {
    mount(Search);
  }
});
