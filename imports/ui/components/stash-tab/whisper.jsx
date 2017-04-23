import React from 'react';

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
    const whisper = document.getElementById('whisper' + item.id);
    whisper.innerHTML = `@${item.player} Hi I would like to buy your ${item.name.replace(/<.*>/, '')} ${item.typeLine} in ${item.stashName} for ${ item.note }`;
    selectText('whisper' + item.id);
    document.execCommand('copy');
    e.stopPropagation();
    this.setState({ whispered: true });
  }

  render() {
    if (!this.props.item) { return <div></div> }
    const { item } = this.props;
    return (
      <div className='whisper-container'>
        <div onClick={this.getWhisper}>
          <div id={'whisper' + item.id}>
            Whisper Player
          </div>
        </div>
      </div>
    );
  }
}

function selectText(containerid) {
    if (document.selection) {
        var range = document.body.createTextRange();
        range.moveToElementText(document.getElementById(containerid));
        range.select();
    } else if (window.getSelection) {
        var range = document.createRange();
        range.selectNode(document.getElementById(containerid));
        window.getSelection().addRange(range);
    }
}
