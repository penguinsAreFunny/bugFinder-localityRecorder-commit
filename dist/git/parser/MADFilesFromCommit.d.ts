export declare const MODIFIED_FILE_MARKER = "M\t";
export declare const ADDED_FILE_MARKER = "A\t";
export declare const DELETED_FILE_MARKER = "D\t";
export interface MADFiles {
    modifiedFiles: string[];
    addedFiles: string[];
    deletedFiles: string[];
}
export interface MADFilesFromCommit {
    /**
     * Parses MAD-Files from a git commit shown with --name-status
     * @example
     * A    src/foo.ts
     * M    src/bar.ts
     * D    src/loo.ts
     * => {
     *     modifiedFiles: ["src/bar.ts"],
     *     addedFiles: ["src/foo.ts"],
     *     deletedFiles: ["src/loo.ts"]
     * }
     *
     * @param commitNameStatus  @see example above
     */
    MADFilesFromCommit(commitNameStatus: string): MADFiles;
}
