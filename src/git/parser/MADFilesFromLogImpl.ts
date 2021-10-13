import {injectable} from "inversify";
import {
    ADDED_FILE_MARKER,
    DELETED_FILE_MARKER,
    MADFiles,
    MADFilesFromCommit,
    MODIFIED_FILE_MARKER
} from "./MADFilesFromCommit";

@injectable()
export class MADFilesFromLogImpl implements MADFilesFromCommit {

    MADFilesFromCommit(commitNameStatus: string): MADFiles {
        const lines = commitNameStatus.split("\n");
        const modifiedFiles = this.linesRemovingMarkerPre(lines, MODIFIED_FILE_MARKER);
        const addedFiles = this.linesRemovingMarkerPre(lines, ADDED_FILE_MARKER);
        const deletedFiles = this.linesRemovingMarkerPre(lines, DELETED_FILE_MARKER);

        // Not classified yet: R100, C75 : copied files percentage https://stackoverflow.com/questions/53056942/git-diff-name-status-what-does-r100-mean https://git-scm.com/docs/git-status
        // files marker with MM @See Typescript: commit: 5ad8532a11ef2859f91d2bec8f020651538d1ad5
        // Missing: check for commits with not empty lines, but still not modified, added and deletedFiles
        return {
            modifiedFiles: modifiedFiles,
            addedFiles: addedFiles,
            deletedFiles: deletedFiles
        }
    }

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
    private markerPercentageFiles(logLines: string[], marker: string): { percentage: number; file: string }[] {
        // logLines example: R100\tsrc/foo.ts
        const renamePercentagesAndFiles = this.linesRemovingMarkerPre(logLines, marker);

        // line f.e.: 100\tsrc/foo.ts      or      60\tsrc/foo.ts
        const percentageAndFileFromLine = (line) => {
            const split = line.split("\t");
            return {
                percentage: split[0],
                file: split[1]
            };
        }
        return renamePercentagesAndFiles.map(percentageAndFileFromLine);
    }

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
    private linesRemovingMarkerPre(logLines: string[], marker: string) {
        const isMatched = (line: string) => {
            return line.match(marker);
        }
        const matchedLines = logLines.filter(isMatched);
        return matchedLines.map((line) => {
            return this.removeMarkerPreLine(line, marker);
        });
    }

    /**
     * Removes first marker.length chars at begin of the line
     * @param line
     * @param marker
     * @private
     */
    private removeMarkerPreLine(line: string, marker: string): string {
        return line.slice(marker.length, line.length);
    }
}
