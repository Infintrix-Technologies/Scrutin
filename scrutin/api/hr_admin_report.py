import frappe
from datetime import datetime
from frappe.query_builder import DocType
from frappe.query_builder import functions as fn



@frappe.whitelist()
def hr_admin_report():
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

    def get_candidate_questions_answer_responses(candidate_name):
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
            .where(ScrutinCandidate.name == candidate_name)
        )
        return query.run(as_dict=True)

    candidate_details = (
        frappe.qb.from_(ScrutinCandidate)
        .left_join(ScrutinAssessment)
        .on(ScrutinAssessment.name == ScrutinCandidate.assessment)
        .left_join(JobApplicant)
        .on(JobApplicant.name == ScrutinCandidate.job_applicant)
        .select(
            ScrutinCandidate.name.as_("candidate_name"),
            JobApplicant.applicant_name,
            JobApplicant.email_id,
            JobApplicant.name.as_("job_applicant_name"),
            JobApplicant.applicant_rating,
            ScrutinAssessment.assessment_name,
        )
    ).run(as_dict=True)

    candidates = []

    for candidate_detail in candidate_details:
        candidate_name = candidate_detail["candidate_name"]
        applicant_name = candidate_detail["applicant_name"]
        applicant_email = candidate_detail["email_id"]
        assessment_name = candidate_detail["assessment_name"]

        query = (
            frappe.qb.from_(ScrutinCandidate)
            .select(ScrutinCandidate.assessment)
            .where(ScrutinCandidate.name == candidate_name)
        )
        candidate_assessments = query.run(as_dict=True)
        if candidate_assessments:
            assessment_id = candidate_assessments[0].get('assessment')
        else:
            assessment_id = None

        custom_question_count_query = (
            frappe.qb.from_(ScrutinAssessmentQuestion)
            .select(fn.Count(ScrutinAssessmentQuestion.question).as_("total_custom_questions"))
            .where(ScrutinAssessmentQuestion.parent == assessment_id)
        )
        custom_question_count_result = custom_question_count_query.run(as_dict=True)
        total_custom_questions = custom_question_count_result[0]['total_custom_questions'] if custom_question_count_result else 0

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
                ScrutinTest.level,
            )
            .where(ScrutinAssessment.name == assessment_id)
        )
        tests = tests_query.run(as_dict=True)

        candidate_responses = get_candidate_questions_answer_responses(candidate_name)
        answered_questions = {response['question'] for response in candidate_responses}

        response = []
        total_accuracy = 0

        for test in tests:
            test_name = test['name']

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
            
            question_count_query = (
                frappe.qb.from_(ScrutinTestQuestion)
                .inner_join(ScrutinTest)
                .on(ScrutinTest.name == ScrutinTestQuestion.parent)
                .select(fn.Count(ScrutinTestQuestion.question).as_("total_questions"))
                .where(ScrutinTest.name == test_name)
            )
            question_count_result = question_count_query.run(as_dict=True)
            total_questions = question_count_result[0]['total_questions'] if question_count_result else 0

            progress_query = (
                frappe.qb.from_(ScrutinTestProgress)
                .select(
                    ScrutinTestProgress.started_at,
                    ScrutinTestProgress.completed_at,
                )
                .where((ScrutinTestProgress.test == test_name) & (ScrutinTestProgress.parent == candidate_name))
            )
            progress_result = progress_query.run(as_dict=True)
            finished_time = None
            if progress_result:
                started_at = progress_result[0].get("started_at")
                completed_at = progress_result[0].get("completed_at")
                if started_at and completed_at:
                    if isinstance(started_at, str):
                        started_at = datetime.fromisoformat(started_at)
                    if isinstance(completed_at, str):
                        completed_at = datetime.fromisoformat(completed_at)
                    finished_time = str(completed_at - started_at)

            test["finished_time"] = finished_time

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

            question_query = (
                frappe.qb.from_(ScrutinTestQuestion)
                .inner_join(ScrutinTest)
                .on(ScrutinTest.name == ScrutinTestQuestion.parent)
                .inner_join(ScrutinQuestion)
                .on(ScrutinTestQuestion.question == ScrutinQuestion.name)
                .left_join(ScrutinQuestionResponse)
                .on(ScrutinQuestionResponse.question == ScrutinQuestion.name)
                .select(
                    ScrutinQuestion.answer.as_("actual_answer"),
                    ScrutinQuestionResponse.answer.as_("candidate_answer"),
                )
                .where((ScrutinTest.name == test_name) & (ScrutinQuestionResponse.parent == candidate_name))
            )
            questions = question_query.run(as_dict=True)

            correct_count = 0
            for question in questions:
                question["is_correct"] = question["candidate_answer"] == question["actual_answer"]
                if question["is_correct"]:
                    correct_count += 1

            total_test_questions = len(questions)
            accuracy = (correct_count / total_questions) * 100 if total_questions else 0
            total_accuracy += accuracy

            test['total_duration'] = total_duration
            test['total_questions'] = total_questions
            test['unanswered_questions'] = len(unanswered_questions)
            test['answered_questions'] = total_questions - len(unanswered_questions)

            response.append({
                "test_name": test_name,
                "test_title": test["title"],
                "test_level": test["level"],
                "accuracy": accuracy,
                "total_questions": total_questions,
                "correct_count": correct_count,
                "incorrect_count": total_test_questions - correct_count,
                "total_duration": total_duration,
                "answered_questions": test['answered_questions'],
                "unanswered_questions": test['unanswered_questions'],
                "finished_time": finished_time,
            })
        total_tests = len(tests)
        assessment_average = total_accuracy / total_tests if total_tests else 0

        candidates.append({
            "candidate_id": candidate_name,
            "applicant_name": applicant_name,
            "applicant_email": applicant_email,
            "assessment_name": assessment_name,
            "tests": response,
            "custom_questions": total_custom_questions,
            "assessment_average": assessment_average,
        })

    return candidates

