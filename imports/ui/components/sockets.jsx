import React from 'react';

export default class Sockets extends React.Component {
  constructor() {
    super();
    this.debug = this.debug.bind(this);
  }

  debug(e) {
    e.stopPropagation();
    console.log(this.props.sockets);
  }

  getImageFromAttr(attr) {
    const map = {
      'D': '/dex.png',
      'S': '/str.png',
      'I': '/int.png',
    };
    return (
      <img src={map[attr]} />
    );
  }

  render() {
    const { sockets } = this.props;
    let group = 0;
    const height = ((40 * Math.floor(sockets.length / 2)) + 40) + 'px';
    return (
      <div
        className={this.props.show ? 'sockets' : 'sockets faded'}
        style={{height}}
        onClick={this.debug}
      >
      {
        sockets.map((socket, i) => {
          if (i === 0) {
            return <div className={'socket-' + Number(i + 1) + ' width-' + this.props.width} key={Meteor.uuid()}> {this.getImageFromAttr(socket.attr)}</div>
          } else if(socket.group === group) {
            // they are linked
            return (
              <div
                className={'socket-' + Number(i + 1) + ' width-' + this.props.width}
                key={Meteor.uuid()}
              >
                <img className={'link link-' + Number(i + 1) + ' width-' + this.props.width} src='/linkh.png'/>
                { this.getImageFromAttr(socket.attr) }
              </div>
            );
          } else {
            group++;
            return <div className={'socket-' + Number(i + 1) + ' width-' + this.props.width} key={Meteor.uuid()}>{this.getImageFromAttr(socket.attr)} </div>
          }
        })
      }
      </div>
    )
  }
};
