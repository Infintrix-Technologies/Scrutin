import frappe
from frappe import _
from frappe.query_builder import DocType


@frappe.whitelist()
def get_assessment_based_on_designation(applicant_id):
    applicant = DocType("Job Applicant")
    ScrutinAssessment = DocType("Scrutin Assessment")

    query = (
        frappe.qb.from_(applicant)
        .join(ScrutinAssessment).on(ScrutinAssessment.designation == applicant.designation)
        .select(
            applicant.applicant_name,
            applicant.designation,
            ScrutinAssessment.name.as_('assessment_name')
        )
        .where(applicant.name == applicant_id)
    )
    results = query.run(as_dict=True)
    return results
