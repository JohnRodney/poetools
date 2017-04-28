import PropTypes from 'prop-types';

export default PropTypes.shape({
  corrupted: PropTypes.bool.isRequired,
  descrText: PropTypes.string,
  explicitMods: PropTypes.arrayOf(PropTypes.string.isRequired),
  frameType: PropTypes.number.isRequired,
  h: PropTypes.number.isRequired,
  icon: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  identified: PropTypes.bool.isRequired,
  ilvl: PropTypes.number.isRequired,
  inventoryId: PropTypes.string.isRequired,
  league: PropTypes.string.isRequired,
  lockedToCharacter: PropTypes.bool.isRequired,
  name: PropTypes.string.isRequired,
  socketedItems: PropTypes.arrayOf(PropTypes.any).isRequired,
  sockets: PropTypes.arrayOf(PropTypes.any).isRequired,
  typeLine: PropTypes.string.isRequired,
  verified: PropTypes.bool.isRequired,
  w: PropTypes.number.isRequired,
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
}).isRequired;
