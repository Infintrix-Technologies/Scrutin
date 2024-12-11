import time

# def countdown_timer(seconds):
#     time_updates = []
#     for remaining in range(seconds, 0, -1):
#         mins, secs = divmod(remaining, 60)
#         timeformat = '{:02d}:{:02d}'.format(mins, secs)
#         time_updates.append(timeformat)
#         print(timeformat, end='\r', flush=True) 
#         time.sleep(1)
#     time_updates.append("00:00\nTime's up!")
#     print("00:00\nTime's up!") 
#     return time_updates

# countdown_timer(20)



import time
import frappe
from frappe.query_builder import DocType, fn

def countdown_timer(total_duration):
    time_updates = []
    for remaining in range(total_duration, 0, -1):
        mins, secs = divmod(remaining, 60)
        timeformat = '{:02d}:{:02d}'.format(mins, secs)
        time_updates.append(timeformat)
        print(timeformat, end='\r', flush=True)  # Print in real-time
        time.sleep(1)
    time_updates.append("00:00\nTime's up!")
    print("00:00\nTime's up!")  # Final message
    return time_updates

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
        )
        .where(
            (ScrutinCandidate.name == candidate_id)
            & (ScrutinTestProgress.started_at.isnotnull())
            & (ScrutinTestProgress.completed_at.isnull())
        )
    )
    results = query.run(as_dict=True)
    
    # Iterate over results to add total_duration, total_questions, answered_questions, and countdown_timer
    for result in results:
        test_id = result['test']

        # Query to get the total duration of the test
        duration_query = (
            frappe.qb.from_(ScrutinTestQuestion)
            .inner_join(ScrutinTest)
            .on(ScrutinTest.name == ScrutinTestQuestion.parent)
            .inner_join(ScrutinQuestion)
            .on(ScrutinTestQuestion.question == ScrutinQuestion.name)
            .select(fn.Sum(ScrutinQuestion.duration).as_("total_duration"))
            .where(ScrutinTest.name == test_id)
        )
        duration_result = duration_query.run(as_dict=True)
        total_duration = duration_result[0]['total_duration'] if duration_result else 0

        # Query to get the total number of questions in the test
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

        # Add total_duration, total_questions, and answered_questions to the result
        result['total_duration'] = total_duration
        result['total_questions'] = total_questions
        result['show_question'] = show_question

        # Generate countdown timer updates
        result['countdown_timer'] = countdown_timer(total_duration)

    return results


get_candidate_test_progress_for_test_page("97c5oqlsf5")
