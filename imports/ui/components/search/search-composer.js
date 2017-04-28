import { Session } from 'meteor/session';
import Stashes from '../../../api/stash/collection';
import Names from '../../../api/names/collection';

function modContainsSearch(mod, searchValue) {
  return mod.toLowerCase().indexOf(searchValue.toLowerCase()) > -1;
}

function pushIfUnderLimit(arr, value) {
  if (arr.length < 100) { arr.push(value); }
}

function storeMetaDataOnItem(item, stash) {
  const itemCopy = item;
  itemCopy.accountName = stash.accountName;
  itemCopy.player = stash.lastCharacterName;
  itemCopy.stashName = stash.stash;
}

function itemMatchesName(searchValue, item) {
  const nameSearch = searchValue.filter(search => search.type === 'Name');
  const validName = nameSearch.length > 0;
  return validName ? item.name.toLowerCase()
    .indexOf(nameSearch[0].value.toLowerCase()) > -1 : true;
}

function itemMatchesLeague(item) {
  return item.league.indexOf(Session.get('league') || '') > -1;
}

function isMultiModSearch(searchValue) {
  return searchValue.length > 1;
}

function allQueriesWereFound(searchTracker) {
  return Object.keys(searchTracker).every(key => searchTracker[key]);
}

function searchForQueryMatch(allQueries, item, searchTracker) {
  const searchCopy = searchTracker;
  allQueries.forEach((query) => {
    item.explicitMods.forEach((mod) => {
      if (mod.toLowerCase().indexOf(query.toLowerCase()) > -1) {
        searchCopy[query.replace(/ /g, '')] = true;
      }
    });
  });
}

function setAllKeysAsFalse(allQueries, searchTracker) {
  const searchCopy = searchTracker;
  allQueries.forEach((query) => { searchCopy[query.replace(/ /g, '')] = false; });
}

function filterMultipleMods(searchValue, item, stash, searchItems) {
  const allQueries = searchValue
    .map(search => (search.type === 'Mod' ? search.value : false))
    .filter(search => search);
  const searchTracker = {};
  setAllKeysAsFalse(allQueries, searchTracker);
  searchForQueryMatch(allQueries, item, searchTracker);

  if (allQueriesWereFound(searchTracker)
      && itemMatchesLeague(item)
      && itemMatchesName(searchValue, item)) {
    storeMetaDataOnItem(item, stash);
    pushIfUnderLimit(searchItems, item);
  }
}

function handleSingleModQuery(item, searchValue, stash, searchItems) {
  const search = searchValue[0];
  if (search.type === 'Mod') {
    item.explicitMods.map((mod) => {
      if (!modContainsSearch(mod, search.value) || !itemMatchesLeague(item)) { return false; }
      storeMetaDataOnItem(item, stash);
      pushIfUnderLimit(searchItems, item);
      return true;
    });
  } else if (search.type === 'Name') {
    if (item.name.toLowerCase().indexOf(search.value.toLowerCase()) > -1) {
      storeMetaDataOnItem(item, stash);
      pushIfUnderLimit(searchItems, item);
    }
  }
}

function handleStashes(stash, searchItems, searchValue) {
  if (!stash.items.length > 0) { return false; }
  stash.items.map((item) => {
    if (!item.explicitMods) { return false; }
    if (isMultiModSearch(searchValue)) {
      return filterMultipleMods(searchValue, item, stash, searchItems);
    }
    return handleSingleModQuery(item, searchValue, stash, searchItems);
  });
  return true;
}

function findItemsInStashes(searchValue) {
  const stashes = Stashes.find().fetch();
  const searchItems = [];
  stashes.map(stash => handleStashes(stash, searchItems, searchValue));

  return searchItems;
}

function checkSessions() {
  if (!Session.get('query')) { Session.set('query', []); }
  if (!Session.get('league')) { Session.set('league', ''); }
}

export const composer = function compoer(props, onData) {
  checkSessions();
  const searchValue = Session.get('query');
  const stashesHandle = Meteor.subscribe('searchStashes', searchValue, Session.get('league'));
  const namesHandle = Meteor.subscribe('names');
  if (stashesHandle.ready() && namesHandle.ready()) {
    const searchItems = findItemsInStashes(searchValue);
    onData(null, { searchItems, names: Names.findOne({}).names });
  }
};

export default composer;
