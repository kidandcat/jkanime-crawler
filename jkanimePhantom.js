/* global phantom */
/**
 * This is a project designed to get around sites using Cloudflare's "I'm under attack" mode.
 * Using the PhantomJS headless browser, it queries a site given to it as the second parameter,
 *  waits six seconds and returns the cookies required to continue using this site.  With this, 
 *  it is possible to automate scrapers or spiders that would otherwise be thwarted by Cloudflare's 
 *  anti-bot protection.
 * 
 * To run this: phantomjs cloudflare-challenge.js http://www.example.org/
 *
 * Copyright © 2015 by Alex Wilson <antoligy@antoligy.com>
 * 
 * Permission to use, copy, modify, and/or distribute this software for
 * any purpose with or without fee is hereby granted, provided that the
 * above copyright notice and this permission notice appear in all
 * copies.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS" AND ISC DISCLAIMS ALL WARRANTIES WITH
 * REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL ISC BE LIABLE FOR ANY
 * SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
 * WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
 * ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT
 * OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
 */


/**
 * Namespaced object.
 * @type {Object}
 */


/**
 * Simple wrapper to retrieve Cloudflare's 'solved' cookie.
 * @type {Object}
 */
var cloudflareChallenge = {

    webpage: false,
    system: false,
    page: false,
    url: false,
    userAgent: false,

	/**
	 * Initiate object.
	 */
    init: function () {
        this.webpage = require('webpage');
        this.system = require('system');
        this.page = this.webpage.create();
        this.url = this.system.args[1];
        this.userAgent = 'Mozilla/5.0 (Windows NT 6.3; rv:36.0) Gecko/20100101 Firefox/36.0';
        this.timeout = 6000;
        
        //·································································································································
        //·································································································································
/*


        this.page.onResourceRequested = function (request) {
            system.stderr.writeLine('= onResourceRequested()');
            system.stderr.writeLine('  request: ' + JSON.stringify(request, undefined, 4));
        };

        this.page.onResourceReceived = function (response) {
            system.stderr.writeLine('= onResourceReceived()');
            system.stderr.writeLine('  id: ' + response.id + ', stage: "' + response.stage + '", response: ' + JSON.stringify(response));
        };

        this.page.onLoadStarted = function () {
            system.stderr.writeLine('= onLoadStarted()');
            var currentUrl = page.evaluate(function () {
                return window.location.href;
            });
            system.stderr.writeLine('  leaving url: ' + currentUrl);
        };

        this.page.onLoadFinished = function (status) {
            system.stderr.writeLine('= onLoadFinished()');
            system.stderr.writeLine('  status: ' + status);
        };

        this.page.onNavigationRequested = function (url, type, willNavigate, main) {
            system.stderr.writeLine('= onNavigationRequested');
            system.stderr.writeLine('  destination_url: ' + url);
            system.stderr.writeLine('  type (cause): ' + type);
            system.stderr.writeLine('  will navigate: ' + willNavigate);
            system.stderr.writeLine('  from page\'s main frame: ' + main);
        };

        this.page.onResourceError = function (resourceError) {
            system.stderr.writeLine('= onResourceError()');
            system.stderr.writeLine('  - unable to load url: "' + resourceError.url + '"');
            system.stderr.writeLine('  - error code: ' + resourceError.errorCode + ', description: ' + resourceError.errorString);
        };

        this.page.onError = function (msg, trace) {
            system.stderr.writeLine('= onError()');
            var msgStack = ['  ERROR: ' + msg];
            if (trace) {
                msgStack.push('  TRACE:');
                trace.forEach(function (t) {
                    msgStack.push('    -> ' + t.file + ': ' + t.line + (t.function ? ' (in function "' + t.function + '")' : ''));
                });
            }
            system.stderr.writeLine(msgStack.join('\n'));
        };



*/
        //·································································································································
        //·································································································································
    },

	/**
	 * "Solve" Cloudflare's challenge using PhantomJS's engine.
	 * @return {String} JSON containing our cookies.
	 */
    solve: function () {
        var self = this;
        this.page.settings.userAgent = this.userAgent;
        //console.log('PHANTOMJS->  :: Opening page: ' + this.system.args[1]);
        this.page.open(this.url, function (status) {
            //console.log('PHANTOMJS->  :: Page opened');
            setTimeout(function () {
                //console.log('PHANTOMJS->  :: Challenge status ');
                //console.log(status);
                if (status == 'fail') {
                    self.timeout += 500;
                    cloudflareChallenge.solve();
                } else {
                    begin();
                }
            }, self.timeout);
        });
    }

}

/**
 * In order to carry on making requests, both user agent and IP address must what is returned here.
 */
var system = require('system');
var args = system.args;
//console.log('PHANTOMJS->  ########   ' + args[1] + '   ########');
//console.log('PHANTOMJS->  :: Initiating challenge');
cloudflareChallenge.init();
//console.log('PHANTOMJS->  :: Init challenge');
cloudflareChallenge.solve();




function begin() {
    var page = cloudflareChallenge.page;
    



    //·································································································································
    //·································································································································
/*
    //page.settings.resourceTimeout = 5000;
    
    page.onResourceRequested = function (request) {
        system.stderr.writeLine('= onResourceRequested()');
        system.stderr.writeLine('  request: ' + JSON.stringify(request, undefined, 4));
    };

    page.onResourceReceived = function (response) {
        system.stderr.writeLine('= onResourceReceived()');
        system.stderr.writeLine('  id: ' + response.id + ', stage: "' + response.stage + '", response: ' + JSON.stringify(response));
    };

    page.onLoadStarted = function () {
        system.stderr.writeLine('= onLoadStarted()');
        var currentUrl = page.evaluate(function () {
            return window.location.href;
        });
        system.stderr.writeLine('  leaving url: ' + currentUrl);
    };

    page.onLoadFinished = function (status) {
        system.stderr.writeLine('= onLoadFinished()');
        system.stderr.writeLine('  status: ' + status);
    };

    page.onNavigationRequested = function (url, type, willNavigate, main) {
        system.stderr.writeLine('= onNavigationRequested');
        system.stderr.writeLine('  destination_url: ' + url);
        system.stderr.writeLine('  type (cause): ' + type);
        system.stderr.writeLine('  will navigate: ' + willNavigate);
        system.stderr.writeLine('  from page\'s main frame: ' + main);
    };

    page.onResourceError = function (resourceError) {
        system.stderr.writeLine('= onResourceError()');
        system.stderr.writeLine('  - unable to load url: "' + resourceError.url + '"');
        system.stderr.writeLine('  - error code: ' + resourceError.errorCode + ', description: ' + resourceError.errorString);
    };

    page.onError = function (msg, trace) {
        system.stderr.writeLine('= onError()');
        var msgStack = ['  ERROR: ' + msg];
        if (trace) {
            msgStack.push('  TRACE:');
            trace.forEach(function (t) {
                msgStack.push('    -> ' + t.file + ': ' + t.line + (t.function ? ' (in function "' + t.function + '")' : ''));
            });
        }
        system.stderr.writeLine(msgStack.join('\n'));
    };



*/
    //·································································································································
    //·································································································································
    
    
    //console.log('PHANTOMJS->  :: Begin function');
    var system = require('system');
    var args = system.args;

    page.onConsoleMessage = function (msg) {
        //console.log(msg);
    };


    //console.log('PHANTOMJS->  Url: ' + args[1]);


    page.open(args[1], function (status) {
        if (status == 'fail') {
            phantom.exit();
        }
        //console.log('PHANTOMJS->  status');
        //console.log(status);
        //console.log('PHANTOMJS->  Waiting the page load..');
        setTimeout(function () {
            var downloadUrl = page.evaluate(function () {
                //console.log('PHANTOMJS->  Inside the web');
                //console.log('PHANTOMJS->  Looking for iframe.player_conte');
                //console.log(window.document.getElementsByClassName('player_conte')[0]);
                return document.getElementsByClassName('player_conte')[0].src;
            });
            //console.log('PHANTOMJS->  Episode Url is: ' + downloadUrl);
            asd(downloadUrl);
        }, 10000);
    });
}


function asd(url) {
    var page = cloudflareChallenge.page;
    page.open(url, function (status) {
        var videoUrl;
        //console.log(console.log('PHANTOMJS->  Waiting the video for loading..'));
        setTimeout(function () {
            videoUrl = page.evaluate(function () {
                var url = window.document.getElementsByClassName('player_conte')[0].childNodes[9].value.split('&file=')[1];
                return url;
            });
            console.log('PHANTOMJS->  gotURL::' + videoUrl);
            phantom.exit();
        }, 7000);
    });
}


