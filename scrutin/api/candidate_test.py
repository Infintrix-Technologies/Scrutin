import frappe 
from frappe.query_builder import DocType




@frappe.whitelist()
def get_question_with_navigation(candidate_id, current_test_index=0, current_question_index=4):
    
    try:
        current_test_index = int(current_test_index)
        current_question_index = int(current_question_index)
    except ValueError:
        frappe.throw("Invalid input: current_test_index and current_question_index must be integers.")

    # Define DocTypes
    ScrutinAssessment = DocType("Scrutin Assessment")
    ScrutinAssessmentTest = DocType("Scrutin Assessment Tests")
    ScrutinTest = DocType("Scrutin Test")
    ScrutinTestQuestion = DocType("Scrutin Test Question")
    ScrutinQuestion = DocType("Scrutin Question")
    ScrutinQuestionOption = DocType("Scrutin Question Option")
    ScrutinCandidate = DocType("Scrutin Candidate")

    # Query to get candidate's assessment
    query = (
        frappe.qb.from_(ScrutinCandidate)
        .select(ScrutinCandidate.assessment)
        .where(ScrutinCandidate.name == candidate_id)
    )
    candidate_assessments = query.run(as_dict=True) 
    if candidate_assessments:
        assessment_name = candidate_assessments[0].get('assessment')
    else:
        assessment_name = None

    if not assessment_name:
        return {
            'message': 'No assessment found for the candidate'
        }

    # Query to get tests related to the assessment
    tests_query = (
        frappe.qb.from_(ScrutinAssessmentTest)
        .inner_join(ScrutinAssessment)
        .on(ScrutinAssessment.name == ScrutinAssessmentTest.parent)
        .inner_join(ScrutinTest)
        .on(ScrutinAssessmentTest.test == ScrutinTest.name)
        .select(
            ScrutinAssessmentTest.test,
            ScrutinAssessmentTest.weight,
            ScrutinTest.title,
        )
        .where(ScrutinAssessment.name == assessment_name)
    )
    tests = tests_query.run(as_dict=True)

    if current_test_index >= len(tests):
        return {
            'message': 'No more tests available'
        }

    # Get the current test
    current_test = tests[current_test_index]
    test_name = current_test['test']

    # Query to get questions for the current test
    question_query = (
        frappe.qb.from_(ScrutinTestQuestion)
        .inner_join(ScrutinTest)
        .on(ScrutinTest.name == ScrutinTestQuestion.parent)
        .inner_join(ScrutinQuestion)
        .on(ScrutinTestQuestion.question == ScrutinQuestion.name)
        .select(ScrutinTestQuestion.question, 
                ScrutinQuestion.question.as_("question_text"),
                ScrutinQuestion.type,
                ScrutinQuestion.duration.as_("question_duration"))
        .where(ScrutinTest.name == test_name)
    )
    questions = question_query.run(as_dict=True)

    if current_question_index >= len(questions):
        # Move to the next test if the current test questions are exhausted
        current_test_index += 1
        current_question_index = 0

        if current_test_index >= len(tests):
            return {
                'message': 'No more questions available'
            }

        # Get the new current test
        current_test = tests[current_test_index]
        test_name = current_test['test']

        # Re-query for questions for the new current test
        question_query = (
            frappe.qb.from_(ScrutinTestQuestion)
            .inner_join(ScrutinTest)
            .on(ScrutinTest.name == ScrutinTestQuestion.parent)
            .inner_join(ScrutinQuestion)
            .on(ScrutinTestQuestion.question == ScrutinQuestion.name)
            .select(ScrutinTestQuestion.question, 
                    ScrutinQuestion.question.as_("question_text"),
                    ScrutinQuestion.type,
                    ScrutinQuestion.duration.as_("question_duration"))
            .where(ScrutinTest.name == test_name)
        )
        questions = question_query.run(as_dict=True)

    if current_question_index >= len(questions):
        return {
            'message': 'No more questions available'
        }

    # Get the current question
    current_question = questions[current_question_index]

    # Add options for the current question
    option_query = (
        frappe.qb.from_(ScrutinQuestionOption)
        .select(
            ScrutinQuestionOption.value,
            ScrutinQuestionOption.label
        )
        .where(ScrutinQuestionOption.parent == current_question['question'])
    )
    options = option_query.run(as_dict=True)
    current_question['options'] = options

    # Return the current test and question with their details
    return {
        'current_test_index': current_test_index,
        'current_question_index': current_question_index,
        'test': {
            'test': current_test['test'],
            'title': current_test['title'],
            'weight': current_test['weight'],
            'current_question': current_question,
        }
    }
