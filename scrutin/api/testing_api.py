import frappe
import requests
from frappe.query_builder import DocType
from frappe.utils.file_manager import save_file


def upload_image_from_url(image_url, candidate_id):
    # Get the image content from the URL
    response = requests.get(image_url)
    response.raise_for_status()  # Ensure the request was successful

    # Get the filename from the URL
    filename = image_url.split("/")[-1]

    # Prepare file details for upload
    file_doc = frappe.get_doc({
        "doctype": "File",
        "file_name": filename,
        "attached_to_doctype": "Scrutin Candidate",
        "attached_to_name": candidate_id,
        "is_private": 0,
    })

    # Save the file document with the content
    file_doc.save(ignore_permissions=True)
    file_doc.write_file(content=response.content)

    return file_doc

def upload_webcam_snapshots(candidate_id):
    snapshots = get_candidate_webcam_snapshot(candidate_id)

    for snapshot in snapshots:
        image_url = snapshot["image"]
        upload_image_from_url(image_url, candidate_id)

    frappe.db.commit()

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








@frappe.whitelist(allow_guest=True)
def upload_image(filedata, candidate_id):
    """
    Upload an image and link it to the Scrutin Webcam Snapshot child table.
    :param filedata: Binary data of the file
    :param docname: Parent document name (Scrutin Candidate)
    :return: Success message
    """
    try:
        # Save the file to the file system
        file_doc = save_file('image.png', filedata, 'Scrutin Candidate', candidate_id, is_private=1)

        # Get the parent document
        candidate_doc = frappe.get_doc('Scrutin Candidate', candidate_id)

        # Create a new child document and assign the file URL
        new_snapshot = candidate_doc.append('webcam_snapshots', {
            'image': file_doc.file_url
        })

        # Save the parent document
        candidate_doc.save(ignore_permissions=True)
        
        return {'status': 'success', 'message': 'File uploaded and linked successfully'}
    except Exception as e:
        frappe.log_error(frappe.get_traceback(), 'upload_image')
        return {'status': 'error', 'message': str(e)}





@frappe.whitelist()
def get_file_data(file_id):
    File = DocType("File")

    file_query = (
        frappe.qb.from_(File)
            .select(File.name,
                    File.file_name,
                    File.file_size,
                    File.file_type,
                    File.is_private,
                    File.attached_to_doctype,
                    File.attached_to_name,
                    File.attached_to_field
            )
            .where(File.name == file_id)
                    
        )
    
    file_data = file_query.run(as_dict=True)
    return file_data




@frappe.whitelist()
def add_webcam_snapshot(candidate_id, image):
    try:
        # file_doc = save_file('image.png', filedata, 'Scrutin Candidate', candidate_id, is_private=1)

        candidate = frappe.get_doc("Scrutin Candidate", candidate_id)
        
        candidate.append("web_cam_snapshots", {
            "image": image,
        })

        candidate.save()
        frappe.db.commit()
        return f"Webcam snapshots added successfully for candidate {candidate_id}"
    
    except Exception as e:
        frappe.db.rollback()
        return f"An error occurred: {e}"

