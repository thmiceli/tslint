/*
 * Copyright 2013 Palantir Technologies, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
*/

/// <reference path='../references.ts' />

describe("<no-string-literal>", () => {
    it("forbids object access via string literals", () => {
        var fileName = "rules/sub.test.ts";
        var NoStringLiteralRule = Lint.Test.getRule("no-string-literal");

        var actualFailures = Lint.Test.applyRuleOnFile(fileName, NoStringLiteralRule);
        var expectedFailures = [
            Lint.Test.createFailure(fileName, [10, 20], [10, 25], NoStringLiteralRule.FAILURE_STRING),
            Lint.Test.createFailure(fileName, [11, 21], [11, 24], NoStringLiteralRule.FAILURE_STRING),
            Lint.Test.createFailure(fileName, [15, 5], [15, 23], NoStringLiteralRule.FAILURE_STRING),
            Lint.Test.createFailure(fileName, [16, 5], [16, 30], NoStringLiteralRule.FAILURE_STRING)
        ];

        expectedFailures.forEach((expectedFailure) => {
            Lint.Test.assertContainsFailure(actualFailures, expectedFailure);
        });
    });
});
