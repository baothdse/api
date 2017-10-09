var botbuilder = require('botbuilder');
var lib = new botbuilder.Library('show-more');
var config = require('../bot-config');

var listProduct = [
    {
        "id" : "4",
        'name': 'Cupcakes',
        'description': 'Bánh bông lan kem siêu hạng',
        'link': 'https://i.pinimg.com/736x/db/a2/72/dba272aae31b84d0d0091a3d2960b181--liquor-cupcakes-rum-cupcakes.jpg',
    },
    {
        "id" : "5",
        'name': 'Bánh bông lan kem Caramel',
        'description': 'Caramel, Chocolate, Muối',
        'link': 'https://716f24d81edeb11608aa-99aa5ccfecf745e7cf976b37d172ce54.ssl.cf1.rackcdn.com/samantha-bees-salty-caramel-bake-1265288l2.jpg',
    }
]

lib.dialog('showMoreProduct', [
    function (session, args, next) {
        var message = new botbuilder.Message(session);
        console.log(args);
        message.attachmentLayout(botbuilder.AttachmentLayout.carousel);
        if (args == 'Có' || args == 'Xem thêm') {
            //     if (confirmEntity.resolution.values == 'Yes') {
            message.attachments([
                config.createHeroCard(session, listProduct[0].name, listProduct[0].description,
                    listProduct[0].link, 'Đặt ' + listProduct[0].name, 'Đặt hàng'),
                config.createHeroCard(session, listProduct[1].name, listProduct[1].description,
                    listProduct[1].link, 'Đặt ' + listProduct[1].name,'Đặt hàng')
            ]);
        } else {
            message = 'Cảm ơn bạn đã đến với cửa hàng của chúng tôi';
        }
        session.send(message);
    }
])

module.exports.createLibrary = function () {
    return lib.clone();
}