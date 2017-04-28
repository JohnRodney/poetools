import React from 'react';
import PropTypes from 'prop-types';
import { composeWithTracker } from 'react-komposer';
import Header from '../header';
import Stashes from '../../../api/stash/collection';
import ToolTip from './tooltip';
import Sockets from '../sockets';

const defaultItem = JSON.parse('{"verified":false,"w":1,"h":1,"ilvl":55,"icon":"http://web.poecdn.com/image/Art/2DItems/Jewels/basicdex.png?scale=1&w=1&h=1&v=7375b3bb90a9809870b31d1aa4aa68b93","league":"Hardcore Legacy","id":"ebfd91d6fcbaf2bbd5ecaaa7578e673d07dede91409da1d4db8a0511df52545c","sockets":[],"name":"<<set:MS>><<set:M>><<set:S>>Plague Prism","typeLine":"Viridian Jewel","identified":true,"corrupted":false,"lockedToCharacter":false,"explicitMods":["14% increased Physical Damage","5% reduced Mana Cost of Skills"],"descrText":"Place into an allocated Jewel Socket on the Passive Skill Tree. Right click to remove from the Socket.","frameType":2,"x":11,"y":3,"inventoryId":"Stash12","socketedItems":[]}');

function setupBlocks(maxX, maxY) {
  const tabArray = [];
  for (let x = 0; x < maxX; x += 1) {
    tabArray[x] = [];
    for (let y = 0; y < maxY; y += 1) {
      tabArray[x].push({
        x,
        y,
        taken: false,
      });
    }
  }
  return tabArray;
}

class StashTab extends React.Component {
  static transformDivStashTo12by12(items) {
    let y = -1;
    return items
      .map((card, i) => {
        y = Math.floor(i / 12);
        const cardCopy = card;
        cardCopy.x = i % 12;
        cardCopy.y = y;
        return cardCopy;
      });
  }

  constructor() {
    super();
    this.state = {
      blocks: setupBlocks(12, 12),
      activeTabIndex: 0,
      activeItem: defaultItem,
    };
  }

  setTaken() {
    let { items } = this.props.stashes[this.state.activeTabIndex];
    const { stashType } = this.props.stashes[this.state.activeTabIndex];
    if (['DivinationCardStash', 'EssenceStash'].indexOf(stashType) > -1) {
      items = this.constructor.transformDivStashTo12by12(items);
    }

    const blocks = setupBlocks(12, 12);
    items.forEach((item) => {
      for (let x = 0; x < item.w; x += 1) {
        for (let y = 0; y < item.h; y += 1) {
          const block = blocks[item.x + x][item.y + y];
          block.taken = true;
          block.item = item;
          if (x === 0 && y === 0) {
            block.render = true;
          }
        }
      }
    });
    this.blocks = blocks;
  }

  mouseEnter(x, y) {
    const block = this.blocks[x][y];
    return () => {
      const activeItem = block.item ? block.item : this.state.activeItem;
      this.setState({ activeItem });
    };
  }

  renderTab() {
    this.setTaken();
    const blocks = this.blocks;
    if (!blocks) { return []; }
    const layout = [];
    for (let y = 0; y < 12; y += 1) {
      for (let x = 0; x < 12; x += 1) {
        const block = blocks[x][y];
        const taken = block.taken ? ' taken' : '';
        const content = block.render ? <div><img alt="an item" className="stash-tab-icon" src={block.item.icon} /> <Sockets width={block.item.w} sockets={block.item.sockets} show /> </div> : '';

        layout.push((
          <div
            key={Meteor.uuid()}
            className={`block${taken}`}
            onMouseEnter={this.mouseEnter(x, y)}
          >{content}</div>
        ));
      }
    }
    return layout;
  }

  render() {
    return (
      <div>
        <Header filter={() => {}} setLeague={() => {}} />
        <div className="stash-tab-body">
          <ToolTip show item={this.state.activeItem} />
          {this.renderTab()}
        </div>
        <div className="tabs">
          {
            this.props.stashes.map((stash, i) => (
              <div
                className={this.state.activeTabIndex === i ? 'active' : ''}
                key={Meteor.uuid()}
                onClick={() => { this.setState({ activeTabIndex: i }); }}
              >{i}</div>
            ))
          }
        </div>
      </div>
    );
  }
}

function composer(props, onData) {
  const pathname = window.location.pathname;
  const accountName = pathname.substring(pathname.lastIndexOf('/') + 1, pathname.length);
  const stashesHandle = Meteor.subscribe('stashes', accountName);
  if (stashesHandle.ready()) {
    // Find all the stashes for this user that have items
    const stashes = Stashes.find().fetch()
      .filter(stash => stash.items && stash.items.length > 0 && stash.accountName === accountName);

    // If the tab has a buyout for all add it to each item
    stashes.forEach((stash) => {
      if (stash.stash.indexOf('b/o') > -1) {
        stash.items.forEach((item) => {
          const copyItem = item;
          copyItem.note = stash.stash;
        });
      }
    });
    // send the react component its data
    onData(null, { stashes });
  }
}

StashTab.propTypes = {
  stashes: PropTypes.arrayOf(PropTypes.shape({
    _id: PropTypes.shape({
      _str: PropTypes.string.isRequired,
    }).isRequired,
    accountName: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    items: PropTypes.arrayOf(PropTypes.shape({
      corrupted: PropTypes.bool.isRequired,
      descrText: PropTypes.string,
      explicitMods: PropTypes.arrayOf(PropTypes.string.isRequired),
      frameType: PropTypes.number.isRequired,
      h: PropTypes.number.isRequired,
      icon: PropTypes.string.isRequired,
      id: PropTypes.string.isRequired,
      identified: PropTypes.bool.isRequired,
      ilvl: PropTypes.number.isRequired,
      inventoryId: PropTypes.string.isRequired,
      league: PropTypes.string.isRequired,
      lockedToCharacter: PropTypes.bool.isRequired,
      name: PropTypes.string.isRequired,
      socketedItems: PropTypes.arrayOf(PropTypes.any).isRequired,
      sockets: PropTypes.arrayOf(PropTypes.any).isRequired,
      typeLine: PropTypes.string.isRequired,
      verified: PropTypes.bool.isRequired,
      w: PropTypes.number.isRequired,
      x: PropTypes.number.isRequired,
      y: PropTypes.number.isRequired,
    }).isRequired).isRequired,
    lastCharacterName: PropTypes.string.isRequired,
    public: PropTypes.bool.isRequired,
    stash: PropTypes.string.isRequired,
    stashType: PropTypes.string.isRequired,
  }).isRequired).isRequired,
};

export default composeWithTracker(composer)(StashTab);
