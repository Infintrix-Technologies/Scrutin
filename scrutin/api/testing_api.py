import frappe
from frappe.query_builder import DocType

# @frappe.whitelist()
# def get_test_details_with_options(test_id):
#     ScrutinTest = DocType("Scrutin Test")
#     ScrutinTestQuestion = DocType("Scrutin Test Question")
#     ScrutinQuestion = DocType("Scrutin Question")
#     ScrutinQuestionOption = DocType("Scrutin Question Option")

#     # Query to get test details
#     test_query = (
#         frappe.qb.from_(ScrutinTest)
#         .select(
#             ScrutinTest.name.as_("test_id"),
#             ScrutinTest.title,
#             ScrutinTest.description,
#             ScrutinTest.language,
#             ScrutinTest.level,
#             ScrutinTest.status,
#             ScrutinTest.test_format
#         )
#         .where(ScrutinTest.name == test_id)
#     )
#     test_details = test_query.run(as_dict=True)

#     if not test_details:
#         return {'error': 'Test not found'}

#     test_details = test_details[0]

#     # Query to get questions related to the test
#     question_query = (
#         frappe.qb.from_(ScrutinTestQuestion)
#         .inner_join(ScrutinQuestion)
#         .on(ScrutinTestQuestion.question == ScrutinQuestion.name)
#         .select(
#             ScrutinTestQuestion.question,
#             ScrutinQuestion.question.as_("question_text"),
#             ScrutinQuestion.name.as_("question_id"),
#             ScrutinQuestion.type,
#             ScrutinQuestion.answer,
#             ScrutinQuestion.duration.as_("question_duration")
#         )
#         .where(ScrutinTestQuestion.parent == test_id)
#     )
#     questions = question_query.run(as_dict=True)

#     for question in questions:
#         # Query to get options for each question
#         option_query = (
#             frappe.qb.from_(ScrutinQuestionOption)
#             .select(
#                 ScrutinQuestionOption.value,
#                 ScrutinQuestionOption.label
#             )
#             .where(ScrutinQuestionOption.parent == question['question'])
#         )
#         options = option_query.run(as_dict=True)
#         question['options'] = options

#     return {
#         'test_details': test_details,
#         'questions': questions
#     }











import json

def get_test_details_with_options(test_id):
    ScrutinTest = DocType("Scrutin Test")
    ScrutinTestQuestion = DocType("Scrutin Test Question")
    ScrutinQuestion = DocType("Scrutin Question")
    ScrutinQuestionOption = DocType("Scrutin Question Option")

    # Query to get test details
    test_query = (
        frappe.qb.from_(ScrutinTest)
        .select(
            ScrutinTest.name.as_("test_id"),
            ScrutinTest.title,
            ScrutinTest.description,
            ScrutinTest.language,
            ScrutinTest.level,
            ScrutinTest.status,
            ScrutinTest.test_format
        )
        .where(ScrutinTest.name == test_id)
    )
    test_details = test_query.run(as_dict=True)

    if not test_details:
        return {'error': 'Test not found'}

    test_details = test_details[0]

    # Query to get questions related to the test
    question_query = (
        frappe.qb.from_(ScrutinTestQuestion)
        .inner_join(ScrutinQuestion)
        .on(ScrutinTestQuestion.question == ScrutinQuestion.name)
        .select(
            ScrutinTestQuestion.question,
            ScrutinQuestion.question.as_("question_text"),
            ScrutinQuestion.name.as_("question_id"),
            ScrutinQuestion.type,
            ScrutinQuestion.answer,
            ScrutinQuestion.duration.as_("question_duration")
        )
        .where(ScrutinTestQuestion.parent == test_id)
    )
    questions = question_query.run(as_dict=True)

    for question in questions:
        # Query to get options for each question
        option_query = (
            frappe.qb.from_(ScrutinQuestionOption)
            .select(
                ScrutinQuestionOption.value,
                ScrutinQuestionOption.label
            )
            .where(ScrutinQuestionOption.parent == question['question'])
        )
        options = option_query.run(as_dict=True)
        question['options'] = options

    return {
        'test_details': test_details,
        'questions': questions
    }


@frappe.whitelist()
def create_test_template_from_test(test_id):
    # Get test details with options
    test_data = get_test_details_with_options(test_id)
    if 'error' in test_data:
        frappe.throw("Test not found")

    # Extract test details and questions
    test_details = test_data['test_details']
    questions = test_data['questions']
    
    # Convert questions to JSON format
    test_questions_json = json.dumps(questions)
    
    # Create the new document in "Scrutin Test Template" DocType
    new_template = frappe.get_doc({
        "doctype": "Scrutin Test Template",
        "title": test_details['title'],
        "description": test_details['description'],
        "language": test_details['language'],
        "level": test_details['level'],
        "status": test_details['status'],
        "test_format": test_details['test_format'],
        "test_questions": test_questions_json
    })
    
    new_template.insert()
    frappe.db.commit()
    return new_template.name
