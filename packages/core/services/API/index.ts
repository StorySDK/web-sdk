export const API = {
  groups: {

  },
  statistics: {
    story: {
      onWatch(params: { storyId: string }) {
        console.log(params);
      }
      // onNext(),
      // onPrev(),
      // onClose(),
      // onGroupOpen()
    },
    widgets: {
      chooseAnswer: {
        onAnswer(params: { widgetId: string; answer: string }) {
          console.log(params);
        }
      },
      clickMe: {
        onClick(params: { widgetId: string }) {
          console.log(params);
        }
      },
      emojiReaction: {
        onReact(params: { widgetId: string; emoji: string }) {
          console.log(params);
        }
      },
      question: {
        onAnswer(params: { widgetId: string; answer: string }) {
          console.log(params);
        }
      },
      slider: {
        onSlide(params: { widgetId: string; value: number }) {
          console.log(params);
        }
      },
      swipeUp: {
        onSwipe(params: { widgetId: string }) {
          console.log(params);
        }
      },
      talkAbout: {
        onAnswer(params: { widgetId: string; answer: string }) {
          console.log(params);
        }
      }
    }
  }
};
