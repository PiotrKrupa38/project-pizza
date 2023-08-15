import {select, settings} from '../settings.js'

class AmountWidget{
    constructor(element){
      const thisWidget = this;
      
      thisWidget.getElements(element)
      thisWidget.initActions();
      thisWidget.setValue(thisWidget.input.value);
    
    }
  
    getElements(element){
      const thisWidget = this;
    
      thisWidget.element = element;
      thisWidget.input = thisWidget.element.querySelector(select.widgets.amount.input);
      thisWidget.linkDecrease = thisWidget.element.querySelector(select.widgets.amount.linkDecrease);
      thisWidget.linkIncrease = thisWidget.element.querySelector(select.widgets.amount.linkIncrease);
    }
  
    setValue(value){
      const thisWidget = this;
  
      const newValue = parseInt(value);
  
      /*TODO: Add Validation*/
      if(thisWidget.value !== newValue && !isNaN(newValue) && newValue >= settings.amountWidget.defaultMin && newValue <= settings.amountWidget.defaultMax) {
        thisWidget.value = newValue;
      } else {
        thisWidget.value = settings.amountWidget.defaultValue;
      }
      thisWidget.input.value = thisWidget.value;
      this.announce();
  
    }
  
    initActions(){
      const thisWidget = this;
  
      thisWidget.input.addEventListener('change', function(){
        thisWidget.setValue(thisWidget.input.value)
      })
      
      thisWidget.linkDecrease.addEventListener('click', function(event){
        event.preventDefault();
        thisWidget.setValue(thisWidget.value - 1);
      });
  
      thisWidget.linkIncrease.addEventListener('click', function(event){
        event.preventDefault();
        thisWidget.setValue(thisWidget.value + 1);
      })
    }
  
    announce(){
      const thisWidget = this;
      const event = new CustomEvent('updated', {
        bubbles: true
      });
      thisWidget.element.dispatchEvent(event);
    }
  
  }

  export default AmountWidget;