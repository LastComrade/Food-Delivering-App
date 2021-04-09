const cartController = () => {
    return {
        index(req, res) {
            
            res.render("customers/cart");
        },
        update(req, res) {
            
            // When cart is created for the first time (Basic stucuture is added is the cart session)
            if (!req.session.cart) {
                req.session.cart = {
                    items: {},
                    totalQty: 0,
                    totalPrice: 0,
                };
            }
            let cart = req.session.cart;
            console.log(req.body);

            // Check if item does not exist in cart
            if (!cart.items[req.body._id]) {
                cart.items[req.body._id] = {
                    item: req.body,
                    qty: 1
                }
                cart.totalQty++;
                cart.totalPrice = cart.totalPrice + req.body.price
            }
            else {
                cart.items[req.body._id].qty++;
                cart.totalQty++;
                cart.totalPrice = cart.totalPrice + req.body.price;
            }
            return res.json({ totalQty: req.session.cart.totalQty });
        },
    };
};

module.exports = cartController;
