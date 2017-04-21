import { Meteor } from 'meteor/meteor';
import rp from 'request-promise';
import Stashes from '../imports/api/stash/collection.js';
import ChangeIndex from '../imports/api/change-index.jsx';
import '../imports/api/stash/publish.js';

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
    if (!res.stashes) { getABatch(res.next_change_id); }
    console.log(res.stashes.length);

    res.stashes.forEach((stash) => {
      Stashes.insert(stash);
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
