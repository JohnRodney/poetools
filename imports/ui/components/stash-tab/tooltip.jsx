import React from 'react';

export default class ToolTip extends React.Component {
  constructor() {
    super();
  }

  getFrameType(frameType) {
    return [
      'normal',
      'magic',
      'rare',
      'unique',
      'gem',
      'currency',
      'divination card',
      'quest item',
      'prophecy',
      'relic'
    ][frameType];
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

  renderProperties(item) {
    if(!item.properties) { return ''; }
    return item.properties.map((property) => {
      let name = property.name;
      let value = false;
      if (property.values.length > 0) {
        if(property.name.indexOf('%') > -1) {
          if(property.name.indexOf('%0') > -1) {
            name = name.replace('%0', property.values[0][0])
            value = ''
          }
          if(property.name.indexOf('%1') > -1) {
            name = name.replace('%1', property.values[1][0])
            value = ''
          }
        } else if(property.values[0] && property.values[0].constructor === Array) {
          value = property.values[0][0];
        } else {
          value = property.values[0];
        }
      }

      return (
        <div key={Meteor.uuid()}>
          <span className='property-name'>{value ? name + ': ' : name}</span>
          <span className='property-value'>{value ? value : ''}</span>
        </div>
      )
    });
  }

  render() {
    if (!this.props.show || this.props.item.stub) { return null }
    const { item } = this.props;
    const { name, typeLine } = item;
    const rarity = this.getFrameType(item.frameType);
    const nameLayout = name.replace(/<.*>/, '').length > 0 ? (
        <div className={'name ' + rarity}>
          { name.replace(/<.*>/, '') + ' ' }
        </div>
      ) : '';
    return (
      <div className='tool-tip'>
        <div className={'item-name ' + rarity}>
          { nameLayout }
          <div className={'base ' + rarity}>
            { typeLine.replace(/<.*>/, '') }
          </div>
        </div>
        <div className='properties'>
          { this.renderProperties(item) }
        </div>
        <hr className='tool-tip-divider' />
        <div className='mods'>
          { this.getItemImplicitMods(item) }
        </div>
        <hr className='tool-tip-divider' />
        <div className='mods'>
          { this.getItemExplicitMods(item) }
        </div>
                <div className='unidentified'>{ item.identified ? '' : 'unidentified' }</div>
      </div>
    );
  }
};
