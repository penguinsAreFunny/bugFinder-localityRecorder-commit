"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MADFilesFromLog = void 0;
var inversify_1 = require("inversify");
var MADFilesFromCommit_1 = require("./MADFilesFromCommit");
var MADFilesFromLog = /** @class */ (function () {
    function MADFilesFromLog() {
    }
    MADFilesFromLog.prototype.MADFilesFromCommit = function (commitNameStatus) {
        var lines = commitNameStatus.split("\n");
        var modifiedFiles = this.linesRemovingMarkerPre(lines, MADFilesFromCommit_1.MODIFIED_FILE_MARKER);
        var addedFiles = this.linesRemovingMarkerPre(lines, MADFilesFromCommit_1.ADDED_FILE_MARKER);
        var deletedFiles = this.linesRemovingMarkerPre(lines, MADFilesFromCommit_1.DELETED_FILE_MARKER);
        // Not classified yet: R100, C75 : copied files percentage https://stackoverflow.com/questions/53056942/git-diff-name-status-what-does-r100-mean https://git-scm.com/docs/git-status
        // files marker with MM @See Typescript: commit: 5ad8532a11ef2859f91d2bec8f020651538d1ad5
        // Missing: check for commits with not empty lines, but still not modified, added and deletedFiles
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
    MADFilesFromLog.prototype.markerPercentageFiles = function (logLines, marker) {
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
     * @param logLines
     * @param marker
     * @private
     */
    MADFilesFromLog.prototype.linesRemovingMarkerPre = function (logLines, marker) {
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
    MADFilesFromLog.prototype.removeMarkerPreLine = function (line, marker) {
        return line.slice(marker.length, line.length);
    };
    MADFilesFromLog = __decorate([
        (0, inversify_1.injectable)()
    ], MADFilesFromLog);
    return MADFilesFromLog;
}());
exports.MADFilesFromLog = MADFilesFromLog;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTUFERmlsZXNGcm9tTG9nLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2dpdC9wYXJzZXIvTUFERmlsZXNGcm9tTG9nLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUFBLHVDQUFxQztBQUNyQywyREFNOEI7QUFHOUI7SUFBQTtJQTBFQSxDQUFDO0lBeEVHLDRDQUFrQixHQUFsQixVQUFtQixnQkFBd0I7UUFDdkMsSUFBTSxLQUFLLEdBQUcsZ0JBQWdCLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQzNDLElBQU0sYUFBYSxHQUFHLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxLQUFLLEVBQUUseUNBQW9CLENBQUMsQ0FBQztRQUMvRSxJQUFNLFVBQVUsR0FBRyxJQUFJLENBQUMsc0JBQXNCLENBQUMsS0FBSyxFQUFFLHNDQUFpQixDQUFDLENBQUM7UUFDekUsSUFBTSxZQUFZLEdBQUcsSUFBSSxDQUFDLHNCQUFzQixDQUFDLEtBQUssRUFBRSx3Q0FBbUIsQ0FBQyxDQUFDO1FBRTdFLG9MQUFvTDtRQUNwTCx5RkFBeUY7UUFDekYsa0dBQWtHO1FBQ2xHLE9BQU87WUFDSCxhQUFhLEVBQUUsYUFBYTtZQUM1QixVQUFVLEVBQUUsVUFBVTtZQUN0QixZQUFZLEVBQUUsWUFBWTtTQUM3QixDQUFBO0lBQ0wsQ0FBQztJQUVEOzs7Ozs7Ozs7OztPQVdHO0lBQ0ssK0NBQXFCLEdBQTdCLFVBQThCLFFBQWtCLEVBQUUsTUFBYztRQUM1RCxxQ0FBcUM7UUFDckMsSUFBTSx5QkFBeUIsR0FBRyxJQUFJLENBQUMsc0JBQXNCLENBQUMsUUFBUSxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBRWhGLHlEQUF5RDtRQUN6RCxJQUFNLHlCQUF5QixHQUFHLFVBQUMsSUFBSTtZQUNuQyxJQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQy9CLE9BQU87Z0JBQ0gsVUFBVSxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUM7Z0JBQ3BCLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDO2FBQ2pCLENBQUM7UUFDTixDQUFDLENBQUE7UUFDRCxPQUFPLHlCQUF5QixDQUFDLEdBQUcsQ0FBQyx5QkFBeUIsQ0FBQyxDQUFDO0lBQ3BFLENBQUM7SUFFRDs7Ozs7Ozs7O09BU0c7SUFDSyxnREFBc0IsR0FBOUIsVUFBK0IsUUFBa0IsRUFBRSxNQUFjO1FBQWpFLGlCQVFDO1FBUEcsSUFBTSxTQUFTLEdBQUcsVUFBQyxJQUFZO1lBQzNCLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUM5QixDQUFDLENBQUE7UUFDRCxJQUFNLFlBQVksR0FBRyxRQUFRLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQ2hELE9BQU8sWUFBWSxDQUFDLEdBQUcsQ0FBQyxVQUFDLElBQUk7WUFDekIsT0FBTyxLQUFJLENBQUMsbUJBQW1CLENBQUMsSUFBSSxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBQ2xELENBQUMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztJQUVEOzs7OztPQUtHO0lBQ0ssNkNBQW1CLEdBQTNCLFVBQTRCLElBQVksRUFBRSxNQUFjO1FBQ3BELE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUNsRCxDQUFDO0lBekVRLGVBQWU7UUFEM0IsSUFBQSxzQkFBVSxHQUFFO09BQ0EsZUFBZSxDQTBFM0I7SUFBRCxzQkFBQztDQUFBLEFBMUVELElBMEVDO0FBMUVZLDBDQUFlIn0=