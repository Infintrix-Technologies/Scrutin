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




# @frappe.whitelist()
# def upload_local_image(file_path, doctype='File', docname=None):
#     try:
#         # Check if the file exists
#         if os.path.exists(file_path):
#             # Extract the image content
#             with open(file_path, 'rb') as file:
#                 image_content = file.read()
            
#             # Extract the image name
#             image_name = os.path.basename(file_path)
            
#             # Save the file in the "File" DocType
#             file_doc = save_file(image_name, image_content, doctype, docname, is_private=0)
#             frappe.db.commit()
            
#             return file_doc
#         else:
#             frappe.throw(_("File does not exist at the specified path: {0}").format(file_path))
#     except Exception as e:
#         # Catch any other exceptions and log the error message
#         frappe.throw(_("An error occurred while uploading the image: {0}").format(str(e)))




#This API is upload images that are already uploaded to the server
@frappe.whitelist()
def upload_image(data, file_name, attached_to_doctype, attached_to_name,  is_private=0):
    # Check if the input is a URL or a base64 string
    if data.startswith('http://') or data.startswith('https://'):
        # It's a URL
        response = requests.get(data)
        if response.status_code == 200:
            image_content = response.content
            image_name = file_name if file_name else data.split("/")[-1]
        else:
            frappe.throw(_("Failed to download the image from the URL. Please check the URL and try again."))
    elif data.startswith('data:image/'):
        # It's a base64 string
        header, encoded = data.split(',', 1)
        file_extension = header.split(';')[0].split('/')[1]
        image_content = base64.b64decode(encoded)
        image_name = file_name if file_name else f"uploaded_image.{file_extension}"
    else:
        frappe.throw(_("Invalid data format. Please provide a valid URL or a base64 encoded image."))

    # Save the file in the "File" DocType
    try:
        file_doc = save_file(
            image_name, 
            image_content, 
            attached_to_doctype, 
            attached_to_name, 
            # attached_to_field,
            is_private=is_private
        )
        frappe.db.commit()
        return file_doc
    except Exception as e:
        frappe.throw(_("An error occurred while uploading the image: {0}").format(str(e)))

        





#This api is based on the documentation but not tested yet 
def upload_image_to_doctype(api_url, api_token, file_path, doctype, docname, fieldname):
    """
    Upload an image file to a specified Doctype in Frappe.

    :param api_url: The base URL of the Frappe site.
    :param api_token: The API token for authentication in the format 'xxxx:yyyy'.
    :param file_path: The local path to the image file to be uploaded.
    :param doctype: The name of the Doctype to which the file should be uploaded.
    :param docname: The name of the specific document within the Doctype.
    :param fieldname: The field name where the file should be attached.
    """
    url = f"{api_url}/api/method/upload_file"
    headers = {
        'Accept': 'application/json',
        'Authorization': f'token {api_token}'
    }
    files = {
        'file': open(file_path, 'rb')
    }
    data = {
        'doctype': doctype,
        'docname': docname,
        'fieldname': fieldname,
        'is_private': 0  # Set to 1 if you want the file to be private
    }

    response = requests.post(url, headers=headers, files=files, data=data)

    if response.status_code == 200:
        return response.json()
    else:
        response.raise_for_status()

# Usage example
# api_url = 'http://your-frappe-site.com'
# api_token = 'xxxx:yyyy'
# file_path = '/path/to/file/file.png'
# doctype = 'Image File Upload'
# docname = 'your-docname'  # Replace with the specific document name or ID
# fieldname = 'Image'

# response = upload_image_to_doctype(api_url, api_token, file_path, doctype, docname, fieldname)
# print(response)
