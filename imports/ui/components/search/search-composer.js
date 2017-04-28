import Stashes from '../../../api/stash/collection.js';
import Names from '../../../api/names/collection.js';

export const composer = function (props, onData) {
  checkSessions();
  const searchValue = Session.get('query');
  const stashesHandle = Meteor.subscribe('searchStashes', searchValue, Session.get('league'));
  const namesHandle = Meteor.subscribe('names');
  if (stashesHandle.ready() && namesHandle.ready()) {
    const searchItems = findItemsInStashes(searchValue);
    onData( null, { searchItems, names: Names.findOne({}).names });
  }
}

function findItemsInStashes(searchValue) {
  const stashes = Stashes.find().fetch();
  console.log(stashes[0])
  const searchItems = [];

  console.log(stashes.length)
  stashes.map((stash) => {
    return handleStashes(stash, searchItems, searchValue);
  });

  return searchItems;
}

function isMultiModSearch(searchValue) {
  return searchValue.length > 1;
}

function handleStashes(stash, searchItems, searchValue) {
  if(!stash.items.length > 0) { return false; }
  stash.items.map((item) => {
    if (!item.explicitMods) { return false; }
    if (isMultiModSearch(searchValue)) { return filterMultipleMods(searchValue, item, stash, searchItems) }
    return handleSingleModQuery(item, searchValue, stash, searchItems);
  });
}
/*
 *[{
   value: 'maximum life',
   type: 'Mod',
 },
   value: 'Atziri's Promise',
   type: 'Name',
 ]
 */
function handleSingleModQuery(item, searchValue, stash, searchItems) {
  search = searchValue[0];
  if (search.type === 'Mod') {
    item.explicitMods.map((mod) => {
      if(!modContainsSearch(mod, search.value) || !itemMatchesLeague(item)) { return false; }
      storeMetaDataOnItem(item, stash);
      pushIfUnderLimit(searchItems, item);
    });
  } else if (search.type === 'Name') {
    if (item.name.toLowerCase().indexOf(search.value.toLowerCase()) > -1) {
      storeMetaDataOnItem(item, stash);
      pushIfUnderLimit(searchItems, item);
    }
  }
}

function setAllKeysAsFalse(allQueries, searchTracker) {
  allQueries.forEach((query) => { searchTracker[query.replace(/ /g, '')] = false; });
}

function searchForQueryMatch(allQueries, item, searchTracker) {
  allQueries.forEach((query) => {
    item.explicitMods.forEach((mod) => {
      if(mod.toLowerCase().indexOf(query.toLowerCase()) > -1) {
        searchTracker[query.replace(/ /g, '')] = true;
      }
    });
  });
}

function allQueriesWereFound(searchTracker) {
  return Object.keys(searchTracker).every((key) => {
    return searchTracker[key];
  });
}

function itemMatchesLeague(item) {
  return item.league.indexOf(Session.get('league') || '') > -1;
}

function storeMetaDataOnItem(item, stash) {
  item.accountName = stash.accountName;
  item.player = stash.lastCharacterName;
  item.stashName = stash.stash;
}

function filterMultipleMods(searchValue, item, stash, searchItems) {
  const allQueries = searchValue.map((search) => { return search.type === 'Mod' ? search.value : false; })
    .filter((search) => search);
  const searchTracker = {};
  setAllKeysAsFalse(allQueries, searchTracker)
  searchForQueryMatch(allQueries, item, searchTracker);

  if(allQueriesWereFound(searchTracker) && itemMatchesLeague(item) && itemMatchesName(searchValue, item)) {
    storeMetaDataOnItem(item, stash)
    pushIfUnderLimit(searchItems, item)
  }
}

function itemMatchesName(searchValue, item) {
  nameSearch = searchValue.filter((search) => {
    return search.type === 'Name';
  });

  return nameSearch.length > 0 ? item.name.toLowerCase().indexOf(nameSearch[0].value.toLowerCase()) > -1 : true;
}

function pushIfUnderLimit(arr, value) {
  if (arr.length < 100) { arr.push(value); }
}

function checkSessions() {
  if (!Session.get('query')) { Session.set('query', []); }
  if (!Session.get('league')) { Session.set('league', ''); }
}

function modContainsSearch(mod, searchValue) {
  return mod.toLowerCase().indexOf(searchValue.toLowerCase()) > -1
}
