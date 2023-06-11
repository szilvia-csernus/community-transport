from datetime import datetime

registration_form_types = {
    "fullname": (str, None),
    "email": (str, None),
    "password": (str, None),
    "address": (str, None)
}

signin_form_types = {
    "email": (str, None),
    "password": (str, None)
}

edit_member_form_types = {
    "fullname": (str, None),
    "address": (str, None)
}

transport_request_form_types = {
    "date": (datetime, "%d %B, %Y"),
    "time": (datetime, "%I:%M %p"),
    "pickup_address": (str, None),
    "dropoff_address": (str, None)
}


def validate_form_data(form_data, form_type):
    """ Validate the form data according to specified form type. Return \
        boolean value alongside an error message if relevant."""

    if form_type == "register":
        required_fields = registration_form_types
    elif form_type == "signin":
        required_fields = signin_form_types
    elif form_type == "edit_member":
        required_fields = edit_member_form_types
    elif form_type == "transport_request":
        required_fields = transport_request_form_types
    else:
        return False, "Invalid form type."

    # Check each field in required_fields
    for field_name, (field_type, field_format) in required_fields.items():
        # Grab next value from form
        value = form_data.get(field_name)

        if field_type == datetime:
            try:
                datetime.strptime(value, field_format)
            except ValueError:
                return False, f"Invalid format for {field_name}, expected \
                    {field_format}, got {value} instead."
            
        # Check that value has correct data type
        elif not isinstance(value, field_type):
            # Return false and an error message if data type is incorrect
            return False, f"Invalid data type for '{field_name}'. Expected \
                '{field_type}', got '{type(value)}' instead."
    return True,"All form data is valid."
