import {inject, injectable} from "inversify";
import {BUGFINDER_LOCALITYRECORDER_COMMIT_TYPES} from "./TYPES";
import {Git} from "./git";
import {Commit} from "./commit";
import {LocalityRecorder} from "bugfinder-framework";

@injectable()
export class CommitRecorder implements LocalityRecorder<Commit>{

    @inject(BUGFINDER_LOCALITYRECORDER_COMMIT_TYPES.git)
    git: Git;

    async getLocalities(): Promise<Commit[]> {
        return this.git.logAll();
    }

}