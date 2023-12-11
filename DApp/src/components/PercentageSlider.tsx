import React, { useEffect, useState } from 'react';
import { Slider, Tooltip, Typography } from '@material-ui/core';

const PercentageSlider: React.FC<{ disabled: boolean; value: number | undefined; onChange: React.Dispatch<number> }> = ({
  disabled,
  value,
  onChange,
}) => {
  const [sliderValue, setSliderValue] = useState<number>(0);
  const [showTooltip, setShowTooltip] = useState<boolean>(false);

  useEffect(() => {
    if (!value) setSliderValue(0);
  }, [value]);

  return (
    <div>
      <Slider
        value={sliderValue}
        onChange={(event, newValue) => {
          setSliderValue(newValue as number);
          onChange(newValue as number);
        }}
        valueLabelDisplay="auto"
        min={0}
        max={100}
        disabled={disabled}
        aria-labelledby="slider"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      />
      <Tooltip
        open={showTooltip}
        placement="top"
        title={`${sliderValue}%`}
      >
        <span></span>
      </Tooltip>
    </div>
  );
};

export default PercentageSlider;
