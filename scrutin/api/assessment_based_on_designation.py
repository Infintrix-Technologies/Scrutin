import frappe
from frappe import _
from frappe.query_builder import DocType


@frappe.whitelist()
def get_assessment_based_on_designation(applicant_id):
    applicant = DocType("Job Applicant")
    job_opening = DocType("Job Opening")
    ScrutinAssessment = DocType("Scrutin Assessment")

    query = (
        frappe.qb.from_(job_opening)
        .join(applicant).on(job_opening.name == applicant.job_title)
        .join(ScrutinAssessment).on(ScrutinAssessment.designation == job_opening.designation)
        .select(
            job_opening.job_title,
            applicant.applicant_name,
            job_opening.designation,
            ScrutinAssessment.name.as_('assessment_name')
        )
        .where(applicant.name == applicant_id)
    )
    results = query.run(as_dict=True)
    return results
