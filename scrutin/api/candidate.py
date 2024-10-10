import frappe
from frappe import _
import datetime
print("Password is:",frappe.generate_hash(length=12))
@frappe.whitelist()
def create_candidate():
    
    if frappe.local.request.method != "POST":
        frappe.throw(_("Only POST requests are allowed"), frappe.PermissionError)
        
        
    data = frappe.local.form_dict
    
    
    assessment_to_assign = data.get("assessment")
    job_applicant_id = data.get("job_applicant")
    
    
    
    
    if not assessment_to_assign or not job_applicant_id:
        frappe.throw(_("Missing required fields: assessment or job_applicant"))
        

    job_applicant_doc = frappe.get_doc('Job Applicant',job_applicant_id)
    
    user = frappe.db.exists("User", {"email": job_applicant_doc.name})
    
    
    
    
    
    # generated_password = frappe.generate_hash(length=12)
    generated_password = "Muufhuqiwe78r3458@"
    if not user:
        user = frappe.get_doc({
            "doctype": "User",
            "email": job_applicant_doc.email_id,
            "first_name": job_applicant_doc.applicant_name,
            "enabled": 1,
            "new_password": generated_password
            # "roles": [{"role": role}]
        })
        user.insert()
        frappe.db.commit()
        user_name  = user.name
    else:
        user_name  = user

        
    scrutin_candidate = frappe.get_doc({
        "doctype": "Scrutin Candidate",
        "assessment": assessment_to_assign,
        "job_applicant": job_applicant_id,
        "user": user_name
    })
    scrutin_candidate.insert()
    frappe.db.commit()
        
    
    message = f"""
    Hello {job_applicant_doc.applicant_name},

    Your scrutin test is available at {frappe.utils.get_url()}/scrutin/candidacy/{scrutin_candidate.name}
    
    Login with your email and password: {generated_password}
    
    Best regards,
    Team
    """
    print(message)
    
    scrutin_candidate.invited_on = datetime.datetime.now()
    scrutin_candidate.save()
    
    try:
    
        frappe.sendmail(recipients=[job_applicant_doc.email_id], subject="Invitate to Take Test Against your job application", message=message)
        
    except Exception as e:
        frappe.log_error(frappe.get_traceback(), "Failed to send email to candidate")
        # frappe.throw(f"Email sending failed: {str(e)}")
    return {"message": message,"candidate": scrutin_candidate}
