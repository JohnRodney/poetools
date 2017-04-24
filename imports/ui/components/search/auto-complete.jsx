import React from 'react';

export default class SearchComponent extends React.Component {
  constructor() {
    super();
    this.focus = this.focus.bind(this);
    this.blur = this.blur.bind(this);
    this.changeQuery = this.changeQuery.bind(this);
    this.state = {
      showSuggest: false,
      query: '',
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
    return (
      <div className='suggestions'>
        {
          this.props.items.map((mod, i) => {
            if(mod.indexOf(this.state.query) > -1 && rendered < 10) {
              rendered++;
              return (
                <div className="suggestion" onClick={(e) => { this.props.onChange(mod), this.setState({ showSuggest: false, query: mod }) }} key={Meteor.uuid()}>{mod}</div>
              );
            }
            return (<div key={Meteor.uuid()}></div>);
          })
        }
      </div>
    )
  }

  changeQuery(e) {
    this.setState({ query: e.target.value });
    this.props.onChange(e.target.value);
  }

  render() {
    const value = this.state.query ? this.state.query : this.props.value;
    return (
      <div className='auto-complete'>
        <input value={value} id={this.props.id} onFocus={this.focus} onChange={this.changeQuery} onBlur={this.blur}/>
        <select>
          <option>Name</option>
          <option>Mod</option>
        </select>
        { this.getSuggest() }
      </div>
    );
  }
}
