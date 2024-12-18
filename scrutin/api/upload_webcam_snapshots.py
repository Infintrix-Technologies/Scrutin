import frappe
from frappe.query_builder import DocType


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

