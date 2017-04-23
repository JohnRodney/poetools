export const FindUnknownMods = function(Stashes) {
  const notFountMods = [];
  const stashes = Stashes.find({}, {limit: 50}).fetch();
  for(ii = 0; ii < stashes.length; ii++) {
    const stash = stashes[ii];
    if (stash.items && stash.items.length > 0) {
      for (i = 0; i < stash.items.length; i++) {
        const item = stash.items[i];
        if (!ItemFormat(item, notFountMods)) {
          i = stash.items.length;
          ii = stashes.length;
        }
      }
    }
  }
  console.log(notFountMods.filter((mod) => { return mod !== '' }));
}
