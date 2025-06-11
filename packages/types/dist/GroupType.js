"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScoreType = exports.StorySize = exports.GroupType = void 0;
var GroupType;
(function (GroupType) {
    GroupType["GROUP"] = "group";
    GroupType["ONBOARDING"] = "onboarding";
    GroupType["TEMPLATE"] = "template";
})(GroupType || (exports.GroupType = GroupType = {}));
var StorySize;
(function (StorySize) {
    StorySize["SMALL"] = "SMALL";
    StorySize["LARGE"] = "LARGE";
})(StorySize || (exports.StorySize = StorySize = {}));
var ScoreType;
(function (ScoreType) {
    ScoreType["NUMBERS"] = "numbers";
    ScoreType["LETTERS"] = "letters";
})(ScoreType || (exports.ScoreType = ScoreType = {}));
