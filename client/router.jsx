import Home from '../imports/ui/home.jsx';
import { mount } from 'react-mounter';
import StashTab from '../imports/ui/components/stash-tab/stash-tab.jsx';

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
