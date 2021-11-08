import {Commit} from "../commit";

export interface GitOptions {
    baseDir: string;
    maxConcurrentProcesses: 4;
}

export interface Git {
    _options: GitOptions;

    /**
     * Returns the parsed log as an array of ordered from semantic older to newer
     * Default git log is used to get the order
     * @See GitCommit
     */
    logAll(): Promise<Commit[]>;

    checkout(hash: string, force?: boolean);

    MADFiles(hash: string): Promise<{ modifiedFiles: string[]; addedFiles: string[]; deletedFiles: string[] }>;

    modifiedFiles(hash: string): Promise<string[]>;

    modifiedFilesSync(hash: string): string[];

    addedFiles(hash: string): Promise<string[]>;

    addedFilesSync(hash: string): string[];

    deletedFiles(hash: string): Promise<string[]>;

    deletedFilesSync(hash: string): string[];

}
