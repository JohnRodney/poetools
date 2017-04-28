import React from 'react';
import PropTypes from 'prop-types';
import { composeWithTracker, setDefaultLoadingComponent } from 'react-komposer';
import { Session } from 'meteor/session';
import { Meteor } from 'meteor/meteor';
import Stashes from '../api/stash/collection';
import Stash from './stash';
import Header from './components/header';

class Home extends React.Component {
  static filter(e) {
    Session.set('accountName', e.target.value);
  }

  constructor() {
    super();
    this.state = {
      stashes: [],
      filter: '',
      league: 'Hardcore',
    };
    this.setLeague = this.setLeague.bind(this);
  }

  getStashTabLayout() {
    return (
      <div className="results-container">
        {
          this.props.stashes.map((stash) => {
            if (!stash.public || stash.items.length === 0
                || !this.hasItemsInLeague(stash)) { return []; }
            return <Stash key={Meteor.uuid()} stash={stash} league={this.state.league} />;
          })
        }
      </div>
    );
  }

  setLeague(league) {
    this.setState({ league });
  }

  hasItemsInLeague(stash) {
    return stash.items.filter(item => item.league === this.state.league).length > 0;
  }

  render() {
    return (
      <div>
        <Header filter={this.constructor.filter} setLeague={this.setLeague} />
        { this.getStashTabLayout() }
      </div>
    );
  }
}

function composer(props, onData) {
  if (!Session.get('accountName')) { Session.set('accountName', 'Xeno'); }
  const stashesHandle = Meteor.subscribe('stashes', Session.get('accountName'));
  if (stashesHandle.ready()) {
    const stashes = Stashes.find().fetch();
    onData(null, { stashes });
  }
}

const LoadingComponent = () => (<div className="loader">Searching</div>);
setDefaultLoadingComponent(LoadingComponent);
export default composeWithTracker(composer)(Home);

Home.propTypes = {
  stashes: PropTypes.arrayOf(PropTypes.shape({
    _id: PropTypes.shape({
      _str: PropTypes.string.isRequired,
    }).isRequired,
    accountName: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    items: PropTypes.arrayOf(PropTypes.shape({
      corrupted: PropTypes.bool.isRequired,
      descrText: PropTypes.string,
      explicitMods: PropTypes.arrayOf(PropTypes.string.isRequired),
      frameType: PropTypes.number.isRequired,
      h: PropTypes.number.isRequired,
      icon: PropTypes.string.isRequired,
      id: PropTypes.string.isRequired,
      identified: PropTypes.bool.isRequired,
      ilvl: PropTypes.number.isRequired,
      inventoryId: PropTypes.string.isRequired,
      league: PropTypes.string.isRequired,
      lockedToCharacter: PropTypes.bool.isRequired,
      name: PropTypes.string.isRequired,
      socketedItems: PropTypes.arrayOf(PropTypes.any).isRequired,
      sockets: PropTypes.arrayOf(PropTypes.any).isRequired,
      typeLine: PropTypes.string.isRequired,
      verified: PropTypes.bool.isRequired,
      w: PropTypes.number.isRequired,
      x: PropTypes.number.isRequired,
      y: PropTypes.number.isRequired,
    }).isRequired).isRequired,
    lastCharacterName: PropTypes.string.isRequired,
    public: PropTypes.bool.isRequired,
    stash: PropTypes.string.isRequired,
    stashType: PropTypes.string.isRequired,
  }).isRequired).isRequired,
};
