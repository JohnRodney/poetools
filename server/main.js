import { Meteor } from 'meteor/meteor';
import { getABatch } from '../imports/api/batch-importer/batch.js';
import ChangeIndex from '../imports/api/change-index.jsx';
import '../imports/api/stash/publish.js';

Meteor.startup(() => {
  const index = ChangeIndex.findOne();
  const id = (!index || !index.value) ?'62550831-66057206-61889784-71915785-66836847': index.value;
  getABatch(id);
});
