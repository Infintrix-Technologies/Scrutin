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
    candidate_detail = frappe.db.sql("""
        SELECT 
            sc.name AS candidate_name,
            sa.assessment_name,
            ja.applicant_name
        FROM 
            `tabScrutin Candidate` sc
        LEFT JOIN 
            `tabScrutin Assessment` sa ON sc.assessment = sa.name
        LEFT JOIN 
            `tabJob Applicant` ja ON sc.job_applicant = ja.name
    """, as_dict=True)

    return candidate_detail


@frappe.whitelist()

# def get_assessment_candidate():
    # assessment_candidate = frappe.db.sql("""
    #     SELECT 
    #         sc.job_applicant AS candidate_email,
    #         sc.assessment
    #     FROM 
    #         `tabScrutin Candidate` sc
    #     WHERE 
    #         sc.assessment IN (
    #             SELECT 
    #                 assessment
    #             FROM 
    #                 `tabScrutin Candidate`
    #             GROUP BY 
    #                 assessment
    #             HAVING 
    #                 COUNT(job_applicant) > 1
    #         )
    #     ORDER BY 
    #         sc.assessment, sc.job_applicant;
    # """, as_dict=True)
    
    # return assessment_candidate




# def get_assessment_candidate():
#     assessment_candidate = frappe.db.sql("""
#         SELECT 
#             sc1.job_applicant as candidate_email,
#             sc1.assessment
#         FROM 
#             `tabScrutin Candidate` sc1
#         WHERE 
#             EXISTS (
#                 SELECT 1
#                 FROM `tabScrutin Candidate` sc2
#                 WHERE sc1.assessment = sc2.assessment
#                 AND sc1.job_applicant != sc2.job_applicant
#             )
#         ORDER BY 
#             sc1.assessment, sc1.job_applicant;
#     """, as_dict=True)
    
#     return assessment_candidate



def get_assessment_candidate(assessment):
    assessment_candidate = frappe.db.sql("""
        SELECT 
            sc1.job_applicant AS candidate_email,
            sc1.assessment
        FROM 
            `tabScrutin Candidate` sc1
        WHERE 
            sc1.assessment = %(assessment)s
            AND EXISTS (
                SELECT 1
                FROM `tabScrutin Candidate` sc2
                WHERE sc1.assessment = sc2.assessment
                AND sc1.job_applicant != sc2.job_applicant
            )
        ORDER BY 
            sc1.assessment, sc1.job_applicant;
    """, {'assessment': assessment}, as_dict=True)
    
    return assessment_candidate


@frappe.whitelist()
def specific_assessment_candidates(assessmnt):
    assessment = DocType("Scrutin Assessment")
    candidate = DocType("Scrutin Candidate")

    query = (
        frappe.qb.from_(assessment)
        .join(candidate).on(candidate.assessment == assessmnt)
        .select(candidate.job_applicant, candidate.assessment)
    )
    
    results = query.run(as_dict=True)

    return results
 