import frappe
from frappe.query_builder import DocType
from frappe.query_builder import functions as fn


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

#this api give the candidate Job_applicant_name and Assessment_name and also give the assessment count that one candidate have
@frappe.whitelist()
def get_applicant_name_assessment_name_for_candidate():

    ScrutinCandidate = DocType("Scrutin Candidate")
    ScrutinAssessment = DocType("Scrutin Assessment")
    JobApplicant = DocType("Job Applicant")

    candidate_detail = (
        frappe.qb.from_(ScrutinCandidate)
        .left_join(ScrutinAssessment)
        .on(ScrutinAssessment.name == ScrutinCandidate.assessment)
        .left_join(JobApplicant)
        .on(JobApplicant.name == ScrutinCandidate.job_applicant)
        .select(
            ScrutinCandidate.name.as_("candidate_id"),
            ScrutinAssessment.assessment_name,
            JobApplicant.applicant_name,
            ScrutinCandidate.job_applicant,
            fn.Count(ScrutinCandidate.job_applicant).as_("Assessments"),
            ScrutinCandidate.invited_on,
        )
        .groupby(ScrutinCandidate.job_applicant)
    ).run(as_dict=True)

    return candidate_detail


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
def get_assessment_data(assessment_name):
    ScrutinAssessment = DocType("Scrutin Assessment")
    ScrutinAssessmentQuestion = DocType("Scrutin Assessment Questions")
    ScrutinQuestion = DocType("Scrutin Question")
    ScrutinAssessmentTest = DocType("Scrutin Assessment Tests")
    ScrutinTest = DocType("Scrutin Test")
    ScrutinTestQuestion = DocType("Scrutin Test Question")
    ScrutinCandidate = DocType("Scrutin Candidate")
    JobApplicant = DocType("Job Applicant")

    #Query to get the candidate of the specific assessment
    candidate_query = (
        frappe.qb.from_(ScrutinCandidate)
        .left_join(ScrutinAssessment)
        .on(ScrutinAssessment.name == ScrutinCandidate.assessment)
        .left_join(JobApplicant)
        .on(JobApplicant.name == ScrutinCandidate.job_applicant)
        .select(
            ScrutinCandidate.name.as_("candidate_name"),
            ScrutinCandidate.job_applicant,
            ScrutinCandidate.status,
            ScrutinCandidate.invited_on,
            ScrutinAssessment.assessment_name,
            JobApplicant.applicant_name
        )
        .where(ScrutinCandidate.assessment == assessment_name)
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
            ScrutinQuestion.type
        )
        .where(ScrutinAssessment.name == assessment_name)
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
        .where(ScrutinAssessment.name == assessment_name)
    )
    tests = tests_query.run(as_dict=True)

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

    return {
        'custom_questions': custom_questions,
        'tests': tests,
        'candidate_name': candidate_name,
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
            ScrutinCandidate.status,
            ScrutinCandidate.invited_on,
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




# @frappe.whitelist()

# def get_test_questions_options(test_id):
    ScrutinQuestion = DocType("Scrutin Question")
    ScrutinQuestionOption = DocType("Scrutin Question Option")

    option_query = (
        frappe.qb.from_(ScrutinQuestion)
        .left_join(ScrutinQuestionOption)
        .on(ScrutinQuestion.name == ScrutinQuestionOption.parent)
        .select(
            ScrutinQuestionOption.value,
            ScrutinQuestionOption.label,
            ScrutinQuestion.question,
        )
        .where(ScrutinQuestion.name == test_id)
    )
    options = option_query.run(as_dict=True)
    return options




#This API give the all question of Test and also give the 
# @frappe.whitelist()
# def get_test_details_with_options(test_name):
    ScrutinTest = DocType("Scrutin Test")
    ScrutinTestQuestion = DocType("Scrutin Test Question")
    ScrutinQuestion = DocType("Scrutin Question")
    ScrutinQuestionOption = DocType("Scrutin Question Option")
    ScrutinAssessment = DocType("Scrutin Assessment")
    ScrutinAssessmentTest = DocType("Scrutin Assessment Tests")
    
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
        .where(ScrutinTest.name == test_name)
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
        .where(ScrutinTest.name == test_name)
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


#This API give me the specific assessment all tests and their questions with options
@frappe.whitelist()
def get_assessment_test_and_question_with_options(assessment_name):
    ScrutinAssessment = DocType("Scrutin Assessment")
    ScrutinAssessmentTest = DocType("Scrutin Assessment Tests")
    ScrutinTest = DocType("Scrutin Test")
    ScrutinTestQuestion = DocType("Scrutin Test Question")
    ScrutinQuestion = DocType("Scrutin Question")
    ScrutinQuestionOption = DocType("Scrutin Question Option")
    
    # Query to get tests for the given assessment
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
        .where(ScrutinAssessment.name == assessment_name)
    )
    tests = tests_query.run(as_dict=True)

    # Initialize the final response and total assessment duration
    response = []
    total_assessment_duration = 0

    for test in tests:
        test_name = test['test']
        
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
                    ScrutinQuestion.duration.as_("question_duration"))
            .where(ScrutinTest.name == test_name)
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
            .where(ScrutinTest.name == test_name)
        )
        duration_result = duration_query.run(as_dict=True)
        test_total_duration = duration_result[0]['test_total_duration'] if duration_result else 0
        
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
        
        # Add the test details to the response
        response.append({
            'test': test_name,
            'title': test['title'],
            'weight': test['weight'],
            'questions': questions,
            'test_total_duration': test_total_duration
        })
        
        # Add the test total duration to the total assessment duration
        total_assessment_duration += test_total_duration
    
    # Add total assessment duration to the response
    return {
        'tests': response,
        'total_assessment_duration': total_assessment_duration
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
            ScrutinTest.name,
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
