/* =========================================
  1. CATEGORY FILTER LOGIC
  ========================================= */


// this wil show totebag first
filterSelection("totebag");


function filterSelection(c) {
 var x, i;
 x = document.getElementsByClassName("lookbook-item");
  // hide all
 for (i = 0; i < x.length; i++) {
   removeClass(x[i], "show");
  
   // then, make the one we wnat to see in the category appear ykyk
   if (x[i].className.indexOf(c) > -1) {
     addClass(x[i], "show");
   }
 }
}


// add class
function addClass(element, name) {
 var i, arr1, arr2;
 arr1 = element.className.split(" ");
 arr2 = name.split(" ");
 for (i = 0; i < arr2.length; i++) {
   if (arr1.indexOf(arr2[i]) == -1) {element.className += " " + arr2[i];}
 }
}


// remove class
function removeClass(element, name) {
 var i, arr1, arr2;
 arr1 = element.className.split(" ");
 arr2 = name.split(" ");
 for (i = 0; i < arr2.length; i++) {
   while (arr1.indexOf(arr2[i]) > -1) {
     arr1.splice(arr1.indexOf(arr2[i]), 1);    
   }
 }
 element.className = arr1.join(" ");
}


// makes the button active tykyk
var btnContainer = document.querySelector(".category-nav");
if (btnContainer) {
   var btns = btnContainer.getElementsByClassName("filter-btn");
   for (var i = 0; i < btns.length; i++) {
     btns[i].addEventListener("click", function(){
       var current = btnContainer.getElementsByClassName("active");
       if (current.length > 0) {
           current[0].className = current[0].className.replace(" active", "");
       }
       this.className += " active";
     });
   }
}




/* =========================================
  2. PAGE FADE-IN EFFECT
  ========================================= */




// ya so it basically makes the page fade in
document.addEventListener("DOMContentLoaded", function() {
   setTimeout(function() {
       document.body.style.opacity = '1';
   }, 400);
   updateCartDisplay();
});


document.addEventListener("visibilitychange", function() {
   if (document.visibilityState === 'visible') {
       const body = document.body;
       body.style.animation = 'none';
       body.offsetHeight;
       body.style.animation = 'fadeInPage 0.4s ease-out forwards';
   }
});




/* =========================================
  3. PRODUCT POPUP LOGIC (+ Quantity)
  ========================================= */


let currentPopupQty = 1;


function openPopup(element) {
   var popup = document.getElementById("miniPopup");
  
   currentPopupQty = 1;
   document.getElementById("popupQty").innerText = "1";


   // so the images of the product and info and stuff will be turned into a variable
   var imgSrc = element.querySelector("img").src;
   var title = element.querySelector("h3").innerText;
   var price = element.querySelector(".price-data").innerText;
   var desc = element.querySelector(".desc-data").innerHTML;
  
   // and then the variable will be sent into the popup
   document.getElementById("popupImg").src = imgSrc;
   document.getElementById("popupTitle").innerText = title;
   document.getElementById("popupPrice").innerText = price;
   document.getElementById("popupDetails").innerHTML = desc;
  
   // make the pop popup
   popup.style.display = "block";
}


function closePopup() {
   document.getElementById("miniPopup").style.display = "none";
}


function changePopupQty(change) {
   currentPopupQty += change;
   if (currentPopupQty < 1) currentPopupQty = 1;
   document.getElementById("popupQty").innerText = currentPopupQty;
}




/* =========================================
  4. SHOPPING CART LOGIC (With Storage)
  ========================================= */


// so we have a json which saved the stuff in the shopping cart so lets say i go to payment but i wanna go back to products, it will save what ive bought if i go back
let cart = JSON.parse(sessionStorage.getItem("shoppingCart")) || [];


// saves the thing
function saveCart() {
   sessionStorage.setItem("shoppingCart", JSON.stringify(cart));
}


function openCart() {
   document.getElementById("cartSidebar").classList.add("open");
   document.querySelector(".cart-overlay").style.display = "block";
   document.body.style.overflow = "hidden";
}


function closeCart() {
   document.getElementById("cartSidebar").classList.remove("open");
   document.querySelector(".cart-overlay").style.display = "none";
   document.body.style.overflow = "auto";
}


function addToCart() {
   let title = document.getElementById("popupTitle").innerText;
   let priceText = document.getElementById("popupPrice").innerText;
   let imgSrc = document.getElementById("popupImg").src;


   let existingItem = cart.find(item => item.title === title);


   if (existingItem) {
       existingItem.qty += currentPopupQty;
   } else {
       let product = {
           title: title,
           price: priceText,
           img: imgSrc,
           qty: currentPopupQty,
           id: Date.now()
       };
       cart.push(product);
   }


   saveCart();
   updateCartDisplay();
   closePopup();
   openCart();  
}


function changeCartQty(id, change) {
   let item = cart.find(x => x.id === id);
   if (item) {
       item.qty += change;
       if (item.qty <= 0) {
           removeFromCart(id);
       } else {
           saveCart();
           updateCartDisplay();
       }
   }
}


function removeFromCart(id) {
   cart = cart.filter(item => item.id !== id);
   saveCart();
   updateCartDisplay();
}


function updateCartDisplay() {
   let cartItemsContainer = document.querySelector(".cart-items");
   let totalElement = document.querySelector(".cart-footer .total span:last-child");
   let countElement = document.querySelector(".cart-header h2");


   // just in case the cart dont exist for some reason but ya
   if (!cartItemsContainer) return;


   cartItemsContainer.innerHTML = "";
   let totalPrice = 0;
   let totalCount = 0;


   if (cart.length === 0) {
       cartItemsContainer.innerHTML = '<p class="empty-msg">Your cart is empty.</p>';
       countElement.innerText = "Your Cart (0)";
       totalElement.innerText = "IDR 0";
       return;
   }


   cart.forEach(item => {
       let cleanPrice = parseInt(item.price.replace(/[^0-9]/g, ''));
       totalPrice += (cleanPrice * item.qty);
       totalCount += item.qty;


       let cartItem = document.createElement("div");
       cartItem.classList.add("cart-item-card");
      
       cartItem.innerHTML = `
           <img src="${item.img}" alt="product">
           <div class="cart-item-info">
               <h4>${item.title}</h4>
               <p>${item.price}</p>
               <div class="qty-selector" style="margin-top: 5px; transform: scale(0.8); transform-origin: left;">
                   <button onclick="changeCartQty(${item.id}, -1)">-</button>
                   <span>${item.qty}</span>
                   <button onclick="changeCartQty(${item.id}, 1)">+</button>
               </div>
           </div>
           <button class="remove-btn" onclick="removeFromCart(${item.id})">
               <i class='bx bx-trash'></i>
           </button>
       `;
       cartItemsContainer.appendChild(cartItem);
   });


   let formattedTotal = totalPrice.toLocaleString('en-US');
   totalElement.innerText = "IDR " + formattedTotal;
   countElement.innerText = `Your Cart (${totalCount})`;
}




/* =========================================
  5. HORIZONTAL SCROLL WITH MOUSE WHEEL
  ========================================= */


  // ya so for this one the wheel will make it go horizontal instead of vertical and this only works at products.html. it doesnt work at mobile tho but that makes it better and easier for them


(function () {
 const scrollContainer = document.querySelector(".product-grid");
 if (!scrollContainer) return;


 const wheelHandler = (evt) => {
   if (evt.ctrlKey || evt.altKey || evt.metaKey) return;
   evt.preventDefault();
   scrollContainer.scrollLeft += evt.deltaY;
 };


 const mql = window.matchMedia("(min-width: 525px)");


 function updateEnabledState() {
   if (mql.matches) {
     scrollContainer.addEventListener("wheel", wheelHandler, { passive: false });
   } else {
     scrollContainer.removeEventListener("wheel", wheelHandler, { passive: false });
   }
 }


 updateEnabledState();


 if (typeof mql.addEventListener === "function") {
   mql.addEventListener("change", updateEnabledState);
 } else if (typeof mql.addListener === "function") {
   mql.addListener(updateEnabledState);
 }


 window.addEventListener("unload", () => {
   scrollContainer.removeEventListener("wheel", wheelHandler, { passive: false });
 });
})();
/* =========================================
  6. CHECKOUT LOGIC
  ========================================= */


  // check if cart is empty
function checkout() {
   if (cart.length === 0) {
       alert("Your cart is empty! Add some cute stuff first. :3");
       return;
   }
  
    window.location.href = 'payment.html';
}
