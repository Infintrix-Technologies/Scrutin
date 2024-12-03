// Copyright (c) 2024, Infintrix Technologies and contributors
// For license information, please see license.txt

// frappe.ui.form.on("Scrutin Candidate", {
// 	refresh(frm) {

//         // console.log("Show Assessments based on designations: ",frm)
//         frappe.msgprint(__("Show the Assessments based on designations"));

// 	},
// });

frappe.ui.form.on('Scrutin Candidate', {
    job_applicant: function(frm) {
        update_assessment_field_visibility(frm);
        if (frm.doc.job_applicant && frm.doc.assessments_based_on_designation) {
            fetch_and_set_assessments(frm);
        } else {
            clear_assessment_options(frm);
        }
    },
    assessments_based_on_designation: function(frm) {
        update_assessment_field_visibility(frm);
        if (frm.doc.assessments_based_on_designation && frm.doc.job_applicant) {
            fetch_and_set_assessments(frm);
        } else {
            clear_assessment_options(frm);
        }
    }
});

function fetch_and_set_assessments(frm) {
    frappe.call({
        method: "scrutin.api.assessment_based_on_designation.get_assessment_based_on_designation",
        args: {
            applicant_id: frm.doc.job_applicant
        },
        callback: function(r) {
            if (r.message) {
                const assessments = r.message.map(item => item.assessment_name);

                frm.set_query('assessment', function() {
                    return {
                        filters: [
                            ['Scrutin Assessment', 'name', 'in', assessments]
                        ]
                    };
                });
                frm.refresh_field('assessment');

                if (assessments.length === 1) {
                    frm.set_value('assessment', assessments[0]);
                }
            }
        }
    });
}

function update_assessment_field_visibility(frm) {
    if (frm.doc.job_applicant && frm.doc.assessments_based_on_designation) {
        frm.set_df_property('assessment', 'hidden', 0);
    } else {
        frm.set_df_property('assessment', 'hidden', 1);
        frm.set_value('assessment', null);
    }
    frm.refresh_field('assessment');
}

function clear_assessment_options(frm) {
    frm.set_value('assessment', null);
    frm.set_query('assessment', function() {
        return {
            filters: [
                ['Scrutin Assessment', 'name', 'in', []]
            ]
        };
    });
    frm.refresh_field('assessment');
}


