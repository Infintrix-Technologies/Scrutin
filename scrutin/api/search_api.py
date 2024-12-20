import frappe
from frappe.query_builder import DocType
from frappe.query_builder import functions as fn


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
def candidate_list_api(assessment_id):

    ScrutinCandidate = DocType("Scrutin Candidate")
    ScrutinAssessment = DocType("Scrutin Assessment")
    JobApplicant = DocType("Job Applicant")

    candidate_detail = (
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
        .where(ScrutinCandidate.assessment == assessment_id)
    ).run(as_dict=True)

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