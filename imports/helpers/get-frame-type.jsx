export const getFrameType = function getFrameType(frameType) {
  return [
    'normal',
    'magic',
    'rare',
    'unique',
    'gem',
    'currency',
    'divination card',
    'quest item',
    'prophecy',
    'relic',
  ][frameType];
};
export default getFrameType;
