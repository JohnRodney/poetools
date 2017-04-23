import { Meteor } from 'meteor/meteor';
import Stashes from './collection.js';

Meteor.publish('stashes', (accountName) => {
  console.log('publish')
  return Stashes.find({ $and: [{accountName: { $regex: accountName  }}, {$where: "this.items.length > 1" } ]}, { limit: 100 });
});

Meteor.publish('searchStashes', (value) => {

  let finalQuery = { items: { $elemMatch: { typeLine: 'Portal' , league: 'Hardcore Legacy' }}};
  //let finalQuery = { items: { $elemMatch: { explicitMods: { $regex: value, $options: 'i' } }}};
  const queries = value.split('&');
  const andArray = [];
  if (value.indexOf('&') > -1) {
    queries.forEach((query) => {
      andArray.push(queryFactory(query))
    });
  }

  if(andArray.length > 0) {
    finalQuery = {
      $and: andArray,
    }
    console.log(andArray)
    return Stashes.find(
      { items: { $elemMatch: { explicitMods: { $all: andArray } }}},
      { limit: 99 });
  }

  return Stashes.find(
    finalQuery,
    { limit: 99 });
});

function queryFactory(value) {
  return new RegExp(value, 'i');
}
