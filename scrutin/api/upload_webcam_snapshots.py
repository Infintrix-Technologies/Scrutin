import frappe
import base64
import requests
from frappe import _
from frappe.query_builder import DocType
from frappe.utils.file_manager import save_file


@frappe.whitelist()
def get_candidate_webcam_snapshot(candidate_id):
    ScrutinCandidate = DocType("Scrutin Candidate")
    ScrutinWebcam = DocType("Scrutin Webcam Snapshot")

    webcam_query = (
        frappe.qb.from_(ScrutinCandidate)
        .left_join(ScrutinWebcam)
        .on(ScrutinWebcam.parent == ScrutinCandidate.name)
        .select(
            ScrutinCandidate.name.as_("candidate_id"),
            ScrutinWebcam.image,
        )
        .where(ScrutinCandidate.name == candidate_id)
    )
    webcam_snapshots = webcam_query.run(as_dict=True)
    return webcam_snapshots




#This API is upload images that are already uploaded to the server
@frappe.whitelist()
def upload_image(data, file_name, attached_to_doctype, attached_to_name,  is_private=0):
    if data.startswith('http://') or data.startswith('https://'):
        
        response = requests.get(data)
        if response.status_code == 200:
            image_content = response.content
            image_name = file_name if file_name else data.split("/")[-1]
        else:
            frappe.throw(_("Failed to download the image from the URL. Please check the URL and try again."))
    elif data.startswith('data:image/'):
    
        header, encoded = data.split(',', 1)
        file_extension = header.split(';')[0].split('/')[1]
        image_content = base64.b64decode(encoded)
        image_name = file_name if file_name else f"uploaded_image.{file_extension}"
    else:
        frappe.throw(_("Invalid data format. Please provide a valid URL or a base64 encoded image."))

    try:
        file_doc = save_file(
            image_name, 
            image_content, 
            attached_to_doctype, 
            attached_to_name, 
            is_private=is_private
        )
        frappe.db.commit()
        return file_doc
    except Exception as e:
        frappe.throw(_("An error occurred while uploading the image: {0}").format(str(e)))

        




# @frappe.whitelist()
# def upload_webcam_snapshot(file, parent_docname):
#     # Ensure the file is uploaded
#     if not file:
#         frappe.throw("File is required")

#     # Save the file and link it to the parent DocType (Scrutin Candidate)
#     try:
#         # Save the file in the system
#         uploaded_file = save_file(
#             file_name=file.filename,
#             content=file.stream.read(),
#             dt="Scrutin Candidate",
#             dn=parent_docname,
#             is_private=1
#         )

#         # Add a new row to the Webcam Snapshots child table
#         parent_doc = frappe.get_doc("Scrutin Candidate", parent_docname)
#         parent_doc.append("web_cam_snapshots", {
#             "image": uploaded_file.file_url
#         })
#         parent_doc.save()

#         return {
#             "status": "success",
#             "file_url": uploaded_file.file_url
#         }
#     except Exception as e:
#         frappe.throw(f"File upload failed: {str(e)}")







