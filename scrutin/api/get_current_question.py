import time
import frappe
from frappe.utils import now
from datetime import datetime, timedelta
from frappe.query_builder import DocType
from frappe.query_builder import functions as fn

def countdown_timer(seconds):
    time_updates = []
    for remaining in range(seconds, 0, -1):
        mins, secs = divmod(remaining, 60)
        timeformat = '{:02d}:{:02d}'.format(mins, secs)
        time_updates.append(timeformat)
        print(timeformat, end='\r', flush=True) 
        time.sleep(1)
    time_updates.append("00:00\nTime's up!")
    print("00:00\nTime's up!") 
    return time_updates


#Example Function how to start a timer in frappe framework
def start_timer(duration):
    # Save the timer start time and duration
    timer_doc = frappe.get_doc({
        "doctype": "Timer",
        "start_time": datetime.now(),
        "duration": duration
    })
    timer_doc.insert()
    return timer_doc.name

@frappe.whitelist()
def get_timer_status(timer_name):
    # Fetch the timer details
    timer_doc = frappe.get_doc("Timer", timer_name)
    start_time = timer_doc.start_time
    duration = timer_doc.duration
    end_time = start_time + timedelta(seconds=duration)
    remaining_time = (end_time - datetime.now()).total_seconds()
    return {
        "start_time": start_time,
        "duration": duration,
        "remaining_time": max(0, remaining_time)
    }



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

    # Check candidate status
    status_query = (
        frappe.qb.from_(ScrutinCandidate)
        .select(ScrutinCandidate.status)
        .where(ScrutinCandidate.name == candidate_id)
    )
    candidate_status_result = status_query.run(as_dict=True)
    if candidate_status_result:
        candidate_status = candidate_status_result[0].get('status')
        if candidate_status == "Open" or candidate_status != "Started":
            raise frappe.PermissionError("Candidate status not valid for this operation: 403 Forbidden")

    # Check if candidate exists
    exists_query = (
        frappe.qb.from_(ScrutinCandidate)
        .select(ScrutinCandidate.name)
        .where(ScrutinCandidate.name == candidate_id)
    )
    candidate_exists = exists_query.run(as_dict=True)
    if not candidate_exists:
        raise frappe.DoesNotExistError(f"Candidate with ID {candidate_id} does not exist")

    # Helper functions
    def has_test_started(candidate_id, test_id):
        test_progress_query = (
            frappe.qb.from_(ScrutinTestProgress)
            .select(ScrutinTestProgress.name)
            .where(
                (ScrutinTestProgress.parent == candidate_id) &
                (ScrutinTestProgress.test == test_id)
            )
        )
        test_progress = test_progress_query.run(as_dict=True)
        return bool(test_progress)
    
    def are_all_questions_answered(test_id, candidate_id):
        question_query = (
            frappe.qb.from_(ScrutinTestQuestion)
            .inner_join(ScrutinTest)
            .on(ScrutinTest.name == ScrutinTestQuestion.parent)
            .inner_join(ScrutinQuestion)
            .on(ScrutinTestQuestion.question == ScrutinQuestion.name)
            .select(ScrutinTestQuestion.question)
            .where(ScrutinTest.name == test_id)
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
    
    # Retrieve assessment for candidate
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

    # Retrieve tests for the assessment
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
        test_id = current_test['test']

        if not has_test_started(candidate_id, test_id):
            add_scrutin_test_progress(candidate_id, test_id, None)

        # Check if all questions are answered or the duration is zero
        test_progress = get_candidate_test_progress_for_test_page(candidate_id)
        test_duration_zero = any(progress['test'] == test_id and progress['remaining_time'] == 0 for progress in test_progress)

        if are_all_questions_answered(test_id, candidate_id) or test_duration_zero:
            current_test_index += 1
        else:
            break

    if current_test_index >= len(tests):
        return {'message': 'No more tests available'}

    test_id = tests[current_test_index]['test']
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
        .where(ScrutinTest.name == test_id)
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

    # Fetch test progress details including remaining time and question counts
    test_progress_details = get_candidate_test_progress_for_test_page(candidate_id)
    duration = 0
    remaining_time = 0
    total_no_of_question = 0
    show_no_of_test_question = 0

    if test_progress_details:
        for progress in test_progress_details:
            if progress['test'] == test_id:
                remaining_time = progress.get('remaining_time', 0)
                total_no_of_question = progress.get('total_questions', 0)
                show_no_of_test_question = progress.get('show_question', 0)
                duration = progress.get('duration', 0)
                break

    update_data = {
        'current_question': current_question['question'],
        'next_question': next_question
    }
    frappe.db.set_value("Scrutin Candidate", candidate_id, update_data)

    return {
        'test': {
            'test': {
                'test_id': current_test['test'],
                'title': test_title
            },
            'current_question': {
                'name': current_question['question'],
                'text': current_question['question_text'],
                'type': current_question['question_type'],
                'options': options
            },
            'last_test_question': last_test_question,
            'total_no_of_question': total_no_of_question,
            'show_no_of_test_question': show_no_of_test_question,
            'remaining_time': remaining_time,
            "total_duration": duration
        }
    }









@frappe.whitelist(allow_guest=True)
def add_scrutin_test_progress_duration(candidate_id):
    try:
        # Get the candidate's test progress details
        progress_details = get_candidate_test_progress_for_test_page(candidate_id)
        
        # Assuming we are working with the first test in progress
        if not progress_details:
            return f"No test progress found for candidate {candidate_id}"
        
        test_progress = progress_details[0]
        test_id = test_progress['test']
        total_duration = test_progress['total_duration']

        # Fetch the Scrutin Candidate document
        candidate = frappe.get_doc("Scrutin Candidate", candidate_id)
        
        # Add a new entry in the child table with calculated total_duration
        candidate.append("test_progress", {
            "test": test_id,
            "duration": total_duration,
        })

        # Save the document to commit the changes
        candidate.save()
        frappe.db.commit()
        return f"Test progress added successfully for candidate {candidate_id}"
    
    except Exception as e:
        frappe.db.rollback()
        return f"An error occurred: {e}"

@frappe.whitelist()
def get_candidate_test_progress_for_test_page(candidate_id):
    ScrutinCandidate = DocType("Scrutin Candidate")
    ScrutinTest = DocType("Scrutin Test")
    ScrutinTestProgress = DocType("Scrutin Test Progress")
    ScrutinQuestion = DocType("Scrutin Question")
    ScrutinTestQuestion = DocType("Scrutin Test Question")
    ScrutinQuestionResponse = DocType("Scrutin Question Responses")

    # Main query to get the candidate's test progress
    query = (
        frappe.qb.from_(ScrutinCandidate)
        .join(ScrutinTestProgress)
        .on(ScrutinCandidate.name == ScrutinTestProgress.parent)
        .join(ScrutinTest)
        .on(ScrutinTestProgress.test == ScrutinTest.name)
        .select(
            ScrutinTestProgress.test,
            ScrutinTestProgress.duration,
            ScrutinTestProgress.started_at,
        )
        .where(
            (ScrutinCandidate.name == candidate_id)
            & (ScrutinTestProgress.started_at.isnotnull())
            & (ScrutinTestProgress.completed_at.isnull())
        )
    )
    results = query.run(as_dict=True)
    
    for result in results:
        test_id = result['test']
        duration = result['duration']
        started_at = result['started_at']

        if started_at:
            # Calculate remaining time
            elapsed_time = datetime.now() - started_at
            remaining_time = duration - elapsed_time.total_seconds()
            remaining_time = max(0, remaining_time)  # Ensure it doesn't go negative
        else:
            remaining_time = duration

        result['remaining_time'] = remaining_time

        question_count_query = (
            frappe.qb.from_(ScrutinTestQuestion)
            .inner_join(ScrutinTest)
            .on(ScrutinTest.name == ScrutinTestQuestion.parent)
            .select(fn.Count(ScrutinTestQuestion.question).as_("total_questions"))
            .where(ScrutinTest.name == test_id)
        )
        question_count_result = question_count_query.run(as_dict=True)
        total_questions = question_count_result[0]['total_questions'] if question_count_result else 0

        # Query to get the answered questions for the candidate specific to the test
        answered_query = (
            frappe.qb.from_(ScrutinQuestionResponse)
            .inner_join(ScrutinQuestion)
            .on(ScrutinQuestionResponse.question == ScrutinQuestion.name)
            .inner_join(ScrutinTestQuestion)
            .on(ScrutinQuestion.name == ScrutinTestQuestion.question)
            .select(ScrutinQuestionResponse.question)
            .where(
                (ScrutinQuestionResponse.parent == candidate_id) &
                (ScrutinTestQuestion.parent == test_id)
            )
        )
        answered_result = answered_query.run(as_dict=True)
        answered_questions = len(answered_result) if answered_result else 0
        show_question = answered_questions + 1

        result['total_questions'] = total_questions
        result['show_question'] = show_question

    return results


def add_scrutin_test_progress(candidate_id, test_name, started_at):
    try:
        ScrutinTest = DocType("Scrutin Test")
        ScrutinTestQuestion = DocType("Scrutin Test Question")
        ScrutinQuestion = DocType("Scrutin Question")

        # Query to get the total duration of the test
        duration_query = (
            frappe.qb.from_(ScrutinTestQuestion)
            .inner_join(ScrutinTest)
            .on(ScrutinTest.name == ScrutinTestQuestion.parent)
            .inner_join(ScrutinQuestion)
            .on(ScrutinTestQuestion.question == ScrutinQuestion.name)
            .select(fn.Sum(ScrutinQuestion.duration).as_("total_duration"))
            .where(ScrutinTest.name == test_name)
        )
        duration_result = duration_query.run(as_dict=True)
        total_duration = duration_result[0]['total_duration'] if duration_result else 0
        # Fetch the Scrutin Candidate document
        candidate = frappe.get_doc("Scrutin Candidate", candidate_id)
        
        # Add a new entry in the child table
        candidate.append("test_progress", {
            "test": test_name,
            "started_at": started_at or now(),
            "duration": total_duration,
        })

        # Save the document to commit the changes
        candidate.save()
        frappe.db.commit()
        return f"Test progress added successfully for candidate {candidate_id}"
    
    except Exception as e:
        frappe.db.rollback()
        return f"An error occurred: {e}"


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







