import { Meteor } from 'meteor/meteor';
import rp from 'request-promise';
import Stashes from '../imports/api/stash/collection.js';
import ChangeIndex from '../imports/api/change-index.jsx';
import '../imports/api/stash/publish.js';
import { ItemFormat } from '../imports/helpers/item-format.jsx';

Meteor.startup(() => {
  const index = ChangeIndex.findOne();
  if (!index || !index.value) {
   getABatch('62550831-66057206-61889784-71915785-66836847');
  } else {
   getABatch(index.value);
  }
});

function getABatch(id) {
  console.log('getting a batch', id)
  const reqId = id || false;
  const uri = reqId ? 'http://www.pathofexile.com/api/public-stash-tabs/?id=' + id : 'http://www.pathofexile.com/api/public-stash-tabs';
  var options = {
      uri: uri,
      qs: {
          // access_token: 'xxxxx xxxxx' // -> uri + '?access_token=xxxxx%20xxxxx'
      },
      headers: {
          'User-Agent': 'Request-Promise'
      },
      json: true // Automatically parses the JSON string in the response
  };

  rp(options).then(Meteor.bindEnvironment((res) => {
    if (!typeof(res.stashes) === 'object') { getABatch(id); }

    res.stashes.forEach((stash) => {
      try {
        // Look for the stash already in the database
        const existingStash = Stashes.findOne({ id: stash.id });
        if (existingStash) {
          Stashes.update({ _id: existingStash._id }, stash);
        } else {
          Stashes.insert(stash);
        }
      } catch (e) {
        console.log('error parsing: ', e)
      }
    });

    console.log('inserted all');
    if (ChangeIndex.findOne() && res.next_change_id) {
      console.log('updating change-index');
      ChangeIndex.update(ChangeIndex.findOne()._id, { value: res.next_change_id });
    } else if(res.next_change_id) {
      ChangeIndex.insert({ value: res.next_change_id });
    }

    if(res.next_change_id) {
      getABatch(res.next_change_id);
    } else {
      setTimeout(() => {getABatch(id)}, 1000);
    }
  }));
}

Meteor.methods({
  getStashTabs(id) {
    /* const reqId = id || false;
    const uri = reqId ? 'http://www.pathofexile.com/api/public-stash-tabs/?id=' + id : 'http://www.pathofexile.com/api/public-stash-tabs';
    var options = {
        uri: uri,
        qs: {
            // access_token: 'xxxxx xxxxx' // -> uri + '?access_token=xxxxx%20xxxxx'
        },
        headers: {
            'User-Agent': 'Request-Promise'
        },
        json: true // Automatically parses the JSON string in the response
    };

    return rp(options); */
    return { stashes: [] };
  }
});
