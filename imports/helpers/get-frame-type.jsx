export const getFrameType = function(frameType) {
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
    'relic'
  ][frameType];
}
