import { Meteor } from 'meteor/meteor';
import Stashes from './collection';

Meteor.publish('stashes', accountName => Stashes
    .find({ $and: [{ accountName: { $regex: accountName } }, { $where: 'this.items.length > 1' }] }, { limit: 100 }));
/*
 *[{
   value: 'maximum life',
   type: 'Mode',
 },
   value: 'Atziri's Promise',
   type: 'Name',
 ]
 */
const typeToPropMap = {
  Name: 'name',
  Mod: 'explicitMods',
};

function queryFactory(value) {
  return new RegExp(value, 'i');
}

function buildSingleQuery(queries, i, league) {
  const query = queries[i];
  const queryForMongo = {};
  queryForMongo[typeToPropMap[query.type]] = { $regex: query.value, $options: 'i' };
  queryForMongo.league = league;
  return { items: { $elemMatch: queryForMongo } };
}

Meteor.publish('searchStashes', (queries, league) => {
  if (queries.length === 0) { return []; }
  const finalQuery = buildSingleQuery(queries, 0, league);
  const andArray = [];
  const queryForMongo = {};
  if (queries.length > 1) {
    queries.forEach((query) => {
      if (query.type === 'Mod') {
        andArray.push(queryFactory(query.value));
      } else if (query.type === 'Name') {
        queryForMongo.name = { $regex: query.value, $options: 'i' };
      }
    });
  }

  if (andArray.length > 0) {
    queryForMongo.explicitMods = { $all: andArray };
    queryForMongo.league = league;

    return Stashes.find(
      { items: { $elemMatch: queryForMongo } },
      { limit: 99 });
  }

  return Stashes.find(
    finalQuery,
    { limit: 99 });
});
