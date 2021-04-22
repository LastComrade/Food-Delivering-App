import axios from "axios";
import Noty from "noty";
import { initAdmin } from "./admin";
import moment from "moment";

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


// Render order status
const statuses = document.querySelectorAll(".status_line");
const hiddenInput = document.querySelector("#hiddenInput");
let order = hiddenInput ? hiddenInput.value : null;
order = JSON.parse(order);
let time = document.createElement("small");

function updateStatus(order) {
    statuses.forEach((status) => {
        status.classList.remove("step-completed");
        status.classList.remove("current");
    });
    let stepCompleted = true;
    statuses.forEach((status) => {
        let dataProp = status.dataset.status;
        if (stepCompleted) {
            status.classList.add("step-completed");
        }
        if (dataProp === order.status) {
            stepCompleted = false;
            time.innerText = moment(order.updatedAt).format("hh:mm A");
            status.appendChild(time);
            if (status.nextElementSibling) {
                status.nextElementSibling.classList.add("current");
            }
        }
    });
}

updateStatus(order);

// Socket
let socket = io();
initAdmin(socket);

// Join
if (order) {
    socket.emit("join", `order_${order._id}`);
}

let adminAreaPath = window.location.pathname;
// console.log(adminAreaPath);
if (adminAreaPath.includes('admin')) {
    socket.emit('join', 'adminRoom');
}

socket.on("orderUpdated", (data) => {
    const updatedOrder = { ...order };
    updatedOrder.updatedAt = moment().format();
    updatedOrder.status = data.status;
    updateStatus(updatedOrder);
    new Noty({
        type: "success",
        timeout: 1000,
        text: "Order Updated",
        layout: "topLeft",
    }).show();
});
