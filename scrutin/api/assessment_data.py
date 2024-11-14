import frappe
from frappe.query_builder import DocType

@frappe.whitelist()
def get_specific_assessments():
    assessment = frappe.qb.DocType("Scrutin Assessment")
    ScrutinAssessment = DocType("Scrutin Assessment")
    ScrutinAssessmentTest = DocType("Scrutin Assessment Tests")


    # query = (
    #     frappe.qb.from_(assessment)
    #     .select(assessment.language, assessment.company)
    #     .where(assessment.language == "en")
    # )

    query = (
        frappe.qb.from_(ScrutinAssessmentTest)
        .inner_join(ScrutinAssessment)
        .on(ScrutinAssessment.name == ScrutinAssessmentTest.parent)
        .select(
            ScrutinAssessment.name,
            ScrutinAssessment.assessment_name,            
            ScrutinAssessmentTest.test,        
            ScrutinAssessmentTest.weight       
        )
    )

    results = query.run(as_dict=True)

    return results



# @frappe.whitelist()
# def get_assessment_name():
#     assessment = DocType("Scrutin Assessment")
#     candidate = DocType("Scrutin Candidate")



@frappe.whitelist()
def get_assessment_name():
    # Query to get assessment names that are present in both Scrutin Assessment and Scrutin Candidate
    assessment_names = frappe.db.sql("""
        SELECT sa.assessment_name
        FROM `tabScrutin Assessment` sa
        JOIN `tabScrutin Candidate` sc ON sa.name = sc.assessment
    """, as_dict=True)
    
    # Extract assessment names from the result
    assessment_names = [d.assessment_name for d in assessment_names]
    
    return assessment_names



@frappe.whitelist()
def get_assessment_test_custom_question():

    doc = frappe.get_doc("Scrutin Assessment", "0b1bdsk5tu")

    return doc



@frappe.whitelist()
def get_applicant_jobtitle():
    applicant = DocType("Job Applicant")
    job_title = DocType("Job Opening")

    query = (
        frappe.qb.from_(job_title)
        .join(applicant)
        .on(job_title.name == applicant.job_title)
        .select(
            job_title.job_title,
            applicant.applicant_name
        )
    )
    results = query.run(as_dict=True)

    return results

    
@frappe.whitelist()

def get_applicant_name_assessment_name_for_candidate():

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
            ScrutinCandidate.name.as_("candidate_name"),
            ScrutinAssessment.assessment_name,
            JobApplicant.applicant_name,
        )
    ).run(as_dict=True)

    return candidate_detail




@frappe.whitelist()

def specific_assessment_candidates(assessmnt):
    assessment = DocType("Scrutin Assessment")
    candidate = DocType("Scrutin Candidate")

    query = (
        frappe.qb.from_(assessment)
        .join(candidate).on(candidate.assessment == assessment.name)
        .select(candidate.job_applicant, candidate.assessment)
        .where(assessment.name == assessmnt)
    )
    
    results = query.run(as_dict=True)

    return results


# def specific_assessment_candidates(assessmnt):
#     assessment = DocType("Scrutin Assessment")
#     candidate = DocType("Scrutin Candidate")

#     query = (
#         frappe.qb.from_(assessment)
#         .join(candidate).on(candidate.assessment == assessmnt)
#         .select(candidate.job_applicant, candidate.assessment)
#     )
    
#     results = query.run(as_dict=True)

#     return results

 