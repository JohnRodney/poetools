import React from 'react';
import { getFrameType } from '../../../helpers/get-frame-type.jsx';
import Price from './price.jsx';

export default class ToolTip extends React.Component {
  constructor() {
    super();
  }

  getItemMods(item, type) {
    if (!item[type]) { return ''; }
    return item[type].map((mod) => {
      return (
        <div className={'item-mod ' + type.substring(0, type.search(/[A-Z]/))}  key={Meteor.uuid()}>
          { mod.replace(/<.*>/, '').replace(/\{/g, '').replace(/\}/g, '') }
        </div>
      )
    })
  }

  replaceWithValues(name, values) {
    let withValues = name;
    for(i = 0; i < 5; i++) {
      if(withValues.indexOf('%' + i) > -1) {
        withValues = withValues.replace('%' + i, values[i][0])
      }
    }
    return withValues;
  }

  renderProperties(item) {
    if(!item.properties) { return ''; }

    return item.properties.map((property) => {
      const { values } = property;
      let { name } = property;
      let value = false;

      if (values.length > 0) {
        if(name.indexOf('%') > -1) {
          name = this.replaceWithValues(name, values)
        } else if(property.values[0].constructor === Array) {
          value = property.values[0][0]
        } else { value = property.values[0]; }
      }

      return (
        <div key={Meteor.uuid()}>
          <span className='property-name'>{value ? name + ': ' : name}</span>
          <span className='property-value'>{value ? value : ''}</span>
        </div>
      )
    });
  }

  getDescText(item) {
    if (!item.secDescrText) { return <div></div> }
    return <div>{item.secDescrText}</div>;
  }

  getRequirements(item) {
    if (!item.requirements) { return <div></div> }
    return (
      <div>
        <span>Requires </span>
        {
          item.requirements.map((requirement) => {
            return (
              <span key={Meteor.uuid()}>
                <span className='requirement-name'>{requirement.name} </span>
                <span className='requirement-value'>{requirement.values[0][0]} </span>
              </span>
            )
          })
        }
      </div>
    );
  }

  getAdditionalProperties(item) {
    if (!item.additionalProperties) { return <div></div> }
    return (
      <div>
        {
          item.additionalProperties.map((property) => {
            return (
              <div key={Meteor.uuid()}>
                { property.name } : {property.values[0][0]}
              </div>
            );
          })
        }
      </div>
    );
  }

  render() {
    if (!this.props.show || this.props.item.stub) { return null }
    const { item } = this.props;
    const { name, typeLine } = item;
    const rarity = getFrameType(item.frameType);
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
        {
          item && item.properties && item.properties.length > 0 ? <hr className={'tool-tip-divider ' + rarity} /> : ''
        }
        <div className='requirements'>
          { this.getRequirements(item) }
        </div>
        {
          item && item.requirements && item.requirements.length > 0 ? <hr className={'tool-tip-divider ' + rarity} /> : ''
        }
        <div className='description'>
          { this.getDescText(item) }
        </div>
        {
          item && item.secDescrText ? <hr className={'tool-tip-divider ' + rarity} /> : ''
        }
        <div className='mods'>
          { this.getItemMods(item, 'implicitMods') }
        </div>
        {
          item && item.implicitMods && item.implicitMods.length > 0 ? <hr className={'tool-tip-divider ' + rarity} /> : ''
        }
        <div className='mods'>
          { this.getItemMods(item, 'explicitMods') }
        </div>
        <div className='corrupted'>{ item.corrupted ? 'corrupted' : '' }</div>
        <div className='unidentified'>{ item.identified ? '' : 'unidentified' }</div>
        {
          item && item.explicitMods && item.explicitMods.length > 0 || item.corrupted || !item.identified ? <hr className={'tool-tip-divider ' + rarity} /> : ''
        }
        <div className='additional-properties'>
          { this.getAdditionalProperties(item) }
        </div>
        {
          item && item.additionalProperties && item.additionalProperties.length > 0 ? <hr className={'tool-tip-divider ' + rarity} /> : ''
        }
        <div className='note'>
          <Price note={item.note} />
        </div>
      </div>
    );
  }
};
