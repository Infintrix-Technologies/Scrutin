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

@frappe.whitelist()
def get_specific_candidate_detail():

    candidate_detail = frappe.get_doc("Scrutin Candidate", "j8kvgfi36d")

    return candidate_detail.as_dict()


@frappe.whitelist()
def get_assessment_test():
    assessment_test = frappe.get_doc("Scrutin Assessment", "vk1m38vch1")

    return assessment_test.as_dict()