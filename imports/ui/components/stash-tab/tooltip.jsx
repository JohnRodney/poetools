import React from 'react';
import PropTypes from 'prop-types';
import { getFrameType } from '../../../helpers/get-frame-type';
import Price from './price';

function cleanMod(mod) {
  return mod.replace(/<.*>/, '').replace(/\{/g, '').replace(/\}/g, '');
}

export default class ToolTip extends React.Component {
  static getItemMods(item, type) {
    if (!item[type]) { return ''; }
    return item[type].map(mod => (
      <div className={`item-mod ${type.substring(0, type.search(/[A-Z]/))}`} key={Meteor.uuid()}>
        {cleanMod(mod)}
      </div>
    ));
  }

  static replaceWithValues(name, values) {
    let withValues = name;
    for (let i = 0; i < 5; i += 1) {
      if (withValues.indexOf(`%${i}`) > -1) {
        withValues = withValues.replace(`%${i}`, values[i][0]);
      }
    }
    return withValues;
  }

  static getDescText(item) {
    if (!item.secDescrText) { return <div />; }
    return <div>{item.secDescrText}</div>;
  }

  static getRequirements(item) {
    if (!item.requirements) { return <div />; }
    return (
      <div>
        <span>Requires </span>
        {
          item.requirements.map(requirement => (
            <span key={Meteor.uuid()}>
              <span className="requirement-name">{requirement.name} </span>
              <span className="requirement-value">{requirement.values[0][0]} </span>
            </span>
          ))
        }
      </div>
    );
  }

  static getAdditionalProperties(item) {
    if (!item.additionalProperties) { return <div />; }
    return (
      <div>
        {
          item.additionalProperties.map(property => (
            <div key={Meteor.uuid()}>
              { property.name } : {property.values[0][0]}
            </div>
          ))
        }
      </div>
    );
  }


  renderProperties(item) {
    if (!item.properties) { return ''; }

    return item.properties.map((property) => {
      const { values } = property;
      let { name } = property;
      let value = false;

      if (values.length > 0) {
        if (name.indexOf('%') > -1) {
          name = this.constructor.replaceWithValues(name, values);
        } else if (property.values[0].constructor === Array) {
          value = property.values[0][0];
        } else { value = property.values[0]; }
      }

      return (
        <div key={Meteor.uuid()}>
          <span className="property-name">{value ? `${name}: ` : name}</span>
          <span className="property-value">{value || ''}</span>
        </div>
      );
    });
  }

  render() {
    if (!this.props.show) { return null; }
    const { item } = this.props;
    const { name, typeLine } = item;
    const rarity = getFrameType(item.frameType);
    const nameLayout = name.replace(/<.*>/, '').length > 0 ? (
      <div className={`name ${rarity}`}>
        {`${name.replace(/<.*>/, '')} `}
      </div>
    ) : '';

    return (
      <div className="tool-tip">
        <div className={`item-name ${rarity}`}>
          {nameLayout}
          <div className={`base ${rarity}`}>
            {typeLine.replace(/<.*>/, '')}
          </div>
        </div>
        <div className="properties">
          { this.renderProperties(item) }
        </div>
        {
          item && item.properties && item.properties.length > 0 ? <hr className={`tool-tip-divider ${rarity}`} /> : ''
        }
        <div className="requirements">
          {this.constructor.getRequirements(item)}
        </div>
        {
          item && item.requirements && item.requirements.length > 0 ? <hr className={`tool-tip-divider ${rarity}`} /> : ''
        }
        <div className="description">
          { this.constructor.getDescText(item) }
        </div>
        {
          item && item.secDescrText ? <hr className={`tool-tip-divider ${rarity}`} /> : ''
        }
        <div className="mods">
          {this.constructor.getItemMods(item, 'implicitMods')}
        </div>
        {
          item && item.implicitMods && item.implicitMods.length > 0 ? <hr className={`tool-tip-divider ${rarity}`} /> : ''
        }
        <div className="mods">
          {this.constructor.getItemMods(item, 'explicitMods')}
        </div>
        <div className="corrupted">{ item.corrupted ? 'corrupted' : '' }</div>
        <div className="unidentified">{ item.identified ? '' : 'unidentified' }</div>
        {
          (item && item.explicitMods && item.explicitMods.length > 0) || item.corrupted || !item.identified ? <hr className={`tool-tip-divider ${rarity}`} /> : ''
        }
        <div className="additional-properties">
          { this.constructor.getAdditionalProperties(item) }
        </div>
        {
          item && item.additionalProperties && item.additionalProperties.length > 0 ? <hr className={`tool-tip-divider ${rarity}`} /> : ''
        }
        <div className="note">
          <Price note={item.note} />
        </div>
      </div>
    );
  }
}

ToolTip.propTypes = {
  show: PropTypes.bool.isRequired,
  item: PropTypes.shape({
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
  }).isRequired,
};
