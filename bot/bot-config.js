var botbuilder = require('botbuilder');
var siteUrl = require('./site-url.js');

//create connector
var connector = new botbuilder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});

//Initial Bot

var currentPlace = "Uni space";
var bot = new botbuilder.UniversalBot(connector, [
    function (session, args, next) {
        if (session.message && session.message.value) {
            if(session.message.value.type === 'menu') {
                session.beginDialog('show-menu:showMenu', session)
            } else if (session.message.value.type === 'searchProduct') {
                session.beginDialog('search:searchProduct')
            }

        } else {
            var message = new botbuilder.Message(session);
            session.send('Uni Coorporation xin chào! Chúng tôi có thể giúp gì cho bạn');
            var welcomeCard = require('./card/welcome.json');
            message.addAttachment(welcomeCard);
            session.send(message);
        }
    }

]);

//luis
var luisAppUrl = process.env.LUIS_APP_URL || 'https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/f27af6e6-01da-4685-ac7a-1e5e7cd744d8?subscription-key=747a9082c49148218afb177584a54ec4&timezoneOffset=0&verbose=true&q=';

bot.recognizer(new botbuilder.LuisRecognizer(luisAppUrl));

// Connector listener wrapper to capture site url
var connectorListener = connector.listen();

function listen() {
    return function (req, res) {
        // Capture the url for the hosted application
        // We'll later needs this url to create the checkout link 
        var url = req.protocol + '://' + req.get('host');
        siteUrl.save(url);
        connectorListener(req, res);
    };
};


// Send welcome when conversation with bot is started, by initiating the root dialog
bot.on('conversationUpdate', function (message) {
    if (message.membersAdded) {
        message.membersAdded.forEach(function (identity) {
            if (identity.id === message.address.bot.id) {
                bot.beginDialog(message.address, '/');
            }
        });
    }
});

// Dialogs
bot.library(require('./dialogs/products').createLibrary());
bot.library(require('./dialogs/show-more').createLibrary());
bot.library(require('./dialogs/order').createLibrary());
bot.library(require('./dialogs/show-menu').createLibrary());
bot.library(require('./dialogs/search').createLibrary());

// Other wrapper functions
function beginDialog(address, dialogId, dialogArgs) {
    bot.beginDialog(address, dialogId, dialogArgs);
};

function sendMessage(message) {
    bot.send(message);
};


//Card
module.exports.createHeroCard = function (session, title, subtitle, imageLink, buttonTitle, message) {
    return new botbuilder.HeroCard(session)
        .title(title)
        .subtitle(subtitle)
        .images([
            botbuilder.CardImage.create(session, imageLink)
        ])
        .buttons([
            botbuilder.CardAction.imBack(session, buttonTitle, message)
        ])
}

module.exports.createTwoOptionCard = function (session, option1, message1, option2, message2) {
    return new botbuilder.HeroCard(session)
        .buttons([
            botbuilder.CardAction.imBack(session, option1, message1),
            botbuilder.CardAction.imBack(session, option2, message2)
        ])
}
function createHeroCard(session, title, subtitle, imageLink, buttonTitle, message) {
    return new botbuilder.HeroCard(session)
        .title(title)
        .subtitle(subtitle)
        .images([
            botbuilder.CardImage.create(session, imageLink)
        ])
        .buttons([
            botbuilder.CardAction.imBack(session, buttonTitle, message)
        ])
}

function createTwoOptionCard(session) {
    return new botbuilder.HeroCard(session)
        .buttons([
            botbuilder.CardAction.imBack(session, "Có", "Có"),
            botbuilder.CardAction.imBack(session, "Không", "Không")
        ])
}
module.exports = {
    listen: listen,
    beginDialog: beginDialog,
    sendMessage: sendMessage,
    createHeroCard: createHeroCard,
    createTwoOptionCard: createTwoOptionCard
};
