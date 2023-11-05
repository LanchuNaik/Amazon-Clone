import { cart } from '../../data/cart.js';
import { getProduct } from '../../data/product.js';
import { getDeliveryOption } from '../../data/deliveryOptions.js';
import { formatCurrency } from '../util/money.js';

export function renderPaymentSummary() {
  let productPriceCents = 0;
  let shippingPriceCents = 0;

  cart.forEach((cartItem) => {

    const product = getProduct(cartItem.productId);
    productPriceCents += product.priceCents * cartItem.quantity;

    const deliveryOption = getDeliveryOption(cartItem.deliveryOptionId);
    console.log(deliveryOption);
    shippingPriceCents += deliveryOption.priceCents;
  });

  const totalBeforeTaxCents = productPriceCents + shippingPriceCents;
  const taxCents = totalBeforeTaxCents * 0.1;
  const totalCents = totalBeforeTaxCents + taxCents;

  const paymentSummaryHTML = `
       <div class="title">Order Summary</div>
          <div class="row">
            <div>
              Items(1):
            </div>
            <div class="payment-money-summary">
              $${formatCurrency(productPriceCents)}
            </div>
          </div>

          <div class="row">
            <div>Shipping & handling:</div>
            <div class="payment-money-summary">$${formatCurrency(shippingPriceCents)}<br>
              <hr>
            </div>
          </div>

          <div class="row">
            <div>Total before tax:</div>
            <div class="payment-money-summary">$${formatCurrency(totalBeforeTaxCents)} </div>
          </div>

          <div class="row">
            <div>Estimated tax(10%):</div>
            <div class="payment-money-summary">$${formatCurrency(taxCents)}</div>
          </div>
          <hr>

          <div class="row">
            <div class="order-total">Order total:</div>
            <div class="total-money-summary">$${formatCurrency(totalCents)}</div>
          </div>
          
          <div class="paypal">
            <div>Use Paypal</div>
            <input type="checkbox">
          </div>

        <div class="place-order"><a href="order.html">Place your order</a></div>`;
  document.querySelector('.js-payment-summary').innerHTML = paymentSummaryHTML;
};

