import frappe
from frappe import _
import datetime
from frappe.query_builder import DocType


@frappe.whitelist()
def create_candidate(assessment, job_applicant):
    if not assessment or not job_applicant:
        frappe.throw(_("Missing required fields: assessment or job_applicant"))

    JobApplicant = DocType("Job Applicant")
    User = DocType("User")
    ScrutinCandidate = DocType("Scrutin Candidate")

    # Fetch job applicant details
    applicant_query = (
        frappe.qb.from_(JobApplicant)
        .select(JobApplicant.email_id, JobApplicant.applicant_name)
        .where(JobApplicant.name == job_applicant)
    )
    applicant = applicant_query.run(as_dict=True)
    if not applicant:
        frappe.throw(_("Job Applicant not found"))
    applicant = applicant[0]

    # Check if user exists
    user_query = (
        frappe.qb.from_(User)
        .select(User.name)
        .where(User.email == applicant["email_id"])
    )
    user = user_query.run(as_dict=True)

    generated_password = "Muufhuqiwe78r3458@"
    if not user:
        # Create new user
        user_doc = frappe.get_doc(
            {
                "doctype": "User",
                "email": applicant["email_id"],
                "first_name": applicant["applicant_name"],
                "enabled": 1,
                "new_password": generated_password,
            }
        )
        user_doc.insert()
        frappe.db.commit()
        user_name = user_doc.name
    else:
        user_name = user[0]["name"]

    # Check if a Scrutin Candidate already exists with the same email and assessment
    existing_candidate_query = (
        frappe.qb.from_(ScrutinCandidate)
        .select(ScrutinCandidate.name)
        .where(
            (ScrutinCandidate.user == user_name) &
            (ScrutinCandidate.status == "Open")
        )
    )
    existing_candidate = existing_candidate_query.run(as_dict=True)
    if existing_candidate and existing_candidate[0]["name"]:
        return {"message": _("Candidate with the same email and status already exists.")}
    
    # Create a new Scrutin Candidate
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
    Hello {applicant["applicant_name"]},

    Your scrutin test is available at {frappe.utils.get_url()}/scrutin/candidacy/{scrutin_candidate.name}
    
    Login with your email: {applicant["email_id"]} and password: {generated_password}
    
    Best regards,
    Team
    """

    scrutin_candidate.invited_on = datetime.datetime.now()
    scrutin_candidate.save()

    try:
        frappe.sendmail(
            recipients=[applicant["email_id"]],
            subject="Invitation to Take Test Against your job application",
            message=message,
        )
    except Exception as e:
        frappe.log_error(frappe.get_traceback(), "Failed to send email to candidate")
    
    return "Candidate Create Successfully"


