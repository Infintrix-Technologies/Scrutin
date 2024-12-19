# import frappe
# from frappe.query_builder import DocType


# @frappe.whitelist()
# def get_candidate_webcam_snapshot(candidate_id):
#     ScrutinCandidate = DocType("Scrutin Candidate")
#     ScrutinWebcam = DocType("Scrutin Webcam Snapshot")

#     webcam_query = (
#         frappe.qb.from_(ScrutinCandidate)
#         .left_join(ScrutinWebcam)
#         .on(ScrutinWebcam.parent == ScrutinCandidate.name)
#         .select(
#             ScrutinCandidate.name.as_("candidate_id"),
#             ScrutinWebcam.image,
#         )
#         .where(ScrutinCandidate.name == candidate_id)
#     )
#     webcam_snapshots = webcam_query.run(as_dict=True)
#     return webcam_snapshots









# import frappe
# import requests
from frappe import _ 
# from frappe.utils.file_manager import save_file

# @frappe.whitelist()
# def upload_image_from_url(url, doctype='File', docname=None):
#     # Fetch the image content from the URL
#     response = requests.get(url)
    
#     if response.status_code == 200:
#         # Extract the image content
#         image_content = response.content
#         image_name = url.split("/")[-1]
        
#         # Save the file in the "File" DocType
#         file_doc = save_file(image_name, image_content, doctype, docname, is_private=0)
#         frappe.db.commit()
        
#         return file_doc
#     else:
#         frappe.throw(_("Failed to download the image from the URL. Please check the URL and try again."))



# @frappe.whitelist()
# def upload_image_from_url(url, doctype='File', docname=None):
#     try:
#         # Fetch the image content from the URL
#         response = requests.get(url)
        
#         # Check if the request was successful
#         if response.status_code == 200:
#             # Extract the image content
#             image_content = response.content
#             image_name = url.split("/")[-1]
            
#             # Save the file in the "File" DocType
#             file_doc = save_file(image_name, image_content, doctype, docname, is_private=0)
#             frappe.db.commit()
            
#             return file_doc
#         else:
#             # Log the response status code and reason
#             frappe.throw(_("Failed to download the image from the URL. Status Code: {0}, Reason: {1}").format(response.status_code, response.reason))
#     except Exception as e:
#         # Catch any other exceptions and log the error message
#         frappe.throw(_("An error occurred while downloading the image: {0}").format(str(e)))




import frappe
from frappe.utils.file_manager import save_file
import os


@frappe.whitelist()
def upload_local_image(file_path, doctype='File', docname=None):
    try:
        # Check if the file exists
        if os.path.exists(file_path):
            # Extract the image content
            with open(file_path, 'rb') as file:
                image_content = file.read()
            
            # Extract the image name
            image_name = os.path.basename(file_path)
            
            # Save the file in the "File" DocType
            file_doc = save_file(image_name, image_content, doctype, docname, is_private=0)
            frappe.db.commit()
            
            return file_doc
        else:
            frappe.throw(_("File does not exist at the specified path: {0}").format(file_path))
    except Exception as e:
        # Catch any other exceptions and log the error message
        frappe.throw(_("An error occurred while uploading the image: {0}").format(str(e)))


