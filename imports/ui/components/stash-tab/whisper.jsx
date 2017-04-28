import React from 'react';
import PropTypes from 'prop-types';

function selectText(containerid) {
  if (document.selection) {
    const range = document.body.createTextRange();
    range.moveToElementText(document.getElementById(containerid));
    range.select();
  } else if (window.getSelection) {
    const range = document.createRange();
    range.selectNode(document.getElementById(containerid));
    window.getSelection().addRange(range);
  }
}

export default class Price extends React.Component {
  constructor() {
    super();
    this.state = {
      whispered: false,
    };
    this.getWhisper = this.getWhisper.bind(this);
  }

  getWhisper(e) {
    const { item } = this.props;
    const whisper = document.getElementById(`whisper ${item.id}`);
    whisper.innerHTML = `@${item.player} Hi I would like to buy your ${item.name.replace(/<.*>/, '')} ${item.typeLine} in ${item.stashName} for ${item.note}`;
    selectText(`whisper ${item.id}`);
    document.execCommand('copy');
    e.stopPropagation();
    this.setState({ whispered: true });
  }

  render() {
    if (!this.props.item) { return <div />; }
    const { item } = this.props;
    return (
      <div className="whisper-container">
        <div onClick={this.getWhisper}>
          <div id={`whisper ${item.id}`}>
            Whisper Player
          </div>
        </div>
      </div>
    );
  }
}

Price.propTypes = {
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
