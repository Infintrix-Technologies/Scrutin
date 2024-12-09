import frappe
from frappe import _
import datetime

@frappe.whitelist(methods=["POST"])
def create_candidate(assessment, job_applicant):
    if not assessment or not job_applicant:
        frappe.throw(_("Missing required fields: assessment or job_applicant"))

    job_applicant_doc = frappe.get_doc("Job Applicant", job_applicant)

    # Check if user exists by email
    user = frappe.db.exists("User", {"email": job_applicant_doc.email_id})

    generated_password = "Muufhuqiwe78r3458@"
    if not user:
        user = frappe.get_doc(
            {
                "doctype": "User",
                "email": job_applicant_doc.email_id,
                "first_name": job_applicant_doc.applicant_name,
                "enabled": 1,
                "new_password": generated_password,
            }
        )
        user.insert()
        frappe.db.commit()
        user_name = user.name
    else:
        user_name = user

    existing_candidate = frappe.db.exists(
        "Scrutin Candidate",
        {"user": user_name, "assessment": assessment}
    )

    if existing_candidate:
        existing_candidate_doc = frappe.get_doc("Scrutin Candidate", existing_candidate)
        
        if existing_candidate_doc.status == job_applicant_doc.status:
            return {"message": _("Candidate with the same email and status already exists."), "candidate": existing_candidate_doc}
    
    scrutin_candidate = frappe.get_doc(
        {
            "doctype": "Scrutin Candidate",
            "assessment": assessment,
            "job_applicant": job_applicant,
            "user": user_name,
        }
    )
    scrutin_candidate.insert()
    frappe.db.commit()

    message = f"""
    Hello {job_applicant_doc.applicant_name},

    Your scrutin test is available at {frappe.utils.get_url()}/scrutin/candidacy/{scrutin_candidate.name}
    
    Login with your email: {job_applicant_doc.email_id} and password: {generated_password}
    
    Best regards,
    Team
    """

    scrutin_candidate.invited_on = datetime.datetime.now()
    scrutin_candidate.save()

    try:
        frappe.sendmail(
            recipients=[job_applicant_doc.email_id],
            subject="Invitation to Take Test Against your job application",
            message=message,
        )
    except Exception as e:
        frappe.log_error(frappe.get_traceback(), "Failed to send email to candidate")
    
    return {"message": message, "candidate": scrutin_candidate}







@frappe.whitelist()
def update_job_applicant_status(job_applicant):
    job_applicant_doc = frappe.get_doc("Job Applicant", job_applicant)
    job_applicant_doc.phone_number = "03001122334"
    job_applicant_doc.save()
    return {"message": f"Phone Number updated to {job_applicant_doc.phone_number}"}



# update the field of Scrutin Candidate #
@frappe.whitelist()
def update_candidate(assessment):
    scrutin_candidate_doc = frappe.get_doc("Scrutin Candidate", assessment)
    scrutin_candidate_doc.invite_accepted_on = datetime.datetime.now()
    scrutin_candidate_doc.status = "Accepted"
    scrutin_candidate_doc.save()
    return {"message": f"Invite Accepted On {scrutin_candidate_doc.invite_accepted_on} and Status is {scrutin_candidate_doc.status}"}

 
