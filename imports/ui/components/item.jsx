import React from 'react';
import Meteor from 'meteor/meteor';
import PropTypes from 'prop-types';
import Sockets from './sockets';
import Price from './stash-tab/price';
import Whisper from './stash-tab/whisper';

export default class Item extends React.Component {
  static getItemProperties(item) {
    if (!item.properties) { return <div />; }

    return item.properties.map((property) => {
      if (!property.values[0] || !property.values[0][0]) {
        return <div key={Meteor.uuid()} />;
      }

      return (
        <div className="item-property" key={Meteor.uuid()}>
          <div className="name">{ property.name }</div>
          <div className="value">{property.values[0][0]}</div>
        </div>
      );
    });
  }

  static getItemExplicitMods(item) {
    if (!item.explicitMods) { return <div />; }

    return item.explicitMods.map(mod => <div className="item-mod explicit" key={Meteor.uuid()}>{mod}</div>);
  }

  static getItemImplicitMods(item) {
    if (!item.implicitMods) { return <div />; }

    return item.implicitMods.map(mod => <div className="item-mod implicit" key={Meteor.uuid()}>{mod}</div>);
  }

  constructor() {
    super();
    ['debug', 'mouseEnter', 'mouseLeave'].forEach((prop) => {
      this[prop] = this[prop].bind(this);
    });
    this.state = {
      showSockets: false,
    };
  }

  debug() {
    FlowRouter.go(`/stash-tab/${this.props.item.accountName}`);
  }

  mouseEnter() {
    this.setState({ showSockets: true });
  }

  mouseLeave() {
    this.setState({ showSockets: false });
  }

  render() {
    const { item } = this.props;
    return (
      <div className="an-item" onClick={this.debug}>
        <Sockets sockets={item.sockets} show={this.state.showSockets} />
        <div className="item-image">
          <img
            alt="some item from the game"
            src={item.icon}
            onMouseEnter={this.mouseEnter}
            onMouseLeave={this.mouseLeave}
          />
        </div>
        { item.corrupted ? <div className="corrupted">Corrupted</div> : '' }
        <div className="item-info">
          <div className="item-name">
            { `${item.name.replace(/<.*>/, '')} `}
            { item.typeLine.replace(/<.*>/, '') }
          </div>
          <div className="ilvl">
            ilvl: {item.ilvl}
          </div>
          <div className="properties">
            { this.constructor.getItemProperties(item) }
          </div>
          <div className="mods">
            { this.constructor.getItemExplicitMods(item) }
          </div>
          <div className="mods">
            { this.constructor.getItemImplicitMods(item) }
          </div>
          <div className="item-note">
            <Price note={item.note} />
          </div>
          <Whisper item={item} />
          { item.league }
        </div>
      </div>
    );
  }
}

Item.propTypes = {
  item: PropTypes.shape({
    corrupted: PropTypes.bool.isRequired,
    descrText: PropTypes.string,
    explicitMods: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
    frameType: PropTypes.number.isRequired,
    h: PropTypes.number.isRequired,
    icon: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    identified: PropTypes.bool.isRequired,
    ilvl: PropTypes.number.isRequired,
    inventoryId: PropTypes.string.isRequired,
    league: PropTypes.string.isRequired,
    lockedToCharacter: PropTypes.bool.isRequired,
    accountName: PropTypes.bool,
    name: PropTypes.string.isRequired,
    socketedItems: PropTypes.arrayOf(PropTypes.any).isRequired,
    sockets: PropTypes.arrayOf(PropTypes.any).isRequired,
    typeLine: PropTypes.string.isRequired,
    verified: PropTypes.bool.isRequired,
    w: PropTypes.number.isRequired,
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
  }).isRequired,
};
