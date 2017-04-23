import Home from '../imports/ui/home.jsx';
import { mount } from 'react-mounter';
import StashTab from '../imports/ui/components/stash-tab/stash-tab.jsx';
import Search from '../imports/ui/components/search/explicit.jsx';

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

FlowRouter.route('/searchExplicit/:searchValue', {
  name: 'search',
  action() {
    mount(Search);
  }
});
