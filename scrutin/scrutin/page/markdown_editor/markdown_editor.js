frappe.pages['markdown-editor'].on_page_load = function(wrapper) {
	let page = frappe.ui.make_app_page({
		parent: wrapper,
		title: 'Markdown Editor',
		single_column: true
	});
	page.set_primary_action("Save", () => {
		// console.log("Save Clicked");
		frappe.msgprint("Save Clicked");
	})
	// add a normal menu item
	page.add_action_item('Delete', () => delete_items())

	page.set_indicator("Unsaved", "red")

	setup_fields(page);
}

frappe.pages['markdown-editor'].on_page_show = function(wrapper) {
	frappe.require('editor.bundle.js').then(() => {
		
	})
}

function setup_fields(page) {
	let is_document_field_added = false;
	let is_fieldname_field_added = false;
	let doctype_field = page.add_field({
		label: 'Document Type',
		fieldtype: 'Link',
		fieldname: 'document_type',
		options: 'DocType',
		async change() {
			const doctype = doctype_field.get_value();
			const fields = await get_fields(doctype)

			// page.clear_fields();
			if(!is_document_field_added){

				let document_field = page.add_field({
					label: 'Document',
					fieldtype: 'Link',
					fieldname: 'document',
					options: doctype,
					change() {
						// console.log(document_field.get_value());
						const document_name = document_field.get_value();
	
						let fieldname_field = page.add_field({
							label: "Markdown Field",
							fieldtype: "Select",
							fieldname: "fieldname",
                            options: fields,
                            
						});
					},
				});
			}else {
				//handle later
			}    
		}
	});
}


 async function get_fields(doctype_name) {

	await frappe.model.with_doctype(doctype_name);

	let fields = frappe.meta
	    .get_docfields(doctype_name, null, {
			// fieldtype: ["not in", frappe.model.no_value_type],
			fieldtype: ["in", "Markdown Editor"],
		})
		.sort((a, b) => {
			if (a.label && b.label) {
				return a.label.localeCompare(b.label);
			}
		})
		.map((df)=> ({
			label:`${df.label ||__("No Label")} (${df.fieldtype})`,
			value: df.fieldname,
		}))
		// .map((df) => (df.label))

	// df.options = df.options.concat(fields);
		// console.log(fields);
		return fields;

}