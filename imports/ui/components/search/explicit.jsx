import React from 'react';
import PropTypes from 'prop-types';
import { composeWithTracker, setDefaultLoadingComponent } from 'react-komposer';
import { Session } from 'meteor/session';
import Item from '../item';
import Header from '../header';
import SearchComponent from './search-component';
import { composer } from './search-composer';
import ItemPropType from '../../../proptypes/item';

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
  searchItems: PropTypes.arrayOf(ItemPropType).isRequired,
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
