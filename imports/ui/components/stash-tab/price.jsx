import React from 'react';

const currencyTypes = [
  'chaos',
  'alch',
  'exa'
];

export default class Price extends React.Component {
  constructor() {
    super();
  }

  getPrice() {
    const { note } = this.props;
    const currencyFound = currencyTypes.filter((type) => {
      return note.toLowerCase().indexOf(type.toLowerCase()) > -1;
    });

    if (currencyFound.length > 0) {
      return (
        <div>
          { note.toLowerCase().replace(currencyFound[0].toLowerCase(), '').replace(/\~b\/o/g, '').replace(/\~/g, '').replace('price', '') }
          <img className='currency' src={'/' + currencyFound[0] + '.png'}/>
        </div>
      )
    }

    return (
        <div>
          { note }
        </div>
    )
  }

  render() {
    if (!this.props.note) { return <div></div> }
    return (
      <div>
        {this.getPrice()}
      </div>
    );
  }
}
