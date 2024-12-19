import frappe
from frappe.query_builder import DocType
from frappe.query_builder.functions import Now
from frappe.query_builder import functions as fn


@frappe.whitelist()
def get_file_data(file_id):
    File = DocType("File")

    file_query = (
        frappe.qb.from_(File)
            .select(File.name,
                    File.file_name,
                    File.file_size,
                    File.file_type,
                    File.is_private,
                    File.file_url,
                    File.attached_to_doctype,
                    File.attached_to_name,
                    File.attached_to_field
            )
            .where(File.name == file_id)
                    
        )
    
    file_data = file_query.run(as_dict=True)
    return file_data






@frappe.whitelist()

def get_candidate_test_progress_remaining_time(candidate_id):
    ScrutinCandidate = DocType("Scrutin Candidate")
    ScrutinTest = DocType("Scrutin Test")
    ScrutinTestProgress = DocType("Scrutin Test Progress")

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
            ScrutinTestProgress.completed_at,
        )
        .where(
            ScrutinCandidate.name == candidate_id
        )
    )
    results = query.run(as_dict=True)
    
    current_time = Now()
    
    for result in results:
        started_at = result.get('started_at')
        completed_at = result.get('completed_at')
        duration = result.get('duration')
        
        if completed_at:
            time_taken = (completed_at - started_at).total_seconds()
        else:
            time_taken = (current_time - started_at).total_seconds()
        
        remaining_time = max(0, duration - time_taken)
        result['remaining_time'] = int(remaining_time)
    
    return results










@frappe.whitelist()
def test_details_for_overview_page_with_remaining_time(candidate_id):
    ScrutinAssessment = DocType("Scrutin Assessment")
    ScrutinTest = DocType("Scrutin Test")
    ScrutinAssessmentTest = DocType("Scrutin Assessment Tests")
    ScrutinQuestion = DocType("Scrutin Question")
    ScrutinTestQuestion = DocType("Scrutin Test Question")
    ScrutinAssessmentQuestion = DocType("Scrutin Assessment Questions")
    ScrutinCandidate = DocType("Scrutin Candidate")
    ScrutinQuestionResponse = DocType("Scrutin Question Responses")
    JobApplicant = DocType("Job Applicant")
    ScrutinTestProgress = DocType("Scrutin Test Progress")

    # Check if candidate exists
    exists_query = (
        frappe.qb.from_(ScrutinCandidate)
        .select(ScrutinCandidate.name)
        .where(ScrutinCandidate.name == candidate_id)
    )
    candidate_exists = exists_query.run(as_dict=True)
    
    if not candidate_exists:
        raise frappe.DoesNotExistError(f"Candidate with ID {candidate_id} does not exist")

    # Helper function to get candidate's question responses
    def get_candidate_questions_answer_responses(candidate_id):
        query = (
            frappe.qb.from_(ScrutinCandidate)
            .join(ScrutinQuestionResponse).on(ScrutinCandidate.name == ScrutinQuestionResponse.parent)
            .join(ScrutinQuestion).on(ScrutinQuestionResponse.question == ScrutinQuestion.name)
            .select(
                ScrutinQuestion.name.as_("question"),
                ScrutinQuestion.question.as_("question_content"),
                ScrutinQuestionResponse.answer,
            )
            .where(ScrutinCandidate.name == candidate_id)
        )
        return query.run(as_dict=True)
    
    # Fetch candidate's detail including applicant name
    candidate_detail = (
        frappe.qb.from_(ScrutinCandidate)
        .left_join(ScrutinAssessment).on(ScrutinAssessment.name == ScrutinCandidate.assessment)
        .left_join(JobApplicant).on(JobApplicant.name == ScrutinCandidate.job_applicant)
        .select(JobApplicant.applicant_name)
        .where(ScrutinCandidate.name == candidate_id)
    ).run(as_dict=True)
    applicant_name = candidate_detail[0]["applicant_name"] if candidate_detail else None

    # Fetch candidate's assessments
    query = (
        frappe.qb.from_(ScrutinCandidate)
        .select(ScrutinCandidate.assessment)
        .where(ScrutinCandidate.name == candidate_id)
    )
    candidate_assessments = query.run(as_dict=True)
    assessment_id = candidate_assessments[0].get('assessment') if candidate_assessments else None

    # Fetch custom questions count
    custom_question_count_query = (
        frappe.qb.from_(ScrutinAssessmentQuestion)
        .select(fn.Count(ScrutinAssessmentQuestion.question).as_("total_custom_questions"))
        .where(ScrutinAssessmentQuestion.parent == assessment_id)
    )
    custom_question_count_result = custom_question_count_query.run(as_dict=True)
    total_custom_questions = custom_question_count_result[0]['total_custom_questions'] if custom_question_count_result else 0

    # Fetch tests for the candidate's assessment
    tests_query = (
        frappe.qb.from_(ScrutinAssessmentTest)
        .inner_join(ScrutinAssessment).on(ScrutinAssessment.name == ScrutinAssessmentTest.parent)
        .inner_join(ScrutinTest).on(ScrutinTest.name == ScrutinAssessmentTest.test)
        .select(
            ScrutinAssessment.assessment_name,
            ScrutinTest.name,
            ScrutinTest.title,
        )
        .where(ScrutinAssessment.name == assessment_id)
    )
    tests = tests_query.run(as_dict=True)

    # Fetch candidate's responses
    candidate_responses = get_candidate_questions_answer_responses(candidate_id)
    answered_questions = {response['question'] for response in candidate_responses}

    # Fetch candidate's test progress remaining time
    def get_candidate_test_progress_remaining_time(candidate_id):
        query = (
            frappe.qb.from_(ScrutinCandidate)
            .join(ScrutinTestProgress).on(ScrutinCandidate.name == ScrutinTestProgress.parent)
            .join(ScrutinTest).on(ScrutinTestProgress.test == ScrutinTest.name)
            .select(
                ScrutinTestProgress.test,
                ScrutinTestProgress.duration,
                ScrutinTestProgress.started_at,
                ScrutinTestProgress.completed_at,
            )
            .where(ScrutinCandidate.name == candidate_id)
        )
        results = query.run(as_dict=True)
        
        current_time = Now()
        
        for result in results:
            started_at = result.get('started_at', '%Y-%m-%d %H:%M:%S')
            completed_at = result.get('completed_at', '%Y-%m-%d %H:%M:%S')
            duration = result.get('duration')
            
            if completed_at:
                time_taken = (completed_at - started_at).total_seconds()
            else:
                time_taken = (current_time - started_at).total_seconds()
            
            remaining_time = max(0, duration - time_taken)
            result['remaining_time'] = int(remaining_time)
            if remaining_time < 1:
                remaining_time = 0
            result['time_completed'] = remaining_time == 0
        
        return results

    test_progress = get_candidate_test_progress_remaining_time(candidate_id)
    progress_dict = {p['test']: p for p in test_progress}

    all_tests_completed = True

    for test in tests:
        test_name = test['name']

        # Fetch total duration of the test
        duration_query = (
            frappe.qb.from_(ScrutinTestQuestion)
            .inner_join(ScrutinTest).on(ScrutinTest.name == ScrutinTestQuestion.parent)
            .inner_join(ScrutinQuestion).on(ScrutinTestQuestion.question == ScrutinQuestion.name)
            .select(fn.Sum(ScrutinQuestion.duration).as_("total_duration"))
            .where(ScrutinTest.name == test_name)
        )
        duration_result = duration_query.run(as_dict=True)
        total_duration = duration_result[0]['total_duration'] if duration_result else 0
        
        # Fetch total number of questions in the test
        question_count_query = (
            frappe.qb.from_(ScrutinTestQuestion)
            .inner_join(ScrutinTest).on(ScrutinTest.name == ScrutinTestQuestion.parent)
            .select(fn.Count(ScrutinTestQuestion.question).as_("total_questions"))
            .where(ScrutinTest.name == test_name)
        )
        question_count_result = question_count_query.run(as_dict=True)
        total_questions = question_count_result[0]['total_questions'] if question_count_result else 0

        # Check if all questions in the test are answered
        test_questions_query = (
            frappe.qb.from_(ScrutinTestQuestion)
            .inner_join(ScrutinTest).on(ScrutinTest.name == ScrutinTestQuestion.parent)
            .inner_join(ScrutinQuestion).on(ScrutinTestQuestion.question == ScrutinQuestion.name)
            .select(ScrutinTestQuestion.question)
            .where(ScrutinTest.name == test_name)
        )
        test_questions = test_questions_query.run(as_dict=True)
        unanswered_questions = [
            question['question'] for question in test_questions if question['question'] not in answered_questions
        ]
        
        # Update test details
        test['total_duration'] = total_duration
        test['total_questions'] = total_questions
        test['unanswered_questions'] = len(unanswered_questions)
        test['answered_questions'] = total_questions - len(unanswered_questions)
        test['test_completed'] = test['total_questions'] == test['answered_questions']
        test_progress_entry = progress_dict.get(test_name)
        if test_progress_entry:
            test['remaining_time'] = test_progress_entry['remaining_time']
            test['time_completed'] = test_progress_entry['time_completed']
        else:
            test['remaining_time'] = None
            test['time_completed'] = False

        if not test['test_completed'] and not test['time_completed']:
            all_tests_completed = False

    return {
        "tests": tests,
        "custom_questions": total_custom_questions,
        "applicant_name": applicant_name,
        "assessment_completed": all_tests_completed,
    }



