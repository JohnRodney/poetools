import React from 'react';
import { composeWithTracker } from 'react-komposer';
import Stashes from '../../../api/stash/collection.js';
import Item from '../item.jsx';
import Header from '../header.jsx';
import SearchComponent from './search-component.jsx'

class Search extends React.Component {
  constructor() {
    super();
  }

  filter(e) {
    console.log(e, 'filter');
  }

  setLeague(league) {
    console.log(e, 'set league');
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

function composer(props, onData) {
  const pathname = window.location.pathname;
  searchValue = pathname.substring(pathname.lastIndexOf('/') + 1, pathname.length).replace(/%20/g, ' ');
  stashesHandle = Meteor.subscribe('searchStashes', searchValue.replace(/%20/g, ' '));
  if (stashesHandle.ready()) {
    const stashes = Stashes.find().fetch();
    console.log(stashes.length);
    const searchItems = [];
    stashes.forEach((stash) => {
      if(stash.items.length > 0) {
        stash.items.forEach((item) => {
          let found = false;
          // look for multimods
          if (searchValue.indexOf('&') > -1 && item.explicitMods) {

            const allQueries = searchValue.split('&')
            const searchTracker = {};

            allQueries.forEach((query) => {
              searchTracker[query.replace(/ /g, '')] = false;
            });

            allQueries.forEach((query) => {
              item.explicitMods.forEach((mod) => {
                if(mod.toLowerCase().indexOf(query.toLowerCase()) > -1) {
                  searchTracker[query.replace(/ /g, '')] = true;
                }
              });
            });

            const allFound = Object.keys(searchTracker).every((key) => {
              return searchTracker[key];
            });

            if(allFound) {
              item.accountName = stash.accountName;
              searchItems.push(item);
            }
          } else if (item.explicitMods) {
            item.explicitMods.forEach((mod) => {
              if(mod.toLowerCase().indexOf(searchValue.toLowerCase()) > -1) {
                found = true;
              }
            });
          }

          if (found) {
            item.accountName = stash.accountName;
            item.stashName = stash.stash;
            item.player = stash.lastCharacterName;
            searchItems.push(item);
          }
        });
      }
    });
    onData( null, { searchItems });
  }
}

export default composeWithTracker(composer)(Search);
