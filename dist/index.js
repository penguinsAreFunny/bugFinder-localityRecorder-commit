"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
var bugfinder_framework_1 = require("bugfinder-framework");
var git_1 = require("./git");
var TYPES_1 = require("./TYPES");
__exportStar(require("./commit"), exports);
__exportStar(require("./commitRecorder"), exports);
__exportStar(require("./git"), exports);
__exportStar(require("./TYPES"), exports);
/**
 * Default configuration
 */
bugfinder_framework_1.localityAContainer.bind(TYPES_1.BUGFINDER_LOCALITYRECORDER_COMMIT_TYPES.git).to(git_1.GitImpl);
bugfinder_framework_1.localityAContainer.bind(TYPES_1.BUGFINDER_LOCALITYRECORDER_COMMIT_TYPES.gitCommitParser).to(git_1.FormatParser);
bugfinder_framework_1.localityAContainer.bind(TYPES_1.BUGFINDER_LOCALITYRECORDER_COMMIT_TYPES.madFilesFromCommitParser).to(git_1.MADFilesFromLogImpl);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBQUEsMkRBQXVEO0FBQ3ZELDZCQUEwRjtBQUMxRixpQ0FBZ0U7QUFFaEUsMkNBQXdCO0FBQ3hCLG1EQUFnQztBQUNoQyx3Q0FBcUI7QUFDckIsMENBQXVCO0FBRXZCOztHQUVHO0FBQ0gsd0NBQWtCLENBQUMsSUFBSSxDQUF1QiwrQ0FBdUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsYUFBTyxDQUFDLENBQUE7QUFDdEcsd0NBQWtCLENBQUMsSUFBSSxDQUF1QiwrQ0FBdUMsQ0FBQyxlQUFlLENBQUMsQ0FBQyxFQUFFLENBQUMsa0JBQVksQ0FBQyxDQUFBO0FBQ3ZILHdDQUFrQixDQUFDLElBQUksQ0FBdUIsK0NBQXVDLENBQUMsd0JBQXdCLENBQUMsQ0FBQyxFQUFFLENBQUMseUJBQW1CLENBQUMsQ0FBQSJ9