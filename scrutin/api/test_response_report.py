import frappe
from frappe import _
from datetime import datetime
from frappe.query_builder import DocType
from frappe.query_builder import functions as fn




# this api give each test start, complete & finished time 
@frappe.whitelist()
def get_candidate_response_test_finish_time(candidate_id):
    ScrutinCandidate = DocType("Scrutin Candidate")
    ScrutinTestProgress = DocType("Scrutin Test Progress")
    ScrutinTest = DocType("Scrutin Test")

    query = (
        frappe.qb.from_(ScrutinCandidate)
        .join(ScrutinTestProgress)
        .on(ScrutinCandidate.name == ScrutinTestProgress.parent)
        .join(ScrutinTest)
        .on(ScrutinTestProgress.test == ScrutinTest.name)
        .select(
            ScrutinCandidate.job_applicant,
            ScrutinTestProgress.test,
            ScrutinTest.title,
            ScrutinTestProgress.started_at,
            ScrutinTestProgress.completed_at,
        )
        .where(ScrutinCandidate.name == candidate_id)
    )
    results = query.run(as_dict=True)

    # Calculate the finished time for each record
    for result in results:
        started_at = result.get("started_at")
        completed_at = result.get("completed_at")
        if started_at and completed_at:
            # Parse the timestamps if they are not already datetime objects
            if isinstance(started_at, str):
                started_at = datetime.fromisoformat(started_at)
            if isinstance(completed_at, str):
                completed_at = datetime.fromisoformat(completed_at)

            # Calculate the finished time
            finished_time = completed_at - started_at
            result["finished_time"] = str(finished_time)  # Convert to string for JSON compatibility
        else:
            result["finished_time"] = None  # Handle cases where timestamps are missing

    return results


# this api give all details about assessment tests and also give in what time candidate complete the test
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
    ScrutinTestProgress = DocType("Scrutin Test Progress")

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
            JobApplicant.email_id,
        )
        .where(ScrutinCandidate.name == candidate_id)
    ).run(as_dict=True)
    applicant_name = candidate_detail[0]["applicant_name"] if candidate_detail else None
    applicant_email = candidate_detail[0]["email_id"] if candidate_detail else None

    # Fetch candidate's assessments
    query = (
        frappe.qb.from_(ScrutinCandidate)
        .select(ScrutinCandidate.assessment)
        .where(ScrutinCandidate.name == candidate_id)
    )
    candidate_assessments = query.run(as_dict=True)
    if candidate_assessments:
        assessment_id = candidate_assessments[0].get("assessment")
    else:
        assessment_id = None

    # Fetch custom questions count
    custom_question_count_query = (
        frappe.qb.from_(ScrutinAssessmentQuestion)
        .select(fn.Count(ScrutinAssessmentQuestion.question).as_("total_custom_questions"))
        .where(ScrutinAssessmentQuestion.parent == assessment_id)
    )
    custom_question_count_result = custom_question_count_query.run(as_dict=True)
    total_custom_questions = (
        custom_question_count_result[0]["total_custom_questions"]
        if custom_question_count_result
        else 0
    )

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
    answered_questions = {response["question"] for response in candidate_responses}

    response = []
    total_accuracy = 0

    for test in tests:
        test_name = test["name"]

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
        total_duration = duration_result[0]["total_duration"] if duration_result else 0

        # Fetch total number of questions in the test
        question_count_query = (
            frappe.qb.from_(ScrutinTestQuestion)
            .inner_join(ScrutinTest)
            .on(ScrutinTest.name == ScrutinTestQuestion.parent)
            .select(fn.Count(ScrutinTestQuestion.question).as_("total_questions"))
            .where(ScrutinTest.name == test_name)
        )
        question_count_result = question_count_query.run(as_dict=True)
        total_questions = question_count_result[0]["total_questions"] if question_count_result else 0

        # Fetch progress for each test to calculate finished time
        progress_query = (
            frappe.qb.from_(ScrutinTestProgress)
            .select(
                ScrutinTestProgress.started_at,
                ScrutinTestProgress.completed_at,
            )
            .where(ScrutinTestProgress.test == test_name)
            .where(ScrutinTestProgress.parent == candidate_id)
        )
        progress_result = progress_query.run(as_dict=True)
        finished_time = None
        if progress_result:
            started_at = progress_result[0].get("started_at")
            completed_at = progress_result[0].get("completed_at")
            if started_at and completed_at:
                # Parse timestamps
                if isinstance(started_at, str):
                    started_at = datetime.fromisoformat(started_at)
                if isinstance(completed_at, str):
                    completed_at = datetime.fromisoformat(completed_at)
                # Calculate finished time
                finished_time = str(completed_at - started_at)

        # Append finished time to test data
        test["finished_time"] = finished_time

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
            question["question"]
            for question in test_questions
            if question["question"] not in answered_questions
        ]

        # Append other test details
        test["total_duration"] = total_duration
        test["total_questions"] = total_questions
        test["unanswered_questions"] = len(unanswered_questions)
        test["answered_questions"] = total_questions - len(unanswered_questions)

        response.append(
            {
                "test_name": test_name,
                "test_title": test["title"],
                "questions": [],
                "accuracy": 0,
                "total_questions": total_questions,
                "correct_count": 0,
                "incorrect_count": 0,
                "total_duration": total_duration,
                "answered_questions": test["answered_questions"],
                "unanswered_questions": test["unanswered_questions"],
                "finished_time": finished_time,
            }
        )

    # Calculate the assessment average accuracy
    total_tests = len(tests)
    assessment_average = total_accuracy / total_tests if total_tests else 0

    return {
        "candidate_id": candidate_id,
        "applicant_name": applicant_name,
        "applicant_email": applicant_email,
        "assessment": assessment_id,
        "tests": response,
        "custom_questions": total_custom_questions,
        "assessment_average": assessment_average,
    }




@frappe.whitelist()
def send_email_to_candidate_test_response_report(candidate_id):
    report = get_candidate_test_response_report(candidate_id)

    # Email details
    applicant_name = report["applicant_name"]
    applicant_email = report["applicant_email"]
    tests = report["tests"]
    assessment_average = report["assessment_average"]

    # Generate email content
    email_subject = "Your Test Performance Report"
    email_body = f"Dear {applicant_name},\n\n"
    email_body += "Here is your performance report:\n\n"

    for test in tests:
        email_body += f"Test Name: {test['test_title']}\n"
        email_body += f"Total Questions: {test['total_questions']}\n"
        email_body += f"Correct Answers: {test['correct_count']}\n"
        email_body += f"Incorrect Answers: {test['incorrect_count']}\n"
        email_body += f"Accuracy: {test['accuracy']}%\n"
        email_body += f"Total Duration: {test['total_duration']} minutes\n"
        email_body += f"Answered Questions: {test['answered_questions']}\n"
        email_body += f"Unanswered Questions: {test['unanswered_questions']}\n\n"
        email_body += f"Finished Test Time: {test['finished_time']}\n\n"

    email_body += f"Overall Assessment Average Accuracy: {assessment_average}%\n\n"
    email_body += "Best regards,\nYour Assessment Team"

    # Send email
    if applicant_email:
        frappe.sendmail(
            recipients=[applicant_email],
            subject=email_subject,
            message=email_body
        )
    else:
        frappe.throw("Applicant email not found.")

    return {"message": "Email sent successfully", "candidate_id": candidate_id}
