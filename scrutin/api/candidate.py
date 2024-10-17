import frappe
from frappe import _
import datetime

print("Password is:", frappe.generate_hash(length=12))


@frappe.whitelist(methods=["POST"])
def create_candidate(assessment,job_applicant):
    
    if not assessment or not job_applicant:
        frappe.throw(_("Missing required fields: assessment or job_applicant"))

    session = {
        "data": {
            "user": "Administrator",
            "session_ip": "127.0.0.1",
            "last_updated": "2024-10-10 23:22:29.225111",
            "session_expiry": "170:00:00",
            "full_name": None,
            "user_type": "System User",
            "lang": "en",
            "csrf_token": "9258ce19825639be0b8b16ab400ee1a472a79c174617ac5b6957a072",
        },
        "user": "Administrator",
        "sid": "49ade8e9de339e0de331ce53edfb444e6537c1593586abca53311717",
    }

    # print(frappe.session)



    job_applicant_doc = frappe.get_doc("Job Applicant", job_applicant)

    user = frappe.db.exists("User", {"email": job_applicant_doc.name})

    # generated_password = frappe.generate_hash(length=12)
    generated_password = "Muufhuqiwe78r3458@"
    if not user:
        user = frappe.get_doc(
            {
                "doctype": "User",
                "email": job_applicant_doc.email_id,
                "first_name": job_applicant_doc.applicant_name,
                "enabled": 1,
                "new_password": generated_password,
                # "roles": [{"role": role}]
            }
        )
        user.insert()
        frappe.db.commit()
        user_name = user.name
    else:
        user_name = user

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
    
    Login with your email:{job_applicant} and password: {generated_password}
    
    Best regards,
    Team
    """
    print(message)

    scrutin_candidate.invited_on = datetime.datetime.now()
    scrutin_candidate.save()

    try:

        frappe.sendmail(
            recipients=[job_applicant_doc.email_id],
            subject="Invitate to Take Test Against your job application",
            message=message,
        )

    except Exception as e:
        frappe.log_error(frappe.get_traceback(), "Failed to send email to candidate")
        # frappe.throw(f"Email sending failed: {str(e)}")
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

 
