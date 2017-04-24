import React from 'react';

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
      <div className='header'>
        Poe Tools made by a fool
        <select onChange={this.changeLeague}>
          <option>Hardcore</option>
          <option>Standard</option>
          <option selected>Hardcore Legacy</option>
          <option>Legacy</option>
        </select>
        <input
          onChange={this.props.filter}
        />
        <img className='search-icon' src='/search-icon.png'/>
      </div>
    );
  }
};
