import React from 'react';
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

  setLeague(league) {
    Session.set('league', league)
    console.log(league, 'set league');
  }

  render() {
    console.log(this.props);
    const noItemsToDisplay = this.props.searchItems.length === 0 ? (<div className='no-items'>No items found</div>) : '';
    return (
      <div>
        <Header filter={this.filter} setLeague={this.setLeague} />
        <div className='search-results'>
          <SearchComponent names={this.props.names} />
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
          { noItemsToDisplay }
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
