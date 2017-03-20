function placeAnOrder(orderNaume) {
    console.log('Customer order:', orderNaume);

    cookAndDeliverFood(function(){
        console.log('Delivered food order', orderNaume);
    });
}

function cookAndDeliverFood(callback) {
    setTimeout(callback,5000);
}

placeAnOrder(1);
placeAnOrder(2);
placeAnOrder(3);
placeAnOrder(4);
placeAnOrder(5);
