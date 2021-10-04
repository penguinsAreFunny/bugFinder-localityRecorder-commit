# Description
This package is used as a localityRecorder for the recording phase of the [bugfinder-framework](https://github.com/penguinsAreFunny/bugFinder-framework#readme) or 
([npm:bugfinder-framework](https://www.npmjs.com/package/bugfinder-framework)). It records git-commits as localities.
# Prerequisites
You need to begin with understanding the [bugfinder-framework](https://github.com/penguinsAreFunny/bugFinder-framework#readme)
and installing it:

    npm i bugfinder-framework

You need to have [git](https://git-scm.com/) installed. Used version

    git v2.28.0

# Usage
    npm i -D bugfinder-localityrecorder-commit
inversify.config.ts
```
import {LOCALITY_A_TYPES, LocalityRecorder} from "bugfinder-framework";
import {
    BUGFINDER_LOCALITYRECORDER_COMMIT_TYPES, Commit, CommitRecorder,
    GitOptions
} from "bugfinder-localityrecorder-commit";
import {localityAContainer} from "bugfinder-framework-defaultcontainer";

const container = localityAContainer;

const projectRoot = "../projectroot/"
const gitOptions: GitOptions = {
    baseDir: projectRoot,
    maxConcurrentProcesses: 4
}

container.bind<LocalityRecorder<Commit>>(BUGFINDER_LOCALITYRECORDER_COMMITPATH_TYPES.commitRecorder).to(CommitRecorder)
container.bind<GitOptions>          (BUGFINDER_LOCALITYRECORDER_COMMIT_TYPES.gitOptions).toConstantValue(gitOptions)
```
main.ts
```
import "reflect-metadata";
import {container} from "./inversify.config"
import {LOCALITY_A_TYPES, LocalityRecorder} from "bugfinder-framework";

const localityRecorder = container.get<LocalityRecorder<Commit>>(LOCALITY_A_TYPES.localityRecorder);
const localities = await localityRecorder.getLocalities();      
```