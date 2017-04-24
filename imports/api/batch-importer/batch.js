import rp from 'request-promise';
import Stashes from '../stash/collection.js';
import ChangeIndex from '../change-index.jsx';

export const getABatch = function(id) {
  console.log('getting a batch:', id);
  const uri = 'http://www.pathofexile.com/api/public-stash-tabs/?id=' + id;
  var options = { uri, headers: { 'User-Agent': 'Request-Promise' }, json: true };

  rp(options).then(Meteor.bindEnvironment((res) => {
    console.log('server resoponded');
    if (!typeof(res.stashes) === 'object') { getABatch(id); }
    insertOrUpdateBatches(res);
    updateOrCreateChangeId(res);
    queNextBatch(res, id);
  }));
}

function queNextBatch(res, id) {
  setTimeout(Meteor.bindEnvironment(() => { getABatch(res.next_change_id ? res.next_change_id : id)}) , 1000);
}

function updateOrCreateChangeId(res) {
  const { _id } = ChangeIndex.findOne();
  const changeIndex = { value: res.next_change_id };
  if (_id) { return ChangeIndex.update(_id, changeIndex); }
  return ChangeIndex.insert(changeIndex);
}

function insertOrUpdateBatches(res) {
  console.log('doing stuff..')

  res.stashes.forEach((stash, i) => {
    const existingStash = Stashes.findOne({ id: stash.id });
    if (existingStash) {
      Stashes.update({ _id: existingStash._id }, stash);
    } else {
      Stashes.insert(stash);
    }
  });

  console.log('done doing stuff..');
}
