# TESTING - Community Transport project 


## Validation

### Python Validation

| CI Python Linter Result | Passed |Warnings | 
| :--- | :---: | :--- | 
| [models.py file CI Linter Result](testing-images/python-models-py.jpeg) | &check; | |
| [routes.py file CI Linter Result](testing-images/python-routes-py.jpeg) | &check; | The Linter warnings refer to SQL Alchemy database queries that would not work with the suggested corrections.|


<br><br>

### JavaScript Validations

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

*  -
    - 



## Members' Goals

*  -
    - 

- - -
<br><br>

# Accessibility
<br>

* Chrome Dev Tools' Lighthouse score is 100% for accessibility for both mobile and desktop devices. 

<br>


<br><br>

# Manual Test Cases


| Test case code | load | click | type  | type  | select  | click  | click  | click  | click  |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | 
| 001 | &check; | &check; |  | &check; | | | | | &check; |
| 002 | | &check; |  | &check; | | | | &check; | &check; |
| 003 | | &check; |  | &check; | | | | &check; | &check; |
| 004 | | &check; |  | &check; | | | | &check; | &check; |
| 005 | | &check; |  | &check; | | &check; | | | |
| 006 | | &check; |  | | &check; | &check; | | | |
| 007 | | &check; | | | | &check; | | | | | | | | 
| 008 | | &check; | | | | | &check; | &check; | |
| 009 | &check; | &check; |  | | | | &check; | &check; | |
| 010 | &check; | &check; |  | |  &check; | | &check; | &check; | |

<br><br>

**"Expected look" definitions:**

a.  

b.  

c.  

d.  

e.  

f.  

g.  

h.  

i.  

j.  
<br><br>

**"Expected behaviour" definitions:**

a. 

b. 

c. 

d. 

e. 

f. 

g. 

h. 

i. 

j. 

k. 

l. 

<br><br>

Browser & Version: Chrome 111.0.5563.110 (Desktop)
<br>
| Test case | Expected look | Expected behaviour | Pass | Notes |
| :---: | :--- | :--- | :--- | :--- |
| 001 | a. i. c. e. g. | a. k. c. e. g. h. i. l. | &check; | |
| 002 | b. d. f. h. j. | b. d. f. g. h. i. j. l. | &check; | |
| 003 | b. d. f. h. j. | b. d. f. g. h. i. j. l. | &check; | |
| 004 | b. d. f. h. j. | b. d. f. g. h. i. j. l. | &check; | |
| 005 | b. d. f. | b. d. f. g. h. l. | &check; | |
| 006 | b. d. f. | b. d. f. g. h. l. | &check; | |
| 007 | b. d. | b. d. l. | &check; | |
| 008 | b. d. | b. d. j. k. | &check; | |
| 009 | b. d. f. | b. d. f. j. k. | &check; | |
| 010 | b. d. f. | b. d. f. g. h. j. k. | &check; | |


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