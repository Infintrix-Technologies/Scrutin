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
    
    if test_title:
        query = query.where(ScrutinTest.title.like(f"%{test_title}%"))
    
    results = query.run(as_dict=True)
    return results

def search_test(self, text, limit=20):
    tests = tests_list_page_api(test_title=text)
    
    if limit:
        tests = tests[:limit]
    
    return tests





@frappe.whitelist()
def get_test_questions(test_id):
    ScrutinQuestion = DocType("Scrutin Question")
    ScrutinTestQuestion = DocType("Scrutin Test Question")
    ScrutinTest = DocType("Scrutin Test")
    ScrutinQuestionOption = DocType("Scrutin Question Option")

    # Query to fetch questions with test info
    question_query = (
        frappe.qb.from_(ScrutinTestQuestion)
        .inner_join(ScrutinTest)
        .on(ScrutinTest.name == ScrutinTestQuestion.parent)
        .inner_join(ScrutinQuestion)
        .on(ScrutinTestQuestion.question == ScrutinQuestion.name)
        .select(
            ScrutinTestQuestion.question,
            ScrutinQuestion.question.as_("question_text"),
            ScrutinQuestion.type,
            ScrutinTest.title.as_("test_title"),
            ScrutinQuestion.duration.as_("question_duration"),
            ScrutinQuestion.answer.as_("answer"),
        )
        .where(ScrutinTest.name == test_id)
    )

    results = question_query.run(as_dict=True)

    if not results:
        return {"test_title": "", "questions": []}

    test_title = results[0]["test_title"]

    # Strip test_title and fetch options for each question
    for question in results:
        question.pop("test_title", None)

        # Fetch options for the current question
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
        "test_title": test_title,
        "questions": results
    }


@frappe.whitelist()
def create_scrutin_test_template():
    doc = frappe.get_doc({
        "doctype": "Scrutin Test Template",
        "title": "Sample Test",
        "language": "en",
        "level": "Beginner",
        "test_format": "Multiple-choice",
        "status": "Draft",
        "test_questions": json.dumps(
        [
    {
        "question_text": "<div class=\"ql-editor read-mode\"><p>Which tool in Adobe Photoshop is used to remove blemishes and imperfections from an image?</p></div>",
        "type": "Single Choice",
        "answer": "2",
        "question_duration": 60.0,
        "options": [
            {
                "value": "1",
                "label": "Clone Stamp Tool"
            },
            {
                "value": "2",
                "label": "Healing Brush Tool"
            },
            {
                "value": "3",
                "label": "Magic Wand Tool"
            },
            {
                "value": "4",
                "label": "Lasso Tool"
            }
        ]
    },
    {
        "question_text": "<div class=\"ql-editor read-mode\"><p>What is the main function of the Pen Tool in Adobe Illustrator?</p></div>",
        "type": "Single Choice",
        "answer": "1",
        "question_duration": 60.0,
        "options": [
            {
                "value": "1",
                "label": "Creating vector paths and shapes"
            },
            {
                "value": "2",
                "label": "Filling shapes with color"
            },
            {
                "value": "3",
                "label": "Selecting areas of an image"
            },
            {
                "value": "4",
                "label": "Applying filters to images"
            }
        ]
    }
        ])
    })
    doc.insert()
    frappe.db.commit()
    print("Scrutin Test Template created successfully.")



