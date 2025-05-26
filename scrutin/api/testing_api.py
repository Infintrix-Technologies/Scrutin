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

