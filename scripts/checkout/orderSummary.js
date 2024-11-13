import { cart, removeFromCart, updateDeliveryOption } from "../../data/cart.js";
import { products } from "../../data/products.js";
import { formatCurrency } from "../utils/money.js";
import dayjs from "https://unpkg.com/dayjs@1.11.10/esm/index.js";
import { deliveryOptions } from "../../data/deliveryOptions.js";

export function renderOrderSummary() {
  let cartSummaryHtml = "";

  cart.forEach((cartItem) => {
    const productId = cartItem.productId;

    let matchingProducts;

    products.forEach((product) => {
      if (product.id === productId) {
        matchingProducts = product;
      }
    });
    //   console.log("matchingProducts", matchingProducts);

    const deliveryOptionId = cartItem.deliveryOptionId;
    let deliveryOption;

    deliveryOptions.forEach((option) => {
      if (option.id === deliveryOptionId) {
        deliveryOption = option;
      }
    });
    const today = dayjs();
    const deliveryDate = today.add(deliveryOption.deliveryDays, "days");
    const dateString = deliveryDate.format("dddd, MMMM D");

    cartSummaryHtml += `
      <div class="cart-item-container
      js-cart-item-container-${matchingProducts.id}">
          <div class="delivery-date">
            Delivery date: ${dateString}
          </div>
              <div class="cart-item-details-grid">
                <img class="product-image"
                  src="${matchingProducts.image}">

              <div class="cart-item-details">
                  <div class="product-name">
                    ${matchingProducts.name}
                  </div>
                  <div class="product-price">
                    $${formatCurrency(matchingProducts.priceCents)}
                  </div>
                  <div class="product-quantity">
                      <span>
                          Quantity: <span class="quantity-label">
                          ${cartItem.quantity}
                      </span>
                    </span>
                    <span class="update-quantity-link link-primary">
                      Update
                    </span>
                    <span class="delete-quantity-link link-primary js-delete-link"
                    data-product-id = ${matchingProducts.id} >
                      Delete
                    </span>
                  </div>
              </div>

              <div class="delivery-options">
                  <div class="delivery-options-title">
                    Choose a delivery option:
                  </div>
                  ${deliveryOptionsHtml(matchingProducts, cartItem)}
              </div>
          </div>
      </div>
      `;
  });
  document.querySelector(".js-order-summary").innerHTML = cartSummaryHtml;

  /* delivery options */
  function deliveryOptionsHtml(matchingProducts, cartItem) {
    let html = "";
    deliveryOptions.forEach((deliveryOption) => {
      const today = dayjs();
      const deliveryDate = today.add(deliveryOption.deliveryDays, "days");
      const dateString = deliveryDate.format("dddd, MMMM D");
      // console.log("deliveryDate", dateString);

      const priceString =
        deliveryOption.priceCents === 0
          ? "FREE"
          : `$${formatCurrency(deliveryOption.priceCents)} -`;

      const isChecked = deliveryOption.id === cartItem.deliveryOptionId;

      html += `
        <div class="delivery-option js-delivery-option"
        data-product-id = "${matchingProducts.id}"
        data-delivery-option-id = "${deliveryOption.id}"
        >
          <input type="radio"
            ${isChecked ? "checked" : ""}
              class="delivery-option-input"
              name="delivery-option-${matchingProducts.id}">
            <div>
                <div class="delivery-option-date">
                  ${dateString}
                </div>
                <div class="delivery-option-price">
                  ${priceString} Shipping
                </div>
            </div>
        </div>
      `;
    });
    return html;
  }

  // delete link  and container
  document.querySelectorAll(".js-delete-link").forEach((link) => {
    link.addEventListener("click", () => {
      // console.log(link.dataset);
      const productId = link.dataset.productId;
      // console.log(productId);
      removeFromCart(productId);

      const container = document.querySelector(
        `.js-cart-item-container-${productId}`
      );
      // console.log("container", container);
      container.remove();
    });
  });

  /* Update Delivery Date */
  document.querySelectorAll(".js-delivery-option").forEach((element) => {
    element.addEventListener("click", () => {
      const { productId, deliveryOptionId } = element.dataset;
      updateDeliveryOption(productId, deliveryOptionId);
      renderOrderSummary();
    });
  });
}
