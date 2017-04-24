import React from 'react';
import { Session } from 'meteor/session';
import ReactAutoComplete from './auto-complete.jsx';
import { KnownMods } from '../../../helpers/known-mod-strings.jsx';
KnownNames = ["Atziri's Promise"]
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

  addField() {
    const searches = this.state.searches;
    searches.push({ value: '', type: 'Name' });
    this.setState({ searches });
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ searching: false });
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
    console.log(this.state.searches)
    Session.set('query', this.state.searches);
    this.setState({ searching: true })
  }

  render() {
    console.log(this.props);
    return (
      <div className='search-component'>
        {
          this.state.searches.map((search, i) => {
            return(
              <div key={Meteor.uuid()} className='a-search-container'>
                <ReactAutoComplete
                  id={'searches-' + i}
                  items={{ Mod: KnownMods, Name: this.props.names }}
                  value={search.value}
                  type={search.type}
                  typeChange={
                    (type) => {
                      this.changeType(i, type)
                    }
                  }
                  onChange={
                    (e) => {
                      this.handleInput(i, e);
                    }
                  }
                />
                <div className='close' onClick={(e) => {
                  const { searches } = this.state;
                  searches.splice(i, 1);
                  this.setState({ searches })
                }}></div>
              </div>
            );
          })
        }
        <div className='add-field' onClick={this.addField}>+</div>
        { this.state.searching ? <div className="loader-wobble"></div> : <button onClick={ this.search }className='search-button'>Search</button> }
      </div>
    );
  }
};
