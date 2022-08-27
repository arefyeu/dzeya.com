(function () {

  'use strict';


  const inputPhone = document.querySelector(".js-phone");

  const iti = window.intlTelInput(inputPhone, {
    allowDropdown: true,
    //customContainer: "iti--mobile",
    //dropdownContainer: itiDropdownContainer,
    //onlyCountries: ["az", "am", "by", "ge", "kg", "kz", "md", "ru", "tj", "tm", "ua", "uz"],
    initialCountry: "auto",
    separateDialCode: true,
    autoPlaceholder: "aggressive",
    nationalMode: true,
    formatOnDisplay: true,
    geoIpLookup: function (callback) {
      $.get('https://ipinfo.io', function () { }, "jsonp").always(function (resp) {
        var countryCode = (resp && resp.country) ? resp.country : "";
        callback(countryCode);
      });
    },
    utilsScript: "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/16.0.8/js/utils.js?v=4", // just for formatting/placeholders etc
  });

  // countryChange
  function countryChange() {
    let placeholderActive = this.getAttribute('placeholder');
    let placeholderLength = placeholderActive.length;
    this.setAttribute('minlength', placeholderLength);
    this.setAttribute('maxlength', placeholderLength);

    let newMask = placeholderActive.replace(/[1-9]/g, '0');
    $(this).mask(newMask, {});
  }

  inputPhone.addEventListener('input', countryChange);
  inputPhone.addEventListener('keyup', countryChange);

})();