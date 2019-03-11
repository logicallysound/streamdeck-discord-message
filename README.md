# Discord Message Stream Deck Plugin

A Stream Deck Plugin that allows you to configure keys that send messages to
Discord text channels.

## Requirements

* Stream Deck 4.1 or later
* macOS 10.11+, Windows 10

## How to Install

The packaged `.streamDeckPlugin` file is included in the `Release` directory.

Open that file and the Stream Deck app will prompt you to install the plugin.
When the plugin is installed, it will add the "Discord Message" action to the
"Custom" section at the bottom of the Action List in the Stream Deck App.

## How to use

This plugin sends messages to Discord by posting to a Webhook. See
[Intro to Webhooks](https://support.discordapp.com/hc/en-us/articles/228383668-Intro-to-Webhooks)
to learn how to add a Webhook to your server.

Copy the Webhook URL and paste it into the "Webhook" text field when you're
configuring your Stream Deck key. When you press the key, the message will be
sent to the channel that you configured in your Webhook on Discord. The username
and avatar for the message will be the name and icon you configured for that
Webhook.

You can use the same Webhook for as many keys as you would like and all of those
keys will send their configured message to the same text channel. If you would
like to send a message to a different channel, you will need to configure
another Webhook for that channel.
