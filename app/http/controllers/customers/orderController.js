const Order = require("../../../models/order");

function orderController() {
    return {
        store(req, res) {
            // Validate Request
            const { phone, address } = req.body;
            if (!phone || !address) {
                req.flash("error", "All fields are required");
                return res.redirect("/cart");
            }

            const order = new Order({
                customerId: req.user._id,
                items: req.session.cart.items,
                phone,
                address,
            });
            
            order.save()
            .then((response) => {
                req.flash('success', 'Order placed successfully')
                return res.redirect('/')
            })
            .catch((err) => {
                req.flash('error', 'Something went wrong')
                return res.redirect('/cart');
            })
        },
    };
}

module.exports = orderController;
