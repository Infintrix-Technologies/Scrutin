import frappe


@frappe.whitelist()
def create_scrutin_candidate():
    assessment_to_assign = "0b1bdsk5tu"
    job_applicant_id = "salmansaeed7272@gmail.com"

    candidate = frappe.get_doc({
        "doctype": "Scrutin Candidate",
        "assessment": assessment_to_assign,
        "job_applicant": job_applicant_id
    })
    candidate.insert()
    frappe.db.commit()
    message = f"""
    Hello {job_applicant_id},

    Your scrutiny results are available at {frappe.utils.get_url()}/scrutin/candidacy/{assessment_to_assign}
    
    Best regards,
    Team
    """
    print(message)
    return {"message": message,"candidate": candidate}
    # return {"message": "Candidate created and email sent successfully.", "candidate": candidate}
