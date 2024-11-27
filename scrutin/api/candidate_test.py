import frappe 
from frappe.query_builder import DocType
from frappe.utils import now



# This API is Show the Test Question One by One on test page
@frappe.whitelist()
def get_question_with_navigation(candidate_id, current_test_index=0, current_question_index=0):

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





# This API is used to POST data into Scrutin Test Progress child Table
@frappe.whitelist(allow_guest=True)
def add_scrutin_test_progress(candidate_id, test_id, started_at=None, completed_at=None):
    try:
        # Fetch the Scrutin Candidate document
        candidate = frappe.get_doc("Scrutin Candidate", candidate_id)
        
        # Add a new entry in the child table
        candidate.append("test_progress", {
            "test": test_id,
            "started_at": started_at or now(),
            "completed_at": completed_at or now(),
        })

        # Save the document to commit the changes
        candidate.save()
        frappe.db.commit()
        return f"Test progress added successfully for candidate {candidate_id}"
    
    except Exception as e:
        frappe.db.rollback()
        return f"An error occurred: {e}"



# POST Question & Answer in the Candidate Response
@frappe.whitelist(allow_guest=True)
def add_scrutin_question_response(candidate_id, question_id, answer):
    try:
    
        candidate = frappe.get_doc("Scrutin Candidate", candidate_id)
        
        # Add a new entry in the child table
        candidate.append("question_answers", {
            "question": question_id,
            "answer": answer,
        })

        candidate.save()
        frappe.db.commit()
        return f"Question Response added successfully for candidate {candidate_id}"
    
    except Exception as e:
        frappe.db.rollback()
        return f"An error occurred: {e}"
    




# This API Show Test Question One by One and also POST the Test and Question & Answer 
# into the candidate Responses
@frappe.whitelist()
def get_question_with_answer_and_post_in_responses(candidate_id, current_test_index=0, current_question_index=0, selected_option=None):
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
    ScrutinTestProgress = DocType("Scrutin Test Progress")
    ScrutinQuestionResponse = DocType("Scrutin Question Response")

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
        return {'message': 'No assessment found for the candidate'}

    # Query to get tests related to the assessment
    tests_query = (
        frappe.qb.from_(ScrutinAssessmentTest)
        .inner_join(ScrutinAssessment)
        .on(ScrutinAssessment.name == ScrutinAssessmentTest.parent)
        .inner_join(ScrutinTest)
        .on(ScrutinAssessmentTest.test == ScrutinTest.name)
        .select(ScrutinAssessmentTest.test, ScrutinAssessmentTest.weight, ScrutinTest.title)
        .where(ScrutinAssessment.name == assessment_name)
    )
    tests = tests_query.run(as_dict=True)

    if current_test_index >= len(tests):
        return {'message': 'No more tests available'}

    # Get the current test
    current_test = tests[current_test_index]
    test_name = current_test['test']

    # Check if the test has already been logged in the ScrutinTestProgress (store test only once)
    test_progress_query = (
        frappe.qb.from_(ScrutinTestProgress)
        .select(ScrutinTestProgress.test)
        # .where(ScrutinTestProgress.candidate == candidate_id)
        .where(ScrutinTestProgress.test == test_name)
    )
    test_progress = test_progress_query.run(as_dict=True)
    if not test_progress:
        # Add test progress if not already recorded
        candidate = frappe.get_doc("Scrutin Candidate", candidate_id)
        candidate.append("test_progress", {
            "test": test_name,
            "started_at": now(),
        })
        candidate.save()
        frappe.db.commit()

    # Query to get questions for the current test
    question_query = (
        frappe.qb.from_(ScrutinTestQuestion)
        .inner_join(ScrutinTest)
        .on(ScrutinTest.name == ScrutinTestQuestion.parent)
        .inner_join(ScrutinQuestion)
        .on(ScrutinTestQuestion.question == ScrutinQuestion.name)
        .select(ScrutinTestQuestion.question, ScrutinQuestion.question.as_("question_text"),
                ScrutinQuestion.type, ScrutinQuestion.duration.as_("question_duration"))
        .where(ScrutinTest.name == test_name)
    )
    questions = question_query.run(as_dict=True)

    if current_question_index >= len(questions):
        # Move to the next test if the current test questions are exhausted
        current_test_index += 1
        current_question_index = 0

        if current_test_index >= len(tests):
            return {'message': 'No more questions available'}

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
            .select(ScrutinTestQuestion.question, ScrutinQuestion.question.as_("question_text"),
                    ScrutinQuestion.type, ScrutinQuestion.duration.as_("question_duration"))
            .where(ScrutinTest.name == test_name)
        )
        questions = question_query.run(as_dict=True)

    if current_question_index >= len(questions):
        return {'message': 'No more questions available'}

    # Get the current question
    current_question = questions[current_question_index]

    # If an option is selected, store it in the ScrutinQuestionResponse
    if selected_option:
        option_query = (
            frappe.qb.from_(ScrutinQuestionOption)
            .select(ScrutinQuestionOption.value)
            .where(ScrutinQuestionOption.parent == current_question['question'])
            .where(ScrutinQuestionOption.value == selected_option)
        )
        option = option_query.run(as_dict=True)
        if option:
            # Save the selected answer
            candidate = frappe.get_doc("Scrutin Candidate", candidate_id)
            candidate.append("question_answers", {
                "question": current_question['question'],
                "answer": selected_option,
            })
            candidate.save()
            frappe.db.commit()

    # Add options for the current question
    option_query = (
        frappe.qb.from_(ScrutinQuestionOption)
        .select(ScrutinQuestionOption.value, ScrutinQuestionOption.label)
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





