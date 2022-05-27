# Contributing to WinkNLP

Thank you for taking time to contribute. We are delighted to receive contributions from the community. For `wink-nlp` every contribution matters — whether you are reporting a **bug**, posting a **question** or **suggestion**, submitting a **pull request** or updating the **documentation**.

This document will guide you through the contribution process and guidelines.

## Getting Started
If you spot a bug/issue and the same has not yet been reported, [raise a new issue](https://github.com/winkjs/wink-nlp/issues) or consider fixing it and sending a PR. If you have questions and/or suggestions, post them at our [discussions](https://github.com/winkjs/wink-nlp/discussions). New features may also be discussed there; eventually you may consider developing the same and sending a PR.

### How to send a PR?

1. Fork the repository from github
2. Develop your code changes
4. Capture the logic in comments
3. Ensure that the API is properly documented
4. Ensure proper linting
2. Write test cases to cover each and every change and/or new feature
2. Review security and performance
5. Run the entire test suite
6. Make sure coverage either stays at the current levels or improves; note minimum acceptable level is ≥99.5%
7. Commit your changes in compliance with commit guidelines
8. Push to your fork
9. [Sign the CLA](https://cla-assistant.io/winkjs/wink-nlp) if you are contributing for the first time

After completing the above steps, you are ready to submit the pull request.


## Code of Conduct
By contributing, you are expected to uphold [wink’s code of conduct](CODE_OF_CONDUCT.md). In essence, each one of us should:

1. respect fellow contributors, irrespective of their level of experience, race, religion, gender, sexual orientation, and age;
2. collaborate constructively;
3. never engage in any form of offense, harassment,  insult, personal attack, provocation and/or use of inappropriate language;



## Development Guidelines
WinkNLP is a developer-friendly Natural Language Processing (NLP) library, whose API is designed specifically to make development of NLP solutions easier and faster.
Do take out some time in understanding the structure of APIs, before attempting any enhancements.

In winkNLP, we prefer **functions** and **closures** over objects/classes.

Like artisans, we too need a toolset and process to create beautiful software. The process is orchestrated by [Travis CI](https://www.travis-ci.com) in accordance with the configuration files present in the repository. The details are outlined below:


### Linting
Well defined linting rules or **coding standards** help us in making code more consistent and avoid bugs. [ESLint](https://eslint.org) enforces these rules automatically. These rules are defined in a configuration file named `.eslintrc.json`, which is located at the root of the repository. These rules cover basic formatting, naming conventions, limits of code complexity, and many more; please refer to the configuration file for further details.

We recommend using a suitable ESLint plugin/add-on for the code editor. Use script **`npm run pretest`** at command line to run linting on the entire code.


### Documenting
We believe that the documentation must not only explain the API but also narrate the story of logic, algorithms and references used. WinkNLP uses the [JSDoc](https://jsdoc.app) standard for API documentation. It is inspired by [Literate-Programming Standards](https://en.wikipedia.org/wiki/Literate_programming) for documenting the logic using [docker](http://jbt.github.io/docker/src/docker.js.html); the **`npm run sourcedocs`** script generates a well formatted code documentation in HTML.

### Testing
Test cases should cover each and every feature and/or change; use of standard test heuristics such as equivalence partition, boundary values, empty/null value, and decision tree is recommended to write effective test cases.

WinkNLP requires a test coverage of **at least ≥99.5%** and aims for 100%. Any new contribution must maintain the existing test coverage level. We use [Chai](http://chaijs.com/), [Mocha](https://mochajs.org/) and [Istanbul](https://istanbul.js.org), [Coveralls](https://coveralls.io/) to run tests and determine coverage.

Use script **`npm run test`** at command line to run the entire test suite and obtain test coverage report.

#### Performance Considerations
It is important to maintain the performance of winkNLP, whenever a change is made and/or a new feature is added. We use the [benchmark](https://benchmarkjs.com) package to measure performance in tokens per second for the entire NLP pipeline. Use script **`npm run perf`** at command line to measure performance.

#### Security Considerations
Our security review/testing is inspired from the recommendations in [OWASP's NodeJS Security Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Nodejs_Security_Cheat_Sheet.html) that are applicable to winkNLP —  since it is a library used by developers to create NLP web/mobile/CLI  apps/tools, only Platform Security specific recommendations apply. We follow the  guidelines outlined below:

1. Stay away from using any external package — winkNLP has 0 external dependency.
1. Use ESLint as a Static Analysis Security Testing (SAST) tool.
1. Never use `eval()` function.
1. Avoid prototype pollution by using objects created via **`Object.create( null )`**.
1. Perform input validation with defined default behavior.
1. Use  tools like [regexploit](https://github.com/doyensec/regexploit) to detect potential ReDoS apart from reviewing regexes using  [regex 101](https://regex101.com) on Chrome browser (Latest stable version), Node.js (LTS version).

### Committing
We follow [commit guidelines](https://github.com/angular/angular.js/blob/master/DEVELOPERS.md#commits) from Google's [Angular Project](https://angular.io/), whose documentation is licensed under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). See important excerpts for quick reference below:

#### Commit Message Format
Each commit message consists of a **header**, a **body** and a **footer**. The header has a special format that includes a **type**, a **scope** and a **subject**:

    <type>(<scope>): <subject>
    <BLANK LINE>
    <body>
    <BLANK LINE>
    <footer>

The header is **mandatory** and the scope of the header is optional. Any line of the commit message should not be longer than 100 characters!

**Type** should be one of the following:

- `build`: Changes that affect the build system or external dependencies
- `ci`: Changes to our CI configuration files and scripts
- `docs`: Documentation only changes
- `feat`: A new feature
- `fix`: A bug fix
- `perf`: A code change that improves performance
- `refactor`: A code change that neither fixes a bug nor adds a feature
- `test`: Adding missing tests or correcting existing tests
- `revert:` When you have to revert to an older commit. Ths subject should be the header of the old  commit and the body should contain `This reverts commit <hash>.` Use the `git revert` command to accomplish this.

**Scope** specifies the  place of the commit change. You can use `*` when the change affects more than a single scope.

**Subject** must contain a crisp description of the change and it must (a) use the imperative, present tense: "change" not "changed" nor "changes", (b) not capitalize the first letter, and (c) not use period (.) at the end.

**Body** just as in the subject, use the imperative, present tense: "change" not "changed" nor "changes". The body should include the motivation for the change.

**Footer** should contain any information about **Breaking Changes** and is also the place to reference [GitHub issues that this commit closes](https://help.github.com/articles/closing-issues-via-commit-messages/). Breaking Changes should start with the word `BREAKING CHANGE:` with a space or two newlines. The rest of the commit message is then used for this.

## Versioning
WinkNLP follows [semantic versioning](https://semver.org/) for every release.

## Governance
This section outlines winkNLP’s governance  guidelines:
1. This is a project of [Graype Systems Private Limited (Graype)](http://graype.in), which is a micro-size company incorporated in India.
1. The project team consists of 3-core members, including a technical lead.
1. The project welcomes contributions from the community. For winkNLP every contribution matters — whether it  is [reporting a bug/issue](https://github.com/winkjs/wink-nlp/issues), [posting a question/suggestion](https://github.com/winkjs/wink-nlp/discussions), submitting a pull request or updating the documentation.
1. Everyone is entitled to state their opinion and may present their arguments. There is an effort to achieve consensus but in absence of obvious consensus, the technical lead has the final say in decision making. It roughly matches a standard BDFL (Benevolent Dictator For Life) style project.
1. WinkNLP is licensed under the terms of the MIT license; therefore there are no limitations on forking and developing it further separately.
1. The technical lead has commit and administrative rights on the project's [organization](https://github.com/winkjs) and [repository](https://github.com/winkjs/wink-nlp) at Github. Therefore the technical lead can make changes and accept changes — typically pull requests submitted by others. These changes may include changes to the process and contribution requirements.
1. [Graype](http://graype.in) offers commercial support and/or services around the project.
1. The key roles are (a) User — who uses or has used the package; (b) Contributor — who has reported one or more issues, participated in one or more discussions OR sent one or more PRs; (c) Core Team Member as stated above and (d) Technical Lead.
1. Core team members are Prateek Saxena, Rachna Chakraborty and Sanjaya Kumar Saxena (Technical Lead).
1. Current opportunities to participate are outlined in the [roadmap](ROADMAP.md).
1. Every PR must comply with our [development guidelines](CONTRIBUTING.md#development-guidelines) before they can be accepted/merged.
1. Participation requires adherence to our [code of conduct](CODE_OF_CONDUCT.md).



## Contributor License Agreement (CLA)

The [CLA](https://gist.github.com/sanjayaksaxena/8b96d3d4f2be6cdc0f28a5839d5a5b2a) is for your protection as well as the protection of [Graype](http://graype.in) and it’s licensees; it does not change your rights to use your own Contributions for any other purpose. Our CLA is a short and easy to understand agreement and can be signed using a simple click-through form.  Please [sign our Contributor License Agreement (CLA)](https://cla-assistant.io/winkjs/wink-nlp) before sending pull requests. It's a quick process, we promise!
