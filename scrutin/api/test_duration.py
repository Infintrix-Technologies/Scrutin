import frappe
from frappe import _
from datetime import datetime
from frappe.query_builder import DocType
from frappe.query_builder import functions as fn



#this both API are used for the duration and count of the questions show on the test page
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





