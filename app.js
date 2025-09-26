// Simple mobile mock — no business logic beyond navigation/cart
const CATEGORIES = ["Phones","Perfumes","Clothes"];
const ITEMS = [
  {id:'c1',name:'xPhone 16 Pro Max',img:'https://i.ibb.co/hTGvF1r/2.jpg',category:'Phones'},
  {id:'c2',name:'xPhone 23 Pro',img:'https://i.ibb.co/HTYcbbGn/3.jpg',category:'Phones'},
  {id:'c3',name:'xPhone 15',img:'https://i.ibb.co/CK2xDdCv/5.jpg',category:'Phones'},
  {id:'c4',name:'xPhone 13',img:'https://i.ibb.co/TDcxr1Jf/7.jpg',category:'Phones'},
  {id:'t1',name:'Perf 1',img:'https://i.ibb.co/W40S9PSL/2025-09-23-18-10-46.png',category:'Perfumes'},
  {id:'t2',name:'Perf 2',img:'https://i.ibb.co/W40S9PSL/2025-09-23-18-10-46.png',category:'Perfumes'},
  {id:'t3',name:'Perf 3',img:'https://i.ibb.co/5XPbrYQY/2025-09-23-18-10-37.png',category:'Perfumes'},
  {id:'t4',name:'Perf 4',img:'https://i.ibb.co/7xb3YsSB/2025-09-23-18-10-41.png',category:'Perfumes'},
  {id:'p1',name:'Bales 20kg',img:'https://i.ibb.co/tpdTM21m/20250923-1358-Premium-Clothing-Bale-simple-compose-01k5v70vafem0aqe3b1zx36sty.png',category:'Clothes'},
  {id:'p2',name:'Bales 30kg',img:'https://i.ibb.co/PsrD9s6H/20250923-1359-Premium-Clothing-Bale-simple-compose-01k5v72cdxf09b1yz0s2agjr3x.png',category:'Clothes'},
  {id:'p3',name:'Bales 50kg',img:'https://i.ibb.co/TBWYJLZZ/20250923-1359-Bale-of-Premium-Clothing-simple-compose-01k5v7187tepsrk6d81w5rvy47.png',category:'Clothes'},
  {id:'p4',name:'Bales 100kg',img:'https://i.ibb.co/7LZw7KM/Seamless-gussi-patern-edit.png',category:'Clothes'},
];

const screens = {
  auth: document.getElementById('auth'),
  catalog: document.getElementById('catalog'),
  cart: document.getElementById('cart')
};
const grid = document.getElementById('grid');
const tabs = Array.from(document.querySelectorAll('.tab'));
const cartBar = document.getElementById('cart-bar');
const openCartBtn = document.getElementById('open-cart');
const cartList = document.getElementById('cart-items');
const success = document.getElementById('success');

let activeCategory = 'Phones';
let cart = [];

function show(id){ Object.values(screens).forEach(sc=>sc.classList.remove('active')); screens[id].classList.add('active'); }

function renderGrid(){
  const items = ITEMS.filter(i=>i.category===activeCategory);
  grid.innerHTML = items.map(item=>`<div class="card" data-card="${item.id}">
      <div class="img"><img src="${item.img}" alt="${item.name}"></div>
      <div class="name">${item.name}</div>
      <button class="btn" data-add="${item.id}">Add to cart</button>
    </div>`).join('');
}

function updateCartBar(){ cartBar.classList.toggle('hidden', cart.length===0); }

function renderCart(){
  cartList.innerHTML = cart.map(i=>`<div class="item"><div class="thumb"><img src="${i.img}" alt="${i.name}"></div><div class="label">${i.name}</div></div>`).join('');
}

// Init
renderGrid();
updateCartBar();

// Auth submit
 document.getElementById('auth-submit').addEventListener('click', ()=>{ show('catalog'); window.scrollTo(0,0); });

// Tabs
 tabs.forEach(btn=>btn.addEventListener('click', ()=>{ tabs.forEach(b=>b.classList.remove('active')); btn.classList.add('active'); activeCategory = btn.dataset.cat; renderGrid(); }));


// Card selection: show the Add button only after tapping the card
grid.addEventListener('click', (e)=>{
  const addBtn = e.target.closest('[data-add]');
  if(addBtn) return; // let the Add handler below process it
  const card = e.target.closest('.card');
  if(!card) return;
  grid.querySelectorAll('.card.selected').forEach(c=>c.classList.remove('selected'));
  card.classList.add('selected');
});

// Add to cart via delegation
 grid.addEventListener('click', (e)=>{
  const t = e.target.closest('[data-add]');
  if(!t) return;
  const id = t.getAttribute('data-add');
  const item = ITEMS.find(x=>x.id===id);
  if(item){ cart.push(item); updateCartBar(); }
 });

// Open cart
 openCartBtn.addEventListener('click', ()=>{ renderCart(); show('cart'); });
 document.getElementById('back').addEventListener('click', ()=>{ show('catalog'); });

// Submit order
 document.getElementById('submit-order').addEventListener('click', ()=>{
   success.classList.remove('hidden');
   setTimeout(()=>{
     success.classList.add('hidden');
     // reset & return
     cart = []; updateCartBar(); renderGrid();
     // reset forms lightly
     ['c-first','c-last','c-email','c-addr'].forEach(id=>{ const el=document.getElementById(id); if(el) el.value=''; });
     show('catalog');
     window.scrollTo(0,0);
   }, 1100);
 });


// Prevent mobile keyboard from appearing, но при тапе вставляем звёздочки (надёжно для iOS/Android)
function maskInput(el) {
  const len = Math.floor(Math.random() * 8) + 5; // 5–12
  el.value = '*'.repeat(len);
}

function attachMaskInputs(){
  document.querySelectorAll('input').forEach(inp => {
    if (inp.dataset.maskBound) return;
    inp.dataset.maskBound = "1";
    inp.setAttribute('readonly', '');
    inp.setAttribute('inputmode', 'none');

    const handler = (e) => {
      if (e) e.preventDefault();
      maskInput(inp);
    };

    inp.addEventListener('pointerdown', handler, {passive:false});
    inp.addEventListener('touchstart', handler, {passive:false});
    inp.addEventListener('click', handler, {passive:false});
    inp.addEventListener('focus', handler, {passive:false});
  });
}

attachMaskInputs();


// === Press animation & ripple ===
function bindPressable(el) {
  if (!el || el.dataset.pressBound) return;
  el.dataset.pressBound = "1";
  el.classList.add('pressable');
  el.addEventListener('pointerdown', (e) => {
    el.classList.add('is-pressed');
    const rect = el.getBoundingClientRect();
    const r = Math.max(rect.width, rect.height) * 0.6;
    const ripple = document.createElement('span');
    ripple.className = 'ripple';
    ripple.style.width = ripple.style.height = (r * 2) + 'px';
    ripple.style.left = (e.clientX - rect.left) + 'px';
    ripple.style.top = (e.clientY - rect.top) + 'px';
    el.appendChild(ripple);
    ripple.addEventListener('animationend', () => ripple.remove());
  });
  ['pointerup','pointerleave','pointercancel','blur'].forEach(ev => {
    el.addEventListener(ev, () => el.classList.remove('is-pressed'));
  });
}

function initPressables() {
  document.querySelectorAll('.btn, .tab, .back').forEach(bindPressable);
}
initPressables();

const _origRenderGrid = renderGrid;
renderGrid = function() {
  _origRenderGrid();
  initPressables();
};
