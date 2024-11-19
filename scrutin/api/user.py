import frappe
from frappe.query_builder import DocType


@frappe.whitelist()
def get_logged_user():
    
    return frappe.session.user


@frappe.whitelist()
def get_user_candidates():
    user = DocType("User")
    candidate = DocType("Scrutin Candidate")

    query = (
        frappe.qb.from_(candidate)
        .join(user)
        .on(candidate.user == user.email) 
        .select(candidate.name, candidate.job_applicant)
    )

    return query.run(as_dict=True)


from frappe.utils import random_string

@frappe.whitelist()
def create_user_from_job_applicant(email, first_name):
    if frappe.db.exists("User", {"email": email}):
        frappe.throw(f"User with email {email} already exists")
    
    # Generate a random password
    # password = random_string(10)
    user = frappe.get_doc({
        'doctype': 'User',
        'email': email,
        'first_name': first_name,
        'new_password': 'userpass123',
        'enabled': 1,
        'send_welcome_email': 1
    })
    user.insert(ignore_permissions=True)
    
    frappe.sendmail(
        recipients=email,
        subject="Your New User Account",
        message=f"Your account has been created. Your password is: {password}"
    )

    return user.name



