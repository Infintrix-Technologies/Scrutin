import frappe
from frappe import _
from datetime import datetime
from frappe.query_builder import DocType
from frappe.query_builder import functions as fn


#Assessment List Page API
@frappe.whitelist()
def assessment_list_page_api(assessment_name=None):
    ScrutinAssessment = DocType("Scrutin Assessment")
    ScrutinCandidate = DocType("Scrutin Candidate")
    
    candidate_count = (
        frappe.qb.from_(ScrutinCandidate)
        .select(ScrutinCandidate.assessment, fn.Count('*').as_('candidate_count'))
        .groupby(ScrutinCandidate.assessment)
    ).as_("candidate_count")
    
    query = (
        frappe.qb.from_(ScrutinAssessment)
        .left_join(candidate_count).on(ScrutinAssessment.name == candidate_count.assessment)
        .select(
            ScrutinAssessment.name,
            ScrutinAssessment.assessment_name,
            ScrutinAssessment.company,
            ScrutinAssessment.language,
            candidate_count.candidate_count
        )
    )
    
    # Add a filter if assessment_name is provided
    if assessment_name:
        query = query.where(ScrutinAssessment.assessment_name.like(f"%{assessment_name}%"))
    
    results = query.run(as_dict=True)
    return results

def search_assessment(self, text, limit=20):
    # Use the assessment_list_page_api to get the filtered assessment list based on assessment_name
    assessments = assessment_list_page_api(assessment_name=text)
    
    # Apply limit if needed
    if limit:
        assessments = assessments[:limit]
    
    return assessments


#This API provide the Job_title for Job_applicant
@frappe.whitelist()
def get_applicant_jobtitle():
    applicant = DocType("Job Applicant")
    job_title = DocType("Job Opening")

    query = (
        frappe.qb.from_(job_title)
        .join(applicant)
        .on(job_title.name == applicant.job_title)
        .select(
            job_title.job_title,
            applicant.applicant_name
        )
    )
    results = query.run(as_dict=True)
    return results


#Test list to search candidate based on test for candidate list page
@frappe.whitelist()
def test_list():
    ScrutinTest = DocType("Scrutin Test")

    test_query = (
        frappe.qb.from_(ScrutinTest)
            .select(ScrutinTest.name,
                    ScrutinTest.title,
            )
    )
    test_list = test_query.run(as_dict=True)
    return test_list


#this api give the candidate Job_applicant_name and Assessment_name and also give the assessment count that one candidate have
@frappe.whitelist()
def candidate_list_api(assessment_id=None, test_id=None, applicant_name=None):
    ScrutinCandidate = DocType("Scrutin Candidate")
    ScrutinAssessment = DocType("Scrutin Assessment")
    JobApplicant = DocType("Job Applicant")
    ScrutinTest = DocType("Scrutin Test")
    ScrutinAssessmentTest = DocType("Scrutin Assessment Tests")

    # Create the base query
    query = (
        frappe.qb.from_(ScrutinCandidate)
        .left_join(ScrutinAssessment)
        .on(ScrutinAssessment.name == ScrutinCandidate.assessment)
        .left_join(JobApplicant)
        .on(JobApplicant.name == ScrutinCandidate.job_applicant)
        .select(
            ScrutinCandidate.name.as_("candidate_id"),
            ScrutinAssessment.assessment_name,
            ScrutinCandidate.assessment,
            JobApplicant.applicant_name,
            ScrutinCandidate.job_applicant,
            fn.Count(ScrutinCandidate.job_applicant).as_("Assessments"),
            ScrutinCandidate.invited_on,
        )
        .groupby(ScrutinCandidate.job_applicant)
    )

    # Add a filter if assessment_id is provided
    if assessment_id:
        query = query.where(ScrutinCandidate.assessment == assessment_id)

    # Add a filter if test_id is provided
    if test_id:
        query = query.left_join(ScrutinAssessmentTest).on(ScrutinAssessmentTest.parent == ScrutinAssessment.name)
        query = query.left_join(ScrutinTest).on(ScrutinAssessmentTest.test == ScrutinTest.name)
        query = query.where(ScrutinTest.name == test_id)
    
    # Add a filter if applicant_name is provided
    if applicant_name:
        query = query.where(JobApplicant.applicant_name.like(f"%{applicant_name}%"))

    candidate_detail = query.run(as_dict=True)

    return candidate_detail

def search_candidate(self, text, scope=None, limit=20):
    # Use the candidate_list_api to get the filtered candidate list based on applicant_name
    candidates = candidate_list_api(applicant_name=text)
    
    # Optionally apply scope and limit if needed
    if scope:
        # Implement scope-specific logic if required
        pass

    if limit:
        candidates = candidates[:limit]

    return candidates

#This API provide the questions of individual test and also provide the total duration of the test
@frappe.whitelist()
def get_questions_for_test_and_total_duration(test_name):
    ScrutinTest = DocType("Scrutin Test")
    ScrutinTestQuestion = DocType("Scrutin Test Question")
    ScrutinQuestion = DocType("Scrutin Question")
    
    # Query to get questions for the given test
    question_query = (
        frappe.qb.from_(ScrutinTestQuestion)
        .inner_join(ScrutinTest)
        .on(ScrutinTest.name == ScrutinTestQuestion.parent)
        .inner_join(ScrutinQuestion)
        .on(ScrutinTestQuestion.question == ScrutinQuestion.name)
        .select(ScrutinTestQuestion.question, 
                ScrutinQuestion.question.as_("question_text"),
                ScrutinQuestion.type,
                ScrutinQuestion.duration.as_("question_duration"),
                )
        .where(ScrutinTest.name == test_name)
    )
    tests = question_query.run(as_dict=True)

    # Query to calculate the total duration for the test
    duration_query = (
        frappe.qb.from_(ScrutinTestQuestion)
        .inner_join(ScrutinTest)
        .on(ScrutinTest.name == ScrutinTestQuestion.parent)
        .inner_join(ScrutinQuestion)
        .on(ScrutinTestQuestion.question == ScrutinQuestion.name)
        .select(fn.Sum(ScrutinQuestion.duration).as_("test_total_duration"))
        .where(ScrutinTest.name == test_name)
    )
    duration_result = duration_query.run(as_dict=True)
    total_duration = duration_result[0]['test_total_duration'] if duration_result else 0

    # Add total duration to the response
    return {
        'questions': tests,
        'test_total_duration': total_duration
    }


#This API will provide the candidate assessment based on the email because email is used as a id in candidate
# @frappe.whitelist()
# def get_candidate_assessment(email):
    ScrutinCandidate = DocType("Scrutin Candidate")
    ScrutinAssessment = DocType("Scrutin Assessment")
    JobApplicant = DocType("Job Applicant")
    ScrutinAssessmentTest = DocType("Scrutin Assessment Tests")
    ScrutinTest = DocType("Scrutin Test")

    assessment_query = (
        frappe.qb.from_(ScrutinAssessment)
        .left_join(ScrutinCandidate)
        .on(ScrutinCandidate.assessment == ScrutinAssessment.name)
        .left_join(JobApplicant)
        .on(JobApplicant.name == ScrutinCandidate.job_applicant)
        .select(
            ScrutinAssessment.assessment_name,
            ScrutinCandidate.job_applicant,
            ScrutinCandidate.name,
        )
        .where(ScrutinCandidate.job_applicant == email)
    )
    candidate_assessment = assessment_query.run(as_dict=True)

    tests_query = (
        frappe.qb.from_(ScrutinAssessmentTest)
        .inner_join(ScrutinAssessment)
        .on(ScrutinAssessment.name == ScrutinAssessmentTest.parent)
        .inner_join(ScrutinTest)
        .on(ScrutinAssessmentTest.test == ScrutinTest.name)
        .select(
            ScrutinAssessmentTest.test,
            ScrutinAssessmentTest.weight,
            ScrutinTest.title
        )
        .where(ScrutinAssessment.name == ScrutinCandidate.assessment)
    )
    tests = tests_query.run(as_dict=True)

    return {
        'candidate_assessment': candidate_assessment,
        'tests': tests
    }


#This APIs give the all details about the assessment like assessment total candidate, assessment all tests
#and assessment all custom questions and it also give the total duration of each test present in the assessment
@frappe.whitelist()
def get_assessment_data(assessment_id):
    ScrutinAssessment = DocType("Scrutin Assessment")
    ScrutinAssessmentQuestion = DocType("Scrutin Assessment Questions")
    ScrutinQuestion = DocType("Scrutin Question")
    ScrutinAssessmentTest = DocType("Scrutin Assessment Tests")
    ScrutinTest = DocType("Scrutin Test")
    ScrutinTestQuestion = DocType("Scrutin Test Question")
    ScrutinCandidate = DocType("Scrutin Candidate")
    JobApplicant = DocType("Job Applicant")

    assessment_query = (
        frappe.qb.from_(ScrutinAssessment)
        .select(ScrutinAssessment.assessment_name)
        .where(ScrutinAssessment.name == assessment_id)
    )
    assessment_data = assessment_query.run(as_dict=True)

    # Query to get the candidate of the specific assessment
    candidate_query = (
        frappe.qb.from_(ScrutinCandidate)
        .left_join(ScrutinAssessment)
        .on(ScrutinAssessment.name == ScrutinCandidate.assessment)
        .left_join(JobApplicant)
        .on(JobApplicant.name == ScrutinCandidate.job_applicant)
        .select(
            ScrutinCandidate.name.as_("candidate_id"),
            ScrutinCandidate.job_applicant,
            ScrutinCandidate.status,
            ScrutinCandidate.invited_on,
            JobApplicant.applicant_name
        )
        .where(ScrutinCandidate.assessment == assessment_id)
    )

    candidate_name = candidate_query.run(as_dict=True)

    # Query to get custom questions of the specific assessment
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

    # Query to get all tests of the specific assessment
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
        'custom_questions': custom_questions,
        'tests': tests,
        'candidate_name': candidate_name,
    }




#New API for Assessment Detail Page
# These both api are used for the assessment_detail page
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

    exists_query = (
        frappe.qb.from_(ScrutinAssessment)
        .select(ScrutinAssessment.name)
        .where(ScrutinAssessment.name == assessment_id)
    )
    assessment_exists = exists_query.run(as_dict=True)
    
    if not assessment_exists:
        raise frappe.DoesNotExistError(f"Candidate with ID {assessment_id} does not exist")

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
            JobApplicant.applicant_name,
            JobApplicant.applicant_rating,
            JobApplicant.status.as_("applicant_status"),
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

#This api is used on the assesment_detail page that give average of each candidate test and assessment
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

        question_count_query = (
            frappe.qb.from_(ScrutinTestQuestion)
            .inner_join(ScrutinTest)
            .on(ScrutinTest.name == ScrutinTestQuestion.parent)
            .select(fn.Count(ScrutinTestQuestion.question).as_("total_questions"))
            .where(ScrutinTest.name == test_name)
        )
        question_count_result = question_count_query.run(as_dict=True)
        total_questions = question_count_result[0]['total_questions'] if question_count_result else 0

        # Check correctness and calculate statistics
        correct_count = 0
        for question in questions:
            question["is_correct"] = question["candidate_answer"] == question["actual_answer"]
            if question["is_correct"]:
                correct_count += 1

        accuracy = (correct_count / total_questions * 100) 
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







#This api provides all details about Specific candidate based on the email (Not by name or ID)
@frappe.whitelist()
def get_combined_candidate_detail_with_snapshot(email):
    ScrutinCandidate = DocType("Scrutin Candidate")
    ScrutinAssessment = DocType("Scrutin Assessment")
    JobApplicant = DocType("Job Applicant")
    ScrutinAssessmentTest = DocType("Scrutin Assessment Tests")
    ScrutinTest = DocType("Scrutin Test")
    ScrutinAssessmentQuestion = DocType("Scrutin Assessment Questions")
    ScrutinQuestion = DocType("Scrutin Question")
    ScrutinWebcam = DocType("Scrutin Webcam Snapshot")

    exists_query = (
        frappe.qb.from_(ScrutinCandidate)
        .select(ScrutinCandidate.name)
        .where(ScrutinCandidate.job_applicant == email)
    )
    candidate_exists = exists_query.run(as_dict=True)
    
    if not candidate_exists:
        raise frappe.DoesNotExistError(f"Candidate with ID {email} does not exist")

    # Query to get the assessments and candidate details for the specific job applicant email
    assessment_query = (
        frappe.qb.from_(ScrutinAssessment)
        .left_join(ScrutinCandidate)
        .on(ScrutinCandidate.assessment == ScrutinAssessment.name)
        .left_join(JobApplicant)
        .on(JobApplicant.name == ScrutinCandidate.job_applicant)
        .select(
            ScrutinAssessment.name.as_("assessment_name"),
            ScrutinAssessment.assessment_name.as_("assessment_title"),
            ScrutinCandidate.job_applicant,
            ScrutinCandidate.name.as_("candidate_id"),
            JobApplicant.applicant_name.as_("candidate_name"),
            JobApplicant.applicant_rating,
            JobApplicant.status.as_("applicant_status"),
            ScrutinCandidate.status,
            ScrutinCandidate.invited_on,
            ScrutinCandidate.assessment_completed_at,
            ScrutinCandidate.filled_out_only_once_from_ip_address,
            ScrutinCandidate.web_cam_enabled,
            ScrutinCandidate.full_screen_mode_always_active,
            ScrutinCandidate.mouse_always_in_assessment_window,
        )
        .where(JobApplicant.name == email)  # Ensure email field matches
    )
    candidate_assessments = assessment_query.run(as_dict=True)

    # If no assessments are found, return an empty result
    if not candidate_assessments:
        return {'candidate_assessment': [], 'tests': [], 'questions': [], 'webcam_snapshots': []}

    assessment_names = [assessment['assessment_name'] for assessment in candidate_assessments]

    # Query to get the tests for each assessment
    tests_query = (
        frappe.qb.from_(ScrutinAssessmentTest)
        .inner_join(ScrutinAssessment)
        .on(ScrutinAssessment.name == ScrutinAssessmentTest.parent)
        .inner_join(ScrutinTest)
        .on(ScrutinAssessmentTest.test == ScrutinTest.name)
        .select(
            ScrutinAssessment.name.as_("assessment_name"),
            ScrutinAssessmentTest.test,
            ScrutinAssessmentTest.weight,
            ScrutinTest.title,
        )
        .where(ScrutinAssessment.name.isin(assessment_names))
    )
    tests = tests_query.run(as_dict=True)

    # Query to get the questions for each assessment
    questions_query = (
        frappe.qb.from_(ScrutinAssessmentQuestion)
        .inner_join(ScrutinAssessment)
        .on(ScrutinAssessment.name == ScrutinAssessmentQuestion.parent)
        .inner_join(ScrutinQuestion)
        .on(ScrutinAssessmentQuestion.question == ScrutinQuestion.name)
        .select(
            ScrutinAssessment.name.as_("assessment_name"),
            ScrutinAssessmentQuestion.question,
            ScrutinQuestion.question,
        )
        .where(ScrutinAssessment.name.isin(assessment_names))
    )
    questions = questions_query.run(as_dict=True)

    # Query to get the webcam snapshots for the candidate(s)
    candidate_ids = [assessment['candidate_id'] for assessment in candidate_assessments]
    webcam_query = (
        frappe.qb.from_(ScrutinCandidate)
        .left_join(ScrutinWebcam)
        .on(ScrutinWebcam.parent == ScrutinCandidate.name)
        .select(
            ScrutinCandidate.name.as_("candidate_id"),
            ScrutinWebcam.image,
        )
        .where(ScrutinCandidate.name.isin(candidate_ids))
    )
    webcam_snapshots = webcam_query.run(as_dict=True)

    # Group tests and questions under their respective assessments
    assessment_dict = {assessment['assessment_name']: assessment for assessment in candidate_assessments}
    for test in tests:
        assessment_name = test['assessment_name']
        if 'tests' not in assessment_dict[assessment_name]:
            assessment_dict[assessment_name]['tests'] = []
        assessment_dict[assessment_name]['tests'].append({
            'test': test['test'],
            'weight': test['weight'],
            'title': test['title'],
        })

    for question in questions:
        assessment_name = question['assessment_name']
        if 'questions' not in assessment_dict[assessment_name]:
            assessment_dict[assessment_name]['questions'] = []
        assessment_dict[assessment_name]['questions'].append({
            'question': question['question'],
            'question_text': question['question'],
        })

    # Combine webcam snapshots with candidate assessments
    for snapshot in webcam_snapshots:
        candidate_id = snapshot['candidate_id']
        for assessment in candidate_assessments:
            if assessment['candidate_id'] == candidate_id:
                if 'webcam_snapshots' not in assessment:
                    assessment['webcam_snapshots'] = []
                assessment['webcam_snapshots'].append(snapshot['image'])

    # Convert the assessments back to a list
    result_assessments = list(assessment_dict.values())

    return {
        'candidate_assessment': result_assessments,
    }




#This API give the all question of Test and also give the Total Duration of the Test
@frappe.whitelist()
def get_test_details_with_options(test_id):
    ScrutinTest = DocType("Scrutin Test")
    ScrutinTestQuestion = DocType("Scrutin Test Question")
    ScrutinQuestion = DocType("Scrutin Question")
    ScrutinQuestionOption = DocType("Scrutin Question Option")
    
    # Query to get questions for the given test
    question_query = (
        frappe.qb.from_(ScrutinTestQuestion)
        .inner_join(ScrutinTest)
        .on(ScrutinTest.name == ScrutinTestQuestion.parent)
        .inner_join(ScrutinQuestion)
        .on(ScrutinTestQuestion.question == ScrutinQuestion.name)
        .select(ScrutinTestQuestion.question, 
                ScrutinQuestion.question.as_("question_text"),
                ScrutinQuestion.type,
                ScrutinTest.title,
                ScrutinQuestion.duration.as_("question_duration"))
        .where(ScrutinTest.name == test_id)
    )
    questions = question_query.run(as_dict=True)
    
    # Query to calculate the total duration for the test
    duration_query = (
        frappe.qb.from_(ScrutinTestQuestion)
        .inner_join(ScrutinTest)
        .on(ScrutinTest.name == ScrutinTestQuestion.parent)
        .inner_join(ScrutinQuestion)
        .on(ScrutinTestQuestion.question == ScrutinQuestion.name)
        .select(fn.Sum(ScrutinQuestion.duration).as_("test_total_duration"))
        .where(ScrutinTest.name == test_id)
    )
    duration_result = duration_query.run(as_dict=True)
    total_duration = duration_result[0]['test_total_duration'] if duration_result else 0
    
    # Add options for each question
    for question in questions:
        option_query = (
            frappe.qb.from_(ScrutinQuestionOption)
            .select(
                ScrutinQuestionOption.value,
                ScrutinQuestionOption.label
            )
            .where(ScrutinQuestionOption.parent == question['question'])
        )
        options = option_query.run(as_dict=True)
        question['options'] = options
    
    # Add total duration to the response
    return {
        'questions': questions,
        'test_total_duration': total_duration
    }



# this API for Candidacy OverView Page
@frappe.whitelist()
def get_specific_assessment_tests(assessment_name):
    ScrutinAssessment = DocType("Scrutin Assessment")
    ScrutinTest = DocType("Scrutin Test")
    ScrutinAssessmentTest = DocType("Scrutin Assessment Tests")
    ScrutinQuestion = DocType("Scrutin Question")
    ScrutinTestQuestion = DocType("Scrutin Test Question")
    ScrutinAssessmentQuestion = DocType("Scrutin Assessment Questions")

    # Query to get the total number of Custom questions
    custom_question_count_query = (
            frappe.qb.from_(ScrutinAssessmentQuestion)
            .select(fn.Count(ScrutinAssessmentQuestion.question).as_("total_custom_questions"))
            .where(ScrutinAssessmentQuestion.parent == assessment_name)
        )
    custom_question_count_result = custom_question_count_query.run(as_dict=True)
    total_custom_questions = custom_question_count_result[0]['total_custom_questions'] if custom_question_count_result else 0

    # Query to get tests for each assessment
    tests_query = (
        frappe.qb.from_(ScrutinAssessmentTest)
        .inner_join(ScrutinAssessment)
        .on(ScrutinAssessment.name == ScrutinAssessmentTest.parent)
        .inner_join(ScrutinTest)
        .on(ScrutinTest.name == ScrutinAssessmentTest.test)
        .select(
            ScrutinAssessment.assessment_name,
            # ScrutinTest.name,
            ScrutinTest.title,
        )
        .where(ScrutinAssessment.name == assessment_name)
    )
    tests = tests_query.run(as_dict=True)

    for test in tests:
        test_name = test['name']
        
        # Query to get total duration of the test
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
        
        # Query to get total number of questions in the test
        question_count_query = (
            frappe.qb.from_(ScrutinTestQuestion)
            .inner_join(ScrutinTest)
            .on(ScrutinTest.name == ScrutinTestQuestion.parent)
            .select(fn.Count(ScrutinTestQuestion.question).as_("total_questions"))
            .where(ScrutinTest.name == test_name)
        )
        question_count_result = question_count_query.run(as_dict=True)
        total_questions = question_count_result[0]['total_questions'] if question_count_result else 0
        
        test['total_duration'] = total_duration
        test['total_questions'] = total_questions
        

    return {
        "tests": tests,
        "custom_questions": total_custom_questions,
    }















#These two APIs are used to calculate the Candidate Responses on Specific Test and Test Question

#This API will give the specific candidate test and test_questions
@frappe.whitelist()
def get_candidate_responses(email):
    ScrutinCandidate = DocType("Scrutin Candidate")
    ScrutinAssessment = DocType("Scrutin Assessment")
    JobApplicant = DocType("Job Applicant")
    ScrutinAssessmentTest = DocType("Scrutin Assessment Tests")
    ScrutinTest = DocType("Scrutin Test")
    ScrutinQuestion = DocType("Scrutin Question")
    ScrutinTestQuestion = DocType("Scrutin Test Question")

    # Query to get the assessments and candidate details for the specific job applicant email
    assessment_query = (
        frappe.qb.from_(ScrutinAssessment)
        .left_join(ScrutinCandidate)
        .on(ScrutinCandidate.assessment == ScrutinAssessment.name)
        .left_join(JobApplicant)
        .on(JobApplicant.name == ScrutinCandidate.job_applicant)
        .select(
            ScrutinAssessment.name.as_("assessment_name"),
            ScrutinAssessment.assessment_name.as_("assessment_title"),
            ScrutinCandidate.job_applicant,
            ScrutinCandidate.name.as_("candidate_id"),
            JobApplicant.applicant_name.as_("candidate_name"),
        )
        .where(JobApplicant.name == email)  # Ensure email field matches
    )
    candidate_assessments = assessment_query.run(as_dict=True)

    # If no assessments are found, return an empty result
    if not candidate_assessments:
        return {'candidate_assessment': [], 'tests': []}

    assessment_names = [assessment['assessment_name'] for assessment in candidate_assessments]

    # Query to get the tests for each assessment
    tests_query = (
        frappe.qb.from_(ScrutinAssessmentTest)
        .inner_join(ScrutinAssessment)
        .on(ScrutinAssessment.name == ScrutinAssessmentTest.parent)
        .inner_join(ScrutinTest)
        .on(ScrutinAssessmentTest.test == ScrutinTest.name)
        .select(
            ScrutinAssessment.name.as_("assessment_name"),
            ScrutinAssessmentTest.test,
            ScrutinAssessmentTest.weight,
            ScrutinTest.title,
        )
        .where(ScrutinAssessment.name.isin(assessment_names))
    )
    tests = tests_query.run(as_dict=True)

    # Prepare to group tests and questions under their respective assessments
    assessment_dict = {assessment['assessment_name']: assessment for assessment in candidate_assessments}
    test_names = [test['test'] for test in tests]

    # Query to get the questions for each test
    question_query = (
        frappe.qb.from_(ScrutinTestQuestion)
        .inner_join(ScrutinTest)
        .on(ScrutinTest.name == ScrutinTestQuestion.parent)
        .inner_join(ScrutinQuestion)
        .on(ScrutinTestQuestion.question == ScrutinQuestion.name)
        .select(
            ScrutinTestQuestion.question,
            ScrutinQuestion.question.as_("question_text"),
            ScrutinQuestion.type,
            ScrutinTest.title.as_("test_title"),
            ScrutinQuestion.duration.as_("question_duration"),
        )
        .where(ScrutinTest.name.isin(test_names))
    )
    questions = question_query.run(as_dict=True)

    # Organize tests under their respective assessments
    for test in tests:
        assessment_name = test['assessment_name']
        if 'tests' not in assessment_dict[assessment_name]:
            assessment_dict[assessment_name]['tests'] = []
        test_entry = {
            'test': test['test'],
            'weight': test['weight'],
            'title': test['title'],
            'questions': []
        }
        # Add the test entry
        assessment_dict[assessment_name]['tests'].append(test_entry)

    # Organize questions under their respective tests
    for question in questions:
        for assessment in assessment_dict.values():
            for test in assessment.get('tests', []):
                if test['title'] == question['test_title']:
                    test['questions'].append({
                        'question': question['question'],
                        'question_text': question['question_text'],
                        'type': question['type'],
                        'duration': question['question_duration'],
                    })

    # Convert the assessments back to a list
    result_assessments = list(assessment_dict.values())

    return {
        'candidate_assessment': result_assessments,
    }


#This API give the Question & Answer in the responses of Candidate
@frappe.whitelist()
def get_candidate_response_questions_answer(candidate_id):
    ScrutinCandidate = DocType("Scrutin Candidate")
    ScrutinQuestionResponse = DocType("Scrutin Question Responses")
    # ScrutinTest = DocType("Scrutin Test")
    ScrutinQuestion = DocType("Scrutin Question")
    
    # Join the necessary tables
    query = (
        frappe.qb.from_(ScrutinCandidate)
        .join(ScrutinQuestionResponse)
        .on(ScrutinCandidate.name == ScrutinQuestionResponse.parent)
        # .join(ScrutinTest)
        # .on(ScrutinQuestionResponse.test == ScrutinTest.name)
        .join(ScrutinQuestion)
        .on(ScrutinQuestionResponse.question == ScrutinQuestion.name)
        .select(
            # ScrutinTest.name.as_("test"),
            # ScrutinTest.title,
            ScrutinQuestion.name.as_("question"),
            ScrutinQuestion.question.as_("question_content"),
            ScrutinQuestionResponse.answer,
            ScrutinQuestionResponse.answer.as_("marked_answer"),
        )
        .where(ScrutinCandidate.name == candidate_id)
    )
    
    # Execute the query
    results = query.run(as_dict=True)
    return results

    # Query to get the assessments and candidate details for the specific job applicant email

@frappe.whitelist()
def get_candidate_response_test(candidate_id):
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
    return results





# This API is POST the TEST into the Candidate Response Test Progress
@frappe.whitelist(allow_guest=True)
def add_test_progress(email, test_name, started_at=None, completed_at=None):
    # Fetch the Scrutin Candidate by email
    scrutin_candidate = frappe.get_value("Scrutin Candidate", {"job_applicant": email}, "name")
    if not scrutin_candidate:
        frappe.throw(_("Scrutin Candidate with email {0} not found").format(email))

    # Check if the test exists
    test_exists = frappe.get_value("Scrutin Test", {"name": test_name})
    if not test_exists:
        frappe.throw(_("Scrutin Test with name {0} not found").format(test_name))
    
    # Create a new Test Progress record
    test_progress = frappe.get_doc({
        "doctype": "Scrutin Test Progress",
        "parent": scrutin_candidate,
        "parentfield": "test_progress",
        "parenttype": "Scrutin Candidate",
        "test": test_name,
        "started_at": started_at,
        "completed_at": completed_at
    })
    test_progress.insert()

    return {"message": "Test progress added successfully", "test_progress": test_progress.name}




#API that will used on the Candidacy INTRO page
@frappe.whitelist()
def get_candidate_detail_for_intro(candidate_id):
    ScrutinCandidate = DocType("Scrutin Candidate")
    ScrutinAssessment = DocType("Scrutin Assessment")
    JobApplicant = DocType("Job Applicant")
    job_title = DocType("Job Opening")
    
    # Check if the candidate_id exists in Scrutin Candidate DocType
    exists_query = (
        frappe.qb.from_(ScrutinCandidate)
        .select(ScrutinCandidate.name)
        .where(ScrutinCandidate.name == candidate_id)
    )
    candidate_exists = exists_query.run(as_dict=True)
    
    if not candidate_exists:
        raise frappe.DoesNotExistError(f"Candidate with ID {candidate_id} does not exist")
    
    # If candidate exists, fetch the details
    query = (
        frappe.qb.from_(ScrutinAssessment)
        .left_join(ScrutinCandidate)
        .on(ScrutinCandidate.assessment == ScrutinAssessment.name)
        .left_join(JobApplicant)
        .on(JobApplicant.name == ScrutinCandidate.job_applicant)
        .left_join(job_title)
        .on(job_title.name == JobApplicant.job_title)
        .select(
            ScrutinAssessment.name.as_("assessment_name"),
            ScrutinAssessment.assessment_name.as_("assessment_title"),
            ScrutinCandidate.job_applicant,
            ScrutinCandidate.name.as_("candidate_id"),
            JobApplicant.applicant_name.as_("candidate_name"),
            job_title.job_title.as_("job_title"),
        )
        .where(ScrutinCandidate.name == candidate_id)
    )
    candidate_detail = query.run(as_dict=True)
    return candidate_detail




# This API is used to show data about specific candidate on OVERVIEW PAGE by candidate_id
# This show the total duration,(total, answer & unanswer) question of test
@frappe.whitelist()
def test_details_for_overview_page(candidate_id):
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
        
        current_time = datetime.now()
        
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
        test_progress_entry = progress_dict.get(test_name)
        if test_progress_entry:
            test['remaining_time'] = test_progress_entry['remaining_time']
            test['time_completed'] = test_progress_entry['time_completed']
        else:
            test['remaining_time'] = None
            test['time_completed'] = False

        # Determine if the test is completed
        test['test_completed'] = (test['answered_questions'] == test['total_questions']) or test['time_completed']

        if not test['test_completed']:
            all_tests_completed = False

    return {
        "tests": tests,
        "custom_questions": total_custom_questions,
        "applicant_name": applicant_name,
        "assessment_completed": all_tests_completed,
    }





