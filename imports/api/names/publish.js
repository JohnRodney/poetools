import { Meteor } from 'meteor/meteor';
import Names from './collection.js';

Meteor.publish('names', () => {
  return Names.find();
});
