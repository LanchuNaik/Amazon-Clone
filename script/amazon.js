import{cart, addToCart} from '../data/cart.js';
import{products}from '../data/product.js';
import { formatCurrency } from './util/money.js';


let productsHTML = '';

products.forEach((product) => {
  productsHTML += `
        <div class="product-container">
         <div class="product-img-containrer">
          <img  class="product-img" src="${product.image}" alt="socks">
         </div>
          <div class="product-name">${product.name}</div>
          <div class="product-rating-container">
            <div class="product-rating-stars"><img src="images/ratings/rating-${product.rating.stars * 10}.png" alt="ratings" class="product-rating-stars-img"></div>
            <div class="product-rating-counts">${product.rating.count}</div>
          </div>
          <div class="product-price">$${(formatCurrency(product.priceCents))}</div>
          <div>
            <select class="product-quantity  js-quantity-selector-${product.id}" name="quantity">
              <option value="1" selected>1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
              <option value="6">6</option>
              <option value="7">7</option>
              <option value="8">8</option>
              <option value="9">9</option>
              <option value="10">10</option>
            </select>
          </div>

          <div class="added-product js-added-product-${product.id}">
          <img src="images/icons/checkmark.png" alt="checkmark">
          Added
        </div>

          <div class="add-to-cart-btn js-add-to-cart" data-product-id="${product.id}">
            Add to cart
          </div>
      </div>
     `;
});
document.querySelector('.js-products-grid').innerHTML = productsHTML;


function updateCartQuantity(){
  let cartQuantity = 0;
  cart.forEach((cartItem) => {
    cartQuantity += cartItem.quantity;
  });

  document.querySelector('.js-cart-quantity').innerHTML = cartQuantity;
}
updateCartQuantity();


document.querySelectorAll('.js-add-to-cart').forEach((button) => {
  button.addEventListener('click', () => {
    const productId = button.dataset.productId;
    addToCart(productId);
    updateCartQuantity();
 

    const addedMessage = document.querySelector(`.js-added-product-${productId}`);
    addedMessage.classList.add('added-product-visible');

    setTimeout(() => {
      addedMessage.classList.remove('added-product-visible');
    }, 2000);

  });
});
