import React from 'react';

export default class SearchComponent extends React.Component {
  constructor() {
    super();
    this.state = {
      searches: [],
    };
    this.addField = this.addField.bind(this);
  }

  addField() {
    const searches = this.state.searches;
    searches.push({});
    this.setState({ searches });
  }

  render() {
    console.log(this.props);
    return (
      <div className='search-component'>
        <div onClick={this.addField}>add field</div>
        {
          this.state.searches.map((search) => {
            return(
              <div>
                a Field
              </div>
            );
          })
        }
        <button className='search-button'>Search</button>
      </div>
    );
  }
};
