import frappe
from frappe import _
import datetime
from frappe.query_builder import DocType

# @frappe.whitelist(methods=["POST"])
# def create_candidate(assessment, job_applicant):
#     if not assessment or not job_applicant:
#         frappe.throw(_("Missing required fields: assessment or job_applicant"))

#     job_applicant_doc = frappe.get_doc("Job Applicant", job_applicant)

#     user = frappe.db.exists("User", {"email": job_applicant_doc.email_id})

#     generated_password = "Muufhuqiwe78r3458@"
#     if not user:
#         user = frappe.get_doc(
#             {
#                 "doctype": "User",
#                 "email": job_applicant_doc.email_id,
#                 "first_name": job_applicant_doc.applicant_name,
#                 "enabled": 1,
#                 "new_password": generated_password,
#             }
#         )
#         user.insert()
#         frappe.db.commit()
#         user_name = user.name
#     else:
#         user_name = user

#     existing_candidate = frappe.db.exists(
#         "Scrutin Candidate",
#         {"user": user_name, "assessment": assessment}
#     )

#     if existing_candidate:
#         existing_candidate_doc = frappe.get_doc("Scrutin Candidate", existing_candidate)
        
#         if existing_candidate_doc.status == job_applicant_doc.status:
#             return {"message": _("Candidate with the same email and status already exists."), "candidate": existing_candidate_doc}
    
#     scrutin_candidate = frappe.get_doc(
#         {
#             "doctype": "Scrutin Candidate",
#             "assessment": assessment,
#             "job_applicant": job_applicant,
#             "user": user_name,
#         }
#     )
#     scrutin_candidate.insert()
#     frappe.db.commit()

#     message = f"""
#     Hello {job_applicant_doc.applicant_name},

#     Your scrutin test is available at {frappe.utils.get_url()}/scrutin/candidacy/{scrutin_candidate.name}
    
#     Login with your email: {job_applicant_doc.email_id} and password: {generated_password}
    
#     Best regards,
#     Team
#     """

#     scrutin_candidate.invited_on = datetime.datetime.now()
#     scrutin_candidate.save()

#     try:
#         frappe.sendmail(
#             recipients=[job_applicant_doc.email_id],
#             subject="Invitation to Take Test Against your job application",
#             message=message,
#         )
#     except Exception as e:
#         frappe.log_error(frappe.get_traceback(), "Failed to send email to candidate")
    
#     return {"message": message, "candidate": scrutin_candidate}







# @frappe.whitelist()
# def create_candidate(assessment, job_applicant):
#     ScrutinAssessment = DocType("Scrutin Assessment")
#     JobApplicant = DocType("Job Applicant")
#     User = DocType("User")
#     ScrutinCandidate = DocType("Scrutin Candidate")


#     applicant_query = (
#         frappe.qb.from_(JobApplicant)
#         .select(JobApplicant.email_id,
#                 job_applicant.applicant_name,
#                 )
#         .where(JobApplicant.name == job_applicant)
#     )

#     applicant = applicant_query.run(as_dict=True)
#     generated_password = "user1234@"

#     (
#         frappe.qb.insert(User)
#         .into(User)
#         .values(
#             {
#                 "email": applicant.email_id,
#                 "first_name": applicant.applicant_name,
#                 "enabled": 1,
#                 "new_password": generated_password
#             }
#         )
#     )


#     (
#         frappe.qb.insert(ScrutinCandidate)
#         .into(ScrutinCandidate)
#         .values(
#             {
#                 "user": User.name,
#                 "assessment": assessment,
#                 "job_applicant": job_applicant,
#             }
#         )
#     )



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

    if existing_candidate:
        existing_candidate_doc = frappe.get_doc("Scrutin Candidate", existing_candidate[0]["name"])
        
        job_applicant_doc = frappe.get_doc("Job Applicant", job_applicant)
        if existing_candidate_doc.status == job_applicant_doc.status:
            return {"message": _("Candidate with the same email and status already exists."), "candidate": existing_candidate_doc}
    
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
    
    return {"message": message, "candidate": scrutin_candidate}




