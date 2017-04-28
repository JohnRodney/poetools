import React from 'react';
import ItemPropType from '../../../proptypes/item';
import defaultItem from '../../../defaults/item';

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
  item: ItemPropType,
};

Price.defaultProps = {
  item: defaultItem,
};
