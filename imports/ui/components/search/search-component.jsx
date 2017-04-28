import React from 'react';
import { Session } from 'meteor/session';
import PropTypes from 'prop-types';
import ReactAutoComplete from './auto-complete';
import { KnownMods } from '../../../helpers/known-mod-strings';

export default class SearchComponent extends React.Component {
  constructor() {
    super();
    this.state = {
      searches: [],
      inputsNeedUpdate: true,
      searching: false,
    };
    this.addField = this.addField.bind(this);
    this.search = this.search.bind(this);
  }

  componentWillReceiveProps() {
    this.setState({ searching: false });
  }

  addField() {
    const searches = this.state.searches;
    searches.push({ value: '', type: 'Name' });
    this.setState({ searches });
  }

  handleInput(i, value) {
    const { searches } = this.state;
    searches[i] = { value, type: searches[i].type };
  }

  changeType(i, type) {
    const { searches } = this.state;
    searches[i] = { value: searches[i].value, type };
    this.setState({ searches });
  }

  search() {
    Session.set('query', this.state.searches);
    this.setState({ searching: true });
  }

  render() {
    return (
      <div className="search-component">
        {
          this.state.searches.map((search, i) => (
            <div key={Meteor.uuid()} className="a-search-container">
              <ReactAutoComplete
                id={`searches-${i}`}
                items={{ Mod: KnownMods, Name: this.props.names }}
                value={search.value}
                type={search.type}
                typeChange={
                  (type) => {
                    this.changeType(i, type);
                  }
                }
                onChange={
                  (e) => {
                    this.handleInput(i, e);
                  }
                }
              />
              <div
                className="close"
                onClick={() => {
                  const { searches } = this.state;
                  searches.splice(i, 1);
                  this.setState({ searches });
                }}
              />
            </div>
          ))
        }
        <div className="add-field" onClick={this.addField}>+</div>
        { this.state.searching ? <div className="loader-wobble" /> : <button onClick={this.search} className="search-button">Search</button> }
      </div>
    );
  }
}

SearchComponent.propTypes = {
  names: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
};
