import frappe
from frappe import _
from datetime import datetime
from frappe.query_builder import DocType
from frappe.query_builder import functions as fn


@frappe.whitelist()
def comparison_two_candidates_test_response_report(candidate_id):
    ScrutinCandidate = DocType("Scrutin Candidate")
    ScrutinAssessment = DocType("Scrutin Assessment")
    ScrutinAssessmentTest = DocType("Scrutin Assessment Tests")
    ScrutinTest = DocType("Scrutin Test")
    ScrutinTestQuestion = DocType("Scrutin Test Question")
    ScrutinQuestion = DocType("Scrutin Question")
    ScrutinQuestionResponse = DocType("Scrutin Question Responses")
    JobApplicant = DocType("Job Applicant")

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

    candidate_detail = (
        frappe.qb.from_(ScrutinCandidate)
        .left_join(ScrutinAssessment)
        .on(ScrutinAssessment.name == ScrutinCandidate.assessment)
        .left_join(JobApplicant)
        .on(JobApplicant.name == ScrutinCandidate.job_applicant)
        .select(
            JobApplicant.applicant_name,
            JobApplicant.name,
        )
        .where(ScrutinCandidate.name == candidate_id)
    ).run(as_dict=True)
    applicant_name = candidate_detail[0]["applicant_name"] if candidate_detail else None
    applicant_id = candidate_detail[0]["name"] if candidate_detail else None

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

    candidate_responses = get_candidate_questions_answer_responses(candidate_id)
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
            .where((ScrutinTest.name == test_name) & (ScrutinQuestionResponse.parent == candidate_id))
        )
        questions = question_query.run(as_dict=True)

        correct_count = 0
        for question in questions:
            question["is_correct"] = question["candidate_answer"] == question["actual_answer"]
            if question["is_correct"]:
                correct_count += 1

        total_test_questions = len(questions)
        accuracy = (correct_count / total_test_questions * 100) if total_test_questions else 0
        total_accuracy += accuracy

        test['total_duration'] = total_duration
        test['total_questions'] = total_questions
        test['unanswered_questions'] = len(unanswered_questions)
        test['answered_questions'] = total_questions - len(unanswered_questions)

        response.append({
            "test_name": test_name,
            "test_title": test["title"],
            "accuracy": accuracy,
            "total_questions": total_questions,
            "correct_count": correct_count,
            "incorrect_count": total_test_questions - correct_count,
            "total_duration": total_duration,
            "answered_questions": test['answered_questions'],
            "unanswered_questions": test['unanswered_questions'],
        })
    total_tests = len(tests)
    assessment_average = total_accuracy / total_tests if total_tests else 0

    # Update: Format the assessment_average for rating
    rating = round(assessment_average / 100, 1)
    update_job_applicant_rating(applicant_id, rating)


    return {
        "candidate_id": candidate_id,
        "applicant_id": applicant_id,
        "applicant_name": applicant_name,
        "assessment": assessment_id,
        "tests": response,
        "assessment_average": assessment_average,
    }

#API that will change the status and rating of job applicant
@frappe.whitelist()
def update_job_applicant_rating(applicant_id, rating):
    if not (0 <= rating <= 1):
        return f"Invalid rating value: {rating}. Rating must be between 0 and 1."

    JobApplicant = DocType("Job Applicant")
    (
        frappe.qb.update(JobApplicant)
        .set(JobApplicant.applicant_rating, rating)
        .where(JobApplicant.name == applicant_id)
    ).run()
    return f"Rating for applicant {applicant_id} has been updated successfully."







# @frappe.whitelist()
# def comparison_two_candidates_test_response_report(candidate_id_1, candidate_id_2):
#     ScrutinCandidate = DocType("Scrutin Candidate")
#     ScrutinAssessment = DocType("Scrutin Assessment")
#     ScrutinAssessmentTest = DocType("Scrutin Assessment Tests")
#     ScrutinTest = DocType("Scrutin Test")
#     ScrutinTestQuestion = DocType("Scrutin Test Question")
#     ScrutinQuestion = DocType("Scrutin Question")
#     ScrutinQuestionResponse = DocType("Scrutin Question Responses")
#     JobApplicant = DocType("Job Applicant")

#     def get_candidate_questions_answer_responses(candidate_id):
#         query = (
#             frappe.qb.from_(ScrutinCandidate)
#             .join(ScrutinQuestionResponse)
#             .on(ScrutinCandidate.name == ScrutinQuestionResponse.parent)
#             .join(ScrutinQuestion)
#             .on(ScrutinQuestionResponse.question == ScrutinQuestion.name)
#             .select(
#                 ScrutinQuestion.name.as_("question"),
#                 ScrutinQuestion.question.as_("question_content"),
#                 ScrutinQuestionResponse.answer,
#             )
#             .where(ScrutinCandidate.name == candidate_id)
#         )
#         return query.run(as_dict=True)

#     def get_candidate_detail(candidate_id):
#         candidate_detail = (
#             frappe.qb.from_(ScrutinCandidate)
#             .left_join(ScrutinAssessment)
#             .on(ScrutinAssessment.name == ScrutinCandidate.assessment)
#             .left_join(JobApplicant)
#             .on(JobApplicant.name == ScrutinCandidate.job_applicant)
#             .select(
#                 JobApplicant.applicant_name,
#                 JobApplicant.email_id,
#             )
#             .where(ScrutinCandidate.name == candidate_id)
#         ).run(as_dict=True)
#         return candidate_detail[0] if candidate_detail else None

#     def get_assessment_id(candidate_id):
#         query = (
#             frappe.qb.from_(ScrutinCandidate)
#             .select(ScrutinCandidate.assessment)
#             .where(ScrutinCandidate.name == candidate_id)
#         )
#         candidate_assessments = query.run(as_dict=True)
#         return candidate_assessments[0].get('assessment') if candidate_assessments else None

#     def get_tests(assessment_id):
#         tests_query = (
#             frappe.qb.from_(ScrutinAssessmentTest)
#             .inner_join(ScrutinAssessment)
#             .on(ScrutinAssessment.name == ScrutinAssessmentTest.parent)
#             .inner_join(ScrutinTest)
#             .on(ScrutinTest.name == ScrutinAssessmentTest.test)
#             .select(
#                 ScrutinAssessment.assessment_name,
#                 ScrutinTest.name,
#                 ScrutinTest.title,
#             )
#             .where(ScrutinAssessment.name == assessment_id)
#         )
#         return tests_query.run(as_dict=True)

#     def calculate_test_statistics(test_name, answered_questions):
#         duration_query = (
#             frappe.qb.from_(ScrutinTestQuestion)
#             .inner_join(ScrutinTest)
#             .on(ScrutinTest.name == ScrutinTestQuestion.parent)
#             .inner_join(ScrutinQuestion)
#             .on(ScrutinTestQuestion.question == ScrutinQuestion.name)
#             .select(fn.Sum(ScrutinQuestion.duration).as_("total_duration"))
#             .where(ScrutinTest.name == test_name)
#         )
#         duration_result = duration_query.run(as_dict=True)
#         total_duration = duration_result[0]['total_duration'] if duration_result else 0
        
#         question_count_query = (
#             frappe.qb.from_(ScrutinTestQuestion)
#             .inner_join(ScrutinTest)
#             .on(ScrutinTest.name == ScrutinTestQuestion.parent)
#             .select(fn.Count(ScrutinTestQuestion.question).as_("total_questions"))
#             .where(ScrutinTest.name == test_name)
#         )
#         question_count_result = question_count_query.run(as_dict=True)
#         total_questions = question_count_result[0]['total_questions'] if question_count_result else 0

#         test_questions_query = (
#             frappe.qb.from_(ScrutinTestQuestion)
#             .inner_join(ScrutinTest)
#             .on(ScrutinTest.name == ScrutinTestQuestion.parent)
#             .inner_join(ScrutinQuestion)
#             .on(ScrutinTestQuestion.question == ScrutinQuestion.name)
#             .select(ScrutinTestQuestion.question)
#             .where(ScrutinTest.name == test_name)
#         )
#         test_questions = test_questions_query.run(as_dict=True)
#         unanswered_questions = [
#             question['question'] for question in test_questions if question['question'] not in answered_questions
#         ]
#         return total_duration, total_questions, unanswered_questions

#     def get_questions(test_name, candidate_id):
#         question_query = (
#             frappe.qb.from_(ScrutinTestQuestion)
#             .inner_join(ScrutinTest)
#             .on(ScrutinTest.name == ScrutinTestQuestion.parent)
#             .inner_join(ScrutinQuestion)
#             .on(ScrutinTestQuestion.question == ScrutinQuestion.name)
#             .left_join(ScrutinQuestionResponse)
#             .on(ScrutinQuestionResponse.question == ScrutinQuestion.name)
#             .select(
#                 ScrutinQuestion.answer.as_("actual_answer"),
#                 ScrutinQuestionResponse.answer.as_("candidate_answer"),
#             )
#             .where((ScrutinTest.name == test_name) & (ScrutinQuestionResponse.parent == candidate_id))
#         )
#         return question_query.run(as_dict=True)

#     def calculate_accuracy(questions):
#         correct_count = 0
#         for question in questions:
#             question["is_correct"] = question["candidate_answer"] == question["actual_answer"]
#             if question["is_correct"]:
#                 correct_count += 1
#         total_test_questions = len(questions)
#         accuracy = (correct_count / total_test_questions * 100) if total_test_questions else 0
#         return accuracy, correct_count, total_test_questions

#     candidate_detail_1 = get_candidate_detail(candidate_id_1)
#     candidate_detail_2 = get_candidate_detail(candidate_id_2)
#     applicant_name_1 = candidate_detail_1["applicant_name"] if candidate_detail_1 else None
#     applicant_name_2 = candidate_detail_2["applicant_name"] if candidate_detail_2 else None

#     assessment_id_1 = get_assessment_id(candidate_id_1)
#     assessment_id_2 = get_assessment_id(candidate_id_2)

#     tests_1 = get_tests(assessment_id_1)
#     tests_2 = get_tests(assessment_id_2)

#     candidate_responses_1 = get_candidate_questions_answer_responses(candidate_id_1)
#     candidate_responses_2 = get_candidate_questions_answer_responses(candidate_id_2)
#     answered_questions_1 = {response['question'] for response in candidate_responses_1}
#     answered_questions_2 = {response['question'] for response in candidate_responses_2}

#     response_1 = []
#     response_2 = []
#     total_accuracy_1 = 0
#     total_accuracy_2 = 0

#     for test_1, test_2 in zip(tests_1, tests_2):
#         test_name_1 = test_1['name']
#         test_name_2 = test_2['name']

#         total_duration_1, total_questions_1, unanswered_questions_1 = calculate_test_statistics(test_name_1, answered_questions_1)
#         total_duration_2, total_questions_2, unanswered_questions_2 = calculate_test_statistics(test_name_2, answered_questions_2)

#         questions_1 = get_questions(test_name_1, candidate_id_1)
#         questions_2 = get_questions(test_name_2, candidate_id_2)

#         accuracy_1, correct_count_1, total_test_questions_1 = calculate_accuracy(questions_1)
#         accuracy_2, correct_count_2, total_test_questions_2 = calculate_accuracy(questions_2)

#         total_accuracy_1 += accuracy_1
#         total_accuracy_2 += accuracy_2

#         test_1['total_duration'] = total_duration_1
#         test_1['total_questions'] = total_questions_1
#         test_1['unanswered_questions'] = len(unanswered_questions_1)
#         test_1['answered_questions'] = total_questions_1 - len(unanswered_questions_1)

#         test_2['total_duration'] = total_duration_2
#         test_2['total_questions'] = total_questions_2
#         test_2['unanswered_questions'] = len(unanswered_questions_2)
#         test_2['answered_questions'] = total_questions_2 - len(unanswered_questions_2)

#         response_1.append({
#             "test_name": test_name_1,
#             "test_title": test_1["title"],
#             "accuracy": accuracy_1,
#             "total_questions": total_questions_1,
#             "correct_count": correct_count_1,
#             "incorrect_count": total_test_questions_1 - correct_count_1,
#             "total_duration": total_duration_1,
#             "answered_questions": test_1['answered_questions'],
#             "unanswered_questions": test_1['unanswered_questions'],
#         })

#         response_2.append({
#             "test_name": test_name_2,
#             "test_title": test_2["title"],
#             "accuracy": accuracy_2,
#             "total_questions": total_questions_2,
#             "correct_count": correct_count_2,
#             "incorrect_count": total_test_questions_2 - correct_count_2,
#             "total_duration": total_duration_2,
#             "answered_questions": test_2['answered_questions'],
#             "unanswered_questions": test_2['unanswered_questions'],
#         })

#     total_tests_1 = len(tests_1)
#     total_tests_2 = len(tests_2)
#     assessment_average_1 = total_accuracy_1 / total_tests_1 if total_tests_1 else 0
#     assessment_average_2 = total_accuracy_2 / total_tests_2 if total_tests_2 else 0

#     return {
#         "candidate_1": {
#             "candidate_id": candidate_id_1,
#             "applicant_name": applicant_name_1,
#             "assessment": assessment_id_1,
#             "tests": response_1,
#             "assessment_average": assessment_average_1,
#         },
#         "candidate_2": {
#             "candidate_id": candidate_id_2,
#             "applicant_name": applicant_name_2,
#             "assessment": assessment_id_2,
#             "tests": response_2,
#             "assessment_average": assessment_average_2,
#         }
#     }
