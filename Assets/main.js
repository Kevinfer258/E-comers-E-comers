async function getProduct() {
    try {
        const data = await fetch(
            'https://ecommercebackend.fundamentos-29.repl.co/'
        );

        const res = await data.json();
        window.localStorage.setItem('products', JSON.stringify(res))
        return res;
    } catch (error) {
        console.log(error)
    }
}
function printProduct(db) {
    const cartProducts = document.querySelector(".products")  
    let html = "";
    for (const product of db.products) {
        
        html += `
             <div class="product">
                <div class"product__img">
                    <img src="${product.image}" alt="imagen" />
                </div>

                 <div class="product__info">
                    <h4>${product.name} || <span><b>Stock</b>: ${product.quantity}</span> </h4>
                    <h5 >
                            $${product.price}.00
                        ${product.quantity ? `<i class='bx bx-plus'id="${product.id}"></i>` : `<span class="SoulOut" >Soul out</span>`}
                    </h5>

                    </div>

            </div>
        `
    }
    cartProducts.innerHTML= html;
}
function HandleCart() {
    const inconShoppingBagHtml = document.querySelector(".bx-shopping-bag")
    const cartHtml = document.querySelector(".cart")
    inconShoppingBagHtml.addEventListener('click', function () {
        cartHtml.classList.toggle("cart__show")
    })
}
function addCartFromProduct(db) {
    const productsHtml = document.querySelector(".products");
    productsHtml.addEventListener('click', function (e) {
        if (e.target.classList.contains("bx-plus")) {
            const id = Number(e.target.id);

            const productFind = db.products.find(
                (product) => product.id === id
            );
            
            if (db.cart[productFind.id]) {
                if (productFind.quantity === db.cart[productFind.id].amount)
                    return alert('No tenemos mas stock')
                db.cart[productFind.id].amount++;
            } else {
                db.cart[productFind.id] = { ...productFind, amount: 1 }
            }
            window.localStorage.setItem('cart', JSON.stringify(db.cart))
            printProductInCart(db);
            printTotal(db);
            handlePrinAmountProducts(db);
           
        };
        
    });

}
function printProductInCart(db) {
    const cartProducts = document.querySelector(".cart__products");
    let html = ''
    for (const product in db.cart) {
        const { quantity, price, name, image, id, amount } = db.cart[product]
        html += `
            <div class="cart__product">
                <div class="cart__product--img">
                    <img src="${image}" alt="imagen" />
                </div>
                <div class="cart__product--body">
                    <h4>${name} | <span class="price">$${price}.00</span> </h4>
                    <p>Stock: ${quantity}</p>
                    <div class"cart__product--body--op" id = '${id}'>
                    <i class='bx bx-minus'></i>
                        <span>${amount} Unit</span>
                        <i class='bx bx-plus'></i>
                        <i class='bx bxs-trash'></i>

                    </div>
                </div>
            </div>
        `
    }
    cartProducts.innerHTML = html;
}
function handleProductsInCart(db){
    const cartProducts = document.querySelector(".cart__products");
    cartProducts.addEventListener('click', function (e) {
        if (e.target.classList.contains('bx-plus')) {
            const id = Number(e.target.parentElement.id);

            const productFind = db.products.find(
                (product) => product.id === id
            );
            if (productFind.quantity === db.cart[productFind.id].amount)
                return alert('No tenemos mas stock')
            db.cart[id].amount++;
            handlePrinAmountProducts(db)

        }
        
        if (e.target.classList.contains('bx-minus')) {
            const id = Number(e.target.parentElement.id)
            if (db.cart[id].amount ===1){
            const response = confirm('Estas seguro de querer eliminar?')
            if (!response) return;
                delete db.cart[id];
            }else{
                db.cart[id].amount--;
            }
            handlePrinAmountProducts(db);
        }
        if (e.target.classList.contains('bxs-trash')) {
            const id = Number(e.target.parentElement.id)
            const response = confirm('Estas seguro de querer eliminar?')
            if (!response) return;

            delete db.cart[id];
            handlePrinAmountProducts(db);
        }
        window.localStorage.setItem('cart', JSON.stringify(db.cart))
        printProductInCart(db);
        printTotal(db);


    });
}
function printTotal(db){
    const infoTotal = document.querySelector(".info__total");
    const infoAmount = document.querySelector(".info__amount");
    let totalProducts = 0;
    let amountProducts = 0;
    
    for (const product in db.cart) {
        const {amount, price} = db.cart[product];
        totalProducts += price * amount;
       amountProducts += amount;
    }
    infoTotal.textContent = '$ ' +totalProducts + '.00' ;
    infoAmount.textContent = amountProducts + ' Units' ;
    
}
function handleTotal(db){
    const btnBuy = document.querySelector(".btn__buy");
    btnBuy.addEventListener('click', function(){
            if(!Object.values(db.cart).length)return alert('Primero tienes que escoger un producto')
            const response = confirm('¿Seguro que quieres comprar?');
            if(!response) return;

            const currentProducts= []
        
            for (const product of db.products) {
                const productCart = db.cart[product.id]
                if (product.id === productCart?.id){
                    currentProducts.push({
                        ...product,
                        quantity: product.quantity - productCart.amount

                    });
                }else{
                    currentProducts.push(product);
                }

            }
            db.products = currentProducts;
            db.cart = {};
            window.localStorage.setItem('products', JSON.stringify(db.products));
            window.localStorage.setItem('cart', JSON.stringify(db.carts))
            
            printTotal(db);
            printProductInCart(db);
            printProduct(db);
            handlePrinAmountProducts(db);
    });
    
}
function handlePrinAmountProducts(db){
    const amountProducts = document.querySelector(".amountProducts")
    let amount = 0;
    for (const product in db.cart) {
    amount += db.cart[product].amount;
   
 }
     amountProducts.innerHTML = amount;
    
}
function darkMode(){
    const darkModeToggle = document.querySelector('#dark-mode-toggle');

    darkModeToggle.addEventListener('click', () => {
      document.body.classList.toggle('dark-mode');
      darkModeToggle.classList.toggle('bx-sun');
      darkModeToggle.classList.toggle('bx-moon');
    });

}
function menu(){
    const bxsDashboard = document.querySelector(".bxs-dashboard")
    const menu = document.querySelector(".menu")
  
    bxsDashboard.addEventListener('click', function(){
      menu.classList.toggle("menu__show")
    })
}
function scrollNav(){
    window.addEventListener('scroll', function() {
        var nav = document.querySelector('nav'); 
        var scrollPosition = window.scrollY; 
        
        if (scrollPosition > 50) { 
          nav.style.backgroundColor = '#ffffff'; 
        } else {
          nav.style.backgroundColor = 'transparent';
        }
      });
}
function link(){
    const link = document.querySelector(".link")
    link.addEventListener('click', function(){
      const response = confirm('¿Quieres ir a este link?')
      if (response !== true) return ;
    })
}
async function main() {
    const db = {
        products: JSON.parse(window.localStorage.getItem('products')) || (await getProduct()),
        cart: JSON.parse(window.localStorage.getItem('carts')) || {},
    }
    addCartFromProduct(db);
    printProduct(db);
    printProductInCart(db);
    handleProductsInCart(db);
    printTotal(db);
    handleTotal(db);
    handlePrinAmountProducts(db)
    HandleCart();
    scrollNav()
    darkMode(); 
    menu();
    link(); 
}
main()

