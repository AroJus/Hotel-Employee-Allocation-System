from django.db import models
from django.contrib.auth.hashers import make_password, check_password

# Create your models here.

# user_table
# id, username, password, last_name, first_name, userlevel, userstatus, email 
class User(models.Model):
    username = models.CharField(max_length=100)
    password = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    first_name = models.CharField(max_length=100)
    userlevel = models.CharField(max_length=100, default="admin")
    userstatus = models.BooleanField(default=True)
    email = models.CharField(max_length=100)

    def set_password(self, raw_password):
        self.password = make_password(raw_password)
        self.save()

    def check_password(self, raw_password):
        return check_password(raw_password, self.password)

    def __str__(self):
        return self.username

# employee_table
# id, empname, jobposition 
class Employee(models.Model):
    empname = models.CharField(max_length=100, blank=False)
    jobposition = models.CharField(max_length=100, blank=False)

    def __str__(self):
        return self.empname

# task_table
# id, taskname, employee_assigned 
class Task(models.Model):
    taskname = models.CharField(max_length=100)
    employee_assigned = models.ForeignKey(
        Employee, 
        on_delete=models.CASCADE, 
        related_name='tasks',
        null=True,  # Allow null temporarily for migration
        blank=True
    )

    def __str__(self):
        return self.taskname

# schedule_table
# id, employee_assigned, time, days 
class Schedule(models.Model):
    employee_assigned = models.ForeignKey(
        Employee, 
        on_delete=models.CASCADE, 
        related_name='schedules',
        null=True,  # Allow null temporarily for migration
        blank=True
    )
    time = models.TimeField()
    days = models.CharField(max_length=100)  # e.g., "Monday, Tuesday"

    def __str__(self):
        return f"{self.employee_assigned} - {self.days}"

class Notification(models.Model):
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name="notifications")
    title = models.CharField(max_length=255)
    message = models.TextField()
    time = models.DateTimeField(auto_now_add=True)
    read = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.title} for {self.employee.empname}"