# Contributing to Wink

Thank you for taking time to contribute. We are delighted to receive contributions from the community. For wink every contribution matters — whether you are reporting a **bug**, posting a **question**, submitting a **pull request** or updating the **documentation**.

## Getting Started
1. Fork the repository from github
2. Develop your code changes
3. Ensure that the API is properly documented
4. Capture the logic in comments
4. Ensure proper linting via  `npm run pretest`
5. Run tests using `npm run test`
6. Make sure coverage either stays at the current levels or improves
7. Commit your changes in compliance with commit guidelines
8. Push to your fork
9. Sign the CLA if you are contributing for the first time
10. Finally, submit a pull request.


## Code of Conduct
By contributing, you are expected to uphold [wink’s code of conduct](CODE_OF_CONDUCT.md). In essence, each one of us should:

1. respect fellow contributors, irrespective of their level of experience, race, religion, gender, sexual orientation, and age;
2. collaborate constructively;
3. never engage in any form of offense, harassment,  insult, personal attack, provocation and/or use of inappropriate language;



## Things to know
### About Wink
Wink is a growing open source project focusing on **Natural Language Processing**, **Machine Learning** and **Statistics**. It contains multiple repositories or packages. All packages expose consistent and uniform APIs, thus minimizing the need to learn a new interface for each task. Do take out some time in understanding the structure of APIs, before attempting any enhancements. In wink, we prefer **functions** and **closures** over objects.

Like artisans, we too need a toolset and process to create beautiful software. The process is orchestrated by [Travis CI](https://travis-ci.org/) in accordance to the configuration files present in each repository. The details and tools used are outlined below.


### Linting
Well defined linting rules helps us in making code more consistent and avoid bugs. [ESLint](https://eslint.org) enforces these rules via its configuration file. This file is located in the root of each repository.


### Documenting
We believe that the documentation must not only explain the API but also narrate the story of logic, algorithms and references used. Wink uses the [JSDoc](http://usejsdoc.org/) standard for API documentation and [Literate-Programming Standards](https://en.wikipedia.org/wiki/Literate_programming) for documenting the logic using [docker](http://jbt.github.io/docker/src/docker.js.html). The API documentation quality is measured using [Inch CI](https://inch-ci.org/) and we expect that your contribution will improve or maintain the current levels.

### Testing
Wink requires a test coverage of **atleast > 99.5%** and aims for 100%. Any new contribution must maintain the existing test coverage level. We use [Chai](http://chaijs.com/), [Mocha](https://mochajs.org/) and [Istanbul](https://inch-ci.org/), [Coveralls](https://coveralls.io/) to run tests and determine coverage.

### Committing
We follow [commit guidelines](https://github.com/angular/angular.js/blob/master/DEVELOPERS.md#commits) from the Google's [Angular Project](https://angular.io/), whose documentation is licensed under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). See important excerpts for quick reference below:

#### Commit Message Format
Each commit message consists of a **header**, a **body** and a **footer**. The header has a special format that includes a **type**, a **scope** and a **subject**:

    <type>(<scope>): <subject>
    <BLANK LINE>
    <body>
    <BLANK LINE>
    <footer>

The header is **mandatory** and the scope of the header is optional. Any line of the commit message should not be longer 100 characters!

**Type** should be one of the following:

- `feat:` A new feature
- `fix:` A bug fix
- `docs:` Documentation only changes
- `style:` Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)
- `refactor:` A code change that neither fixes a bug nor adds a feature
- `perf:` A code change that improves performance
- `test:` Adding missing or correcting existing tests
- `chore:` Changes to the build process or auxiliary tools and libraries such as documentation generation
- `revert:` when you have to revert to an older commit. Ths subject should be the header of old  commit and body should contain `This reverts commit <hash>.` Use `git revert` command to accomplish this.

**Scope** specifies the  place of the commit change. You can use `*` when the change affects more than a single scope.

**Subject** must contain a crisp description of the change and it must (a) use the imperative, present tense: "change" not "changed" nor "changes", (b) not capitalize the first letter, and (c) not use period (.) at the end.

**Body** just as in the subject, use the imperative, present tense: "change" not "changed" nor "changes". The body should include the motivation for the change.

**Footer** should contain any information about **Breaking Changes** and is also the place to reference [GitHub issues that this commit closes](https://help.github.com/articles/closing-issues-via-commit-messages/). Breaking Changes should start with the word `BREAKING CHANGE:` with a space or two newlines. The rest of the commit message is then used for this.


### Contributor License Agreement (CLA)

The [CLA](https://gist.github.com/sanjayaksaxena/8b96d3d4f2be6cdc0f28a5839d5a5b2a) is for your protection as well as the protection of [GRAYPE](http://graype.in) and it’s licensees; it does not change your rights to use your own Contributions for any other purpose. Our CLA is a short and easy to understand agreement and can be signed using a simple click-through form.  Please sign our Contributor License Agreement (CLA) before sending pull requests. It's a quick process, we promise!
