import React from 'react';
import PropTypes from 'prop-types';

const currencyTypes = [
  'chaos',
  'alch',
  'exa',
];

function cleanString(buffer, currencyFound) {
  return buffer.toLowerCase()
    .replace(currencyFound[0].toLowerCase(), '')
    .replace(/~b\/o/g, '')
    .replace(/~/g, '')
    .replace('price', '');
}

export default class Price extends React.Component {
  getPrice() {
    const { note } = this.props;
    const currencyFound = currencyTypes
      .filter(type => note.toLowerCase().indexOf(type.toLowerCase()) > -1);

    if (currencyFound.length > 0) {
      return (
        <div>
          { cleanString(note, currencyFound) }
          <img alt="money" className="currency" src={`/${currencyFound[0]}.png`} />
        </div>
      );
    }

    return <div>{note}</div>;
  }

  render() {
    if (!this.props.note) { return <div />; }
    return (
      <div>
        {this.getPrice()}
      </div>
    );
  }
}

Price.defaultProps = {
  note: '',
};

Price.propTypes = {
  note: PropTypes.string,
};
