(function() {
  var cartContainer = document.getElementById("CartContainer");
  var checkouts = document.getElementsByClassName('order-summary__section--discount')
  var checkout = checkouts[checkouts.length - 1];

  var idme = `<div class="idme">
    <div class="idme-shopify">
      <p class='idme-btn-affinity'>Nurses receive 20% off</p>
      <a class="idme-btn-unify" href="https://discountify.id.me/oauth/checkpoint/beekman1802" >
        <img src="https://cdn.shopify.com/s/files/1/0223/7461/files/rectangle-outlined-verify-b5f7e58ada059d92bd91f49af5a6b68a3a9d39e7d573c3342501c4093ff46216.svg?v=1671654686" alt="ID.me" style="height:42px"/>
      </a>
    </div>
  </div>`;


   checkout && checkout.insertAdjacentHTML("afterend", idme);
})();

