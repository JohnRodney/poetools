import React from 'react';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import Item from './components/item';

export default class Stash extends React.Component {
  constructor() {
    super();
    this.state = {
      showItems: false,
    };
    this.displayItems = this.displayItems.bind(this);
  }

  getItems() {
    if (!this.state.showItems) { return ''; }
    return (
      <div className="items-container">
        {
          this.props.stash.items.map((item) => {
            if (item.league === this.props.league) {
              return <Item key={Meteor.uuid()} item={item} />;
            }
            return <div key={Meteor.uuid()} />;
          })
        }
      </div>
    );
  }

  displayItems() {
    this.setState({ showItems: !this.state.showItems });
  }

  render() {
    const { stash } = this.props;
    return (
      <div className="a-stash" onClick={() => { FlowRouter.go(`/stash-tab/${stash.accountName}`); }}>
        <p>Account Name: {stash.accountName}</p>
        <p>Character Name: {stash.lastCharacterName}</p>
        <p>Items: {stash.items.length}</p>
        { this.getItems() }
        <div className="clear-fix" />
      </div>
    );
  }
}

Stash.propTypes = {
  stash: PropTypes.shape({
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
  }).isRequired,
  league: PropTypes.string.isRequired,
};
