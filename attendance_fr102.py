import csv
from datetime import datetime, timedelta

# List of students in the class
students = [
    "Sadiya Aliyu",
    "Lawan Ahmad",
    "Bashiru",
    "Anta Diop",
    "Maya Angelou"
]

# Semester start and end dates (Fall 2025)
semester_start = datetime(2025, 8, 25)  # Assume Aug 25, 2025 (Monday)
semester_end = datetime(2025, 12, 12)   # Assume Dec 12, 2025 (Friday)

# Days class meets: Monday=0, Wednesday=2, Friday=4
class_days = [0, 2, 4]

# Generate list of class dates
def get_class_dates(start, end, days):
    current = start
    dates = []
    while current <= end:
        if current.weekday() in days:
            dates.append(current)
        current += timedelta(days=1)
    return dates

class_dates = get_class_dates(semester_start, semester_end, class_days)

# Attendance dictionary: {date: {student_name: 'P' or 'A'}}
attendance = {}

def take_attendance_for_date(date):
    print(f"\nTaking attendance for {date.strftime('%A, %B %d, %Y')}")
    attendance[date.strftime('%Y-%m-%d')] = {}
    for student in students:
        while True:
            status = input(f"Is {student} present? (P/A): ").strip().upper()
            if status in ['P', 'A']:
                attendance[date.strftime('%Y-%m-%d')][student] = status
                break
            else:
                print("Invalid input. Enter 'P' for present or 'A' for absent.")

def save_attendance_to_csv(filename="attendance_FR102_Fall2025.csv"):
    with open(filename, mode='w', newline='') as file:
        writer = csv.writer(file)
        # Header row: Date, then students
        header = ["Date"] + students
        writer.writerow(header)
        
        for date in class_dates:
            date_str = date.strftime('%Y-%m-%d')
            row = [date_str]
            if date_str in attendance:
                for student in students:
                    row.append(attendance[date_str].get(student, 'A'))  # Default to Absent if no data
            else:
                row += ['A'] * len(students)
            writer.writerow(row)
    print(f"\nAttendance saved to {filename}")

def main():
    print("FR102 Fall 2025 - Attendance Taking\n")
    for date in class_dates:
        take_attendance_for_date(date)
    
    save_attendance_to_csv()

if __name__ == "__main__":
    main()
