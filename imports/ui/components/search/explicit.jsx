import React from 'react';
import PropTypes from 'prop-types';
import { composeWithTracker, setDefaultLoadingComponent } from 'react-komposer';
import { Session } from 'meteor/session';
import Item from '../item';
import Header from '../header';
import SearchComponent from './search-component';
import { composer } from './search-composer';

class Search extends React.Component {
  static filter(/* e */) {
    // console.log(e, 'filter');
  }

  static setLeague(league) {
    Session.set('league', league);
  }

  render() {
    const noItemsToDisplay = this.props.searchItems.length === 0 ? (<div className="no-items">No items found</div>) : '';
    return (
      <div>
        <Header filter={this.constructor.filter} setLeague={this.constructor.setLeague} />
        <div className="search-results">
          <SearchComponent names={this.props.names} />
          {
            this.props.searchItems.map(item => (
              <Item
                key={Meteor.uuid()}
                item={item}
              />
            ))
          }
          { noItemsToDisplay }
        </div>
      </div>
    );
  }
}

Search.propTypes = {
  searchItems: PropTypes.arrayOf(PropTypes.shape({
    accountName: PropTypes.string.isRequired,
    corrupted: PropTypes.bool.isRequired,
    explicitMods: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
    flavourText: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
    frameType: PropTypes.number.isRequired,
    h: PropTypes.number.isRequired,
    icon: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    identified: PropTypes.bool.isRequired,
    ilvl: PropTypes.number.isRequired,
    implicitMods: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
    inventoryId: PropTypes.string.isRequired,
    league: PropTypes.string.isRequired,
    lockedToCharacter: PropTypes.bool.isRequired,
    name: PropTypes.string.isRequired,
    note: PropTypes.string,
    player: PropTypes.string.isRequired,
    requirements: PropTypes.arrayOf(PropTypes.shape({
      displayMode: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      values: PropTypes.arrayOf(
        PropTypes.arrayOf(
          PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.number,
          ])).isRequired).isRequired,
    }).isRequired).isRequired,
    socketedItems: PropTypes.arrayOf(PropTypes.any).isRequired,
    sockets: PropTypes.arrayOf(PropTypes.any).isRequired,
    stashName: PropTypes.string.isRequired,
    typeLine: PropTypes.string.isRequired,
    verified: PropTypes.bool.isRequired,
    w: PropTypes.number.isRequired,
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
  }).isRequired).isRequired,
  names: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
};

const LoadingComponent = () => (
  <div>
    <div className="load-message">Crunching some numbers...</div>
    <div className="loader">Searching</div>
  </div>
);
setDefaultLoadingComponent(LoadingComponent);

export default composeWithTracker(composer)(Search);
