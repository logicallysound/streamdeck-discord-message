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
    $SD.on('net.logicallysound.discordmessage.action.willAppear', (jsonObj) => action.onWillAppear(jsonObj));
    $SD.on('net.logicallysound.discordmessage.action.keyUp', (jsonObj) => action.onKeyUp(jsonObj));
    $SD.on('net.logicallysound.discordmessage.action.sendToPlugin', (jsonObj) => action.onSendToPlugin(jsonObj));
    $SD.on('net.logicallysound.discordmessage.action.didReceiveSettings', (jsonObj) => action.onDidReceiveSettings(jsonObj));
    $SD.on('net.logicallysound.discordmessage.action.propertyInspectorDidAppear', (jsonObj) => {
        console.log('%c%s', 'color: white; background: black; font-size: 13px;', '[app.js]propertyInspectorDidAppear:');
    });
    $SD.on('net.logicallysound.discordmessage.action.propertyInspectorDidDisappear', (jsonObj) => {
        console.log('%c%s', 'color: white; background: red; font-size: 13px;', '[app.js]propertyInspectorDidDisappear:');
    });
};

/** ACTIONS */

const action = {
    settings:{},
    onDidReceiveSettings: function(jsn) {
        console.log('%c%s', 'color: white; background: red; font-size: 15px;', '[app.js]onDidReceiveSettings:');

        this.settings = Utils.getProp(jsn, 'payload.settings', {});
        this.doSomeThing(this.settings, 'onDidReceiveSettings', 'orange');
    },

    /**
     * The 'willAppear' event is the first event a key will receive, right before it gets
     * showed on your Stream Deck and/or in Stream Deck software.
     * This event is a good place to setup your plugin and look at current settings (if any),
     * which are embedded in the events payload.
     */

    onWillAppear: function (jsn) {
        console.log("You can cache your settings in 'onWillAppear'", jsn.payload.settings);
        /**
         * "The willAppear event carries your saved settings (if any). You can use these settings
         * to setup your plugin or save the settings for later use.
         * If you want to request settings at a later time, you can do so using the
         * 'getSettings' event, which will tell Stream Deck to send your data
         * (in the 'didReceiceSettings above)
         *
         * $SD.api.getSettings(jsn.context);
        */
        this.settings = jsn.payload.settings;
    },

    onKeyUp: function (jsn) {
        this.doSomeThing(jsn, 'onKeyUp', 'green');

        console.log('Posting to Discord Webhook URL: %s', this.settings.discordwebhook);
        console.log('Message: %s', this.settings.mymessage);
    },

    onSendToPlugin: function (jsn) {
        /**
         * this is a message sent directly from the Property Inspector
         * (e.g. some value, which is not saved to settings)
         * You can send this event from Property Inspector (see there for an example)
         */

        const sdpi_collection = Utils.getProp(jsn, 'payload.sdpi_collection', {});
        if (sdpi_collection.value && sdpi_collection.value !== undefined) {
            this.doSomeThing({ [sdpi_collection.key] : sdpi_collection.value }, 'onSendToPlugin', 'fuchsia');
        }
    },

    /**
     * This snippet shows, how you could save settings persistantly to Stream Deck software
     * It is not used in this example plugin.
     */

    saveSettings: function (jsn, sdpi_collection) {
        console.log('saveSettings:', jsn);
        if (sdpi_collection.hasOwnProperty('key') && sdpi_collection.key != '') {
            if (sdpi_collection.value && sdpi_collection.value !== undefined) {
                this.settings[sdpi_collection.key] = sdpi_collection.value;
                console.log('setSettings....', this.settings);
                $SD.api.setSettings(jsn.context, this.settings);
            }
        }
    },

    /**
     * Finally here's a methood which gets called from various events above.
     * This is just an idea how you can act on receiving some interesting message
     * from Stream Deck.
     */

    doSomeThing: function(inJsonData, caller, tagColor) {
        console.log('%c%s', `color: white; background: ${tagColor || 'grey'}; font-size: 15px;`, `[app.js]doSomeThing from: ${caller}`);
        // console.log(inJsonData);
    },


};
