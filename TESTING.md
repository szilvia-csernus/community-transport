# TESTING - Community Transport project 


## Validation

### Python Validation

Validator: https://pep8ci.herokuapp.com/

| CI Python Linter Result | Passed |Warnings | 
| :--- | :---: | :--- | 
| [models.py file CI Linter Result](testing-images/python-models-py.jpeg) | &check; | |
| [routes.py file CI Linter Result](testing-images/python-routes-py.jpeg) | &check; | The Linter warnings refer to SQL Alchemy database queries that would not work with the suggested corrections.|


<br><br>

### JavaScript Validations

Validator: https://jshint.com/

| JSHint Result | Passed | Warnings |
| :--- | :---: | :--- | 
| [general.js file JSHint Result](testing-images/jshint-general-js.jpeg)| &check; | ES11 features were flagged due to JSHint testing code against ES6.  `M` variable is defined by Materialize. |
| [password_validation.js file JSHint Result](testing-images/jshint-password_validation-js.jpeg)| &check; |  No warnings. |
| [new_req_form_validation.js file JSHint Result](testing-images/jshint-new_req_form_validation-js.jpeg)| &check;| No warnings. |
| [new_req_addr_validation.js file JSHint Result](testing-images/jshint-new_req_addr_validation-js.jpeg)| &check;| ES8 and ES11 features were flagged due to JSHint testing code against ES6.  `google` variable is defined by Google. |
| [reg_form_validation.js file JSHint Result](testing-images/jshint-reg_form_validation-js.jpeg)| &check;|  No warnings. |
| [reg_addr_validation.js file JSHint Result](testing-images/jshint-reg_addr_validation-js.jpeg)| &check;| ES8 and ES11 features were flagged due to JSHint testing code against ES6. `google` variable is defined by Google. |
| [edit_member_form_validation.js file JSHint Result](testing-images/jshint-edit_member_form_validation-js.jpeg)| &check;| No warnings. |
| [edit_member_addr_validation.js file JSHint Result](testing-images/jshint-edit_member_addr_validation-js.jpeg)| &check;| ES8 and ES11 features were flagged due to JSHint testing code against ES6.  `google` variable is defined by Google. |
| [trip_map.js file JSHint Result](testing-images/jshint-trip_map-js.jpeg)| &check;| `google` variable is defined by Google. |
| [cluster_trips_map.js file JSHint Result](testing-images/jshint-cluster_trips_map-js.jpeg)| &check;| ES8 features were flagged due to JSHint testing code against ES6.  `google` and `markerClusterer` variables are defined by Google.  `markerCluster` variable definition is the recommended way of usage. (Using `new` without a variable would be unsafe.) |
| [datetime_validation.js file JSHint Result](testing-images/jshint-datetime_validation-js.jpeg)| &check;| No warnings. |
| [validation_helper.js file JSHint Result](testing-images/jshint-validation_helper-js.jpeg)| &check;| No warnings. |

<br><br>

### HTML and CSS Validations

Validator: https://validator.w3.org/

> Warnings / Errors due to Jinja template functionalities are filtered out from the results.
> CSS Errors can be ignored as they are referring to new CSS properties that are now widely supported.

| W3C Result | Passed |
| :--- | :---: | 
| [base.html file validation](testing-images/w3c-base-html.jpeg) | &check; |
| [register.html file validation](testing-images/w3c-register-html.jpeg) | &check; |
| [signin.html file validation](testing-images/w3c-signin-html.jpeg) | &check; |
| [member_profile.html file validation](testing-images/w3c-member_profile-html.jpeg) | &check; |
| [member_requests.html file validation](testing-images/w3c-member_requests-html.jpeg) | &check; |
| [new_request.html file validation](testing-images/w3c-new_request-html.jpeg) | &check; |
| [admin_profile.html file validation](testing-images/w3c-admin_profile-html.jpeg) | &check; |
| [all_members.html file validation](testing-images/w3c-all_members-html.jpeg) | &check; |
| [all_requests.html file validation](testing-images/w3c-all_requests-html.jpeg) | &check; |
| [volunteer_profile.html file validation](testing-images/w3c-volunteer_profile-html.jpeg) | &check; |
| [volunteer_requests.html file validation](testing-images/w3c-volunteer_requests-html.jpeg) | &check; |
| [volunteer_trips.html file validation](testing-images/w3c-volunteer_trips-html.jpeg) | &check; |
| [edit_member.html file validation](testing-images/w3c-edit_member-html.jpeg) | &check; |
| [404.html file validation](testing-images/w3c-404-html.jpeg) | &check; |
| [500.html file validation](testing-images/w3c-500-html.jpeg) | &check; |
| [style.css file validation](testing-images/w3c-style-css.jpeg) | &check; |

<br><br>

# Testing User Stories

## Site Owner's Goals

| Passed | Site Owneer's Goals
| :--: | :-- |
|  |  **...provide a platform for people willing to take part in this initiative** |
| &check; | The homepage effectively describes who this website is created for. |
| &check; | It allows any individuals to register their interest. |
|  |  **...allow signing up as someone seeking help with transport in the local area.** |
| &check; | The site allows vulnerable individuals to sign up. |
|  |  **...allow signing up as a potential volunteer.** |
| &check; | There is a dedicated link for volunteers to sign up. |
| &check; | The volunteer can sign up normally, then the admin can mark them as volunteers later. |
|  |  **...let admin(s) control who can be accepted to join and manage all their data.** |
| &check; | The admin can approve new members. |
| &check; | The admin can mark anyone as a volunteer. |
| &check; | The admin can mark anyone as an admin. |
| &check; | The admin can edit any member's relevant data. |
| &check; | The admin can delete any users. |
|  |  **...provide authentication for users.** |
| &check; | Without registration, there is no access to the site beyond the home page. |
| &check; | People can register with a safe password. |
| &check; | People can sign in. |
| &check; | People can retain their signed in status until signout or closing the browser tab. |
| &check; | People can sign out. |
|| **...the site should serve all types of users' goals: admins, volunteers and members.**|
| &check; | Detailed admin goals testing shows that the site serves their purpose. See results below. |
| &check; | Detailed volunteer goals testing shows that the site serves their purpose. See results below. |
| &check; | Detailed member goals testing shows that the site serves their purpose. See results below. |
|| **...the site should be easily accessible from a variety of devices.**|
| &check; | The site was thoroughly tested for responsiveness. See results below. |
| &check; | Accessibility was tested with Lighthouse. See results below. |


<br><br>

## Admin's Goals

As an admin, I would like to

* be able to register and safely sign in.
* have control over accepting / declining newly registere users.
* have a record of each individual.
* be able to edit the relevant records of any user.
* be able to delete any user from the database.
* be able to grant admin / volunteer privilages to other users.
* be able to take away admin / volunteer privilages from other users.
* have an overview of all current and past transport requests.
* be able to delete my own record without a trace.
<br><br>

## Member's Goals

As a member, I would like to

* be able to register and safely sign in.
* be able to edit my own data.
* be able to request a new transport.
* be able to see my current / past transport requests.
* know if a volunteer offered transport to any of my requests.
* have an overview of all of my own requests.
* be able to cancel any of my current requests.
* be able to clear any of my past requests.
* be able to delete my own record without a trace.
<br><br>

## Volunteer's Goals

As a volunteer, I would like to

* be able to register and safely sign in.
* be able to edit my own data.
* be able to view all current outstanding transport requests.
* be able to accept a transport request.
* have an overview of all of the trips I previously accepted.
* be able to cancel any current trips I previously accepted.
* be able to delete my own record without a trace.

<br><br>

# Accessibility
<br>

* Chrome Dev Tools' Lighthouse score is 100% for accessibility for both mobile and desktop devices. 

<br>


<br><br>



<br><br>

# Responsiveness Testing

Responsiveness was tested using [Google Dev Tools](https://developer.chrome.com/docs/devtools/). 
<br><br>

| Device | Home | Register | Login | All Members | All Requests | Admin Profile |Outstanding Requests|Volunteer Trips|Volunteer Profile| Member Profile |New Request| Edit Member |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| iPhone SE  | &check; | &check; | &check; | &check; | &check; | &check; | &check; | &check; | &check; | &check; | &check; | &check; |
| iPhone XR | &check; | &check; | &check; | &check; | &check; | &check; | &check; | &check; | &check; | &check; | &check; | &check; |
| iPhone 12 Pro | &check; | &check; | &check; | &check; | &check; | &check; | &check; | &check; | &check; | &check; | &check; | &check; |
| Pixel 5 | &check; | &check; | &check; | &check; | &check; | &check; | &check; | &check; | &check; | &check; | &check; | &check; |
| Samsung Galaxy S8+ |&check; | &check; | &check; | &check; | &check; | &check; | &check; | &check; | &check; | &check; | &check; | &check; |
| Samsung Galaxy S20 Ultra | &check; | &check; | &check; | &check; | &check; | &check; | &check; | &check; | &check; | &check; | &check; | &check; |
| iPad Air | &check; | &check; | &check; | &check; | &check; | &check; | &check; | &check; | &check; | &check; | &check; | &check; |
| iPad Mini | &check; | &check; | &check; | &check; | &check; | &check; | &check; | &check; | &check; | &check; | &check; | &check; |
| Surface Pro 7 | &check; | &check; | &check; | &check; | &check; | &check; | &check; | &check; | &check; | &check; | &check; | &check; |
| Samsung Galaxy A51/71 | &check; | &check; | &check; | &check; | &check; | &check; | &check; | &check; | &check; | &check; | &check; | &check; |
| Nest Hub | &check; | &check; | &check; | &check; | &check; | &check; | &check; | &check; | &check; | &check; | &check; | &check; |
| Nest Hub Max | &check; | &check; | &check; | &check; | &check; | &check; | &check; | &check; | &check; | &check; | &check; | &check; |

<br><br>

# Lighthouse tests

Performance, Accessibility, Best Practices and SEO tests were carried out with [Google Dev Tools](https://developer.chrome.com/docs/devtools/)' **Lighthouse** tool in `Incognito` mode. Results are not 100% consistent, there is always a few percent variation at each performed test.

Results for mobile:
<br>

![Result-mobile](testing-images/lighthouse-mobile.jpeg)

The lower performance scores are caused by the Materialize library's loading time:

![performance-issue](testing-images/lighthouse-mobile-error.jpeg)

Results for desktop:
<br>

![Result-desktop](testing-images/lighthouse-desktop.jpeg)


---

<br><br>

# Bugs


Address label on google address autocomplete fields
- - -