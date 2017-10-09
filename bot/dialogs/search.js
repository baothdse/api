var botbuilder = require('botbuilder');
var lib = new botbuilder.Library('search');
var config = require('../bot-config');

var listRestaurants = [
    {
        "id": "1",
        "restaurantName": "High Land Coffee",
        "address": "255 abc"
    },
    {
        "id": "2",
        "restaurantName": "Gong Cha",
        "address": "Phan Văn Trị"
    }

]

lib.dialog('searchProduct', [
    function (session) {
        var message = new botbuilder.Message(session);
        var searchCard = require('../card/search-type.json');
        message.addAttachment(searchCard);
        session.send(message);
        console.log(session.message.value)
        if (session.message.value.restaurantName) {
            for (var index = 0; index < listRestaurants.length; index++) {
                console.log(listRestaurants[index].restaurantName)
                if(session.message.value.restaurantName === listRestaurants[index].restaurantName) {
                    var restaurant = listRestaurants[index];
                    session.beginDialog('show-menu:showMenu', restaurant)
                    break;
                } else {
                    console.log('khong thay cm gi')
                }
                
            }
        } 
    }
])

module.exports.createLibrary = function () {
    return lib.clone();
}