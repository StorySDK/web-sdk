import React, { useEffect, useState } from 'react';
import block from 'bem-cn';
import { DateTime } from 'luxon';
import { IconIphoneBattery, IconIphoneCellular, IconIphoneWifi } from '@components/icons';
import { useAdaptiveValue } from '@hooks';
import dynamicIsland from '../../../../assets/images/dynamic-island-mockup.svg';
import './StatusBar.scss';

const b = block('StorySdkStatusBar');

const INIT_VERTICAL_PADDING = 10;
const INIT_SIDE_PADDING = 20;
const DYNAMIS_ISLAND_WIDTH = 80;

interface StatusBarProps {
  className?: string;
}

export const StatusBar: React.FC<StatusBarProps> = ({ className }) => {
  const [time, setTime] = useState(DateTime.now().toFormat('HH:mm'));

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(DateTime.now().toFormat('HH:mm'));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const paddingSide = useAdaptiveValue(INIT_SIDE_PADDING);
  const paddingVertical = useAdaptiveValue(INIT_VERTICAL_PADDING);
  const dynamicIslandWidth = useAdaptiveValue(DYNAMIS_ISLAND_WIDTH);

  return (
    <div
      className={`${b()} ${className || ''}`.trim()}
      style={{
        paddingTop: paddingVertical,
        paddingBottom: paddingVertical,
        paddingLeft: paddingSide,
        paddingRight: paddingSide
      }}
    >
      <span className={b('time')}>{time}</span>
      <img alt="" className={b('dynamicIsland')} src={dynamicIsland} width={dynamicIslandWidth} />
      <div className={b('iconWrapper')}>
        <IconIphoneCellular className={b('icon')} />
        <IconIphoneWifi className={b('icon')} />
        <IconIphoneBattery className={b('icon')} />
      </div>
    </div>
  );
};
