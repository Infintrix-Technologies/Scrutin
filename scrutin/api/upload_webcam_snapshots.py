import frappe
from frappe.utils.file_manager import save_file

@frappe.whitelist()
def upload_image(candidate_name, image_file):
    # Validate inputs
    if not candidate_name or not image_file:
        frappe.throw("Candidate name and image file are required.")
    
    # Check if image_file is a dict (which it might be if it is a Frappe file object)
    if isinstance(image_file, dict):
        # If it's a Frappe file object, get its content directly
        image_content = frappe.get_file(image_file.get("file_url")).get("content")
    else:
        # Read the image file as a path if it's not a dict (old behavior)
        with open(image_file, "rb") as f:
            image_content = f.read()

    # Find the Candidate Doctype record
    candidate = frappe.get_doc("Scrutin Candidate", candidate_name)
    if not candidate:
        frappe.throw(f"Candidate with name {candidate_name} not found.")
    
    # Save the file in Frappe's file system
    file_doc = save_file(
        fname=image_file.split("/")[-1] if isinstance(image_file, str) else "uploaded_image",
        content=image_content,
        dt="Scrutin Candidate",
        dn=candidate_name,
        is_private=0
    )

    # Link the file to the Child Doctype
    new_snapshot = frappe.get_doc({
        "doctype": "Scrutin Webcam Snapshot",
        "parent": candidate_name,
        "parentfield": "web_cam_snapshots",
        "parenttype": "Scrutin Candidate",
        "image": file_doc.file_url
    })
    new_snapshot.insert()

    return {
        "message": "Image uploaded successfully",
        "file_url": file_doc.file_url
    }
