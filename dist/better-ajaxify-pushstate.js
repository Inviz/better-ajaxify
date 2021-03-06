/**
 * @file better-ajaxify-pushstate.js
 * @version 1.3.1 2013-10-09T16:29:40
 * @overview SEO-friendly ajax website engine for better-dom
 * @copyright Maksim Chemerisuk 2013
 * @license MIT
 * @see https://github.com/chemerisuk/better-ajaxify
 */
(function(DOM, location, history) {
    "use strict";

    DOM.find("html").on("ajaxify:fetch a", function(target, cancel) {
        if (!cancel) {
            var url = target.get("href");

            if (url) {
                url = url.split("#")[0];

                // handle anchors
                if (url !== location.href.split("#")[0]) {
                    return true;
                } else {
                    location.hash = target.get("hash");
                }
            }

            return false;
        }
    });

    DOM.on("ajaxify:load", ["detail"], function(response) {
        if (typeof response === "object") {
            // update browser url
            if (response.url !== location.pathname) {
                history.pushState(true, response.title, response.url);
            } else if (history.replaceState) {
                history.replaceState(true, response.title);
            }
        }
    });

    if (history.pushState) {
        window.onpopstate = function(e) {
            var url = location.href.split("#")[0];

            // skip initial popstate
            if (!e.state) return;

            DOM.fire("ajaxify:history", url);
        };
        // update initial state
        history.replaceState(true, DOM.getTitle());
    } else {
        // when url should be changed don't start request in old browsers
        DOM.on("ajaxify:loadstart", function(sender, defaultPrevented) {
            if (!defaultPrevented && sender.get("method") !== "post") {
                // load a new page in legacy browsers
                if (sender.matches("form")) {
                    sender.fire("submit");
                } else {
                    location.href = sender.get("href");
                }
            }
        });
    }
}(window.DOM, location, history));
