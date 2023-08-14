import {select, classNames, templates, settings} from './settings.js'
import utils from './utils.js';
import CartProduct from './components/CartProduct.js';

class Cart{
    constructor(element){
      const thisCart = this;
  
      thisCart.products = [];
      
      thisCart.getElements(element);
      thisCart.initActions();
    }
  
    getElements(element){
      const thisCart = this;
      
      thisCart.dom = {};
  
      thisCart.dom.wrapper = element
      thisCart.dom.toggleTrigger = thisCart.dom.wrapper.querySelector(select.cart.toggleTrigger);
      thisCart.dom.productList = thisCart.dom.wrapper.querySelector(select.cart.productList);
      thisCart.dom.deliveryFee = thisCart.dom.wrapper.querySelector(select.cart.deliveryFee);
      thisCart.dom.totalNumber = thisCart.dom.wrapper.querySelector(select.cart.totalNumber);
      thisCart.dom.subtotalPrice = thisCart.dom.wrapper.querySelector(select.cart.subtotalPrice);
      thisCart.dom.totalPrice = thisCart.dom.wrapper.querySelectorAll(select.cart.totalPrice);
      thisCart.dom.form = thisCart.dom.wrapper.querySelector(select.cart.form);
      thisCart.dom.address = thisCart.dom.wrapper.querySelector(select.cart.address);
      thisCart.dom.phone = thisCart.dom.wrapper.querySelector(select.cart.phone);
    }
  
    initActions(){
      const thisCart = this;
  
      thisCart.dom.toggleTrigger.addEventListener('click', function(event){
        event.preventDefault();
        thisCart.dom.wrapper.classList.toggle(classNames.cart.wrapperActive)
      })
      thisCart.dom.productList.addEventListener('updated', function(){
        thisCart.update();
      })
  
      thisCart.dom.productList.addEventListener('remove', function(event){
        thisCart.remove(event.detail.cartProduct);
      });
  
      thisCart.dom.form.addEventListener('submit', function(event) {
        event.preventDefault();
        thisCart.sendOrder();
      })
    }
  
    add(menuProduct){
      const thisCart = this;
  
       /* generate HTML based on template */
       const generatedHTML = templates.cartProduct(menuProduct);
       /* create element using utils.createElementFromHTML */
       menuProduct.element = utils.createDOMFromHTML(generatedHTML);
       /* add element to menu */
       thisCart.dom.productList.appendChild(menuProduct.element);
  
       thisCart.products.push(new CartProduct(menuProduct, menuProduct.element)); 
  
       thisCart.update();
    } 
  
    update() {
      const thisCart = this;
      thisCart.totalNumber = 0;
      thisCart.subtotalPrice = 0;
      thisCart.deliveryFee = 0;
      
      for (let product of thisCart.products) {
        thisCart.totalNumber += product.amount;
        thisCart.subtotalPrice += product.price;
      }
  
      thisCart.dom.totalNumber.innerHTML = thisCart.totalNumber;
      thisCart.dom.subtotalPrice.innerHTML = thisCart.subtotalPrice;
      if (thisCart.subtotalPrice != 0) {
        thisCart.deliveryFee = settings.cart.defaultDeliveryFee;
        thisCart.dom.deliveryFee.innerHTML = thisCart.deliveryFee;
      } else {
        thisCart.dom.deliveryFee.innerHTML = 0;
      }
  
      thisCart.totalPrice = thisCart.subtotalPrice + thisCart.deliveryFee;
      for (let price of thisCart.dom.totalPrice) {
        price.innerHTML = thisCart.totalPrice;
      }
    }
  
    remove(cartProduct) {
      const thisCart = this;
      cartProduct.dom.wrapper.remove();
      const indexOfProduct = thisCart.products.indexOf(cartProduct);
      thisCart.products.splice(indexOfProduct, 1);
      thisCart.update();
    }
  
    sendOrder(){
      const thisCart = this;
  
      const url = settings.db.url + '/' + settings.db.orders;
  
      const payload = {};
  
      payload.address = thisCart.dom.address.value;
      payload.phone = thisCart.dom.phone.value;
      payload.totalPrice = thisCart.totalPrice;
      payload.subtotalPrice = thisCart.subtotalPrice;
      payload.totalNumber = thisCart.totalNumber;
      payload.deliveryFee = thisCart.deliveryFee;
      //payload.products = thisCart.products;
      payload.products = [];
  
      for(let prod of thisCart.products) {
        payload.products.push(prod.getData());
      }
      
      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      };
      
      fetch(url, options);
    }
  }

export default Cart;