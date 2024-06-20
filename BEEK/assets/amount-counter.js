$(document).ready(function() {
  $(document).on('click', '.js-amount-block', function(e) {
    var btnPlus = $(this).find('.js-plus-amount')[0];
    var btnMinus = $(this).find('.js-minus-amount')[0];
    var inputAmount = $(this).parents('.product__wrap').find('.item-amount');
    var blockAmount = $(this).find('.js-amount-block');
    var currentAmount = parseInt(inputAmount.val(), 10);
    if (e.target === btnPlus) {
      var amount = ++currentAmount;
      inputAmount.val(amount);
      blockAmount.html(amount);
    }
    if (e.target === btnMinus && currentAmount > 0) {
      var amount = --currentAmount;
      inputAmount.val(amount);
      blockAmount.html(amount);
    }
  });
});

