import json
import frappe
from frappe.query_builder import DocType


#Scrutin_Test_Template to Scrutin_Test
# These both API are used to create a Scrutin Test doc by getting data from Scrutin Test Template
@frappe.whitelist()
def create_scrutin_test_from_template(template_id):
    
    template_data = get_scrutin_test_templete_data(template_id)
    
    if not template_data:
        frappe.throw(f"Template with id {template_id} not found.")
    
    template = template_data[0]
    
    scrutin_test = frappe.get_doc({
        "doctype": "Scrutin Test",
        "title": template['title'],
        "description": template['description'],
        "language": template['language'],
        "test_format": template['test_format'],
        "level": template['level'],
        "status": template['status']
    })
    scrutin_test.insert()
    
    test_questions = frappe.parse_json(template['test_questions'])['question_ids']
    
    for question_id in test_questions:
        scrutin_test_question = frappe.get_doc({
            "doctype": "Scrutin Test Question",
            "parent": scrutin_test.name,
            "parentfield": "test_questions", 
            "parenttype": "Scrutin Test",
            "question": question_id
        })
        scrutin_test_question.insert()
    
    return scrutin_test.name
@frappe.whitelist()
def get_scrutin_test_templete_data(template_id):
    ScrutinTestTemplate = DocType("Scrutin Test Template")

    template_query = (
        frappe.qb.from_(ScrutinTestTemplate)
        .select(ScrutinTestTemplate.name,
                ScrutinTestTemplate.title,
                ScrutinTestTemplate.description,
                ScrutinTestTemplate.language,
                ScrutinTestTemplate.status,
                ScrutinTestTemplate.level,
                ScrutinTestTemplate.test_format,
                ScrutinTestTemplate.test_questions)
        .where(ScrutinTestTemplate.name == template_id)
    )
    template_result = template_query.run(as_dict=True)
    return template_result




#Scrutin_Test to Scrutin_Test_Template
# These both API are used to create Scrutin Test Template by getting the data from Scrutin Test
@frappe.whitelist()
def create_test_template_from_test(test_id):
    test_details = get_test_details(test_id)
    if not test_details:
        frappe.throw("Test not found")
    
    # Extract the details from the test result
    test_data = test_details[0]
    
    # Collect question IDs
    question_ids = [q['question'] for q in test_details]
    test_questions_json = json.dumps({"question_ids": question_ids})
    
    # Create the new document in "Scrutin Test Template" DocType
    new_template = frappe.get_doc({
        "doctype": "Scrutin Test Template",
        "title": test_data['title'],
        "description": test_data['description'],
        "language": test_data['language'],
        "level": test_data['level'],
        "status": test_data['status'],
        "test_format": test_data['test_format'],
        "test_questions": test_questions_json
    })
    
    new_template.insert()
    frappe.db.commit()
    return new_template.name

def get_test_details(test_id):
    Test = DocType("Scrutin Test")
    TestQuestion = DocType("Scrutin Test Question")

    test_query = (
        frappe.qb.from_(Test)
        .inner_join(TestQuestion)
        .on(Test.name == TestQuestion.parent)
        .select(
            Test.name,
            Test.title,
            Test.description,
            Test.language,
            Test.level,
            Test.status,
            Test.test_format,
            TestQuestion.question
        )
        .where(Test.name == test_id)
    )
    test_result = test_query.run(as_dict=True)
    return test_result


