import frappe
from frappe.query_builder import DocType

@frappe.whitelist()
def get_specific_assessments():
    assessment = frappe.qb.DocType("Scrutin Assessment")
    ScrutinAssessment = DocType("Scrutin Assessment")
    ScrutinAssessmentTest = DocType("Scrutin Assessment Tests")


    query = (
        frappe.qb.from_(assessment)
        .select(assessment.language, assessment.company)
        .where(assessment.language == "en")
    )

    # query = (
    #     frappe.qb.from_(ScrutinAssessmentTest)
    #     .inner_join(ScrutinAssessment)
    #     .on(ScrutinAssessment.name == ScrutinAssessmentTest.parent)
    #     .select(
    #         ScrutinAssessment.name,            
    #         ScrutinAssessmentTest.test,        
    #         ScrutinAssessmentTest.weight       
    #     )
    # )

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