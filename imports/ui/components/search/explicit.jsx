import React from 'react';
import { composeWithTracker } from 'react-komposer';
import Stashes from '../../../api/stash/collection.js';
import Item from '../item.jsx';
import Header from '../header.jsx';
import SearchComponent from './search-component.jsx'
import { Session } from 'meteor/session';
import { setDefaultLoadingComponent } from 'react-komposer';
import { composer } from './search-composer.js';

class Search extends React.Component {
  constructor() {
    super();
  }

  filter(e) {
    console.log(e, 'filter');
  }

  setLeague(league) {
    Session.set('league', league)
    console.log(league, 'set league');
  }

  render() {
    console.log(this.props);
    return (
      <div>
        <Header filter={this.filter} setLeague={this.setLeague} />
        <div className='search-results'>
          <SearchComponent />
          {
            this.props.searchItems.map((item) => {
              return (
                <Item
                  key={Meteor.uuid()}
                  item={item}
                />
              )
            })
          }
        </div>
      </div>
    );
  }
};

const LoadingComponent = () => (
  <div>
    <div className='load-message'>Crunching some numbers...</div>
    <div className='loader'>Searching</div>
  </div>
);
setDefaultLoadingComponent(LoadingComponent);
export default composeWithTracker(composer)(Search);
