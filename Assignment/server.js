var http = require('http');
var fs = require("fs");
var qs = require("querystring");
const { fileURLToPath } = require('url');

var MongoClient = require("mongodb").MongoClient;
var dbUrl = "mongodb://localhost:27017/";
//create a server object:
http.createServer(function (req, res) {

    if (req.url === "/apple") {
        res.write('Hello World!'); //write a response to the client
        res.end(); //end the response
    } else if (req.url === "/orange") {
        sendFileContent(res, "webjquery.html", "text/html");
    }

    else if (req.url === "/main") {
        sendFileContent(res, "index.html", "text/html");
    }

    else if (req.url === "/signup"  || req.url === "/signup?") {
        if (req.method == "POST") {
            console.log("this is signup page");
            return req.on('data', function (data) {
                formdata = '';
                formdata += data;
                console.log("formdata= " + formdata);
                //console.log(formdata);
                data = qs.parse(formdata);
                username = data['username'];
                password = data['password'];

                //console.log(username+password);

                MongoClient.connect(dbUrl, function (err, db) {
                    if (err) throw err;
                    var dbo = db.db("admin");
                    var obj = { username: username};
                    dbo.collection("userlog").find(obj).toArray(function(err, result){
                        if (err) throw err;
                        console.log("41: " + result.length);

                        if (result.length > 0) {
                            res.end("fail");
                        } else {
                            //console.log("47: " + obj);
                            var obj = { username: username, password: password};
                            dbo.collection("userlog").insertOne(obj, function (err, res) {
                                if (err) throw err;
                            });

                            dbo.collection("userlog").find(obj).toArray(function(err, result){
                                if (err) throw err;
                                console.log("55: " + result.length);
                            });

                            res.end("success");
                        }
                    });
                });
            });
        } else {
            sendFileContent(res, "signup.html", "text/html");
        }
    }

    else if (req.url === "/login" || req.url === "/login?") {
        if (req.method == "POST") {
            console.log("this is login page");
            return req.on('data', function (data) {
                formdata = '';
                formdata += data;
                console.log("formdata= " + formdata);
                //console.log(formdata);
                data = qs.parse(formdata);
                username = data['username'];
                password = data['password'];

                //console.log(username+password);

                MongoClient.connect(dbUrl, function (err, db) {
                    if (err) throw err;
                    var dbo = db.db("admin");
                    var obj = { username: username, password: password};
                    dbo.collection("userlog").find(obj).toArray(function(err, result){
                        if (err) throw err;
                        console.log("88: " + result.length);

                        if (result.length > 0) {
                            res.end("success");
                        } else {
                            res.end("fail");
                        }
                    });
                });
            });
        } else {
            sendFileContent(res, "login.html", "text/html");
        }
    }
    else if (req.url === "/categories") {
        
        if (req.method == "POST") {
            return req.on('data', function (data) {
                formdata = '';
                formdata += data;
                //console.log("formdata= " + formdata);
                //console.log(formdata);
                data = qs.parse(formdata);
                username = data['username'];
                img = data['img'];
                name = data['name'];
                //console.log(username+password);

                MongoClient.connect(dbUrl, function (err, db) {
                    if (err) throw err;
                    var dbo = db.db("admin");
                    var obj = {username: username, img: img, name: name};
                    dbo.collection("favour").find(obj).toArray(function(err, result){
                        if (err) throw err;
                        console.log("favour: " + result.length);
                        if (result.length > 0) {
                            dbo.collection("favour").deleteOne(obj, function(err, obj) {
                                if (err) throw err;
                            });
                            res.end("fail");
                        } else {
                            dbo.collection("favour").insertOne(obj, function (err, res) {
                                if (err) throw err;
                            });
                            res.end("success");
                        }
                    });
                });
            });
        } else {
            console.log("this is categories page");
            sendFileContent(res, "categories.html", "text/html");
        }
    }
    else if (req.url === "/favorite") {
        if (req.method == "POST") {
            return req.on('data', function (data) {
                formdata = '';
                formdata += data;
                //console.log("formdata= " + formdata);
                //console.log(formdata);
                data = qs.parse(formdata);
                username = data['username'];
                img = data['img'];
                name = data['name'];
                //console.log(username+password);

                MongoClient.connect(dbUrl, function (err, db) {
                    if (err) throw err;
                    var dbo = db.db("admin");
                    var obj = {username: username, img: img, name: name};
                    dbo.collection("favour").find(obj).toArray(function(err, result){
                        if (err) throw err;
                        console.log("favour: " + result.length);
                        if (result.length > 0) {
                            dbo.collection("favour").deleteOne(obj, function(err, obj) {
                                if (err) throw err;
                            });
                            res.end("fail");
                        } else {
                            dbo.collection("favour").insertOne(obj, function (err, res) {
                                if (err) throw err;
                            });
                            res.end("success");
                        }
                    });
                });
            });
        } else {
            console.log("this is favorite page");
            sendFileContent(res, "favorite.html", "text/html");
        }
    }

    else if (/^\/[a-zA-Z0-9\/-/.-]*.js$/.test(req.url.toString())) {
        sendFileContent(res, req.url.toString().substring(1), "text/javascript");
    } else if (/^\/[a-zA-Z0-9\/-/.-]*.bundle.min.js$/.test(req.url.toString())) {
        sendFileContent(res, req.url.toString().substring(1), "text/javascript");
    } else if (/^\/[a-zA-Z0-9\/-/.-]*.css$/.test(req.url.toString())) {
        sendFileContent(res, req.url.toString().substring(1), "text/css");
    } else if (/^\/[a-zA-Z0-9\/-/.-]*.min.css$/.test(req.url.toString())) {
        sendFileContent(res, req.url.toString().substring(1), "text/css");
    } else if (/^\/[a-zA-Z0-9\/-/.-]*.slicknav.js$/.test(req.url.toString())) {
        sendFileContent(res, req.url.toString().substring(1), "text/css");

    } else if (/^\/[a-zA-Z0-9\/-/.-]*.jpg$/.test(req.url.toString())) {
        sendFileContent(res, req.url.toString().substring(1), "image/jpg");
    } else if (/^\/[a-zA-Z0-9\/-/.-]*.min.js$/.test(req.url.toString())) {
        sendFileContent(res, req.url.toString().substring(1), "text/javascript");

        //}else if(/^\/[a-zA-Z0-9-._\/]*.min.js$/.test(req.url.toString())){
        //sendFileContent(res, req.url.toString().substring(1), "text/javascript");

    } else if (/^\/[a-zA-Z0-9\/-/.-]*.min.css.map$/.test(req.url.toString())) {
        sendFileContent(res, req.url.toString().substring(1), "text/map");
    } else if (/^\/[a-zA-Z0-9\/-/.-]*.min.js.map$/.test(req.url.toString())) {
        sendFileContent(res, req.url.toString().substring(1), "text/map");
    } else if (/^\/[a-zA-Z0-9\/-/.-]*.css.map$/.test(req.url.toString())) {
        sendFileContent(res, req.url.toString().substring(1), "text/map");
    } else if (/^\/[a-zA-Z0-9\/-/.-]*.png$/.test(req.url.toString())) {
        sendFileContent(res, req.url.toString().substring(1), "image/png");
    } else if (/^\/[a-zA-Z0-9\/-/.-]*.ico$/.test(req.url.toString())) {
        sendFileContent(res, req.url.toString().substring(1), "text/ico");

    } else if (/^\/[a-zA-Z0-9\/-/.-]*.ttf?v=4.7.0$/.test(req.url.toString())) {
        sendFileContent(res, req.url.toString().substring(1), "text/font");
    } else if (/^\/[a-zA-Z0-9\/-/.-]*.woff?v=4.7.0$/.test(req.url.toString())) {
        sendFileContent(res, req.url.toString().substring(1), "text/woff");
    } else if (/^\/[a-zA-Z0-9\/-/.-]*.woff2?v=4.7.0$/.test(req.url.toString())) {
        sendFileContent(res, req.url.toString().substring(1), "text/woff2");

    } else if (/^\/[a-zA-Z0-9\/-/.-]*.ttf$/.test(req.url.toString())) {
        sendFileContent(res, req.url.toString().substring(1), "text/font");
    } else if (/^\/[a-zA-Z0-9\/-/.-]*.woff$/.test(req.url.toString())) {
        sendFileContent(res, req.url.toString().substring(1), "text/woff");
    } else if (/^\/[a-zA-Z0-9\/-/.-]*.woff2$/.test(req.url.toString())) {
        sendFileContent(res, req.url.toString().substring(1), "text/woff2");

    } else {
        console.log("Requested URL is: " + req.url);
        res.end();
    }
}).listen(8080); //the server object listens on port 8080


function sendFileContent(response, fileName, contentType) {
    fs.readFile(fileName, function (err, data) {
        if (err) {
            response.writeHead(404);
            response.write("Not Found!");
        }
        else {
            response.writeHead(200, { 'Content-Type': contentType });
            response.write(data);
        }
        response.end();
    });
}