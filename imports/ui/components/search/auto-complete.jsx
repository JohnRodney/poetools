import React from 'react';

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
    }
  }

  blur() {
    setTimeout(() => {this.setState({ showSuggest: false })}, 200)
  }

  focus() {
    this.setState({ showSuggest: true });
  }

  getSuggest() {
    let rendered = 0;
    if (!this.state.showSuggest) { return null; }
    const suggestions = this.props.items[this.props.type].filter((suggestion) => {
      if(suggestion.toLowerCase().indexOf(this.state.query.toLowerCase()) > -1 && rendered < 10) {
        rendered++;
        return true;
      }
      return false;
    });
    return (
      <div className='suggestions'>
        {
          suggestions.map((suggestion, i) => {
            return (
              <div className="suggestion" onClick={(e) => { this.props.onChange(suggestion), this.setState({ showSuggest: false, query: suggestion }) }} key={Meteor.uuid()}>{suggestion}</div>
            );
          })
        }
      </div>
    )
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
    const type = this.state.type ? this.state.type : this.props.type;
    return (
      <div className='auto-complete'>
        <input value={value} id={this.props.id} onFocus={this.focus} onChange={this.changeQuery} onBlur={this.blur}/>
        <select value={this.state.type || this.props.type} onChange={this.changeType}>
          <option>Name</option>
          <option>Mod</option>
        </select>
        { this.getSuggest() }
      </div>
    );
  }
}
