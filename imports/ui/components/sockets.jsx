import React from 'react';
import PropTypes from 'prop-types';

export default class Sockets extends React.Component {
  static getImageFromAttr(attr) {
    const map = {
      D: '/dex.png',
      S: '/str.png',
      I: '/int.png',
    };

    return (
      <img alt="derp" src={map[attr]} />
    );
  }

  render() {
    const { sockets } = this.props;
    let group = 0;
    const height = `${((40 * Math.floor(sockets.length / 2)) + 40)}px`;
    return (
      <div
        className={this.props.show ? 'sockets' : 'sockets faded'}
        style={{ height }}
      >
        {
          sockets.map((socket, i) => {
            if (i === 0) {
              return <div className={`socket-${Number(i + 1)} width-${this.props.width}`} key={Meteor.uuid()}> {this.constructor.getImageFromAttr(socket.attr)}</div>;
            } else if (socket.group === group) {
              // they are linked
              return (
                <div
                  className={`socket-${Number(i + 1)} width-${this.props.width}`}
                  key={Meteor.uuid()}
                >
                  <img alt="alted again" className={`link link-${Number(i + 1)} width-${this.props.width}`} src="/linkh.png" />
                  { this.constructor.getImageFromAttr(socket.attr) }
                </div>
              );
            }
            group += 1;
            return <div className={`socket-${Number(i + 1)} width-${this.props.width}`} key={Meteor.uuid()}>{this.constructor.getImageFromAttr(socket.attr)} </div>;
          })
        }
      </div>
    );
  }
}

Sockets.propTypes = {
  show: PropTypes.bool.isRequired,
  sockets: PropTypes.arrayOf(PropTypes.shape({
    attr: PropTypes.string.isRequired,
    group: PropTypes.number.isRequired,
  }).isRequired).isRequired,
  width: PropTypes.number,
};

Sockets.defaultProps = {
  width: 1,
};
