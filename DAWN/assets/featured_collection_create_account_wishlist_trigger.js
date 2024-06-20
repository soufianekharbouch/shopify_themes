document.addEventListener("DOMContentLoaded", function () {
  const wishes = [
    ...document.querySelectorAll(
      "[data-hx-trigger='form_modal'].sf-wishlist__button"
    ),
  ];

  const formModal = document.querySelector('[data-hx-target = "form_modal"]');

  const closeBtn = document.querySelector('[data-hx-close="form_modal"]');

  function closeModal() {
    if (formModal.classList.contains("flex")) {
      formModal.classList.remove("flex");
      formModal.classList.add("hidden");
    }
  }
  closeBtn.addEventListener("click", closeModal);
  formModal.addEventListener(
    "click",
    (event) => {
      if (event.target.getAttribute("data-hx-target") !== null) {
        closeModal();
      }
    },
    true
  );
  document.addEventListener("keyup", (event) => {
    if (event.key === "Escape") {
      closeModal();
    }

  // wishes.forEach((wish) => {
  //   wish.addEventListener("click", () => {
  //     // formModal.classList.remove("hidden");
  //     // formModal.classList.add("flex");
  //     window.location.href = "https://lynhomeharmony.ma/pages/swym-wishlist";
  //     console.log("wishes");
  //   });
  // });
});
//console.log(formModal);

// it works
// 1- find the form
// 2- style the form
// 3- add the form to a snippet
// 4 - render the form in the collection page
// 5 - use the product preview code and style
