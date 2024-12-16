// Copyright (c) 2024, Infintrix Technologies and contributors
// For license information, please see license.txt

// frappe.ui.form.on("Scrutin Test Template", {
// 	refresh(frm) {

// 	},
// });


frappe.ui.form.on("Scrutin Test Template", {
    refresh(frm) {
        frm.add_custom_button(__("Import Test Template"), function () {
            frappe.call({
                method: "scrutin.api.test_template.create_scrutin_test_from_template",
                args: {
                    template_id: frm.doc.name
                },
                callback: function(r) {
                    if (!r.exc) {
                        frappe.msgprint(__("Test Template Imported Successfully"));
                        frm.reload_doc();
                    } else {
                        frappe.msgprint(__("An error occurred while importing the Test Template"));
                    }
                }
            });
        }, __("Actions"));
        frm.change_custom_button_type("Import Test Template", "Actions", "warning");
    }
});

