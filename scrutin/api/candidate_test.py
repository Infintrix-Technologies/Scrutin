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
def add_scrutin_test_progress(candidate_id, test_name, started_at):
    try:
        # Fetch the Scrutin Candidate document
        candidate = frappe.get_doc("Scrutin Candidate", candidate_id)
        
        # Add a new entry in the child table
        candidate.append("test_progress", {
            "test": test_name,
            "started_at": started_at or now(),
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


@frappe.whitelist()
def update_assessment_started_time(candidate_id):

    ScrutinCandidate = DocType("Scrutin Candidate")
    # Using Query Builder to update the document
    (
        frappe.qb.update(ScrutinCandidate)
        .set(ScrutinCandidate.assessment_started_at, now())
        .where(ScrutinCandidate.name == candidate_id)
    ).run()

@frappe.whitelist()
def update_assessment_completed_time(candidate_id):

    ScrutinCandidate = DocType("Scrutin Candidate")
    # Using Query Builder to update the document
    (
        frappe.qb.update(ScrutinCandidate)
        .set(ScrutinCandidate.assessment_completed_at, now())
        .where(ScrutinCandidate.name == candidate_id)
    ).run()



# This API Show Test Question One by One and also POST the Test and Question & Answer 
# into the candidate Responses if we change the answer then it will change the that question answer
# not make a new entry in the candidate Responses
@frappe.whitelist()
def get_question_with_answer_and_post_in_responses(candidate_id, current_test_index=0, current_question_index=0, selected_option=None):

    # Define DocTypes
    ScrutinAssessment = DocType("Scrutin Assessment")
    ScrutinAssessmentTest = DocType("Scrutin Assessment Tests")
    ScrutinTest = DocType("Scrutin Test")
    ScrutinTestQuestion = DocType("Scrutin Test Question")
    ScrutinQuestion = DocType("Scrutin Question")
    ScrutinQuestionOption = DocType("Scrutin Question Option")
    ScrutinCandidate = DocType("Scrutin Candidate")
    ScrutinTestProgress = DocType("Scrutin Test Progress")

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
        .select(ScrutinAssessmentTest.test, 
                ScrutinAssessmentTest.weight, 
                ScrutinTest.title
            )
        .where(ScrutinAssessment.name == assessment_name)
    )
    tests = tests_query.run(as_dict=True)

    if current_test_index >= len(tests):
        return {'message': 'No more tests available'}

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


    # If an option is selected, store it in the ScrutinQuestionResponse
    if selected_option:
        candidate = frappe.get_doc("Scrutin Candidate", candidate_id)
        existing_answer = None

        # Check if the answer for the current question already exists
        for answer in candidate.question_answers:
            if answer.question == current_question['question']:
                existing_answer = answer
                break

        if existing_answer:
            # Update the existing answer
            existing_answer.answer = selected_option
        else:
            # Add a new answer
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






# Function to get candidate's questions and their responses
@frappe.whitelist()
def get_candidate_questions_answer_responses(candidate_id):
    ScrutinCandidate = DocType("Scrutin Candidate")
    ScrutinQuestionResponse = DocType("Scrutin Question Responses")
    ScrutinQuestion = DocType("Scrutin Question")
    
    query = (
        frappe.qb.from_(ScrutinCandidate)
        .join(ScrutinQuestionResponse)
        .on(ScrutinCandidate.name == ScrutinQuestionResponse.parent)
        .join(ScrutinQuestion)
        .on(ScrutinQuestionResponse.question == ScrutinQuestion.name)
        .select(
            ScrutinQuestion.name.as_("question"),
            ScrutinQuestion.question.as_("question_content"),
            ScrutinQuestionResponse.answer,
        )
        .where(ScrutinCandidate.name == candidate_id)
    )
    results = query.run(as_dict=True)
    return results


@frappe.whitelist()
def are_all_questions_answered(test_name, candidate_id):

    ScrutinTest = DocType("Scrutin Test")
    ScrutinTestQuestion = DocType("Scrutin Test Question")
    ScrutinQuestion = DocType("Scrutin Question")

    question_query = (
        frappe.qb.from_(ScrutinTestQuestion)
        .inner_join(ScrutinTest)
        .on(ScrutinTest.name == ScrutinTestQuestion.parent)
        .inner_join(ScrutinQuestion)
        .on(ScrutinTestQuestion.question == ScrutinQuestion.name)
        .select(ScrutinTestQuestion.question)
        .where(ScrutinTest.name == test_name)
    )
    questions = question_query.run(as_dict=True)
    
    if not questions:
        return True  # No questions in the test
    
    responses = get_candidate_questions_answer_responses(candidate_id)
    answered_questions = {response['question'] for response in responses}
    
    for question in questions:
        if question['question'] not in answered_questions:
            return False
    
    return True





@frappe.whitelist()
def get_specific_test_details(test_id):
    ScrutinTest = DocType("Scrutin Test")
    ScrutinQuestion = DocType("Scrutin Question")
    ScrutinTestQuestion = DocType("Scrutin Test Question")

    question_query = (
        frappe.qb.from_(ScrutinTestQuestion)
        .inner_join(ScrutinTest)
        .on(ScrutinTest.name == ScrutinTestQuestion.parent)
        .inner_join(ScrutinQuestion)
        .on(ScrutinTestQuestion.question == ScrutinQuestion.name)
        .select(ScrutinTestQuestion.question)
        .where(ScrutinTest.name == test_id)
    )
    question_ids = question_query.run(as_dict=True)
    return question_ids




# this api give current question and next question update the started_at time when test start and also update the completed_at
# time when test is completed
@frappe.whitelist()
def get_current_question(candidate_id):
    # Define DocTypes
    ScrutinAssessment = DocType("Scrutin Assessment")
    ScrutinAssessmentTest = DocType("Scrutin Assessment Tests")
    ScrutinTest = DocType("Scrutin Test")
    ScrutinTestQuestion = DocType("Scrutin Test Question")
    ScrutinQuestion = DocType("Scrutin Question")
    ScrutinQuestionOption = DocType("Scrutin Question Option")
    ScrutinCandidate = DocType("Scrutin Candidate")
    ScrutinTestProgress = DocType("Scrutin Test Progress")

    # Function to check if a test has already started for the candidate
    def has_test_started(candidate_id, test_name):
        test_progress_query = (
            frappe.qb.from_(ScrutinTestProgress)
            .select(ScrutinTestProgress.name)
            .where(
                (ScrutinTestProgress.parent == candidate_id) &
                (ScrutinTestProgress.test == test_name)
            )
        )
        test_progress = test_progress_query.run(as_dict=True)
        return bool(test_progress)

    # Function to mark a test as completed
    def mark_test_completed(candidate_id, test_name):
        test_progress_query = (
            frappe.qb.from_(ScrutinTestProgress)
            .select(ScrutinTestProgress.name, ScrutinTestProgress.completed_at)
            .where(
                (ScrutinTestProgress.parent == candidate_id) &
                (ScrutinTestProgress.test == test_name)
            )
        )
        test_progress = test_progress_query.run(as_dict=True)
        if test_progress:
            progress_entry = test_progress[0]
            if not progress_entry['completed_at']:  # Only update if not already completed
                frappe.db.set_value(
                    "Scrutin Test Progress", progress_entry['name'], "completed_at", now()
                )
                frappe.db.commit()

    # Helper function to check if all questions of a test are answered
    def are_all_questions_answered(test_name, candidate_id):
        question_query = (
            frappe.qb.from_(ScrutinTestQuestion)
            .inner_join(ScrutinTest)
            .on(ScrutinTest.name == ScrutinTestQuestion.parent)
            .inner_join(ScrutinQuestion)
            .on(ScrutinTestQuestion.question == ScrutinQuestion.name)
            .select(ScrutinTestQuestion.question)
            .where(ScrutinTest.name == test_name)
        )
        questions = question_query.run(as_dict=True)
        
        if not questions:
            return True  # No questions in the test
        
        responses = get_candidate_questions_answer_responses(candidate_id)
        answered_questions = {response['question'] for response in responses}
        
        for question in questions:
            if question['question'] not in answered_questions:
                return False
        
        return True

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

    tests_query = (
        frappe.qb.from_(ScrutinAssessmentTest)
        .inner_join(ScrutinAssessment)
        .on(ScrutinAssessment.name == ScrutinAssessmentTest.parent)
        .inner_join(ScrutinTest)
        .on(ScrutinAssessmentTest.test == ScrutinTest.name)
        .select(
            ScrutinAssessmentTest.test,
            ScrutinTest.title  
        )
        .where(ScrutinAssessment.name == assessment_name)
    )
    tests = tests_query.run(as_dict=True)

    if not tests:
        return {
            'message': 'No tests available for the assessment'
        }

    current_test_index = 0
    while current_test_index < len(tests):
        current_test = tests[current_test_index]
        test_name = current_test['test']

        if not has_test_started(candidate_id, test_name):
            add_scrutin_test_progress(candidate_id, test_name, None)

        if are_all_questions_answered(test_name, candidate_id):
            mark_test_completed(candidate_id, test_name)
            current_test_index += 1
        else:
            break

    if current_test_index >= len(tests):
        return {
            'message': 'All tests are completed'
        }

    test_name = tests[current_test_index]['test']
    test_title = tests[current_test_index]['title']  

    question_query = (
        frappe.qb.from_(ScrutinTestQuestion)
        .inner_join(ScrutinTest)
        .on(ScrutinTest.name == ScrutinTestQuestion.parent)
        .inner_join(ScrutinQuestion)
        .on(ScrutinTestQuestion.question == ScrutinQuestion.name)
        .select(
            ScrutinTestQuestion.question,
            ScrutinQuestion.question.as_('question_text'),
            ScrutinQuestion.type.as_('question_type')
        )
        .where(ScrutinTest.name == test_name)
    )
    questions = question_query.run(as_dict=True)

    if not questions:
        return {
            'message': 'No questions available for the test'
        }

    responses = get_candidate_questions_answer_responses(candidate_id)
    answered_questions = {response['question'] for response in responses}

    current_question = None
    next_question = None

    for i, question in enumerate(questions):
        if question['question'] not in answered_questions:
            current_question = question
            if i + 1 < len(questions):
                next_question = questions[i + 1]['question']
            else:
                next_question = None
            break

    if not current_question:
        current_question = questions[0]
        next_question = questions[1]['question'] if len(questions) > 1 else None

    if next_question is None:
        next_test_index = current_test_index + 1
        if next_test_index < len(tests):
            next_test = tests[next_test_index]
            next_test_name = next_test['test']
            next_test_question_query = (
                frappe.qb.from_(ScrutinTestQuestion)
                .inner_join(ScrutinTest)
                .on(ScrutinTest.name == ScrutinTestQuestion.parent)
                .inner_join(ScrutinQuestion)
                .on(ScrutinTestQuestion.question == ScrutinQuestion.name)
                .select(ScrutinTestQuestion.question)
                .where(ScrutinTest.name == next_test_name)
            )
            next_test_questions = next_test_question_query.run(as_dict=True)
            if next_test_questions:
                next_question = next_test_questions[0]['question']
        else:
            next_question = None

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

    update_data = {
        'current_question': current_question['question'],
        'next_question': next_question
    }
    frappe.db.set_value("Scrutin Candidate", candidate_id, update_data)

    return {
        'test': {
            'test': {
                'name': current_test['test'],
                'title': test_title  
            },
            'current_question': {
                'name': current_question['question'],
                'text': current_question['question_text'],  
                'type': current_question['question_type'],
                'options': options
            },
            # 'next_question': next_question
        }
    }


# Function to add test progress
def add_scrutin_test_progress(candidate_id, test_name, started_at):
    try:
        # Fetch the Scrutin Candidate document
        candidate = frappe.get_doc("Scrutin Candidate", candidate_id)
        
        # Add a new entry in the child table
        candidate.append("test_progress", {
            "test": test_name,
            "started_at": started_at or now(),
        })

        # Save the document to commit the changes
        candidate.save()
        frappe.db.commit()
        return f"Test progress added successfully for candidate {candidate_id}"
    
    except Exception as e:
        frappe.db.rollback()
        return f"An error occurred: {e}"






@frappe.whitelist()
# def check_how_many_candidate_responses_are_correct(candidate_id):
#     ScrutinCandidate = DocType("Scrutin Candidate")
#     ScrutinQuestionResponse = DocType("Scrutin Question Responses") #response->question->answer
#     ScrutinQuestion = DocType("Scrutin Question") #question -> answer
    
#     query = (
#         frappe.qb.from_(ScrutinCandidate)
#         .join(ScrutinQuestionResponse)
#         .on(ScrutinCandidate.name == ScrutinQuestionResponse.parent)
#         .join(ScrutinQuestion)
#         .on(ScrutinQuestionResponse.question == ScrutinQuestion.name)
#         .select(
#             ScrutinQuestion.name.as_("question"),
#             ScrutinQuestion.question.as_("question_content"),
#             ScrutinQuestionResponse.answer.as_("candidate_answer"),
#             ScrutinQuestion.answer.as_("actual_answer")

#         )
#         .where(ScrutinCandidate.name == candidate_id)
#     )
#     results = query.run(as_dict=True)
#     return results

def check_how_many_candidate_responses_are_correct(candidate_id):
    ScrutinCandidate = DocType("Scrutin Candidate")
    ScrutinQuestionResponse = DocType("Scrutin Question Responses")  # response->question->answer
    ScrutinQuestion = DocType("Scrutin Question")  # question -> answer

    query = (
        frappe.qb.from_(ScrutinCandidate)
        .join(ScrutinQuestionResponse)
        .on(ScrutinCandidate.name == ScrutinQuestionResponse.parent)
        .join(ScrutinQuestion)
        .on(ScrutinQuestionResponse.question == ScrutinQuestion.name)
        .select(
            ScrutinQuestion.name.as_("question"),
            ScrutinQuestion.question.as_("question_content"),
            ScrutinQuestionResponse.answer.as_("candidate_answer"),
            ScrutinQuestion.answer.as_("actual_answer"),
        )
        .where(ScrutinCandidate.name == candidate_id)
    )
    results = query.run(as_dict=True)

    # Add comparison to check if answers match
    for result in results:
        result["is_correct"] = result["candidate_answer"] == result["actual_answer"]

    return results


