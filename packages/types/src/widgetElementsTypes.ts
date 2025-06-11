export type ChooseAnswerWidgetElemetsType = {
  widget: {
    borderRadius: number;
  };
  header: {
    fontSize: number;
    paddingTop: number;
    paddingBottom: number;
  };
  answers: {
    padding: number;
  };
  answer: {
    padding: number;
    marginBottom: number;
  };
  answerId: {
    width: number;
    height: number;
    marginRight: number;
    fontSize: number;
  };
  answerTitle: {
    fontSize: number;
  };
};

export type EmojiReactionWidgetElemetsType = {
  widget: {
    borderRadius: number;
    paddingTop: number;
    paddingBottom: number;
    paddingRight: number;
    paddingLeft: number;
  };
  emoji: {
    width: number;
  };
  item: {
    marginRight: number;
    marginLeft: number;
  };
};

export type QuestionWidgetElementsType = {
  text: {
    fontSize: number;
    marginBottom: number;
  };
  button: {
    height: number;
    fontSize: number;
    borderRadius: number;
  };
};

export type QuizMultipleAnswerWidgetElementsType = {
  title: {
    fontSize: number;
    marginBottom: number;
  };
  answers: {
    gap: number;
  };
  answer: {
    padding: number;
    gap: number;
    borderRadius: number;
  };
  emoji: {
    width: number;
  };
  answerTitle: {
    fontSize: number;
  };
  sendBtn: {
    fontSize: number;
    borderRadius: number;
    padding: number;
    marginTop: number;
    lineHeight: number;
  };
};

export type QuizOneAnswerWidgetElementsType = {
  title: {
    fontSize: number;
    marginBottom: number;
  };
  answers: {
    gap: number;
  };
  answer: {
    padding: number;
    gap: number;
    borderRadius: number;
  };
  emoji: {
    width: number;
  };
  answerTitle: {
    fontSize: number;
  };
};

export type QuizMultipleAnswerWidgetWithImageElementsType = {
  title: {
    fontSize: number;
    marginBottom: number;
  };
  answers: {
    gap: number;
  };
  answer: {
    padding: number;
    gap: number;
    borderRadius: number;
  };
  emoji: {
    width: number;
  };
  answerTitle: {
    fontSize: number;
  };
  sendBtn: {
    fontSize: number;
    borderRadius: number;
    padding: number;
    marginTop: number;
  };
};

export type QuizOpenAnswerWidgetElementsType = {
  title: {
    fontSize: number;
    marginBottom: number;
  };
  input: {
    fontSize: number;
  };
  inputWrapper: {
    paddingVertical: number;
    paddingHorizontal: number;
    borderRadius: number;
    paddingRight: number;
  };
  sendButton: {
    width: number;
    height: number;
    right: number;
  };
};

export type QuizRateWidgetElementsType = {
  title: {
    fontSize: number;
    marginBottom: number;
  };
  stars: {
    gap: number;
  };
};

export type SliderWidgetElementsType = {
  widget: {
    borderRadius: number;
    paddingTop: number;
    paddingLeft: number;
    paddingRight: number;
    paddingBottom: number;
  };
  emoji: {
    width: number;
    height: number;
  };
  text: {
    fontSize: number;
    marginBottom: number;
  };
  slider: {
    height: number;
    borderRadius: number;
  };
};

export type TalkAboutElementsType = {
  widget: {
    borderRadius: number;
  };
  content: {
    paddingRight: number;
    paddingLeft: number;
    paddingBottom: number;
    paddingTop: number;
  };
  text: {
    fontSize: number;
    marginBottom: number;
  };
  input: {
    fontSize: number;
    padding: number;
    borderRadius: number;
  };
  empty: {
    height: number;
  };
  imageWrapper: {
    width: number;
    height: number;
  };
  send: {
    height: number;
  };
  sendText: {
    fontSize: number;
  };
};
