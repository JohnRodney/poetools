import React from 'react';
import { composeWithTracker } from 'react-komposer';
import { setDefaultLoadingComponent } from 'react-komposer';
import Stashes from '../api/stash/collection.js';
import { Session } from 'meteor/session';
import Stash from './stash.jsx';
import Header from './components/header.jsx';

class Home extends React.Component {
  constructor() { super();
    this.state =  {
      stashes: [],
      filter: '',
      league: 'Hardcore',
    }
    this.filter = this.filter.bind(this);
    this.setLeague = this.setLeague.bind(this);
  }

  hasItemsInLeague(stash) {
    return stash.items.filter((item) => {
      if (item.league !== 'Hardcore' && item.league !== 'Standard') { console.log('unicorn', item.league) }
      return item.league === this.state.league;
    }).length > 0;
  }

  getStashTabLayout() {
    return (
      <div className='results-container'>
        {
          this.props.stashes.map((stash, i) => {
            if (!stash.public || stash.items.length === 0 || !this.hasItemsInLeague(stash)) { return []; }
            return (
              <Stash key={'stash' + i} stash={stash} league={this.state.league}/>
            );
          })
        }
      </div>
    )
  }

  filter(e) {
    Session.set('accountName', e.target.value);
  }

  setLeague(league) {
    this.setState({ league });
  }

  render() {
    return (
      <div>
        <Header filter={this.filter} setLeague={this.setLeague}/>
        { this.getStashTabLayout() }
      </div>
    );
  }
};

function composer(props, onData) {
  if (!Session.get('accountName')) { Session.set('accountName', 'Xeno') }
  stashesHandle = Meteor.subscribe('stashes', Session.get('accountName'));
  if (stashesHandle.ready()) {
    const stashes = Stashes.find().fetch();
    onData( null, { stashes });
  }
}

const LoadingComponent = () => (<div className='loader'>Searching</div>);
setDefaultLoadingComponent(LoadingComponent);
export default composeWithTracker(composer)(Home);
