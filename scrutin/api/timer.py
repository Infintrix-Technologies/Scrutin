import time

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


