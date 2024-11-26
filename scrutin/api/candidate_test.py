# Ensure the "CandidateProgress" DocType exists and has the necessary 
# fields (candidate_id, current_test, current_question).
# This code assumes that frappe.qb is the query builder for Frappe, and DocType is a function 
# to reference DocTypes in Frappe.
# Adjust the syntax as per your actual implementation.
# Replace the pseudo-code for database operations (like initializing progress) 
# with actual Frappe database operation functions.



from frappe import qb
from frappe.query_builder import DocType
import frappe 

def get_question_with_navigation(candidate_id, action):
    ScrutinAssessment = DocType("Scrutin Assessment")
    ScrutinAssessmentTest = DocType("Scrutin Assessment Tests")
    ScrutinTest = DocType("Scrutin Test")
    ScrutinTestQuestion = DocType("Scrutin Test Question")
    ScrutinQuestion = DocType("Scrutin Question")
    ScrutinQuestionOption = DocType("Scrutin Question Option")
    ScrutinCandidate = DocType("Scrutin Candidate")
    CandidateProgress = DocType("Candidate Progress")

    # Get the assessment name for the candidate
    query = (
        qb.from_(ScrutinCandidate)
        .select(ScrutinCandidate.assessment)
        .where(ScrutinCandidate.name == candidate_id)
    )
    candidate_assessments = query.run(as_dict=True) 
    if candidate_assessments:
        assessment_name = candidate_assessments[0].get('assessment')
    else:
        assessment_name = None

    # Get the current test and question for the candidate from CandidateProgress
    progress_query = (
        qb.from_(CandidateProgress)
        .select(
            CandidateProgress.current_test,
            CandidateProgress.current_question
        )
        .where(CandidateProgress.candidate_id == candidate_id)
    )
    progress = progress_query.run(as_dict=True)
    
    if not progress:
        # Initialize the candidate progress if not found
        tests_query = (
            qb.from_(ScrutinAssessmentTest)
            .inner_join(ScrutinAssessment)
            .on(ScrutinAssessment.name == ScrutinAssessmentTest.parent)
            .inner_join(ScrutinTest)
            .on(ScrutinAssessmentTest.test == ScrutinTest.name)
            .select(ScrutinAssessmentTest.test)
            .where(ScrutinAssessment.name == assessment_name)
        )
        tests = tests_query.run(as_dict=True)
        if tests:
            current_test = tests[0]['test']
            current_question = 0
            # Initialize progress in database (replace with actual insert code)
            qb.into(CandidateProgress).insert(
                CandidateProgress.candidate_id, CandidateProgress.current_test, CandidateProgress.current_question
            ).values(candidate_id, current_test, current_question).run()
        else:
            return {"error": "No tests found for the assessment"}
    else:
        current_test = progress[0]['current_test']
        current_question = progress[0]['current_question']

    # Get questions for the current test
    question_query = (
        qb.from_(ScrutinTestQuestion)
        .inner_join(ScrutinTest)
        .on(ScrutinTest.name == ScrutinTestQuestion.parent)
        .inner_join(ScrutinQuestion)
        .on(ScrutinTestQuestion.question == ScrutinQuestion.name)
        .select(ScrutinTestQuestion.question, 
                ScrutinQuestion.question.as_("question_text"),
                ScrutinQuestion.type)
        .where(ScrutinTest.name == current_test)
    )
    questions = question_query.run(as_dict=True)
    
    if not questions:
        return {"error": "No questions found for the test"}

    # Handle navigation
    if action == "next":
        current_question += 1
        if current_question >= len(questions):
            # Move to the next test
            tests_query = (
                qb.from_(ScrutinAssessmentTest)
                .inner_join(ScrutinAssessment)
                .on(ScrutinAssessment.name == ScrutinAssessmentTest.parent)
                .inner_join(ScrutinTest)
                .on(ScrutinAssessmentTest.test == ScrutinTest.name)
                .select(ScrutinAssessmentTest.test)
                .where(ScrutinAssessment.name == assessment_name)
            )
            tests = tests_query.run(as_dict=True)
            test_index = [test['test'] for test in tests].index(current_test)
            if test_index + 1 < len(tests):
                current_test = tests[test_index + 1]['test']
                current_question = 0
            else:
                return {"message": "Assessment completed"}
    elif action == "back":
        current_question -= 1
        if current_question < 0:
            tests_query = (
                qb.from_(ScrutinAssessmentTest)
                .inner_join(ScrutinAssessment)
                .on(ScrutinAssessment.name == ScrutinAssessmentTest.parent)
                .inner_join(ScrutinTest)
                .on(ScrutinAssessmentTest.test == ScrutinTest.name)
                .select(ScrutinAssessmentTest.test)
                .where(ScrutinAssessment.name == assessment_name)
            )
            tests = tests_query.run(as_dict=True)
            test_index = [test['test'] for test in tests].index(current_test)
            if test_index - 1 >= 0:
                current_test = tests[test_index - 1]['test']
                question_query = (
                    qb.from_(ScrutinTestQuestion)
                    .inner_join(ScrutinTest)
                    .on(ScrutinTest.name == ScrutinTestQuestion.parent)
                    .inner_join(ScrutinQuestion)
                    .on(ScrutinTestQuestion.question == ScrutinQuestion.name)
                    .select(ScrutinTestQuestion.question, 
                            ScrutinQuestion.question.as_("question_text"),
                            ScrutinQuestion.type)
                    .where(ScrutinTest.name == current_test)
                )
                questions = question_query.run(as_dict=True)
                current_question = len(questions) - 1
            else:
                return {"message": "No previous test"}

    # Update the candidate's progress
    qb.update(CandidateProgress).set(
        CandidateProgress.current_test, CandidateProgress.current_question
    ).where(CandidateProgress.candidate_id == candidate_id).values(current_test, current_question).run()

    # Get the current question details
    current_question_details = questions[current_question]

    # Get options for the current question
    option_query = (
        qb.from_(ScrutinQuestionOption)
        .select(ScrutinQuestionOption.value, ScrutinQuestionOption.label)
        .where(ScrutinQuestionOption.parent == current_question_details['question'])
    )
    options = option_query.run(as_dict=True)
    current_question_details['options'] = options

    return current_question_details
