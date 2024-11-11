import frappe
from frappe import _
from datetime import datetime, timedelta

@frappe.whitelist()
def check_room_availability(room, start_time, end_time, date):
    existing_meetings = frappe.get_all("Meeting", filters={
        "room": room,
        "date": date,
        "start_time": ["<", end_time],
        "end_time": [">", start_time]
    }, fields=["end_time"], order_by="end_time desc")

    if existing_meetings:

        last_meeting_end_time = existing_meetings[0].get('end_time')
        next_available_start_time = (last_meeting_end_time + timedelta(hours=1)).time()
        return {
            "message": True,
            "end_time": last_meeting_end_time.strftime('%H:%M:%S'),
            "suggested_start_time": next_available_start_time.strftime('%H:%M:%S')
        }
    return {"message": False}
