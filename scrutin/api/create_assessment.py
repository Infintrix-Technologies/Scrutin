import frappe
from frappe.query_builder import DocType

# @frappe.whitelist()
# def create_assessment(assessment_name):
#     doc = frappe.get_doc({
#         "doctype": "Scrutin Assessment",
#         "assessment_name": assessment_name,


#     })
#     doc.insert()
#     frappe.db.commit()

#     doc = frappe.get_doc ({
#         "doctype": "Scrutin Assessment Tests",
#         "parent": doc.name,
#         "parentfield": "assessment_tests",
#         "parenttype": "Scrutin Assessment",
#         "test": "o3dd6v8gc6",
#         "weight": 1
#     })
#     doc.insert()
#     frappe.db.commit()
#     return doc.name



@frappe.whitelist()
def create_assessment(assessment_name, company, designation, language, test_id):
    
    assessment = frappe.get_doc({
        "doctype": "Scrutin Assessment",
        "assessment_name": assessment_name,
        "company": company,
        "designation": designation,
        "language": language,
        "assessment_tests": [  
            {
                "test": test_id,
                "weight": 1
            },
        ]
    })
    assessment.insert()
    frappe.db.commit()

    return assessment.name






@frappe.whitelist()
def new_create_assessment(assessment_name, company, language, test_ids, designation=None):
    

    assessment_tests = []
    for test_id in test_ids:
        assessment_tests.append({
            "test": test_id,
            "weight": 1 
        })

    assessment = frappe.get_doc({
        "doctype": "Scrutin Assessment",
        "assessment_name": assessment_name,
        "company": company,
        "designation": designation,
        "language": language,
        "assessment_tests": assessment_tests
    })

    assessment.insert()
    frappe.db.commit()

    return assessment.name
