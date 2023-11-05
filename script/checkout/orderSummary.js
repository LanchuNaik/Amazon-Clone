import { cart, removeFromCart, updateDeliveryOption, updateQuantity } from '../../data/cart.js';
import { products, getProduct } from '../../data/product.js';
import { formatCurrency } from '../util/money.js';
import { hello } from 'https://unpkg.com/supersimpledev@1.0.1/hello.esm.js';
import dayjs from 'https://unpkg.com/dayjs@1.11.10/esm/index.js';
import { deliveryOptions, getDeliveryOption } from '../../data/deliveryOptions.js';
import { renderPaymentSummary } from './paymentSummary.js';

export function renderOrderSummary() {
  let cartSummaryHTML = '';

  cart.forEach((cartItem) => {
    const productId = cartItem.productId;

    const matchingProduct = getProduct(productId);

    const deliveryOptionId = cartItem.deliveryOptionId;

    let deliveryOption = getDeliveryOption(deliveryOptionId);

    const today = dayjs();
    const deliveryDate = today.add(deliveryOption.deliveryDays, 'days');
    const dateString = deliveryDate.format('dddd, MMMM D');

    cartSummaryHTML +=
      `<div class="order-container  js-order-container-${matchingProduct.id}">
      <div class="order-item-container">
        <div class="delivery-date">
        Delivery date &colon;<span class="day-date"> ${dateString}</span>
        </div>

        <div class="item-details-container">
          <div class="image-container">
            <img src="${matchingProduct.image}" alt="T-shirt" class="item-pic">
          </div>

          <div class="item-detail">
            <div class="title">
                A${matchingProduct.name}
            </div>
            <div class="item-price">
                $${formatCurrency(matchingProduct.priceCents)}
            </div>
            <div class="item-quantity js-quqntity-label-${matchingProduct.id}">Quantity : <Span class="quantity">${cartItem.quantity}</Span>
              <span class="update js-update-link link-primary" data-product-id="${matchingProduct.id}"><a href="#">Update</a></span>

              <input class="quantity-input js-quantity-input-${matchingProduct.id}">

              <span class="save-quantity-link js-save-link link-primary" data-product-id="${matchingProduct.id}"><a href="#">Save</a></span>

              <span class="delete js-delete-link link-primary" data-product-id="${matchingProduct.id}"><a href="#">Delete</a></span>
            </div>
          </div>

          <div class="delivery-option-container">
            <div class="delivery-option">Choose a delivery option</div>
            ${deliveryOptionsHTML(matchingProduct, cartItem)}
          </div>
        </div>
      </div>
    </div>
      `
  });

  function deliveryOptionsHTML(matchingProduct, cartItem) {
    let html = '';


    deliveryOptions.forEach((deliveryOption) => {
      const today = dayjs();
      const deliveryDate = today.add(deliveryOption.deliveryDays, 'days');
      const dateString = deliveryDate.format('dddd, MMMM D');

      const priceString = deliveryOption.priceCents === 0 ? 'FREE' : `$${formatCurrency(deliveryOption.priceCents)}`;

      const isChecked = deliveryOption.id === cartItem.deliveryOptionId;


      html +=
        `<div class="delivery-date-option js-delivery-option"
            data-product-id="${matchingProduct.id}" data-delivery-option-id="${deliveryOption.id}">
            <input type="radio" ${isChecked ? 'checked' : ''} name="day-date-${matchingProduct.id}">
            <div class="delivery-day">
              <div class="day-date">${dateString}</div>
              <div class="shipping-type">${priceString}-Shipping</div>
            </div>
         </div>`
    });
    return html;
  }

  document.querySelector('.js-order-summary').innerHTML = cartSummaryHTML;

  document.querySelectorAll('.js-delete-link').forEach((link) => {
    link.addEventListener('click', () => {
      const productId = link.dataset.productId;
      removeFromCart(productId);
      renderPaymentSummary();

      const container = document.querySelector(`.js-order-container-${productId}`);
      container.remove();
      updateCartQuantity();
    });
  });

  document.querySelectorAll('.js-update-link').forEach((updatelink) => {
    updatelink.addEventListener('click', () => {
      const productId = updatelink.dataset.productId;
      console.log(productId);

      const container = document.querySelector(`.js-order-container-${productId}`);
      container.classList.add('is-editing-quantity');
    });
  });

  document.querySelectorAll('.js-save-link').forEach((savelink) => {
    savelink.addEventListener('click', () => {
      const productId = savelink.dataset.productId;

      const quantityIput = document.querySelector(`.js-quantity-input-${productId}`);

      const newQuantity = Number(quantityIput.value);

      if (newQuantity < 0 || newQuantity >= 1000) {
        alert('Quantity must be at least 0 and less than 1000');
        return;
      }

      updateQuantity(productId, newQuantity);

      const container = document.querySelector(`.js-order-container-${productId}`);

      container.classList.remove('is-editing-quantity');

      const quantityLabel = document.querySelector(`.js-quantity-label-${productId}`);

      quantityLabel.innerHTML = newQuantity;

      updateCartQuantity();
    });
  });

  let itemLinks = document.querySelector('.js-items-links');
  function updateCartQuantity() {
    let cartQuantity = 0;
    cart.forEach((cartItem) => {
      cartQuantity += cartItem.quantity;
    });
    itemLinks.innerHTML = `${cartQuantity} items`;
  }
  updateCartQuantity();

  document.querySelectorAll('.js-delivery-option').forEach((element) => {
    element.addEventListener('click', () => {
      const { productId, deliveryOptionId } = element.dataset;
      updateDeliveryOption(productId, deliveryOptionId);
      renderOrderSummary();
      renderPaymentSummary();
    });
  });
};
