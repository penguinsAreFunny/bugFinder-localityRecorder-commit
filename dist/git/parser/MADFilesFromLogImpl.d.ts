import { MADFiles, MADFilesFromCommit } from "./MADFilesFromCommit";
export declare class MADFilesFromLogImpl implements MADFilesFromCommit {
    MADFilesFromCommit(commitNameStatus: string): MADFiles;
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
    private markerPercentageFiles;
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
    private linesRemovingMarkerPre;
    /**
     * Removes first marker.length chars at begin of the line
     * @param line
     * @param marker
     * @private
     */
    private removeMarkerPreLine;
}
