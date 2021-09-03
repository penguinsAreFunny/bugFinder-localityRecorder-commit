"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MADFilesFromLogImpl = void 0;
var inversify_1 = require("inversify");
var MADFilesFromCommit_1 = require("./MADFilesFromCommit");
var MADFilesFromLogImpl = /** @class */ (function () {
    function MADFilesFromLogImpl() {
    }
    MADFilesFromLogImpl.prototype.MADFilesFromCommit = function (commitNameStatus) {
        var lines = commitNameStatus.split("\n");
        var modifiedFiles = this.linesRemovingMarkerPre(lines, MADFilesFromCommit_1.MODIFIED_FILE_MARKER);
        var addedFiles = this.linesRemovingMarkerPre(lines, MADFilesFromCommit_1.ADDED_FILE_MARKER);
        var deletedFiles = this.linesRemovingMarkerPre(lines, MADFilesFromCommit_1.DELETED_FILE_MARKER);
        // TODO: R100, C75 : copied files percentage https://stackoverflow.com/questions/53056942/git-diff-name-status-what-does-r100-mean https://git-scm.com/docs/git-status
        // TODO files marker with MM @See Typescript: commit: 5ad8532a11ef2859f91d2bec8f020651538d1ad5
        // TODO: check for commits mit not empty lines, aber trotzdem keine modified, added und deletedFiles
        return {
            modifiedFiles: modifiedFiles,
            addedFiles: addedFiles,
            deletedFiles: deletedFiles
        };
    };
    /**
     * Given an array of lines with the format $marker$percentage\t$path returns an array with the parsed
     * percentage and path
     *
     * Used for parsing renamed and copied path
     * @Example: R100\tsrc/foo.ts    => [{percentage: 100, path: src/foo.ts}]
     * @Example: C75\tsrc/bar.ts     => [{percentage:  75, path: src/bar.ts}]
     *
     * @param logLines
     * @param marker
     * @private
     */
    MADFilesFromLogImpl.prototype.markerPercentageFiles = function (logLines, marker) {
        // logLines example: R100\tsrc/foo.ts
        var renamePercentagesAndFiles = this.linesRemovingMarkerPre(logLines, marker);
        // line f.e.: 100\tsrc/foo.ts      or      60\tsrc/foo.ts
        var percentageAndFileFromLine = function (line) {
            var split = line.split("\t");
            return {
                percentage: split[0],
                file: split[1]
            };
        };
        return renamePercentagesAndFiles.map(percentageAndFileFromLine);
    };
    /**
     * Given an array of lines containing all added, modified and delteted files, each line
     * beginning with a marker this function returns all lines containing the marker and removing
     * the marker at the beginning of each line
     *
     * Used for parsing Modified, Added and Deleted files with format: "M\tpath" | "A\tpath" | "D\tpath".
     *
     * TODO: just match beginning matcher.length chars of line
     *
     * @param logLines
     * @param marker
     * @private
     */
    MADFilesFromLogImpl.prototype.linesRemovingMarkerPre = function (logLines, marker) {
        var _this = this;
        var isMatched = function (line) {
            return line.match(marker);
        };
        var matchedLines = logLines.filter(isMatched);
        return matchedLines.map(function (line) {
            return _this.removeMarkerPreLine(line, marker);
        });
    };
    /**
     * Removes first marker.length chars at begin of the line
     * @param line
     * @param marker
     * @private
     */
    MADFilesFromLogImpl.prototype.removeMarkerPreLine = function (line, marker) {
        return line.slice(marker.length, line.length);
    };
    MADFilesFromLogImpl = __decorate([
        (0, inversify_1.injectable)()
    ], MADFilesFromLogImpl);
    return MADFilesFromLogImpl;
}());
exports.MADFilesFromLogImpl = MADFilesFromLogImpl;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTUFERmlsZXNGcm9tTG9nSW1wbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9naXQvcGFyc2VyL01BREZpbGVzRnJvbUxvZ0ltcGwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQUEsdUNBQXFDO0FBQ3JDLDJEQU04QjtBQUc5QjtJQUFBO0lBOEVBLENBQUM7SUE1RUcsZ0RBQWtCLEdBQWxCLFVBQW1CLGdCQUF3QjtRQUN2QyxJQUFNLEtBQUssR0FBRyxnQkFBZ0IsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDM0MsSUFBTSxhQUFhLEdBQUcsSUFBSSxDQUFDLHNCQUFzQixDQUFDLEtBQUssRUFBRSx5Q0FBb0IsQ0FBQyxDQUFDO1FBQy9FLElBQU0sVUFBVSxHQUFHLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxLQUFLLEVBQUUsc0NBQWlCLENBQUMsQ0FBQztRQUN6RSxJQUFNLFlBQVksR0FBRyxJQUFJLENBQUMsc0JBQXNCLENBQUMsS0FBSyxFQUFFLHdDQUFtQixDQUFDLENBQUM7UUFFN0Usc0tBQXNLO1FBQ3RLLDhGQUE4RjtRQUM5RixvR0FBb0c7UUFFcEcsT0FBTztZQUNILGFBQWEsRUFBRSxhQUFhO1lBQzVCLFVBQVUsRUFBRSxVQUFVO1lBQ3RCLFlBQVksRUFBRSxZQUFZO1NBQzdCLENBQUE7SUFDTCxDQUFDO0lBRUQ7Ozs7Ozs7Ozs7O09BV0c7SUFDSyxtREFBcUIsR0FBN0IsVUFBOEIsUUFBa0IsRUFBRSxNQUFjO1FBQzVELHFDQUFxQztRQUNyQyxJQUFNLHlCQUF5QixHQUFHLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxRQUFRLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFFaEYseURBQXlEO1FBQ3pELElBQU0seUJBQXlCLEdBQUcsVUFBQyxJQUFJO1lBQ25DLElBQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDL0IsT0FBTztnQkFDSCxVQUFVLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQztnQkFDcEIsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUM7YUFDakIsQ0FBQztRQUNOLENBQUMsQ0FBQTtRQUNELE9BQU8seUJBQXlCLENBQUMsR0FBRyxDQUFDLHlCQUF5QixDQUFDLENBQUM7SUFDcEUsQ0FBQztJQUVEOzs7Ozs7Ozs7Ozs7T0FZRztJQUNLLG9EQUFzQixHQUE5QixVQUErQixRQUFrQixFQUFFLE1BQWM7UUFBakUsaUJBUUM7UUFQRyxJQUFNLFNBQVMsR0FBRyxVQUFDLElBQVk7WUFDM0IsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQzlCLENBQUMsQ0FBQTtRQUNELElBQU0sWUFBWSxHQUFHLFFBQVEsQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDaEQsT0FBTyxZQUFZLENBQUMsR0FBRyxDQUFDLFVBQUMsSUFBSTtZQUN6QixPQUFPLEtBQUksQ0FBQyxtQkFBbUIsQ0FBQyxJQUFJLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFDbEQsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDO0lBRUQ7Ozs7O09BS0c7SUFDSyxpREFBbUIsR0FBM0IsVUFBNEIsSUFBWSxFQUFFLE1BQWM7UUFDcEQsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQ2xELENBQUM7SUE3RVEsbUJBQW1CO1FBRC9CLElBQUEsc0JBQVUsR0FBRTtPQUNBLG1CQUFtQixDQThFL0I7SUFBRCwwQkFBQztDQUFBLEFBOUVELElBOEVDO0FBOUVZLGtEQUFtQiJ9