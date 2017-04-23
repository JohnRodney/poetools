import React from 'react';
import Sockets from './sockets.jsx';
import Price from './stash-tab/price.jsx';
import Whisper from './stash-tab/whisper.jsx';

export default class Item extends React.Component {
  constructor() {
    super();
    ['debug', 'mouseEnter', 'mouseLeave'].forEach((prop) => {
      this[prop] = this[prop].bind(this);
    });
    this.state = {
      showSockets: false,
    }
  }

  getItemProperties(item) {
    if(item.properties) {
      return item.properties.map((property, i) => {
        if (!property.values[0] || !property.values[0][0]) { return <div key={item.name + property.name + i}></div> }
        return (
          <div className='item-property' key={item.name + property.name + i}>
            <div className='name'>{ property.name }</div>
            <div className='value'>{property.values[0][0]}</div>
          </div>
        )
      })
    }
  }

  getItemExplicitMods(item) {
    if(item.explicitMods) {
      return item.explicitMods.map((mod, i) => {
        return (
          <div className='item-mod explicit' key={item.name + mod + i}>
            { mod }
          </div>
        )
      })
    }
  }

  getItemImplicitMods(item) {
    if(item.implicitMods) {
      return item.implicitMods.map((mod, i) => {
        return (
          <div className='item-mod implicit' key={item.name + mod + i}>
            { mod }
          </div>
        )
      })
    }
  }

  debug(e) {
    console.log(this.props.item);
    FlowRouter.go('/stash-tab/' + this.props.item.accountName);
  }

  mouseEnter(e) {
    this.setState({ showSockets: true })
  }

  mouseLeave(e) {
    this.setState({ showSockets: false })
  }

  render() {
    const { item } = this.props;
    return (
      <div className='an-item' onClick={this.debug}>
        <Sockets sockets={item.sockets} show={this.state.showSockets} />
        <div className='item-image'>
        <img
          src={item.icon}
          onMouseEnter={this.mouseEnter}
          onMouseLeave={this.mouseLeave}
        />
        </div>
        { item.corrupted ? <div className='corrupted'>Corrupted</div> : '' }
        <div className='item-info'>
          <div className='item-name'>
            { item.name.replace(/<.*>/, '') + ' ' }
            { item.typeLine.replace(/<.*>/, '') }
          </div>
          <div className='ilvl'>
            ilvl: {item.ilvl}
          </div>
          <div className='properties'>
            { this.getItemProperties(item) }
          </div>
          <div className='mods'>
            { this.getItemExplicitMods(item) }
          </div>
          <div className='mods'>
            { this.getItemImplicitMods(item) }
          </div>
          <div className='item-note'>
            <Price note={item.note} />
          </div>
          <Whisper item={item} />
        </div>
      </div>
    )
  }
};
