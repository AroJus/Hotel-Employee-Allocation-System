from rest_framework.response import Response
from rest_framework.decorators import api_view
from .models import User, Task, Employee, Schedule, Notification
from .serializers import UserSerializer, TaskSerializer, EmployeeSerializer, ScheduleSerializer, NotificationSerializer
from rest_framework_simplejwt.tokens import RefreshToken
import json
from django.contrib.auth import authenticate
from rest_framework import status, generics
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.decorators import permission_classes


# Create your views here.
@api_view(['POST'])
def login_view(request):
    try:
        data = json.loads(request.body)
        username = data.get('username')
        password = data.get('password')

        try:
            user = User.objects.get(username=username)
        except User.DoesNotExist:
            return Response({'message': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

        if user.check_password(password):
            refresh = RefreshToken.for_user(user)
            user_data = {
                'id': user.id,
                'username': user.username,
                'first_name': user.first_name,
                'last_name': user.last_name,
                'email': user.email,
                'userlevel': user.userlevel,
            }
            response = Response({
                'user': user_data,
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }, status=status.HTTP_200_OK)
            response.set_cookie(
                key='access_token',
                value=str(refresh.access_token),
                httponly=True,
                secure=False,  # Set to True in production with HTTPS
                samesite='Lax',
            )
            return response
        return Response({'message': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)
    except Exception as e:
        return Response({'message': str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def logout_view(request):
    response = Response({'message': 'Successfully logged out'}, status=status.HTTP_200_OK)
    response.delete_cookie('access_token')
    return response

@api_view(['POST'])
def refresh_token_view(request):
    try:
        refresh_token = request.data.get('refresh')
        if refresh_token:
            token = RefreshToken(refresh_token)
            return Response({
                'access': str(token.access_token),
            }, status=status.HTTP_200_OK)
        return Response({'message': 'Refresh token is required'}, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response({'message': str(e)}, status=status.HTTP_401_UNAUTHORIZED)

# For user
@api_view(['GET'])
@permission_classes([AllowAny])
def get_users(request):
    users = User.objects.all()
    serializer = UserSerializer(users, many=True)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([AllowAny])
def create_user(request):
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=201)
    return Response(serializer.errors, status=400)

# @api_view(['PUT'])
# @permission_classes([AllowAny])
# def update_user(request, pk):
#     try:
#         user = User.objects.get(id=pk)
#     except User.DoesNotExist:
#         return Response({'error': 'User not found'}, status=404)

#     serializer = UserSerializer(user, data=request.data)
#     if serializer.is_valid():
#         serializer.save()
#         return Response(serializer.data)
#     return Response(serializer.errors, status=400)

@api_view(['PUT'])
@permission_classes([AllowAny]) 
def update_user(request, pk):
    try:
        user = User.objects.get(id=pk)
    except User.DoesNotExist:
        return Response(
            {'error': 'User not found'}, 
            status=status.HTTP_404_NOT_FOUND
        )

    serializer = UserSerializer(
        user, 
        data=request.data,
        partial=True  
    )

    if not serializer.is_valid():
        return Response(
            serializer.errors, 
            status=status.HTTP_400_BAD_REQUEST
        )

    serializer.save()
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['DELETE'])
@permission_classes([AllowAny])
def delete_user(request, pk):
    try:
        user = User.objects.get(id=pk)
    except User.DoesNotExist:
        return Response({'error': 'User not found'}, status=404)

    user.delete()
    return Response({'message': 'User deleted successfully'}, status=200)

# For employee
@api_view(['GET'])
@permission_classes([AllowAny])
def get_employee(request):
    employees = Employee.objects.all()
    serializer = EmployeeSerializer(employees, many=True)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([AllowAny])
def create_employee(request):
    serializer = EmployeeSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=201)
    return Response(serializer.errors, status=400)

@api_view(['PUT'])
@permission_classes([AllowAny])
def update_employee(request, pk):
    try:
        employee = Employee.objects.get(id=pk)
    except Employee.DoesNotExist:
        return Response({'error': 'Employee not found'}, status=404)

    serializer = EmployeeSerializer(
        employee,
        data=request.data,
        partial=True  # Allow partial update
    )

    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    serializer.save()
    return Response(serializer.data, status=status.HTTP_200_OK)
@api_view(['DELETE'])
@permission_classes([AllowAny])
def delete_employee(request, pk):
    try:
        employee = Employee.objects.get(id=pk)
    except Employee.DoesNotExist:
        return Response({'error': 'Employee not found'}, status=404)

    employee.delete()
    return Response({'message': 'Employee deleted successfully'}, status=200)

# For task
@api_view(['GET'])
@permission_classes([AllowAny])
def get_tasks(request):
    tasks = Task.objects.all()
    serializer = TaskSerializer(tasks, many=True)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([AllowAny])
def create_task(request):
    serializer = TaskSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=201)
    return Response(serializer.errors, status=400)

@api_view(['PUT'])
@permission_classes([AllowAny])
def update_task(request, pk):
    try:
        task = Task.objects.get(id=pk)
    except Task.DoesNotExist:
        return Response({'error': 'Task not found'}, status=404)

    serializer = TaskSerializer(task, data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=400)

@api_view(['DELETE'])
@permission_classes([AllowAny])
def delete_task(request, pk):
    try:
        task = Task.objects.get(id=pk)
    except Task.DoesNotExist:
        return Response({'error': 'Task not found'}, status=404)

    task.delete()
    return Response({'message': 'Task deleted successfully'}, status=200)

# For schedule
@api_view(['GET'])
@permission_classes([AllowAny])
def get_schedules(request):
    schedules = Schedule.objects.all()
    serializer = ScheduleSerializer(schedules, many=True)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([AllowAny])
def create_schedule(request):
    serializer = ScheduleSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=201)
    return Response(serializer.errors, status=400)

@api_view(['PUT'])
@permission_classes([AllowAny])
def update_schedule(request, pk):
    try:
        schedule = Schedule.objects.get(id=pk)
    except Schedule.DoesNotExist:
        return Response({'error': 'Schedule not found'}, status=404)

    serializer = ScheduleSerializer(schedule, data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=400)

@api_view(['DELETE'])
@permission_classes([AllowAny])
def delete_schedule(request, pk):
    try:
        schedule = Schedule.objects.get(id=pk)
    except Schedule.DoesNotExist:
        return Response({'error': 'Schedule not found'}, status=404)

    schedule.delete()
    return Response({'message': 'Schedule deleted successfully'}, status=200)


# Notification

@api_view(['GET', 'POST'])
@permission_classes([AllowAny])
def notification_list_create(request):
    if request.method == 'GET':
        notifications = Notification.objects.all().order_by('-time')
        serializer = NotificationSerializer(notifications, many=True)
        return Response(serializer.data)
    elif request.method == 'POST':
        employee_param = request.data.get("employee")
        title = request.data.get("title")
        message = request.data.get("message")
        created = []
        if employee_param == "all":
            employees = Employee.objects.all()
            for emp in employees:
                notif = Notification(employee=emp, title=title, message=message)
                notif.save()
                created.append(NotificationSerializer(notif).data)
            return Response(created, status=status.HTTP_201_CREATED)
        else:
            emp = Employee.objects.filter(empname=employee_param).first()
            if emp:
                notif = Notification(employee=emp, title=title, message=message)
                notif.save()
                return Response(NotificationSerializer(notif).data, status=status.HTTP_201_CREATED)
            else:
                return Response({"error": "Employee not found."}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['DELETE'])
@permission_classes([AllowAny])
def notification_delete(request, pk):
    try:
        notif = Notification.objects.get(pk=pk)
    except Notification.DoesNotExist:
        return Response({"error": "Notification not found."}, status=status.HTTP_404_NOT_FOUND)
    notif.delete()
    return Response({"message": "Notification deleted successfully."}, status=status.HTTP_200_OK)