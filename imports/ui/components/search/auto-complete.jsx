import React from 'react';
import PropTypes from 'prop-types';

export default class SearchComponent extends React.Component {
  constructor() {
    super();
    ['focus', 'blur', 'changeQuery', 'changeType'].forEach((key) => {
      this[key] = this[key].bind(this);
    });
    this.state = {
      showSuggest: false,
      query: '',
      type: false,
    };
  }

  getSuggest() {
    let rendered = 0;
    if (!this.state.showSuggest) { return null; }
    const suggestions = this.props.items[this.props.type].filter((suggestion) => {
      if (suggestion.toLowerCase().indexOf(this.state.query.toLowerCase()) > -1 && rendered < 10) {
        rendered += 1;
        return true;
      }
      return false;
    });
    return (
      <div className="suggestions">
        {
          suggestions.map(suggestion => (
            <div
              className="suggestion"
              onClick={() => {
                this.props.onChange(suggestion);
                this.setState({ showSuggest: false, query: suggestion });
              }}
              key={Meteor.uuid()}
            >{suggestion}</div>
          ))
        }
      </div>
    );
  }

  focus() {
    this.setState({ showSuggest: true });
  }

  blur() {
    setTimeout(() => { this.setState({ showSuggest: false }); }, 200);
  }

  changeType(e) {
    this.setState({ type: e.target.value });
    this.props.typeChange(e.target.value);
  }

  changeQuery(e) {
    this.setState({ query: e.target.value });
    this.props.onChange(e.target.value);
  }

  render() {
    const value = this.state.query ? this.state.query : this.props.value;
    return (
      <div className="auto-complete">
        <input
          value={value}
          id={this.props.id}
          onFocus={this.focus}
          onChange={this.changeQuery}
          onBlur={this.blur}
        />
        <select value={this.state.type || this.props.type} onChange={this.changeType}>
          <option>Name</option>
          <option>Mod</option>
        </select>
        { this.getSuggest() }
      </div>
    );
  }
}

SearchComponent.propTypes = {
  items: PropTypes.shape({
    Mod: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
    Name: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
  }).isRequired,
  type: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  typeChange: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
};
