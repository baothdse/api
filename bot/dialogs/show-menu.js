var botbuilder = require('botbuilder');
var lib = new botbuilder.Library('show-menu');
var config = require('../bot-config');

var listRestaurants = [
    {
        "id": "1",
        "restaurantName": "High Land Coffee",
        "address": "255 abc",
        "menu": [
            {
                "id": "1",
                "name": "Mocha",
                "description": "Coffee, Chocolate, Vani, Đá",
                "link": "https://i.pinimg.com/736x/94/d4/49/94d449968b99699f959e096bb2c812e0--homemade-chocolate-pudding-pudding-recipes.jpg",
            },
            {
                "id": "2",
                "name": "Banana Cake",
                "description": "Bánh chuối siêu hạng",
                "link": "https://i.pinimg.com/736x/9b/8d/6b/9b8d6b453ad25b71fcf44a01a87f92e0--banana-upside-down-cake-upside-down-cakes.jpg",
            },
            {
                "id": "3",
                "name": "Matcha Ice Blended",
                "description": "Matcha, Cream, Ice",
                "link": "http://coffeenowhere.com/order/wp-content/uploads/2016/07/matcha-latte.png",
            }
        ]
    },
    {
        "id": "2",
        "restaurantName": "Gong Cha",
        "address": "Phan Văn Trị",
        "menu": [
            {
                "id": "4",
                'name': 'Cupcakes',
                'description': 'Bánh bông lan kem siêu hạng',
                'link': 'https://i.pinimg.com/736x/db/a2/72/dba272aae31b84d0d0091a3d2960b181--liquor-cupcakes-rum-cupcakes.jpg',
            },
            {
                "id": "5",
                'name': 'Bánh bông lan kem Caramel',
                'description': 'Caramel, Chocolate, Muối',
                'link': 'https://716f24d81edeb11608aa-99aa5ccfecf745e7cf976b37d172ce54.ssl.cf1.rackcdn.com/samantha-bees-salty-caramel-bake-1265288l2.jpg',
            }
        ]
    }

]
lib.dialog('showMenu', [
    function (session, results, next) {
        console.log('showmenu')
        console.log(results)
        var message = new botbuilder.Message(session);
        message.attachmentLayout(botbuilder.AttachmentLayout.carousel);
        for (var index = 0; index < listRestaurants.length; index++) {
            if (results.id === listRestaurants[index].id) {
                var listProduct = listRestaurants[index].menu;
                session.userData.restaurant = listRestaurants[index]
                message.attachments([
                    config.createHeroCard(session, listProduct[0].name, listProduct[0].description,
                        listProduct[0].link, 'Đặt ' + listProduct[0].name, 'Đặt hàng'),
                    config.createHeroCard(session, listProduct[1].name, listProduct[1].description,
                        listProduct[1].link, 'Đặt ' + listProduct[1].name, 'Đặt hàng'),
                ]);
            }

        }
        botbuilder.Prompts.text(session, message);
    }, 
    function(session, results) {
        session.beginDialog('order:orderProduct', results.response);
    }
]);

module.exports.createLibrary = function () {
    return lib.clone();
}