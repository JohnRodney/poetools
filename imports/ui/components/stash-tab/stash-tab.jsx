import React from 'react';
import Header from '../header.jsx';
import { composeWithTracker } from 'react-komposer';
import Stashes from '../../../api/stash/collection.js';
import ToolTip from './tooltip.jsx';
import Sockets from '../sockets.jsx';

class StashTab extends React.Component {
  constructor() {
    super();
    this.state = {
      blocks: this.setupBlocks(),
      activeItem: { name: 'hello', stub: true },
      activeTabIndex: 0,
    }
  }

  setupBlocks() {
    const tabArray = [];
    for(x = 0; x < 12; x++) {
      tabArray[x] = [];
      for(y = 0; y < 12; y++) {
        tabArray[x].push({
          x,
          y,
          taken: false,
        });
      }
    }
    return tabArray;
  }

  setTaken() {
    const blocks = this.setupBlocks();
    this.props.stashes[this.state.activeTabIndex].items.forEach((item) => {
      for(x = 0; x < item.w; x++) {
        for(y = 0; y < item.h; y++) {
          const block = blocks[item.x + x][item.y + y];
          block.taken = true;
          block.item = item;
          if(x === 0 && y === 0) {
            block.render = true;
          }
        }
      }
    })
    this.blocks = blocks;
  }

  filter() {
  }

  setLeague() {
  }

  debug(x, y) {
    return (e) => {
      console.log(this.blocks[x][y]);
    }
  }

  mouseEnter(x, y) {
    const block = this.blocks[x][y];
    return (e) => {
      const activeItem = block.item ? block.item : this.state.activeItem;
      this.setState({ activeItem })
    }
  }

  mouseLeave(x, y) {
  }

  renderTab() {
    this.setTaken();
    const blocks = this.blocks;
    if (!blocks) { return []; }
    const layout = [];
    for(y = 0; y < 12; y++) {
      for(x = 0; x < 12; x++) {
        const block = blocks[x][y];
        const taken = block.taken ? ' taken' : '';
        const content = block.render ? <div><img className='stash-tab-icon' src={block.item.icon} /> <Sockets width={block.item.w} sockets={block.item.sockets} show={true} /> </div>: '';

        layout.push((
          <div
            key={Meteor.uuid()}
            className={'block' + taken}
            onClick={ this.debug(x, y) }
            onMouseEnter={ this.mouseEnter(x, y) }
            onMouseLeave={ this.mouseLeave(x, y) }
          >{ content }</div>
        ))
      }
    }
    return layout;
  }

  render() {
    return (
      <div>
        <Header filter={this.filter} setLeague={this.setLeague}/>
        <div className='stash-tab-body'>
         <ToolTip show={true} item={this.state.activeItem}/>
         {this.renderTab()}
        </div>
        <div className='tabs'>
          {
            this.props.stashes.map((stash, i) => {
              return (
                <div
                  className={this.state.activeTabIndex === i ? 'active' : ''}
                  key={Meteor.uuid()}
                  onClick={ (e) => { this.setState({ activeTabIndex: i }) } }
                >{i}</div>
              );
            })
          }
        </div>

      </div>
    );
  }
};

function composer(props, onData) {
  const pathname = window.location.pathname;
  accountName = pathname.substring(pathname.lastIndexOf('/') + 1, pathname.length);
  stashesHandle = Meteor.subscribe('stashes', accountName);
  if (stashesHandle.ready()) {
    // Find all the stashes for this user that have items
    const stashes = Stashes.find().fetch().filter((stash) => {
      return stash.items && stash.items.length > 0 && stash.accountName === accountName;
    });

    // If the tab has a buyout for all add it to each item
    stashes.forEach((stash) => {
      if (stash.stash.indexOf('b/o') > -1) {
        stash.items.forEach((item) => {
          item.note = stash.stash;
        });
      }
    });
    // send the react component its data
    onData( null, { stashes });
  }
}

export default composeWithTracker(composer)(StashTab);
