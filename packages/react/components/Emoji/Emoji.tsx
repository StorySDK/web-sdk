import React from 'react';
import data from '@emoji-mart/data';
import { init } from 'emoji-mart';

init({ data });

interface EmojiProps {
  emoji: string;
  size?: number;
}

export const Emoji: React.FC<EmojiProps> = ({ emoji, size }) => (
  // @ts-ignore
  <em-emoji
    id={emoji}
    set="apple"
    size={size}
    style={{
      display: 'flex',
      alignItems: 'center'
    }}
  />
);
