import frappe
from frappe.query_builder import DocType
from frappe.query_builder import functions as fn



# @frappe.whitelist()
# def get_assessment_data_for_assessment_detail_page(assessment_id):
#     ScrutinAssessment = DocType("Scrutin Assessment")
#     ScrutinCandidate = DocType("Scrutin Candidate")
#     JobApplicant = DocType("Job Applicant")

#     assessment_query = (
#         frappe.qb.from_(ScrutinAssessment)
#         .select(ScrutinAssessment.assessment_name)
#         .where(ScrutinAssessment.name == assessment_id)
#     )
#     assessment_data = assessment_query.run(as_dict=True)

#     candidate_query = (
#         frappe.qb.from_(ScrutinCandidate)
#         .left_join(ScrutinAssessment)
#         .on(ScrutinAssessment.name == ScrutinCandidate.assessment)
#         .left_join(JobApplicant)
#         .on(JobApplicant.name == ScrutinCandidate.job_applicant)
#         .select(
#             ScrutinCandidate.name.as_("candidate_id"),
#             ScrutinCandidate.job_applicant,
#             ScrutinCandidate.status,
#             ScrutinCandidate.invited_on,
#             JobApplicant.applicant_name
#         )
#         .where(ScrutinCandidate.assessment == assessment_id)
#     )
#     candidate_name = candidate_query.run(as_dict=True)
#     return {
#         'assessment_data': assessment_data,
#         'candidate_name': candidate_name,
#     }

# @frappe.whitelist()
# def get_candidate_test_response_report_for_assessment_detail_page(candidate_id):
    
#     ScrutinCandidate = DocType("Scrutin Candidate")
#     ScrutinAssessment = DocType("Scrutin Assessment")
#     ScrutinAssessmentTest = DocType("Scrutin Assessment Tests")
#     ScrutinTest = DocType("Scrutin Test")
#     ScrutinTestQuestion = DocType("Scrutin Test Question")
#     ScrutinQuestion = DocType("Scrutin Question")
#     ScrutinQuestionResponse = DocType("Scrutin Question Responses")

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

#     query = (
#         frappe.qb.from_(ScrutinCandidate)
#         .select(ScrutinCandidate.assessment)
#         .where(ScrutinCandidate.name == candidate_id)
#     )
#     candidate_assessments = query.run(as_dict=True)
#     if candidate_assessments:
#         assessment_id = candidate_assessments[0].get('assessment')
#     else:
#         assessment_id = None


#     tests_query = (
#         frappe.qb.from_(ScrutinAssessmentTest)
#         .inner_join(ScrutinAssessment)
#         .on(ScrutinAssessment.name == ScrutinAssessmentTest.parent)
#         .inner_join(ScrutinTest)
#         .on(ScrutinTest.name == ScrutinAssessmentTest.test)
#         .select(
#             ScrutinAssessment.assessment_name,
#             ScrutinTest.name,
#             ScrutinTest.title,
#         )
#         .where(ScrutinAssessment.name == assessment_id)
#     )
#     tests = tests_query.run(as_dict=True)

#     candidate_responses = get_candidate_questions_answer_responses(candidate_id)
#     answered_questions = {response['question'] for response in candidate_responses}

#     response = []
#     total_accuracy = 0

#     for test in tests:
#         test_name = test['name']

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
        
#         # Fetch total number of questions in the test
#         question_count_query = (
#             frappe.qb.from_(ScrutinTestQuestion)
#             .inner_join(ScrutinTest)
#             .on(ScrutinTest.name == ScrutinTestQuestion.parent)
#             .select(fn.Count(ScrutinTestQuestion.question).as_("total_questions"))
#             .where(ScrutinTest.name == test_name)
#         )
#         question_count_result = question_count_query.run(as_dict=True)
#         total_questions = question_count_result[0]['total_questions'] if question_count_result else 0


#         # Check if all questions in the test are answered
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

#         # Fetch questions and candidate's responses for the test
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
#         questions = question_query.run(as_dict=True)

#         # Check correctness and calculate statistics
#         correct_count = 0
#         for question in questions:
#             question["is_correct"] = question["candidate_answer"] == question["actual_answer"]
#             if question["is_correct"]:
#                 correct_count += 1

#         total_test_questions = len(questions)
#         accuracy = (correct_count / total_test_questions * 100) if total_test_questions else 0
#         total_accuracy += accuracy

#         # Update test details
#         test['total_duration'] = total_duration
#         test['total_questions'] = total_questions
#         test['unanswered_questions'] = len(unanswered_questions)
#         test['answered_questions'] = total_questions - len(unanswered_questions)

#         # Append test result to response
#         response.append({
#             "test_title": test["title"],
#             "accuracy": accuracy,
#             "total_questions": total_questions,
#             "total_duration": total_duration,
#         })

#     # Calculate the assessment average accuracy
#     total_tests = len(tests)
#     assessment_average = total_accuracy / total_tests if total_tests else 0

#     return {
#         "candidate_id": candidate_id,
#         "assessment": assessment_id,
#         "tests": response,
#         "total_tests": total_tests,
#         "assessment_average": assessment_average,
#     }








@frappe.whitelist()
def get_assessment_data_for_assessment_detail_page(assessment_id):
    ScrutinAssessment = DocType("Scrutin Assessment")
    ScrutinCandidate = DocType("Scrutin Candidate")
    JobApplicant = DocType("Job Applicant")
    ScrutinQuestion = DocType("Scrutin Question")
    ScrutinAssessmentTest = DocType("Scrutin Assessment Tests")
    ScrutinTest = DocType("Scrutin Test")
    ScrutinTestQuestion = DocType("Scrutin Test Question")
    ScrutinAssessmentQuestion = DocType("Scrutin Assessment Questions")

    assessment_query = (
        frappe.qb.from_(ScrutinAssessment)
        .select(ScrutinAssessment.assessment_name)
        .where(ScrutinAssessment.name == assessment_id)
    )
    assessment_data = assessment_query.run(as_dict=True)

    candidate_query = (
        frappe.qb.from_(ScrutinCandidate)
        .left_join(ScrutinAssessment)
        .on(ScrutinAssessment.name == ScrutinCandidate.assessment)
        .left_join(JobApplicant)
        .on(JobApplicant.name == ScrutinCandidate.job_applicant)
        .select(
            ScrutinCandidate.name.as_("candidate_id"),
            ScrutinCandidate.status,
            ScrutinCandidate.invited_on,
            JobApplicant.applicant_name
        )
        .where(ScrutinCandidate.assessment == assessment_id)
    )
    candidate_name = candidate_query.run(as_dict=True)

    # Adding candidate test response report to each candidate
    for candidate in candidate_name:
        candidate_id = candidate.get("candidate_id")
        candidate['test_response_report'] = get_candidate_test_response_report_for_assessment_detail_page(candidate_id)


    questions_query = (
        frappe.qb.from_(ScrutinAssessmentQuestion)
        .inner_join(ScrutinAssessment)
        .on(ScrutinAssessment.name == ScrutinAssessmentQuestion.parent)
        .inner_join(ScrutinQuestion)
        .on(ScrutinAssessmentQuestion.question == ScrutinQuestion.name)
        .select(
            ScrutinAssessmentQuestion.question,
            ScrutinQuestion.question,
            ScrutinQuestion.type,
            ScrutinQuestion.duration,
        )
        .where(ScrutinAssessment.name == assessment_id)
    )
    custom_questions = questions_query.run(as_dict=True)

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
        .where(ScrutinAssessment.name == assessment_id)
    )
    tests = tests_query.run(as_dict=True)

    total_duration_of_all_tests = 0  # Initialize total duration
    total_number_of_tests = len(tests)  # Get the total number of tests

    # Add total duration for each test
    for test in tests:
        test_name = test['test']
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
        test['total_duration'] = total_duration

        total_duration_of_all_tests += total_duration  # Add to total duration of all tests

    # Update assessment_data with total number of tests and total duration
    if assessment_data:
        assessment_data[0]['total_number_of_tests'] = total_number_of_tests
        assessment_data[0]['total_duration_of_all_tests'] = total_duration_of_all_tests


    return {
        'assessment_data': assessment_data,
        'candidate_name': candidate_name,
        'tests': tests,
        'custom_questions': custom_questions,
    }

def get_candidate_test_response_report_for_assessment_detail_page(candidate_id):
    
    ScrutinCandidate = DocType("Scrutin Candidate")
    ScrutinAssessment = DocType("Scrutin Assessment")
    ScrutinAssessmentTest = DocType("Scrutin Assessment Tests")
    ScrutinTest = DocType("Scrutin Test")
    ScrutinTestQuestion = DocType("Scrutin Test Question")
    ScrutinQuestion = DocType("Scrutin Question")
    ScrutinQuestionResponse = DocType("Scrutin Question Responses")

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
            ScrutinTest.name,
            ScrutinTest.title,
        )
        .where(ScrutinAssessment.name == assessment_id)
    )
    tests = tests_query.run(as_dict=True)


    response = []
    total_accuracy = 0

    for test in tests:
        test_name = test['name']


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

        # Check correctness and calculate statistics
        correct_count = 0
        for question in questions:
            question["is_correct"] = question["candidate_answer"] == question["actual_answer"]
            if question["is_correct"]:
                correct_count += 1

        total_test_questions = len(questions)
        accuracy = (correct_count / total_test_questions * 100) if total_test_questions else 0
        total_accuracy += accuracy

        # Append test result to response
        response.append({
            "test_title": test["title"],
            "accuracy": accuracy,
        })

    # Calculate the assessment average accuracy
    total_tests = len(tests)
    assessment_average = total_accuracy / total_tests if total_tests else 0

    return {
        "tests": response,
        "assessment_average": assessment_average,
    }
