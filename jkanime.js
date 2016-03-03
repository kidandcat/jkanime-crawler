

var prompt = require('prompt');
var http = require('http');
var path = require('path');
var fs = require('fs');
var childProcess = require('child_process');
var phantomjs = require('phantomjs');
var binPath = phantomjs.path;
var mkdirp = require('mkdirp');
var request = require('request');
var ProgressBar = require('progress');
var progress = require('request-progress');




var animes = [];
var updates = 0;
var downloads = 0;
var downloaders = [];

prompt.start();
prompt.get(['url', 'update animes?(y/N)'], function (err, result) {

    function getDirectories(srcpath) {
        try {
            return fs.readdirSync(srcpath).filter(function (file) {
                return fs.statSync(path.join(srcpath, file)).isDirectory();
            });
        } catch (e) {

        }
    }

    if (result['update animes?(y/N)'] == 'y') {
        animes = getDirectories('./Anime');
        if (result.url) {
            animes.push(result.url.split('/')[3]);
            console.log('pushed: ' + result.url.split('/')[3]);
        }
        updates = animes.length - 1;
        update();
    } else {
        animes.push(result.url.split('/')[3]);
        updates = animes.length - 1;
        update();
    }

    function update() {
        console.log(' ');
        console.log(' ');
        console.log('····························································');
        console.log('Updating: ' + 'http://jkanime.net/' + animes[updates] + '/');
        getEpisodes('http://jkanime.net/' + animes[updates] + '/');
    }

    function getEpisodes(url) {
        var c = childProcess.execFile(binPath, ['./episodesList.js', url], function (err, stdout, stderr) {
            if (err) console.log(err);
            var urls = stdout.split('**');
            var first = true;

            urls[urls.length - 1] = urls[urls.length - 1].substr(0, urls[urls.length - 1].length - 2);

            urls.forEach(function (ur) {
                if (first) {
                    first = false;
                } else {
                    try {
                        if (fs.statSync("Anime/" + ur.split('net/')[1].split('/')[0] + '/' + ur.split('net/')[1].split('/')[1] + '.mp4').isFile()) {
                            console.log('- File exists: ' + "Anime/" + ur.split('net/')[1].split('/')[0] + '/' + ur.split('net/')[1].split('/')[1] + '.mp4');
                        } else {
                            console.log('+ Downloading: ' + "Anime/" + ur.split('net/')[1].split('/')[0] + '/' + ur.split('net/')[1].split('/')[1] + '.mp4');
                            downloaders.push(ur);
                        }
                    }
                    catch (err) {
                        console.log('+ Downloading: ' + "Anime/" + ur.split('net/')[1].split('/')[0] + '/' + ur.split('net/')[1].split('/')[1] + '.mp4');
                        downloaders.push(ur);
                    }
                }
            });

        });
        c.on('close', function (code) {
            console.log('\n- Left: ' + updates);
            if (updates > 0) {
                updates--;
                update();
            } else {
                if (downloaders.length > 0) {
                    getVideo(downloaders.shift());
                }
            }
        });
    }

    function getVideo(url2) {
        childProcess.execFile(binPath, ['./jkanimePhantom.js', url2], function (err, stdout, stderr) {
            if (err) console.log(err);
            var url = stdout.split('gotURL::')[1];
            if (url && url.substr(0, 4) == 'null') {
                console.log('URL IS NULL');
                getVideo(downloaders.shift());
                return false;
            }
            //console.log('### MKDIRP ' + "./Anime/" + url2.split('net/')[1].split('/')[0] + '/');
            mkdirp("./Anime/" + url2.split('net/')[1].split('/')[0] + '/', function (err) {
                if (err) {
                    console.log('ERROR mkdir error');
                    console.log(err);
                }
            });
            var file = fs.createWriteStream("Anime/" + url2.split('net/')[1].split('/')[0] + '/' + url2.split('net/')[1].split('/')[1] + '.mp4');
            if (typeof url == 'undefined') {
                console.log(' *  *  * ' + 'ERROR DOWNLOADING ' + url2);
                return false;
            }

            var options = {
                url: url,
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2228.0 Safari/537.36'
                }
            };


            file.on('open', function () {
                var r = request.get(options, function (err, res, body) {
                    if (err) {
                        console.log('DOWNLOAD ERROR ' + err);
                    };

                    var bar = new ProgressBar(url2.split('net/')[1].split('/')[0] + ' - ' + url2.split('net/')[1].split('/')[1] + ' [:bar] :percent :etas', {
                        complete: '=',
                        incomplete: ' ',
                        width: 50,
                        total: 100
                    });
                    //http://jkanime.net/durararax2-ketsu/

                    progress(request.get(res.request.uri.href))
                        .on('progress', function (state) {
                            bar.update(state.percentage);
                        })
                        .on('error', function (err) {
                            throw err
                        })
                        .on('end', function () {
                            bar.update(1);
                            fs.appendFile('animes.txt', url2.split('net/')[1].split('/')[0] + '/' + url2.split('net/')[1].split('/')[1] + '.mp4\r\n', function (err) {
                                if (err) { console.log(err) } else {
                                    //console.log('DONE-'+url2.split('net/')[1].split('/')[0] + '/' + url2.split('net/')[1].split('/')[1] + '.mp4');
                                }
                            });
                            console.log(downloaders);
                            if (downloaders.length > 0) {
                                getVideo(downloaders.shift());
                            }
                        })
                        .pipe(file);

                });
            });
        })
    }
});
