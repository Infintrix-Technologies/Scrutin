import json
import frappe
from frappe.query_builder import DocType


#This API is used to add Tests in the Assessment when we create the assessment from frontend side
@frappe.whitelist()
def add_test_in_assessment(assessment_id, test_id):
    assessment_tests = [] 

    for test_id in test_id:
        assessment_test = frappe.get_doc({
            "doctype": "Scrutin Assessment Tests",
            "parent": assessment_id,
            "parentfield": "assessment_tests",
            "parenttype": "Scrutin Assessment",
            "test": test_id
        })
        assessment_test.insert()
        assessment_tests.append(assessment_test.name)  

    frappe.db.commit()  
    return assessment_tests  



@frappe.whitelist(allow_guest=True)
def get_test_list():
    tests = DocType("Scrutin Test")
    
    test_query = (
        frappe.qb.from_(tests)
        .select(tests.name, 
                tests.title,
                tests.level,
                tests.language,
                tests.test_format
                )
    )
    test_list = test_query.run(as_dict=True)
    return test_list









@frappe.whitelist()
def tests_list_page_api(test_title=None):
    ScrutinTest = DocType("Scrutin Test")
    ScrutinQuestion = DocType("Scrutin Question")
    
    # question_count = (
    #     frappe.qb.from_(ScrutinQuestion)
    #     .select(ScrutinCandidate.assessment, fn.Count('*').as_('candidate_count'))
    #     .groupby(ScrutinCandidate.assessment)
    # ).as_("candidate_count")
    
    query = (
        frappe.qb.from_(ScrutinTest)
        .select(
            ScrutinTest.name,
            ScrutinTest.title,
            ScrutinTest.level,
            ScrutinTest.language,
            ScrutinTest.test_format
        )
    )
    
    # Add a filter if assessment_name is provided
    if test_title:
        query = query.where(ScrutinTest.title.like(f"%{test_title}%"))
    
    results = query.run(as_dict=True)
    return results

def search_test(self, text, limit=20):
    # Use the assessment_list_page_api to get the filtered assessment list based on assessment_name
    tests = tests_list_page_api(test_title=text)
    
    # Apply limit if needed
    if limit:
        tests = tests[:limit]
    
    return tests
