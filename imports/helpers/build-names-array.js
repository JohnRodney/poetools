import Names from '../api/names/collection.js';
import Stashes from '../api/stash/collection.js'
export const BuildNamesArray =  function() {
  const names = Names.findOne({});
  const listOfNames = names && names.names ? names.names : [];
  Stashes.find({}).forEach((stash, i) => {
    if (i % 1000 === 0) { console.log(i) }
    stash.items.forEach((item, ) => {
      const cleanName = item.name.replace(/<.*>/, '');
      if (listOfNames.indexOf(cleanName) === -1) {
        listOfNames.push(cleanName);
      }
    });
  });
  if (names) {
    Names.update({ _id: names._id }, { names: listOfNames });
  } else {
    Names.insert({ names: listOfNames })
  }
}
