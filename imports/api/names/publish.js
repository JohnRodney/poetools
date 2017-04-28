import { Meteor } from 'meteor/meteor';
import Names from './collection';

Meteor.publish('names', () => Names.find());
