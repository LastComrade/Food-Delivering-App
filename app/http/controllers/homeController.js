const Menu = require("../../models/menu");

const homeController = () => {
    return {
        async index(req, res) {
            
            const pizzas = await Menu.find()
            // console.log(pizzas);
            return res.render('home', { pizzas })
            // Menu.find().then((pizzas) => {
            //     console.log(pizzas);
            //     res.render("home", { pizzas });
            // });
        },
    };
};

module.exports = homeController;
