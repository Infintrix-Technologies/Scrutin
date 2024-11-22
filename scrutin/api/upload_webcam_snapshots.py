# # in your_app/api.py
# import frappe
# from frappe.utils.file_manager import save_file

# @frappe.whitelist(allow_guest=True, methods=["POST"])
# def upload_webcam_snapshot(scrutin_candidate, image_data):
#     try:
#         # Convert base64 image_data to file
#         file_doc = save_file(
#             fname=f"{scrutin_candidate}_webcam_snapshot.png",
#             content=image_data,
#             dt="Scrutin Candidate",
#             dn=scrutin_candidate,
#             is_private=0
#         )

#         # Create a new child table entry in Scrutin Webcam Snapshot
#         snapshot_doc = frappe.get_doc({
#             "doctype": "Scrutin Webcam Snapshot",
#             "image": file_doc.file_url
#         })
#         snapshot_doc.insert(ignore_permissions=True)

#         # Link the snapshot to the Scrutin Candidate
#         candidate_doc = frappe.get_doc("Scrutin Candidate", scrutin_candidate)
#         candidate_doc.append("web_cam_snapshots", {
#             "web_cam_snapshot": snapshot_doc.name
#         })
#         candidate_doc.save(ignore_permissions=True)

#         return {"status": "success", "message": "Image uploaded successfully"}
#     except Exception as e:
#         frappe.log_error(message=e, title="Image Upload Error")
#         return {"status": "error", "message": str(e)}





# import frappe
# from frappe.utils.file_manager import save_file

# @frappe.whitelist(allow_guest=True)
# def upload_image(candidate_name, image_file):
#     # Check if Scrutin Candidate exists
#     if not frappe.db.exists('Scrutin Candidate', candidate_name):
#         return {"error": "Scrutin Candidate not found"}

#     # Save the image file
#     _file = save_file(image_file, 'Scrutin Candidate', candidate_name, is_private=1)

#     # Create a new child table entry
#     new_snapshot = {
#         'doctype': 'Scrutin Webcam Snapshot',
#         'image': _file.file_url
#     }

#     # Append the new snapshot to the Scrutin Candidate
#     candidate_doc = frappe.get_doc('Scrutin Candidate', candidate_name)
#     candidate_doc.append('web_cam_snapshots', new_snapshot)
#     candidate_doc.save()

#     return {"message": "Image uploaded successfully", "file_url": _file.file_url}








# custom_app/api.py

# import frappe
# from frappe.utils.file_manager import save_file

# @frappe.whitelist()
# def upload_image(candidate_name, image_file):
#     # Validate inputs
#     if not candidate_name or not image_file:
#         frappe.throw("Candidate name and image path are required.")

#     # Find the Candidate Doctype record
#     candidate = frappe.get_doc("Scrutin Candidate", candidate_name)
#     if not candidate:
#         frappe.throw(f"Candidate with name {candidate_name} not found.")

#     # Read the image file
#     with open(image_file, "rb") as image_file:
#         image_content = image_file.read()

#     # Save the file in Frappe's file system
#     file_doc = save_file(
#         fname=image_file.split("/")[-1],
#         content=image_content,
#         dt="Scrutin Candidate",
#         dn=candidate_name,
#         is_private=0
#     )

#     # Link the file to the Child Doctype
#     new_snapshot = frappe.get_doc({
#         "doctype": "Scrutin Webcam Snapshot",
#         "parent": candidate_name,
#         "parentfield": "web_cam_snapshots",
#         "parenttype": "Scrutin Candidate",
#         "image": file_doc.file_url
#     })
#     new_snapshot.insert()

#     return {
#         "message": "Image uploaded successfully",
#         "file_url": file_doc.file_url
#     }





















# import frappe
# from frappe.utils.file_manager import save_file
# from frappe.query_builder import DocType

# @frappe.whitelist()
# def upload_image(candidate_name, image_file):
#     # Validate inputs
#     if not candidate_name or not image_file:
#         frappe.throw("Candidate name and image path are required.")

#     # Define DocTypes
#     ScrutinCandidate = DocType("Scrutin Candidate")
#     ScrutinWebcamSnapshot = DocType("Scrutin Webcam Snapshot")

#     # Find the Candidate Doctype record using Query Builder
#     candidate = frappe.qb.from_(ScrutinCandidate).select(ScrutinCandidate.name).where(ScrutinCandidate.name == candidate_name).run()

#     if not candidate:
#         frappe.throw(f"Candidate with name {candidate_name} not found.")

#     # Read the image file
#     with open(image_file, "rb") as file:
#         image_content = file.read()

#     # Save the file in Frappe's file system
#     file_doc = save_file(
#         fname=image_file.split("/")[-1],
#         content=image_content,
#         dt="Scrutin Candidate",
#         dn=candidate_name,
#         is_private=0
#     )

#     # Insert the new snapshot into the Child Doctype using Query Builder
#     frappe.qb.into(ScrutinWebcamSnapshot).insert(
#         "parent", "parentfield", "parenttype", "image"
#     ).values(
#         candidate_name, "web_cam_snapshots", "Scrutin Candidate", file_doc.file_url
#     ).run()

#     return {
#         "message": "Image uploaded successfully",
#         "file_url": file_doc.file_url
#     }



















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
