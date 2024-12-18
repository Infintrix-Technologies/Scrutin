import frappe
from frappe.query_builder import DocType



@frappe.whitelist()
def anti_cheating_checks(candidate_id, ip_address, web_cam_always_enable, full_screen_always_active, mouse_always_in_test_window):

    ScrutinCandidate = DocType("Scrutin Candidate")

    (
        frappe.qb.update(ScrutinCandidate)
        .set(ScrutinCandidate.filled_out_only_once_from_ip_address, ip_address)
        .set(ScrutinCandidate.web_cam_enabled, web_cam_always_enable)
        .set(ScrutinCandidate.full_screen_mode_always_active, full_screen_always_active)
        .set(ScrutinCandidate.mouse_always_in_assessment_window, mouse_always_in_test_window)
        .where(ScrutinCandidate.name == candidate_id)
    ).run()