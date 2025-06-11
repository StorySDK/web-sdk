"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScoreWidgets = exports.WidgetsTypes = exports.GradientDirection = exports.BackgroundColorType = exports.MediaType = void 0;
var MediaType;
(function (MediaType) {
    MediaType["IMAGE"] = "image";
    MediaType["VIDEO"] = "video";
})(MediaType || (exports.MediaType = MediaType = {}));
var BackgroundColorType;
(function (BackgroundColorType) {
    BackgroundColorType["GRADIENT"] = "gradient";
    BackgroundColorType["COLOR"] = "color";
    BackgroundColorType["TRANSPARENT"] = "transparent";
})(BackgroundColorType || (exports.BackgroundColorType = BackgroundColorType = {}));
var GradientDirection;
(function (GradientDirection) {
    GradientDirection["TOP_TO_BOTTOM"] = "top_to_bottom";
    GradientDirection["LEFT_TO_RIGHT"] = "left_to_right";
})(GradientDirection || (exports.GradientDirection = GradientDirection = {}));
var WidgetsTypes;
(function (WidgetsTypes) {
    WidgetsTypes["RECTANGLE"] = "rectangle";
    WidgetsTypes["IMAGE"] = "image";
    WidgetsTypes["VIDEO"] = "video";
    WidgetsTypes["ELLIPSE"] = "ellipse";
    WidgetsTypes["TEXT"] = "text";
    WidgetsTypes["SWIPE_UP"] = "swipe_up";
    WidgetsTypes["SLIDER"] = "slider";
    WidgetsTypes["QUESTION"] = "question";
    WidgetsTypes["CLICK_ME"] = "click_me";
    WidgetsTypes["LINK"] = "link";
    WidgetsTypes["TALK_ABOUT"] = "talk_about";
    WidgetsTypes["EMOJI_REACTION"] = "emoji_reaction";
    WidgetsTypes["TIMER"] = "timer";
    WidgetsTypes["CHOOSE_ANSWER"] = "choose_answer";
    WidgetsTypes["GIPHY"] = "giphy";
    WidgetsTypes["QUIZ_ONE_ANSWER"] = "quiz_one_answer";
    WidgetsTypes["QUIZ_MULTIPLE_ANSWERS"] = "quiz_multiple_answers";
    WidgetsTypes["QUIZ_OPEN_ANSWER"] = "quiz_open_answer";
    WidgetsTypes["QUIZ_MULTIPLE_ANSWER_WITH_IMAGE"] = "quiz_one_multiple_with_image";
    WidgetsTypes["QUIZ_RATE"] = "quiz_rate";
})(WidgetsTypes || (exports.WidgetsTypes = WidgetsTypes = {}));
exports.ScoreWidgets = [
    WidgetsTypes.CHOOSE_ANSWER,
    WidgetsTypes.QUIZ_ONE_ANSWER,
    WidgetsTypes.QUIZ_MULTIPLE_ANSWERS,
    WidgetsTypes.QUIZ_MULTIPLE_ANSWER_WITH_IMAGE,
];
