import time
import frappe
from datetime import datetime, timedelta

def countdown_timer(seconds):
    time_updates = []
    for remaining in range(seconds, 0, -1):
        mins, secs = divmod(remaining, 60)
        timeformat = '{:02d}:{:02d}'.format(mins, secs)
        time_updates.append(timeformat)
        print(timeformat, end='\r', flush=True) 
        time.sleep(1)
    time_updates.append("00:00\nTime's up!")
    print("00:00\nTime's up!") 
    return time_updates

countdown_timer(20)





#Example Function how to start a timer in frappe framework
def start_timer(duration):
    # Save the timer start time and duration
    timer_doc = frappe.get_doc({
        "doctype": "Timer",
        "start_time": datetime.now(),
        "duration": duration
    })
    timer_doc.insert()
    return timer_doc.name

@frappe.whitelist()
def get_timer_status(timer_name):
    # Fetch the timer details
    timer_doc = frappe.get_doc("Timer", timer_name)
    start_time = timer_doc.start_time
    duration = timer_doc.duration
    end_time = start_time + timedelta(seconds=duration)
    remaining_time = (end_time - datetime.now()).total_seconds()
    return {
        "start_time": start_time,
        "duration": duration,
        "remaining_time": max(0, remaining_time)
    }