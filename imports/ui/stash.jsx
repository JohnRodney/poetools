import React from 'react';
import Item from './components/item.jsx';

export default class Stash extends React.Component {
  constructor() {
    super();
    this.state = {
      showItems: false,
    };
    this.displayItems = this.displayItems.bind(this);
  }

  displayItems() {
    this.setState({ showItems: !this.state.showItems });
  }

  getItems() {
    if (!this.state.showItems) { return ''; }
    return (
      <div className='items-container'>
        {
          this.props.stash.items.map((item, i) => {
            if (item.league === this.props.league) {
              return <Item key={'item' + i} item={item} />;
            }
            return (<div key={'item' + i}></div>);
          })
        }
      </div>
    )
  }

  render() {
    const { stash } = this.props;
    return (
      <div className='a-stash' onClick={ () => {FlowRouter.go('/stash-tab/' + stash.accountName)}}>
        <p>Account Name: {stash.accountName}</p>
        <p>Character Name: {stash.lastCharacterName}</p>
        <p>Items: {stash.items.length}</p>
        { this.getItems() }
        <div className='clear-fix'></div>
      </div>
    )
  }
};
