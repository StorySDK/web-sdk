"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GroupsDisplayType = exports.ScoreType = exports.StorySize = exports.GroupType = void 0;
var GroupType;
(function (GroupType) {
    GroupType["GROUP"] = "group";
    GroupType["ONBOARDING"] = "onboarding";
    GroupType["TEMPLATE"] = "template";
    GroupType["PARENT_GROUP"] = "parent-group";
    GroupType["PREVIEW_WIDGET"] = "preview-widget";
    GroupType["CAROUSEL"] = "carousel";
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
var GroupsDisplayType;
(function (GroupsDisplayType) {
    GroupsDisplayType["HIGHLIGHTS"] = "highlights";
    GroupsDisplayType["CAROUSEL"] = "carousel";
    GroupsDisplayType["POPVIDEO"] = "popvideo";
})(GroupsDisplayType || (exports.GroupsDisplayType = GroupsDisplayType = {}));
