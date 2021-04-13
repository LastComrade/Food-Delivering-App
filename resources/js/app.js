import axios from "axios";
import Noty from "noty";
import { initAdmin } from "./admin";

const addToCart = document.querySelectorAll(".add-to-cart");
const cartCounter = document.querySelector("#cart-counter");

const updateCart = (pizza) => {
    axios
        .post("/update-cart", pizza)
        .then((res) => {
            cartCounter.innerText = res.data.totalQty;
            new Noty({
                type: "success",
                timeout: 1000,
                text: "Item added to cart",
                layout: "topLeft",
            }).show();
        })
        .catch((e) => {
            new Noty({
                type: "error",
                timeout: 1000,
                text: "Someting went wrong",
                layout: "topLeft",
            }).show();
        });
};

addToCart.forEach((btn) => {
    btn.addEventListener("click", (e) => {
        // console.log(e);
        const pizza = JSON.parse(btn.dataset.pizza);
        updateCart(pizza);
        // console.log(pizza);
    });
});

// Remove alert message after X seconds
const alertMessage = document.querySelector("#success-alert");
if (alertMessage) {
    setTimeout(() => {
        alertMessage.remove();
    }, 2000);
}

initAdmin();
