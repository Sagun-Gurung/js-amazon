export let cart = JSON.parse(localStorage.getItem("cart"));
// console.log("cart, ", cart);
if (!cart) {
  cart = [
    {
      productId: "e43638ce-6aa0-4b85-b27f-e1d07eb678c6",
      quantity: 2,
      deliveryOptionId: "1",
    },
    {
      productId: "15b6fc6f-327a-4ec4-896f-486349e85a3d",
      quantity: 1,
      deliveryOptionId: "2",
    },
  ];
}

function saveToStorage() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

/* *************************add to cart functions********************* */

export function addToCart(productId) {
  /* checking if the item is already on the cart */
  let matchingItem;

  cart.forEach((cartItem) => {
    //   console.log("Item", item);
    if (productId === cartItem.productId) {
      matchingItem = cartItem;
    }
  });

  if (matchingItem) {
    matchingItem.quantity += 1;
  } else {
    cart.push({ productId, quantity: 1, deliveryOptionId: "1" });
  }
  // console.log(cart);
  saveToStorage();
}

// algorithm to add stuff in the cart
/* 
    first check if the product is already in the cart
    if it is in the cart, we'll just increase the quantity
    if it's not in the cart, add it to the cart
*/

/* function to remove from cart*/

export function removeFromCart(productId) {
  let newCart = [];

  cart.forEach((cartItem) => {
    if (cartItem.productId !== productId) {
      newCart.push(cartItem);
    }
  });
  cart = newCart;
  // console.log("cart", cart);
  saveToStorage();
}

/* update delivery date */
// we need product id from cartid and delivery option id for date
export function updateDeliveryOption(productId, deliveryOptionId) {
  let matchingItem;

  cart.forEach((cartItem) => {
    if (productId === cartItem.productId) {
      matchingItem = cartItem;
    }
  });
  matchingItem.deliveryOptionId = deliveryOptionId;
  saveToStorage();
}
