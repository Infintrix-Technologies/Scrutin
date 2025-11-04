import frappe
from frappe.query_builder import DocType


@frappe.whitelist()
def webcam_snapshot_api(candidate_id):
    File = DocType("File")

    file_query = (
        frappe.qb.from_(File)
            .select(File.file_url)
            .where(File.attached_to_name == candidate_id)           
        )
    file_data = file_query.run(as_dict=True)
    return file_data

       
