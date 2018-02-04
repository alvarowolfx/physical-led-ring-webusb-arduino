import React from 'react';

const Led = ({
  index,
  selected,
  color,
  onClick,
  ringMiddle,
  ringWidth,
  size,
  angle,
  distance
}) => {
  const rot = (index + 4) * angle;
  const transform = `rotate(${rot}deg) translate(${distance +
    ringWidth / 2}em)`;
  const cssColor = `rgb(${color.r},${color.g},${color.b}`;
  return (
    <li
      onClick={onClick}
      style={{
        display: 'block',
        position: 'absolute',
        boxSizing: 'border-box',
        border: selected ? 'solid 3px white' : 'solid 1px white',
        top: `${ringMiddle}em`,
        left: `${ringMiddle}em`,
        width: `${size}em`,
        height: `${size}em`,
        boxShadow: `0px 0px 50px 0px ${cssColor}`,
        backgroundColor: cssColor,
        transform
      }}
    />
  );
};

const LedRing = ({ colors, selectedLed, circleSize, onLedClickWithIndex }) => {
  const angle = 360 / colors.length;
  const ledSize = circleSize / 8;
  const distance = circleSize / 2;
  const ringMiddle = distance - ledSize / 2;
  const ringWidth = circleSize / 6;
  return (
    <ul
      style={{
        border: `solid ${ringWidth}em gray`,
        position: 'relative',
        margin: '2em',
        width: `${circleSize}em`,
        height: `${circleSize}em`,
        borderRadius: '50%',
        padding: 0,
        listStyle: 'none'
      }}
    >
      {colors.map((color, idx) => {
        return (
          <Led
            key={`led_${idx}`}
            index={idx}
            selected={idx === selectedLed}
            angle={angle}
            distance={distance}
            ringWidth={ringWidth}
            ringMiddle={ringMiddle}
            size={ledSize}
            color={color}
            onClick={e => onLedClickWithIndex(e, idx)}
          />
        );
      })}
      <h4>
        NeoPixel Ring <br />
        with 16 RGB <br />
        addressable LEDs
      </h4>
    </ul>
  );
};

export default LedRing;
