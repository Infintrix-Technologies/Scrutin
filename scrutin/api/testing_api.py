import json
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











@frappe.whitelist()
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





@frappe.whitelist()
# def add_scrutin_question():
#     data = frappe.request.get_json()
    
#     for question_data in data['message']['questions']:
#         # Create a new Scrutin Question document
#         question = frappe.get_doc({
#             "doctype": "Scrutin Question",
#             "question": question_data['question_text'],
#             "type": question_data['type'],
#             "answer": question_data['answer'],
#             "duration": question_data['question_duration']
#         })
#         question.insert()

#         # Create options for the question
#         for option in question_data['options']:
#             option_doc = frappe.get_doc({
#                 "doctype": "Scrutin Question Option",
#                 "parent": question.name,
#                 "parentfield": "options",
#                 "parenttype": "Scrutin Question",
#                 "value": option['value'],
#                 "label": option['label']
#             })
#             option_doc.insert()

#     frappe.db.commit()
#     return {"status": "success", "message": "Questions added successfully"}




# @frappe.whitelist(allow_guest=True)
# def add_scrutin_question():
#     # Hardcoded JSON data
#     data = {
#         "message": {
#             "questions": [
#                 {
#                     "question_text": "<div class=\"ql-editor read-mode\"><p>How do you add a shadow to a box in CSS?</p></div>",
#                     "type": "Single Choice",
#                     "question_id": "1ter695312", 
#                     "answer": "1",
#                     "question_duration": 60.0,
#                     "options": [
#                         {
#                             "value": "2",
#                             "label": "shadow: 10px 10px 5px grey;"
#                         },
#                         {
#                             "value": "1",
#                             "label": "box-shadow: 10px 10px 5px grey;"
#                         },
#                         {
#                             "value": "4",
#                             "label": "shadow-box: 10px 10px 5px grey;"
#                         },
#                         {
#                             "value": "3",
#                             "label": "box-shadow: grey 10px 10px 5px;"
#                         }
#                     ]
#                 }
#             ]
#         }
#     }

#     for question_data in data['message']['questions']:
#         question_id = question_data.get('question_id')
        
#         if question_id and frappe.db.exists("Scrutin Question", question_id):
#             frappe.log_error(f"Question ID {question_id} already exists. Skipping.", "Duplicate Question ID")
#             continue  
        
#         question = frappe.get_doc({
#             "doctype": "Scrutin Question",
#             "question": question_data['question_text'],
#             "type": question_data['type'],
#             "answer": question_data['answer'],
#             "duration": question_data['question_duration']
#         })

#         for option in question_data['options']:
#             question.append("options", {
#                 "value": option['value'],
#                 "label": option['label']
#             })

#         question.insert()

#     frappe.db.commit()
#     return {"status": "success", "message": "Questions processed successfully"}










@frappe.whitelist()
def get_scrutin_questions(question_id):
    ScrutinQuestion = DocType("Scrutin Question")
    ScrutinQuestionOption = DocType("Scrutin Question Option")

    # Query to get the question details
    question_query = (
        frappe.qb.from_(ScrutinQuestion)
        .select(
            ScrutinQuestion.question.as_("question_text"),
            ScrutinQuestion.name.as_("question_id"),
            ScrutinQuestion.type,
            ScrutinQuestion.answer,
            ScrutinQuestion.duration.as_("question_duration")
        )
        .where(ScrutinQuestion.name == question_id)
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
            .where(ScrutinQuestionOption.parent == question['question_id'])
        )
        options = option_query.run(as_dict=True)
        question['options'] = options

    return {
        'questions': questions
    }




















@frappe.whitelist()
def create_scrutin_test_from_template(template_id):
    template_data = get_scrutin_test_template_data(template_id)

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

    test_questions = frappe.parse_json(template['test_questions'])

    for question_data in test_questions:
        question_id = question_data.get('question_id')
        
        if question_id and frappe.db.exists("Scrutin Question", question_id):
            existing_question = frappe.get_doc("Scrutin Question", question_id)
            if (
                existing_question.question == question_data['question_text'] and
                existing_question.type == question_data['type'] and
                existing_question.answer == question_data['answer'] and
                existing_question.duration == question_data['question_duration'] and
                all(opt['value'] == ex_opt.value and opt['label'] == ex_opt.label 
                    for opt, ex_opt in zip(question_data['options'], existing_question.options))
            ):
                # Question exists and matches, so do not add a new question
                pass
            else:
                # Question ID exists but does not match, so add a new question
                question_id = add_scrutin_question(question_data)
        else:
            # Question ID does not exist or is not given, so add a new question
            question_id = add_scrutin_question(question_data)
        
        scrutin_test_question = frappe.get_doc({
            "doctype": "Scrutin Test Question",
            "parent": scrutin_test.name,
            "parentfield": "test_questions",
            "parenttype": "Scrutin Test",
            "question": question_id
        })
        scrutin_test_question.insert()

    frappe.db.commit()
    return scrutin_test.name


def add_scrutin_question(question_data):
    question = frappe.get_doc({
        "doctype": "Scrutin Question",
        "question": question_data['question_text'],
        "type": question_data['type'],
        "answer": question_data['answer'],
        "duration": question_data['question_duration']
    })

    for option in question_data['options']:
        question.append("options", {
            "value": option['value'],
            "label": option['label']
        })

    question.insert()
    return question.name


@frappe.whitelist()
def get_scrutin_test_template_data(template_id):
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
