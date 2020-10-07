/* global $CC, Utils, $SD */

/**
 * Here are a couple of wrappers we created to help ypu quickly setup
 * your plugin and subscribe to events sent by Stream Deck to your plugin.
 */

 /**
  * The 'connected' event is sent to your plugin, after the plugin's instance
  * is registered with Stream Deck software. It carries the current websocket
  * and other information about the current environmet in a JSON object
  * You can use it to subscribe to events you want to use in your plugin.
  */

$SD.on('connected', (jsonObj) => connected(jsonObj));

function connected(jsn) {
    /** subscribe to the willAppear and other events */
    $SD.on('net.logicallysound.discordmessage.action.willAppear', jsonObj => action.onWillAppear(jsonObj));
    $SD.on('net.logicallysound.discordmessage.action.keyUp', jsonObj => action.onKeyUp(jsonObj));
    $SD.on('net.logicallysound.discordmessage.action.didReceiveSettings', jsonObj => action.onDidReceiveSettings(jsonObj));
    $SD.on('net.logicallysound.discordmessage.action.propertyInspectorDidAppear', jsonObj => {
        console.log('[app.js] Event received: propertyInspectorDidAppear');
    });
    $SD.on('net.logicallysound.discordmessage.action.propertyInspectorDidDisappear', jsonObj => {
        console.log('[app.js] Event received: propertyInspectorDidDisappear');
    });
};


/** ACTIONS */

const action = {
    settings:{},
    onDidReceiveSettings: function(jsn) {
        console.log('[app.js] Event received: didReceiveSettings');

        this.settings[jsn.context] = Utils.getProp(jsn, 'payload.settings');
    },

    /**
     * The 'willAppear' event is the first event a key will receive, right before it gets
     * showed on your Stream Deck and/or in Stream Deck software.
     * This event is a good place to setup your plugin and look at current settings (if any),
     * which are embedded in the events payload.
     */

    onWillAppear: function (jsn) {
        console.log('[app.js] Event received: willAppear');
		    /**
         * "The willAppear event carries your saved settings (if any). You can use these settings
         * to setup your plugin or save the settings for later use.
         * If you want to request settings at a later time, you can do so using the
         * 'getSettings' event, which will tell Stream Deck to send your data
         * (in the 'didReceiceSettings above)
         *
         * $SD.api.getSettings(jsn.context);
        */
        if (!this.settings) this.settings={};
        $SD.api.getSettings(jsn.context);
    },

    onKeyUp: function (jsn) {
        console.log('[app.js] Event received: keyUp');

        if (!this.settings || !this.settings[jsn.context].discordwebhook) {
          console.log('[app.js] No Discord webhook to post to!');
          console.log('[app.js] Sending event: showAlert');
          $SD.api.showAlert(jsn.context);
          return;
        }

        // Set up payload using the key's settings
        var payload = {
          "content": this.settings[jsn.context].mymessage
        };

        console.log('[app.js] Posting to Discord Webhook URL: %s', this.settings[jsn.context].discordwebhook);
        console.log('[app.js] Webhook payload: ', payload);

        // Set up request headers to send the data to the webhook properly
        $.ajaxSetup({
          contentType: "application/json; charset=utf-8",
          dataType: "json",
          success: function(data) {
            console.log('[app.js] Sending event: showOk');
            $SD.api.showOk(jsn.context);
          },
          failure: function(data) {
            console.log('[app.js] Sending event: showAlert');
            $SD.api.showAlert(jsn.context);
          },
          error: function(data) {
            console.log('[app.js] Sending event: showAlert');
            $SD.api.showAlert(jsn.context);
          },
        });

        // Post to the Webhook
        $.post(this.settings[jsn.context].discordwebhook, JSON.stringify(payload));
    },

};
