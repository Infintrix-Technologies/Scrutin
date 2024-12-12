import frappe
from frappe.query_builder import DocType


# @frappe.whitelist()
# def get_test_templete_data(template_id):
#     TestTemplate = DocType("Test Template")

#     template_query = (
#         frappe.qb.from_(TestTemplate)
#         .select(TestTemplate.name,
#                 TestTemplate.title,
#                 TestTemplate.description,
#                 TestTemplate.language,
#                 TestTemplate.test_questions)
#         .where(TestTemplate.name == template_id)
#     )
#     template_result = template_query.run(as_dict=True)
#     return template_result


@frappe.whitelist()
def get_test_details(test_id):
    Test = DocType("Scrutin Test")
    TestQuestion = DocType("Scrutin Test Question")

    test_query = (
        frappe.qb.from_(Test)
        .inner_join(TestQuestion)
        .on(Test.name == TestQuestion.parent)
        .select(Test.name,
                Test.title,
                Test.description,
                Test.language,
                TestQuestion.question)
        .where(Test.name == test_id)
    )
    test_result = test_query.run(as_dict=True)
    return test_result















@frappe.whitelist()
def create_scrutin_test_from_template(template_id):
    # Retrieve template data
    template_data = get_test_templete_data(template_id)
    
    if not template_data:
        frappe.throw(f"Template with id {template_id} not found.")
    
    template = template_data[0]
    
    # Create new Scrutin Test
    scrutin_test = frappe.get_doc({
        "doctype": "Scrutin Test",
        "title": template['title'],
        "description": template['description'],
        "language": template['language']
    })
    scrutin_test.insert()
    
    # Parse test_questions JSON
    test_questions = frappe.parse_json(template['test_questions'])['question_ids']
    
    # Add each question to Scrutin Test Question doctype
    for question_id in test_questions:
        scrutin_test_question = frappe.get_doc({
            "doctype": "Scrutin Test Question",
            "parent": scrutin_test.name,
            "parentfield": "test_questions",  # This should be the field name in Scrutin Test
            "parenttype": "Scrutin Test",
            "question": question_id
        })
        scrutin_test_question.insert()
    
    # Return the created Scrutin Test name or details
    return scrutin_test.name

# Helper function to get template data
@frappe.whitelist()
def get_test_templete_data(template_id):
    TestTemplate = DocType("Test Template")

    template_query = (
        frappe.qb.from_(TestTemplate)
        .select(TestTemplate.name,
                TestTemplate.title,
                TestTemplate.description,
                TestTemplate.language,
                TestTemplate.test_questions)
        .where(TestTemplate.name == template_id)
    )
    template_result = template_query.run(as_dict=True)
    return template_result




