import frappe 
from frappe.query_builder import DocType
from frappe.utils import now




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

    # Query to check if assessment_started_at is already set
    query = (
        frappe.qb.from_(ScrutinCandidate)
        .select(ScrutinCandidate.assessment_started_at)
        .where(ScrutinCandidate.name == candidate_id)
    )
    result = query.run(as_dict=True)

    if result and result[0].get('assessment_started_at'):
        # If assessment_started_at is already set, do not update it
        return {
            'message': 'Assessment started time is already set',
            'assessment_started_at': result[0].get('assessment_started_at')
        }
    
    # Using Query Builder to update the document if assessment_started_at is not set
    (
        frappe.qb.update(ScrutinCandidate)
        .set(ScrutinCandidate.assessment_started_at, now())
        .where(ScrutinCandidate.name == candidate_id)
    ).run()

    return {
        'message': 'Assessment started time updated',
        'assessment_started_at': now()
    }


def update_assessment_completed_time(candidate_id):
    ScrutinCandidate = DocType("Scrutin Candidate")

    # Query to check if assessment_completed_at is already set
    query = (
        frappe.qb.from_(ScrutinCandidate)
        .select(ScrutinCandidate.assessment_completed_at)
        .where(ScrutinCandidate.name == candidate_id)
    )
    result = query.run(as_dict=True)

    if result and result[0].get('assessment_completed_at'):
        # If assessment_completed_at is already set, do not update it
        return {
            'message': 'Assessment started time is already set',
            'assessment_completed_at': result[0].get('assessment_completed_at')
        }
    
    # Using Query Builder to update the document if assessment_completed_at is not set
    (
        frappe.qb.update(ScrutinCandidate)
        .set(ScrutinCandidate.assessment_completed_at, now())
        .where(ScrutinCandidate.name == candidate_id)
    ).run()

    return {
        'message': 'Assessment started time updated',
        'assessment_completed_at': now()
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


#This API tells how many test question are present in the candidate question responses
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




# this api give current question and next question update the started_at time when test start and also update the completed_at
# time when test is completed also tell which own is the last test question
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
            'message': 'All tests are completed',
            'completed': True
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
    last_test_question = False

    for i, question in enumerate(questions):
        if question['question'] not in answered_questions:
            current_question = question
            if i + 1 < len(questions):
                next_question = questions[i + 1]['question']
            else:
                next_question = None
                last_test_question = True  # This is the last question
            break

    if not current_question:
        current_question = questions[0]
        next_question = questions[1]['question'] if len(questions) > 1 else None

    if next_question is None and not last_test_question:
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
            'last_test_question': last_test_question
        }
    }




# This API check whick question is correct that candidate submit into the responses
@frappe.whitelist()
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



# This API gives specific assessment tests and their questions
@frappe.whitelist()
def get_candidate_assessment_test_and_question(candidate_id):
    ScrutinCandidate = DocType("Scrutin Candidate")
    ScrutinAssessment = DocType("Scrutin Assessment")
    ScrutinAssessmentTest = DocType("Scrutin Assessment Tests")
    ScrutinTest = DocType("Scrutin Test")
    ScrutinTestQuestion = DocType("Scrutin Test Question")
    ScrutinQuestion = DocType("Scrutin Question")
    
    assessment_query = (
        frappe.qb.from_(ScrutinCandidate)
        .inner_join(ScrutinAssessment)
        .on(ScrutinCandidate.assessment == ScrutinAssessment.name)
        .select(ScrutinAssessment.name.as_("assessment_name"))
        .where(ScrutinCandidate.name == candidate_id)
    )
    assessment = assessment_query.run(as_dict=True)

    if not assessment:
        frappe.throw(f"No assessment found for candidate ID {candidate_id}")
    
    assessment_name = assessment[0]['assessment_name']
    
    tests_query = (
        frappe.qb.from_(ScrutinAssessmentTest)
        .inner_join(ScrutinAssessment)
        .on(ScrutinAssessment.name == ScrutinAssessmentTest.parent)
        .inner_join(ScrutinTest)
        .on(ScrutinAssessmentTest.test == ScrutinTest.name)
        .select(
            ScrutinAssessmentTest.test,
            ScrutinTest.title,
        )
        .where(ScrutinAssessment.name == assessment_name)
    )
    tests = tests_query.run(as_dict=True)

    response = []

    for test in tests:
        test_name = test['test']
        
        question_query = (
            frappe.qb.from_(ScrutinTestQuestion)
            .inner_join(ScrutinTest)
            .on(ScrutinTest.name == ScrutinTestQuestion.parent)
            .inner_join(ScrutinQuestion)
            .on(ScrutinTestQuestion.question == ScrutinQuestion.name)
            .select(
                ScrutinTestQuestion.question, 
                ScrutinQuestion.question.as_("question_text"),
            )
            .where(ScrutinTest.name == test_name)
        )
        questions = question_query.run(as_dict=True)
    
        response.append({
            'test': test_name,
            'title': test['title'],
            'questions': questions,
        })
    
    return {
        'candidate_id': candidate_id,
        'assessment': assessment_name,
        'tests': response,
    }





# This API give the average of individual tests in a given assessment
@frappe.whitelist()
def get_candidate_assessment_performance(candidate_id):
    # Define DocTypes
    ScrutinCandidate = DocType("Scrutin Candidate")
    ScrutinAssessment = DocType("Scrutin Assessment")
    ScrutinAssessmentTest = DocType("Scrutin Assessment Tests")
    ScrutinTest = DocType("Scrutin Test")
    ScrutinTestQuestion = DocType("Scrutin Test Question")
    ScrutinQuestion = DocType("Scrutin Question")
    ScrutinQuestionResponse = DocType("Scrutin Question Responses")

    # Fetch the candidate's assessment
    assessment_query = (
        frappe.qb.from_(ScrutinCandidate)
        .inner_join(ScrutinAssessment)
        .on(ScrutinCandidate.assessment == ScrutinAssessment.name)
        .select(ScrutinAssessment.name.as_("assessment_name"))
        .where(ScrutinCandidate.name == candidate_id)
    )
    assessment = assessment_query.run(as_dict=True)

    if not assessment:
        frappe.throw(f"No assessment found for candidate ID {candidate_id}")

    assessment_name = assessment[0]["assessment_name"]

    # Fetch the tests associated with the assessment
    tests_query = (
        frappe.qb.from_(ScrutinAssessmentTest)
        .inner_join(ScrutinAssessment)
        .on(ScrutinAssessment.name == ScrutinAssessmentTest.parent)
        .inner_join(ScrutinTest)
        .on(ScrutinAssessmentTest.test == ScrutinTest.name)
        .select(
            ScrutinAssessmentTest.test.as_("test_name"),
            ScrutinTest.title.as_("test_title"),
        )
        .where(ScrutinAssessment.name == assessment_name)
    )
    tests = tests_query.run(as_dict=True)

    response = []

    for test in tests:
        test_name = test["test_name"]

        # Fetch questions and candidate's responses for the test
        question_query = (
            frappe.qb.from_(ScrutinTestQuestion)
            .inner_join(ScrutinTest)
            .on(ScrutinTest.name == ScrutinTestQuestion.parent)
            .inner_join(ScrutinQuestion)
            .on(ScrutinTestQuestion.question == ScrutinQuestion.name)
            .left_join(ScrutinQuestionResponse)
            .on(ScrutinQuestionResponse.question == ScrutinQuestion.name)
            .select(
                # ScrutinTestQuestion.question.as_("question_id"),
                # ScrutinQuestion.question.as_("question_text"),
                ScrutinQuestion.answer.as_("actual_answer"),
                ScrutinQuestionResponse.answer.as_("candidate_answer"),
            )
            .where((ScrutinTest.name == test_name) & (ScrutinQuestionResponse.parent == candidate_id))
        )
        questions = question_query.run(as_dict=True)

        # Check correctness and calculate statistics
        correct_count = 0
        for question in questions:
            question["is_correct"] = question["candidate_answer"] == question["actual_answer"]
            if question["is_correct"]:
                correct_count += 1

        total_questions = len(questions)
        accuracy = (correct_count / total_questions * 100) if total_questions else 0

        # Append test result to response
        response.append({
            "test_name": test_name,
            "test_title": test["test_title"],
            "questions": questions,
            "accuracy": accuracy,
            "total_questions": total_questions,
            "correct_count": correct_count,
            "incorrect_count": total_questions - correct_count
        })

    # Return the complete response
    return {
        "candidate_id": candidate_id,
        "assessment": assessment_name,
        "tests": response,
    }




