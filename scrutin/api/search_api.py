import frappe
from frappe.query_builder import DocType
from frappe.query_builder import functions as fn




@frappe.whitelist()
def candidate_list_api(assessment_id=None, test_id=None):
    ScrutinCandidate = DocType("Scrutin Candidate")
    ScrutinAssessment = DocType("Scrutin Assessment")
    JobApplicant = DocType("Job Applicant")
    ScrutinTest = DocType("Scrutin Test")
    ScrutinAssessmentTest = DocType("Scrutin Assessment Tests")

    # Create the base query
    query = (
        frappe.qb.from_(ScrutinCandidate)
        .left_join(ScrutinAssessment)
        .on(ScrutinAssessment.name == ScrutinCandidate.assessment)
        .left_join(JobApplicant)
        .on(JobApplicant.name == ScrutinCandidate.job_applicant)
        .select(
            ScrutinCandidate.name.as_("candidate_id"),
            ScrutinAssessment.assessment_name,
            ScrutinCandidate.assessment,
            JobApplicant.applicant_name,
            ScrutinCandidate.job_applicant,
            fn.Count(ScrutinCandidate.job_applicant).as_("Assessments"),
            ScrutinCandidate.invited_on,
        )
        .groupby(ScrutinCandidate.job_applicant)
    )

    # Add a filter if assessment_id is provided
    if assessment_id:
        query = query.where(ScrutinCandidate.assessment == assessment_id)

    # Add a filter if test_id is provided
    if test_id:
        query = query.left_join(ScrutinAssessmentTest).on(ScrutinAssessmentTest.parent == ScrutinAssessment.name)
        query = query.left_join(ScrutinTest).on(ScrutinAssessmentTest.test == ScrutinTest.name)
        query = query.where(ScrutinTest.name == test_id)

    candidate_detail = query.run(as_dict=True)

    return candidate_detail





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




@frappe.whitelist()
def search_candidate_based_on_test(test_id):
    ScrutinTest = DocType("Scrutin Test")
    ScrutinAssessment = DocType("Scrutin Assessment")
    ScrutinAssessmentTest = DocType("Scrutin Assessment Tests")
    ScrutinCandidate = DocType("Scrutin Candidate")

    test_id_query = (
        frappe.qb.from_(ScrutinAssessmentTest)
        .inner_join(ScrutinTest)
        .on(ScrutinAssessmentTest.test == ScrutinTest.name)
        .inner_join(ScrutinAssessment)
        .on(ScrutinAssessment.name == ScrutinAssessmentTest.parent)
        .inner_join(ScrutinCandidate)
        .on(ScrutinCandidate.assessment == ScrutinAssessment.name)
        .select(ScrutinAssessment.assessment_name,
                ScrutinCandidate.job_applicant)
        .where(ScrutinTest.name == test_id)
    )
    test_id_list = test_id_query.run(as_dict=True)
    return test_id_list


