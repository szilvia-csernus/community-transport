import { initMap, getVerification, renderInputField, addressIsVerified } from "./reg_addr_validation.js";
import { showInvalid } from "./validation_helper.js";
import { passwordIsVerified, passwordInputField, validateStrongPassword } from "./password_validation.js";

// Initialize map
initMap();

// Grab HTML elements
export const addressInput = document.getElementById('address');
export const addressId = document.getElementById('address_id');
export const notification = document.getElementById('addressNotification');
export const form = document.getElementById('form');

passwordInputField.addEventListener('focusout', validateStrongPassword);

// prevent form subbmission unless address is verified
form.addEventListener(
    'submit',
    (e) => {
        e.preventDefault();

        if (passwordIsVerified && addressIsVerified) {
            form.submit();
        } 
        else {
            // if user didn't touch the address field (e.g. it was filled in by
            // the browser's autocompletion, it has to be verified before submission.)
            if (addressId.value) {
                getVerification(
                    addressId.value,
                    addressInput.value,
                    renderInputField
                );
            } else {
                showInvalid(addressInput, notification);
            }
        }
    }
);

