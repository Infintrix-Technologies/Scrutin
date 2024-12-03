import frappe
from frappe.query_builder import DocType
from frappe.query_builder import functions as fn



@frappe.whitelist()
def get_candidate_test_response_report(candidate_id):
    # Define DocTypes
    ScrutinCandidate = DocType("Scrutin Candidate")
    ScrutinAssessment = DocType("Scrutin Assessment")
    ScrutinAssessmentTest = DocType("Scrutin Assessment Tests")
    ScrutinTest = DocType("Scrutin Test")
    ScrutinTestQuestion = DocType("Scrutin Test Question")
    ScrutinQuestion = DocType("Scrutin Question")
    ScrutinQuestionResponse = DocType("Scrutin Question Responses")
    ScrutinAssessmentQuestion = DocType("Scrutin Assessment Questions")
    JobApplicant = DocType("Job Applicant")

    # Helper function to get candidate's question responses
    def get_candidate_questions_answer_responses(candidate_id):
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
        return query.run(as_dict=True)

    # Fetch candidate's detail including applicant name
    candidate_detail = (
        frappe.qb.from_(ScrutinCandidate)
        .left_join(ScrutinAssessment)
        .on(ScrutinAssessment.name == ScrutinCandidate.assessment)
        .left_join(JobApplicant)
        .on(JobApplicant.name == ScrutinCandidate.job_applicant)
        .select(
            JobApplicant.applicant_name,
        )
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
    if candidate_assessments:
        assessment_id = candidate_assessments[0].get('assessment')
    else:
        assessment_id = None

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
        .inner_join(ScrutinAssessment)
        .on(ScrutinAssessment.name == ScrutinAssessmentTest.parent)
        .inner_join(ScrutinTest)
        .on(ScrutinTest.name == ScrutinAssessmentTest.test)
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

    response = []

    for test in tests:
        test_name = test['name']

        # Fetch total duration of the test
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
        
        # Fetch total number of questions in the test
        question_count_query = (
            frappe.qb.from_(ScrutinTestQuestion)
            .inner_join(ScrutinTest)
            .on(ScrutinTest.name == ScrutinTestQuestion.parent)
            .select(fn.Count(ScrutinTestQuestion.question).as_("total_questions"))
            .where(ScrutinTest.name == test_name)
        )
        question_count_result = question_count_query.run(as_dict=True)
        total_questions = question_count_result[0]['total_questions'] if question_count_result else 0

        # Check if all questions in the test are answered
        test_questions_query = (
            frappe.qb.from_(ScrutinTestQuestion)
            .inner_join(ScrutinTest)
            .on(ScrutinTest.name == ScrutinTestQuestion.parent)
            .inner_join(ScrutinQuestion)
            .on(ScrutinTestQuestion.question == ScrutinQuestion.name)
            .select(ScrutinTestQuestion.question)
            .where(ScrutinTest.name == test_name)
        )
        test_questions = test_questions_query.run(as_dict=True)
        unanswered_questions = [
            question['question'] for question in test_questions if question['question'] not in answered_questions
        ]

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
                # ScrutinQuestion.name.as_("question_id"),
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

        total_test_questions = len(questions)
        accuracy = (correct_count / total_questions * 100) if total_test_questions else 0

        # Update test details
        test['total_duration'] = total_duration
        test['total_questions'] = total_questions
        test['unanswered_questions'] = len(unanswered_questions)
        test['answered_questions'] = total_questions - len(unanswered_questions)

        # Append test result to response
        response.append({
            "test_name": test_name,
            "test_title": test["title"],
            "questions": questions,
            "accuracy": accuracy,
            "total_questions": total_questions,
            "correct_count": correct_count,
            "incorrect_count": total_test_questions - correct_count,
            "total_duration": total_duration,
            "answered_questions": test['answered_questions'],
            "unanswered_questions": test['unanswered_questions'],
        })

    return {
        "candidate_id": candidate_id,
        "applicant_name": applicant_name,
        "assessment": assessment_id,
        "tests": response,
        "custom_questions": total_custom_questions,
    }
