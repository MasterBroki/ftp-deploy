"use strict";

const path = require("path");
const fs = require("fs");
const utils = require("util");

// var assert = require("assert");

const statP = utils.promisify(fs.stat);

const del = require("delete");
const FtpDeploy = require("./ftp-deploy");
const remote = "/Users/charles/PhpstormProjects/ftp-deploy/test/remote/ftp";
const config = {
    user: "",
    password: "", // Optional, prompted if none given
    host: "localhost",
    port: 21,
    localRoot: path.join(__dirname, "../test/local"),
    remoteRoot: remote,
    exclude: [],
    include: ["folderA/**/*", "test-inside-root.txt"],
    debugMode: true,
    deleteRemote: false
};

describe("deploy tests", () => {
    const remoteDir = path.join(__dirname, "../test/remote/ftp");

    it("should fail if badly configured", () => {
        const d = new FtpDeploy();
        const configError = Object.assign({}, config, {port: 212});
        return del(remoteDir)
            .then(() => {
                return d.deploy(configError);
            })
            .catch(err => {
                // Should reject if file does not exist
                if (err.code === "ECONNREFUSED") {
                    return Promise.resolve("got expected error");
                } else {
                    return Promise.reject(err);
                }
            });
    });
    it("should fail with no include", () => {
        const d = new FtpDeploy();
        return del(remoteDir)
            .then(() => {
                let c2 = Object.assign({}, config, {include: []});
                return d.deploy(c2);
            })
            .catch(err => {
                if (err.code === "NoIncludes") {
                    return Promise.resolve("got expected error");
                } else {
                    return Promise.reject(err);
                }
            });
    });
    it("should put a file", () => {
        const d = new FtpDeploy();
        return del(remoteDir)
            .then(() => d.deploy(config))
            .then(() => {
                // Should reject if file does not exist
                statP(remoteDir + "/test-inside-root.txt");
            })
            .catch(err => done(err))
    });
    it("should not delete whitelisted files", (done) => {
        const d = new FtpDeploy();
        del(remoteDir)
            .then(() => {
                fs.mkdirSync(remoteDir);
                fs.mkdirSync(remoteDir + "/testFolder");
                fs.writeFileSync(remoteDir + "/testFolder/hello.txt", "test folder!!!");
                fs.writeFileSync(remoteDir + "/hello.txt", "test!!");
                config.deleteRemote = true;
                d.deploy(config).then(() => {
                    // Should reject if file does not exist
                    statP(remoteDir + "/hello.txt");
                    statP(remoteDir + "/testFolder/hello.txt");
                    done()
                })
                    .catch(err => done(err))

            })
    });
    it("should put a dot file", () => {
        const d = new FtpDeploy();
        return del(remoteDir)
            .then(() => {
                config.include = [".*"];
                return d.deploy(config);
            })
            .then(() => {
                // Should reject if file does not exist
                return statP(remoteDir + "/.testfile");
            });
    });
});
