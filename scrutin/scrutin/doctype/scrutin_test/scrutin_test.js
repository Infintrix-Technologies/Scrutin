// Copyright (c) 2024, Infintrix Technologies and contributors
// For license information, please see license.txt

// frappe.ui.form.on("Scrutin Test", {
// 	refresh(frm) {

// 	},
// });


frappe.ui.form.on("Scrutin Test", {
    refresh(frm) {
        frm.add_custom_button(__("Export Test"), function(){
            frappe.call({
                method: "scrutin.api.test_template.create_test_template_from_test",
                args: {
                    test_id: frm.doc.name
                },
                callback: function(r) {
                    if (!r.exc) {
                        frappe.msgprint(__("Test exported successfully"));
                        frappe.desk.notify_success(__("Test exported successfully"));
                    } else {
                        frappe.msgprint(__("An error occurred while exporting the Test"));
                    }
                }
            });

        }, __("Actions"));
        frm.change_custom_button_type("Export Test", "Actions", "warning");
    }
});