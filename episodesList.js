
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
    },

	/**
	 * "Solve" Cloudflare's challenge using PhantomJS's engine.
	 * @return {String} JSON containing our cookies.
	 */
    solve: function () {
        var self = this;
        this.page.settings.userAgent = this.userAgent;
        this.page.open(this.url, function (status) {
            setTimeout(function () {
                //console.log('PJS->  :: Challenge status ');
                //console.log(status);
                if (status == 'fail') {
                    phantom.exit();
                }
                begin();
            }, self.timeout);
        });
    }

}

/**
 * In order to carry on making requests, both user agent and IP address must what is returned here.
 */
//console.log('PJS->  :: Initiating challenge');
cloudflareChallenge.init();
cloudflareChallenge.solve();




function begin() {
    var page = cloudflareChallenge.page;


    /*page.onConsoleMessage = function (msg, lineNum, sourceId) {
        console.log('CONSOLE: ' + msg + ' (from line #' + lineNum + ' in "' + sourceId + '")');
    };*/


    //console.log('PJS->  :: Begin function');
    var system = require('system');
    var args = system.args;




    //console.log('PJS->  Url: ' + args[1]);


    page.open(args[1], function (status) {
        if (status == 'fail') {
            phantom.exit();
        }
        //console.log('PJS->  status');
        //console.log(status);
        //console.log("PJS->  waiting..");
        setTimeout(function () {
            //console.log('PJS->  Waiting the page load..');
            setTimeout(function () {
                var numPages = page.evaluate(function () {
                    //console.log('PJS->  Inside the web');

                    window.episodes = '';
                    var pages = document.querySelector('.listbox .listnavi').childNodes;

                    function getLinks(pageNum) {
                        var nuu = pageNum;
                        document.querySelector('.listbox .listnavi').childNodes[pageNum * 2 + 1].click();
                        setTimeout(function () {
                            for (var z = 0; z < document.getElementById('content-episodes').childNodes.length; z++) {
                                window.episodes += '**' + document.getElementById('content-episodes').childNodes[z].childNodes[0].href;
                            }
                            if (pageNum >= 1) {
                                getLinks(nuu - 1);
                            }
                        }, 2000);
                    }
                    
                    getLinks(Math.floor(pages.length/2)-1);

                    return Math.floor(pages.length/2);
                });

                setTimeout(function () {
                    var downloadUrl = page.evaluate(function () {
                        return window.episodes;
                    });
                    console.log(downloadUrl);
                    phantom.exit();
                }, 3000 * numPages);
            }, 5000);
        }, 2000);
    });
}












