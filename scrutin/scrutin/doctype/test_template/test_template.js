// Copyright (c) 2024, Infintrix Technologies and contributors
// For license information, please see license.txt

// frappe.ui.form.on("Test Template", {
// 	refresh(frm) {

// 	},
// });


frappe.ui.form.on('Test Template', {
    import_test: function(frm){
        if (frm.doc.import_test) {
            frappe.call({
                method: "scrutin.api.test_template.create_scrutin_test_from_template",
                args: {
                    template_id: frm.doc.name
                },
                callback: function(r) {
                    if (r.message) {
                        frappe.msgprint(__("Test Template imported successfully", [frm.doc.name]));
                    }
                }
            });
        } else {
            frappe.msgprint(__("No Test Template to import"));
        }
    }
})