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
