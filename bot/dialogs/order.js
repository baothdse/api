var botbuilder = require('botbuilder');
var lib = new botbuilder.Library('order');
var config = require('../bot-config');

lib.dialog('orderProduct', [
    function (session, args, next) {
        var message = new botbuilder.Message(session);
        var intent = args;
        var productName;
        if (intent.hasOwnProperty('intent')) {
            var listEntities = intent.intent.entities;
            console.log(listEntities)
            for (var index = 0; index < listEntities.length; index++) {
                if (listEntities[index].type == "ProductName") {
                    console.log('kiem tra if')
                    console.log(productName = listEntities[index].entity)
                    productName = listEntities[index].entity;
                }

            }
            if (checkProduct(productName) == true) {
                var card = {
                    "contentType": "application/vnd.microsoft.card.adaptive",
                    "content": {
                        "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
                        "type": "AdaptiveCard",
                        "version": "1.0",
                        "body": [
                            {
                                "type": "Container",
                                "items": [
                                    {
                                        "type": "ColumnSet",
                                        "columns": [
                                            {
                                                "type": "Column",
                                                "size": "auto",
                                                "items": [
                                                    {
                                                        "type": "Image",
                                                        "url": "http://www.highlandscoffee.com.vn/assets/layout/highlands_logo-896dd9ca8324f36e7fa2c49363e78459.png",
                                                        "size": "medium",
                                                        "style": "person"
                                                    }
                                                ]
                                            },
                                            {
                                                "type": "Column",
                                                "size": "stretch",
                                                "items": [
                                                    {
                                                        "type": "TextBlock",
                                                        "text": session.userData.restaurant.restaurantName + " cảm ơn quý khách!",
                                                        "weight": "bolder",
                                                        "isSubtle": true
                                                    },
                                                    {
                                                        "type": "TextBlock",
                                                        "text": "Bạn muốn đặt sản phẩm " + productName + " phải không ạ",
                                                        "wrap": true
                                                    }
                                                ]
                                            }
                                        ]
                                    }
                                ]
                            }
                        ],
                        "actions": [
                            // Hotels Search form
                            {
                                "type": "Action.ShowCard",
                                "title": "Chính xác",
                                "card": {
                                    "type": "AdaptiveCard",
                                    "body": [
                                        {
                                            "type": "Unispace",
                                            "text": "Chào mừng đến với Highland Coffee!",
                                            "weight": "bolder",
                                            "size": "large"
                                        },
                                        {
                                            "type": "TextBlock",
                                            "text": "Vui lòng nhập số lượng của sản phẩm: "
                                        },
                                        {
                                            "type": "Input.Number",
                                            "id": "quantity",
                                            "style": "text"
                                        }
                                    ],
                                    "actions": [
                                        {
                                            "type": "Action.Submit",
                                            "title": "Đặt",
                                            "data": {
                                                "type": "productDetail"
                                            }
                                        }
                                    ]
                                }
                            },
                            {
                                "type": "Action.ShowCard",
                                "title": "Không",
                                "card": {
                                    "type": "AdaptiveCard",
                                    "body": [
                                        {
                                            "type": "TextBlock",
                                            "text": "Bạn có muốn xem sản phẩm khác không?",
                                            "weight": "bolder"
                                        }
                                    ]
                                }
                            }
                        ]
                    }
                }
                message.addAttachment(card);
                session.send(message);
                next({ productName: productName });
            } else {
                message = 'Món ăn này không nằm trong menu của chúng tôi. Vui lòng chọn món khác';
                session.endDialog(message);
            }
        };


    },
    function (session, results) {
        session.userData.productName = results.productName;
        session.beginDialog('confirmProduct', session.message.value);
    },
    function (session, results) {
        if (session.message.text === 'Xem thêm') {
            session.beginDialog('show-more:showMoreProduct');
        } else if (session.message.text === 'Thanh toán luôn') {
            session.beginDialog('confirmOrder');
        }
    },
    function (session, results) {
        session.endDialog('Cảm ơn quý khách đã sử dụng dịch vụ của chúng tôi hôm nay');
    }
]).triggerAction({
    matches: 'OrderProduct'
});

lib.dialog('confirmProduct', [
    function (session, args, next) {
        if (session.message && session.message.value) {
            processInput(session, session.message.value);
            console.log('hehee');
            console.log(session.userData.productName);
            var message = new botbuilder.Message(session);
            var optionCard = config.createTwoOptionCard(session, 'Xem thêm', 'Xem thêm', 'Thanh toán luôn', 'Thanh toán');
            message.addAttachment(optionCard);
            session.userData.productDetail = session.message.value;
            next(message);
        }
    },
    function (session, results) {
        botbuilder.Prompts.text(session, results);
    },
    function (session, results) {
        session.endDialog();
    }
]);

lib.dialog('confirmOrder', [
    function (session, args, next) {
        console.log(session.userData.productDetail);
        var message = new botbuilder.Message(session);
        var card = {
            'contentType': 'application/vnd.microsoft.card.adaptive',
            'content': {
                '$schema': "http://adaptivecards.io/schemas/adaptive-card.json",
                'type': 'AdaptiveCard',
                'version': '1.0',
                'body': [
                    {
                        'type': 'Container',
                        'items': [
                            {

                                'type': 'ColumnSet',
                                'columns': [
                                    {
                                        'type': 'Column',
                                        'size': 'auto',
                                        'items': [
                                            {
                                                'type': 'Image',
                                                'url': 'http://www.highlandscoffee.com.vn/assets/layout/highlands_logo-896dd9ca8324f36e7fa2c49363e78459.png',
                                                'size': 'medium',
                                                'style': 'person'
                                            }
                                        ]
                                    },
                                    {
                                        'type': 'Column',
                                        'width': 3,
                                        'wrap': 'true',
                                        'items': [
                                            {
                                                'type': 'TextBlock',
                                                'text': 'Highland Coffee',
                                                'weight': 'bolder',
                                                'isSubtle': true,
                                                'size': 'small',
                                                'horizontalAlignment': 'center'
                                            },
                                            {
                                                'type': 'TextBlock',
                                                'text': 'Đơn hàng',
                                                'horizontalAlignment': 'center',
                                                'size': 'medium',
                                                'weight': 'bolder'
                                            }
                                        ]
                                    }
                                ]

                            },
                            {
                                'type': 'ColumnSet',
                                'columns': [
                                    {
                                        'type': 'Column',
                                        'size': 2,
                                        'items': [
                                            {
                                                'type': 'TextBlock',
                                                'size': 'small',
                                                'horizontalAlignment': 'center',
                                                'isSubtle': true,
                                                'weight': 'bolder',
                                                'text': 'Sản phẩm'
                                            }
                                        ]
                                    },
                                    {
                                        'type': 'Column',
                                        'size': 2,
                                        'items': [
                                            {
                                                'type': 'TextBlock',
                                                'size': 'small',
                                                'horizontalAlignment': 'center',
                                                'isSubtle': true,
                                                'weight': 'bolder',
                                                'text': 'Số lượng'
                                            }
                                        ]
                                    },
                                    {
                                        'type': 'Column',
                                        'size': 2,
                                        'items': [
                                            {
                                                'type': 'TextBlock',
                                                'size': 'small',
                                                'horizontalAlignment': 'center',
                                                'isSubtle': true,
                                                'text': 'Đơn giá'
                                            }
                                        ]
                                    }
                                ]
                            },
                            {
                                'type': 'ColumnSet',
                                'columns': [
                                    {
                                        'type': 'Column',
                                        'size': 2,
                                        'items': [
                                            {
                                                'type': 'TextBlock',
                                                'size': 'small',
                                                'horizontalAlignment': 'center',
                                                'text': session.userData.productName
                                            }
                                        ]
                                    },
                                    {
                                        'type': 'Column',
                                        'size': 2,
                                        'items': [
                                            {
                                                'type': 'TextBlock',
                                                'size': 'small',
                                                'horizontalAlignment': 'center',
                                                'text': session.userData.productDetail.quantity
                                            }
                                        ]
                                    },
                                    {
                                        'type': 'Column',
                                        'size': 2,
                                        'items': [
                                            {
                                                'type': 'TextBlock',
                                                'size': 'small',
                                                'horizontalAlignment': 'center',
                                                'text': '20000'
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    }
                ],
                //Button
                'actions': [
                    {
                        'type': 'Action.Submit',
                        'title': 'Xác nhận',
                        'data': {
                            'type': 'orderConfirm'
                        }
                    }
                ]
            }
        };
        message.addAttachment(card);

        next(message);
    },
    function (session, results, next) {
        if (!(session.message && session.message.value)) {
            session.send(results);
        }
        next();
    },
    function (session) {
        if (session.message && session.message.value) {
            session.endDialog();
        }
    }
]);

function processInput(session, value) {
    var defaultErrorMessage = 'Bạn vui lòng điền đầy đủ thông tin giúp mình nhé';
    switch (value.type) {
        case 'productDetail':
            if (value.quantity === '') {
                session.send(defaultErrorMessage);
            } else {
                session.send('Bạn có muốn order thêm không hay thanh toán luôn');
            }
            break;
        default:
            session.send(defaultErrorMessage);
            break;
    }
};

function checkProduct(productName) {
    var listProduct = [
        {
            "name": "Mocha",
            "description": "Coffee, Chocolate, Vani, Đá",
            "link": "https://i.pinimg.com/736x/94/d4/49/94d449968b99699f959e096bb2c812e0--homemade-chocolate-pudding-pudding-recipes.jpg",
        },
        {
            "name": "Banana Cake",
            "description": "Bánh chuối siêu hạng",
            "link": "https://i.pinimg.com/736x/9b/8d/6b/9b8d6b453ad25b71fcf44a01a87f92e0--banana-upside-down-cake-upside-down-cakes.jpg",
        },
        {
            "name": "Matcha Ice Blended",
            "description": "Matcha, Cream, Ice",
            "link": "http://coffeenowhere.com/order/wp-content/uploads/2016/07/matcha-latte.png",
        },
        {
            'name': 'Cupcakes',
            'description': 'Bánh bông lan kem siêu hạng',
            'link': 'https://i.pinimg.com/736x/db/a2/72/dba272aae31b84d0d0091a3d2960b181--liquor-cupcakes-rum-cupcakes.jpg',
        },
        {
            'name': 'Bánh bông lan kem Caramel',
            'description': 'Caramel, Chocolate, Muối',
            'link': 'https://716f24d81edeb11608aa-99aa5ccfecf745e7cf976b37d172ce54.ssl.cf1.rackcdn.com/samantha-bees-salty-caramel-bake-1265288l2.jpg',
        }
    ];
    // listProduct.forEach(function (element) {
    //     console.log(element.name);
    //     console.log(productName);
    //     if (element.name.toLowerCase() === productName) {
    //         return true;
    //     } else {
    //         return false;
    //     }
    // })
    console.log('heheheheh  ')

    for (var index = 0; index < listProduct.length; index++) {
        console.log(listProduct[index].name.toLowerCase());
        console.log(productName);
        if (listProduct[index].name.toLowerCase() === productName) {
            console.log('true')
            return true;
        }
    }
    return false;
}


module.exports.createLibrary = function () {
    return lib.clone();
}
