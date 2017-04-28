import { KnownMods } from './known-mod-strings';

function findModType(mod, notFountMods) {
  const result = KnownMods.filter(modType => mod.toLowerCase().indexOf(modType) > -1);
  if (result.length > 0) {
    return result[0];
  }

  let searchableModString = mod.substring(mod.length - mod.split('').reverse().join('').search(/[0-9]/), mod.length).replace(/%/g, '').replace(/\)/g, '');
  if (searchableModString[0] === ' ') {
    searchableModString = searchableModString.substring(1, searchableModString.length);
  }
  if (notFountMods.indexOf(searchableModString.toLowerCase()) === -1) {
    notFountMods.push(searchableModString.toLowerCase());
  }

  return false;
}

function makeModSearchable(searchableModsObject, mod, notFountMods) {
  if (mod.indexOf('Adds') > -1) {
    const arrayOfNumbers = mod.split(' ')
      .filter(word => !isNaN(word))
      .map(numbers => parseInt(numbers, 10));

    searchableModsObject.flat.push({
      name: findModType(mod, notFountMods),
      values: arrayOfNumbers,
    });
  } else if (mod.indexOf('%') > -1) {
    const modValue = mod.substring(mod.indexOf('+') + 1, mod.indexOf('%'));
    searchableModsObject.percent.push({
      name: findModType(mod, notFountMods),
      value: parseInt(modValue, 10),
    });
  } else if (mod.indexOf('+') > -1) {
    const modValue = mod.substring(mod.indexOf('+') + 1, mod.indexOf(' '));
    searchableModsObject.flat.push({
      name: findModType(mod, notFountMods),
      value: parseInt(modValue, 10),
    });
  } else {
    searchableModsObject.other.push({ name: findModType(mod, notFountMods) });
  }
}

function breakExplicitMods(item, notFountMods) {
  if (!item.explicitMods || item.typeLine.indexOf('Leaguestone') > -1 || item.frameType === 4 ||
    item.typeLine.indexOf('Flask') > -1) { return item; }

  const searchableModsObject = { flat: [], percent: [], other: [] };

  item.explicitMods.forEach((mod) => {
    makeModSearchable(searchableModsObject, mod, notFountMods);
  });
  if(item.implicitMods) {
    item.implicitMods.forEach((mod) => {
      makeModSearchable(searchableModsObject, mod, notFountMods)
    });
  }

  item.searchableMods = searchableModsObject;
  return item;
}

export const ItemFormat = function(item, notFountMods) {
  item = breakExplicitMods(item, notFountMods);
  return item;
}



function findModType(mod, notFountMods) {
  const result = KnownMods.filter((modType) => {
    return mod.toLowerCase().indexOf(modType) > -1;
  });
  if (result.length > 0) {
    return result[0];
  }


  let searchableModString = mod.substring(mod.length - mod.split('').reverse().join('').search(/[0-9]/), mod.length).replace(/%/g, '').replace(/\)/g, '');
  if (searchableModString[0] === ' ') {
    searchableModString = searchableModString.substring(1, searchableModString.length);
  }
  if (notFountMods.indexOf(searchableModString.toLowerCase()) === -1) {
    notFountMods.push(searchableModString.toLowerCase());
  }

  return false;
}
