import React from 'react';
import PropTypes from 'prop-types';
import { Session } from 'meteor/session';

export default class Header extends React.Component {
  constructor() {
    super();
    this.changeLeague = this.changeLeague.bind(this);
  }

  componentDidMount() {
    Session.set('league', 'Hardcore Legacy');
  }

  changeLeague(e) {
    this.props.setLeague(e.target.value);
  }

  render() {
    return (
      <div className="header">
        Poe Tools made by a fool
        <select onChange={this.changeLeague}>
          <option>Hardcore</option>
          <option>Standard</option>
          <option>Hardcore Legacy</option>
          <option>Legacy</option>
        </select>
        <input
          onChange={this.props.filter}
        />
        <img alt="magnifying glass" className="search-icon" src="/search-icon.png" />
      </div>
    );
  }
}

Header.propTypes = {
  setLeague: PropTypes.func.isRequired,
  filter: PropTypes.func.isRequired,
};
