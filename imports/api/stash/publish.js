import { Meteor } from 'meteor/meteor';
import Stashes from './collection.js';

Meteor.publish('stashes', (accountName) => {
  console.log('publish')
  return Stashes.find({ $and: [{accountName: { $regex: accountName  }}, {$where: "this.items.length > 1" } ]}, { limit: 100 });
});

var fetchCursor = Meteor.wrapAsync(function fetchCursor (cursor, cb) {
  cursor.toArray(cb);
});
