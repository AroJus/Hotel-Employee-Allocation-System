from django.urls import path
from .views import login_view, logout_view, notification_delete, notification_list_create, refresh_token_view, get_users, create_user, update_user, delete_user, get_employee, create_employee, update_employee, delete_employee, get_tasks, create_task, update_task, delete_task, get_schedules, create_schedule, update_schedule, delete_schedule

urlpatterns = [
    path('user/login/', login_view, name='login'),
    path('user/logout/', logout_view, name='logout'),
    path('user/refresh/', refresh_token_view, name='token_refresh'),
    #user
    path('user/', get_users, name='get_users'),
    path('user/create/', create_user, name='create_user'),
    path('user/update/<int:pk>/', update_user, name='update_user'),
    path('user/delete/<int:pk>/', delete_user, name='delete_user'),
    #employee
    path('employee/', get_employee, name='get_employee'),
    path('employee/create/', create_employee, name='create_employee'),
    path('employee/update/<int:pk>/', update_employee, name='update_employee'),
    path('employee/delete/<int:pk>/', delete_employee, name='delete_employee'),
    #task
    path('task/', get_tasks, name='get_tasks'),
    path('task/create/', create_task, name='create_task'),
    path('task/update/<int:pk>/', update_task, name='update_task'),
    path('task/delete/<int:pk>/', delete_task, name='delete_task'),
    #schedule
    path('schedule/', get_schedules, name='get_schedules'),
    path('schedule/create/', create_schedule, name='create_schedule'),
    path('schedule/update/<int:pk>/', update_schedule, name='update_schedule'),
    path('schedule/delete/<int:pk>/', delete_schedule, name='delete_schedule'),
    # notification
    path("notification/", notification_list_create, name="notification-list-create"),
    path("notification/create/", notification_list_create, name="notification-create"),
    path("notification/delete/<int:pk>/", notification_delete, name="notification-delete"),
]