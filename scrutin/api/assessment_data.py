import frappe
from frappe.query_builder import DocType
from frappe.query_builder import functions as fn

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
def get_assessment_test_custom_question():

    doc = frappe.get_doc("Scrutin Assessment", "Python Assessment")

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

#this api give the candidate Job_applicant_name and Assessment_name
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
def get_assessment_language(candi):
    Assessment = DocType("Scrutin Assessment")
    Candidate = DocType("Scrutin Candidate")

    query = (
        frappe.qb.from_(Candidate)
        .inner_join(Assessment)
        .on(Assessment.name == Candidate.assessment)
        .select(Assessment.language)
        .where(Candidate.name == candi)
    )
    results = query.run(as_dict=True)
    return results



#this api will provide the specific assessment candidate and candidate name fetch from applicant_name
@frappe.whitelist()
def get_specific_assessment_candidate_name(assessment_name):

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
            ScrutinCandidate.job_applicant,
            ScrutinCandidate.status,
            ScrutinCandidate.invited_on,
            ScrutinAssessment.assessment_name,
            JobApplicant.applicant_name
        )
        .where(ScrutinCandidate.assessment == assessment_name)
    ).run(as_dict=True)

    return candidate_detail



# Function to get all tests of a specific Scrutin Assessment
@frappe.whitelist()
def get_tests_for_assessment(assessment_name):
    ScrutinAssessment = DocType("Scrutin Assessment")
    ScrutinAssessmentTest = DocType("Scrutin Assessment Tests")
    ScrutinTest = DocType("Scrutin Test")
    
    query = (
        frappe.qb.from_(ScrutinAssessmentTest)
        .inner_join(ScrutinAssessment)
        .on(ScrutinAssessment.name == ScrutinAssessmentTest.parent)
        .inner_join(ScrutinTest)
        .on(ScrutinAssessmentTest.test == ScrutinTest.title)
        .select(ScrutinAssessmentTest.test,
                ScrutinAssessmentTest.weight,
                ScrutinTest.title,
                ScrutinTest.duration,)
        .where(ScrutinAssessment.name == assessment_name)
    )
    result = query.run(as_dict=True)
    return result


#this api will provide the all custom questions that are associated with specific assessment
@frappe.whitelist()
def get_custom_questions_for_assessment(assessment_name):
    ScrutinAssessment = DocType("Scrutin Assessment")
    ScrutinAssessmentQuestion = DocType("Scrutin Assessment Questions")
    ScrutinQuestion = DocType("Scrutin Question")
    
    query = (
        frappe.qb.from_(ScrutinAssessmentQuestion)
        .inner_join(ScrutinAssessment)
        .on(ScrutinAssessment.name == ScrutinAssessmentQuestion.parent)
        .inner_join(ScrutinQuestion)
        .on(ScrutinAssessmentQuestion.question == ScrutinQuestion.name)
        .select(ScrutinAssessmentQuestion.question, 
                ScrutinQuestion.question,
                ScrutinQuestion.type)
        .where(ScrutinAssessment.name == assessment_name)
    )
    result = query.run(as_dict=True)
    return result




#get all questions of specific test
@frappe.whitelist()
def get_questions_for_test(test_name):
    ScrutinTest = DocType("Scrutin Test")
    ScrutinTestQuestion = DocType("Scrutin Test Question")
    ScrutinQuestion = DocType("Scrutin Question")
    
    query = (
        frappe.qb.from_(ScrutinTestQuestion)
        .inner_join(ScrutinTest)
        .on(ScrutinTest.name == ScrutinTestQuestion.parent)
        .inner_join(ScrutinQuestion)
        .on(ScrutinTestQuestion.question == ScrutinQuestion.name)
        .select(ScrutinTestQuestion.question, 
                ScrutinQuestion.question,
                ScrutinQuestion.type,
                ScrutinQuestion.duration)
        .where(ScrutinTest.name == test_name)
    )
    result = query.run(as_dict=True)
    return result



@frappe.whitelist()
def get_total_duration_for_test(test_name):
    ScrutinTest = DocType("Scrutin Test")
    ScrutinTestQuestion = DocType("Scrutin Test Question")
    ScrutinQuestion = DocType("Scrutin Question")
    
    query = (
        frappe.qb.from_(ScrutinTestQuestion)
        .inner_join(ScrutinTest)
        .on(ScrutinTest.name == ScrutinTestQuestion.parent)
        .inner_join(ScrutinQuestion)
        .on(ScrutinTestQuestion.question == ScrutinQuestion.name)
        .select(fn.Sum(ScrutinQuestion.duration).as_("total_duration"))
        .where(ScrutinTest.name == test_name)
    )
    result = query.run(as_dict=True)
    return result[0]['total_duration'] if result else 0