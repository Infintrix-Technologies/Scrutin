import frappe
from frappe.query_builder import DocType


@frappe.whitelist()
def assessment_list():
    ScrutinAssessment = DocType("Scrutin Assessment")

    assessment_query = (
        frappe.qb.from_(ScrutinAssessment)
            .select(ScrutinAssessment.name,
                    ScrutinAssessment.assessment_name,
            )
    )

    assessment_list = assessment_query.run(as_dict=True)
    return assessment_list



@frappe.whitelist()
def candidates_of_selected_assessment(assessment_id):
    ScrutinAssessment = DocType("Scrutin Assessment")
    ScrutinCandidate = DocType("Scrutin Candidate")

    assessment_query = (
        frappe.qb.from_(ScrutinAssessment)
        .left_join(ScrutinCandidate)
        .on(ScrutinAssessment.name == ScrutinCandidate.assessment)
            .select(ScrutinAssessment.name,
                    ScrutinAssessment.assessment_name,
                    ScrutinCandidate.job_applicant
            )
            .where(ScrutinCandidate.assessment == assessment_id)
    )
    candidate_list = assessment_query.run(as_dict=True)
    return candidate_list



@frappe.whitelist()
def test_list():
    ScrutinTest = DocType("Scrutin Test")

    test_query = (
        frappe.qb.from_(ScrutinTest)
            .select(ScrutinTest.name,
                    ScrutinTest.title,
            )
    )

    test_list = test_query.run(as_dict=True)
    return test_list