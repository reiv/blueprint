/*
 * Copyright 2018 Palantir Technologies, Inc. All rights reserved.
 */

const { createKarmaConfig } = require("@blueprintjs/karma-build-scripts");
const fs = require("fs");
const path = require("path");

module.exports = function (config) {
    const baseConfig = createKarmaConfig({
        dirname: __dirname,
        coverageExcludes: [
            "src/generated/*",
        ],
    });
    config.set(baseConfig);
    config.set({
        // overrides here
    });
};