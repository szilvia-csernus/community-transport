import { initMap, getVerification, renderInputField, addressIsVerified } from "./reg_addr_validation.js";
import { showInvalid } from "./validation_helper.js";
import { passwordIsVerified, passwordInputField, validateStrongPassword } from "./password_validation.js";
import { phoneInputField, phoneIsVerified, validatePhoneNumber } from "./phone_validation.js";
import { fullnameInputField, fullnameIsVerified, validateFullname } from "./name_validation.js";
import { emailInputField, emailIsVerified, validateEmail } from "./email_validation.js";

// Initialize map
initMap();

// Grab HTML elements
export const addressInput = document.getElementById('address');
export const addressId = document.getElementById('address_id');
export const addressNotification = document.getElementById('address-notification');
export const phoneNotification = document.getElementById('phone-notification');
export const fullnameNotification = document.getElementById('fullname-notification');
export const emailNotification = document.getElementById('email-notification');

const form = document.getElementById('form');

passwordInputField.addEventListener('focusout', validateStrongPassword);
phoneInputField.addEventListener('focusout', validatePhoneNumber);
fullnameInputField.addEventListener('focusout', validateFullname);
emailInputField.addEventListener('focusout', validateEmail);

// prevent form subbmission unless address is verified
form.addEventListener(
    'submit',
    (e) => {
        e.preventDefault();

        if (passwordIsVerified && 
            addressIsVerified && 
            phoneIsVerified && 
            fullnameIsVerified &&
            emailIsVerified) {
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
                showInvalid(addressInput, addressNotification);
            }
        }
        if (!passwordIsVerified) {
            validateStrongPassword()
        }
        if (!phoneIsVerified) {
            validatePhoneNumber();
        }
        if (!fullnameIsVerified) {
            validateFullname();
        }
        if (!emailIsVerified) {
            validateEmail();
        }
    }
);

