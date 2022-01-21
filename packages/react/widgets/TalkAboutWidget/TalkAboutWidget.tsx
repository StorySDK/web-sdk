import React, { useState, useCallback, useMemo } from 'react';
import block from 'bem-cn';
import {
  TalkAboutWidgetParamsType,
  WidgetComponent,
  WidgetPositionType,
  WidgetPositionLimitsType
} from '../../types';
import { IconLogoCircle } from '../../components/Icon';
import { calculateElementSize } from '../../utils';
import './TalkAboutWidget.scss';

const b = block('TalkAboutSdkWidget');

const INIT_ELEMENT_STYLES = {
  widget: {
    borderRadius: 10
  },
  content: {
    paddingRight: 12,
    paddingLeft: 12,
    paddingBottom: 12,
    paddingTop: 30
  },
  text: {
    fontSize: 14,
    marginBottom: 15
  },
  input: {
    fontSize: 10,
    padding: 11,
    borderRadius: 8
  },
  empty: {
    height: 18
  },
  imageWrapper: {
    width: 36,
    height: 36
  },
  send: {
    height: 50
  },
  sendText: {
    fontSize: 14
  }
};

export const TalkAboutWidget: WidgetComponent<{
  params: TalkAboutWidgetParamsType;
  position?: WidgetPositionType;
  positionLimits?: WidgetPositionLimitsType;
  onAnswer?(answer: string): void;
}> = (props) => {
  const { params, position, positionLimits } = props;

  const calculate = useCallback(
    (size) => {
      if (position && positionLimits) {
        return calculateElementSize(position, positionLimits, size);
      }

      return size;
    },
    [position, positionLimits]
  );

  const elementSizes = useMemo(
    () => ({
      widget: {
        borderRadius: calculate(INIT_ELEMENT_STYLES.widget.borderRadius)
      },
      content: {
        paddingRight: calculate(INIT_ELEMENT_STYLES.content.paddingRight),
        paddingLeft: calculate(INIT_ELEMENT_STYLES.content.paddingLeft),
        paddingBottom: calculate(INIT_ELEMENT_STYLES.content.paddingBottom),
        paddingTop: calculate(INIT_ELEMENT_STYLES.content.paddingTop)
      },
      text: {
        fontSize: calculate(INIT_ELEMENT_STYLES.text.fontSize),
        marginBottom: calculate(INIT_ELEMENT_STYLES.text.marginBottom)
      },
      input: {
        fontSize: calculate(INIT_ELEMENT_STYLES.input.fontSize),
        padding: calculate(INIT_ELEMENT_STYLES.input.padding),
        borderRadius: calculate(INIT_ELEMENT_STYLES.input.borderRadius)
      },
      empty: {
        height: calculate(INIT_ELEMENT_STYLES.empty.height)
      },
      imageWrapper: {
        width: calculate(INIT_ELEMENT_STYLES.imageWrapper.width),
        height: calculate(INIT_ELEMENT_STYLES.imageWrapper.height)
      },
      send: {
        height: calculate(INIT_ELEMENT_STYLES.send.height)
      },
      sendText: {
        fontSize: calculate(INIT_ELEMENT_STYLES.sendText.fontSize)
      }
    }),
    [calculate]
  );

  const [text, setText] = useState<string>('');
  const [isSent, setIsSent] = useState<boolean>(false);

  const handleTextChange = (e: any) => {
    setText(e.target.value);
  };

  const handleSendClick = () => {
    if (text.length) {
      if (props.onAnswer) {
        props.onAnswer(text);
      }

      setIsSent(true);
    }
  };

  return (
    <>
      <div className={b('container')}>
        <picture className={b('imageWrapper')} style={elementSizes.imageWrapper}>
          {params.image ? (
            <img alt="" className={b('image')} src={params.image} />
          ) : (
            <IconLogoCircle className={b('image').toString()} />
          )}
        </picture>

        <div className={b('empty')} style={elementSizes.empty} />

        <div className={b({ color: params.color })} style={elementSizes.widget}>
          <div
            className={b('contentContainer', { sendOpen: text.length > 0 })}
            style={elementSizes.content}
          >
            <div className={b('text')} style={elementSizes.text}>
              {params.text}
            </div>

            <input
              className={b('input')}
              disabled={isSent}
              placeholder="Type something..."
              style={elementSizes.input}
              type="text"
              value={text}
              onChange={handleTextChange}
            />
          </div>

          {text && (
            <button
              className={b('send', { disabled: isSent })}
              style={elementSizes.send}
              onClick={!isSent ? handleSendClick : undefined}
            >
              <span className={b('sendText', { green: isSent })} style={elementSizes.sendText}>
                {isSent ? 'Sent!' : 'Send'}
              </span>
            </button>
          )}
        </div>
      </div>
    </>
  );
};
