import frappe
from frappe.query_builder import DocType
from frappe.utils.file_manager import save_file

@frappe.whitelist()
def upload_image(candidate_name, image_file):
    
    if not candidate_name or not image_file:
        frappe.throw("Candidate name and image file are required.")
    
    if isinstance(image_file, dict):

        image_content = frappe.get_file(image_file.get("file_url")).get("content")
    else:
        with open(image_file, "rb") as f:
            image_content = f.read()

    candidate = frappe.get_doc("Scrutin Candidate", candidate_name)
    if not candidate:
        frappe.throw(f"Candidate with name {candidate_name} not found.")
    
    file_doc = save_file(
        fname=image_file.split("/")[-1] if isinstance(image_file, str) else "uploaded_image",
        content=image_content,
        dt="Scrutin Candidate",
        dn=candidate_name,
        is_private=0
    )

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

