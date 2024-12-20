import frappe
from frappe.query_builder import DocType


@frappe.whitelist()
def get_file_data(doctype, docname):
    File = DocType("File")

    file_query = (
        frappe.qb.from_(File)
            .select(File.name,
                    File.file_name,
                    File.file_size,
                    File.file_type,
                    File.is_private,
                    File.file_url,
                    File.attached_to_doctype,
                    File.attached_to_name,
                    File.attached_to_field
            )
            .where(
                (File.attached_to_doctype == doctype)
                &(File.attached_to_name == docname))
                    
        )
    
    file_data = file_query.run(as_dict=True)
    return file_data



