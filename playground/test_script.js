// works with the test server
const path = require("path");

const FtpDeploy = require("../src/ftp-deploy");
const remote = "/Users/charles/PhpstormProjects/ftp-deploy/test/remote/ftp";

const config = {
    user: "anonymous",
    password: "anon", // Optional, prompted if none given
    host: "localhost",
    port: 2121,
    localRoot: path.join(__dirname, "local"),
    remoteRoot: "/f",
    deleteRemote: true,
    exclude: [],
    include: ["test-inside-root.txt"],
    whitelist: [
        remote + "/hello.txt",
        remote + "/testFolder"
    ],
    // include: ["**/*", "*", ".*"]
};

const ftpDeploy = new FtpDeploy();

// use with promises
ftpDeploy
    .deploy(config)
    .then(res => console.log("finished: ", res))
    .catch(err => console.log("err", err));

ftpDeploy.on("log", data => console.log("[log]", data));
ftpDeploy.on("uploading", data => console.log("[uploading]", data));
ftpDeploy.on("uploaded", data => console.log("[uploaded]", data));
ftpDeploy.on("upload-error", data => console.log("[upload-error]", data));
