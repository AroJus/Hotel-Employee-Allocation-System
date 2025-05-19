from rest_framework import serializers
from .models import Employee, Task, User, Schedule, Notification

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'

    def create(self, validated_data):
        user = User.objects.create(
            username=validated_data['username'],
            last_name=validated_data['last_name'],
            first_name=validated_data['first_name'],
            userlevel=validated_data.get('userlevel', 'admin'),
            userstatus=validated_data.get('userstatus', True),
            email=validated_data['email'],
        )
        user.set_password(validated_data['password'])
        return user

    def update(self, instance, validated_data):
        instance.username = validated_data.get('username', instance.username)
        instance.last_name = validated_data.get('last_name', instance.last_name)
        instance.first_name = validated_data.get('first_name', instance.first_name)
        instance.userlevel = validated_data.get('userlevel', instance.userlevel)
        instance.userstatus = validated_data.get('userstatus', instance.userstatus)
        instance.email = validated_data.get('email', instance.email)
        if 'password' in validated_data:
            instance.set_password(validated_data['password'])
        else:
            instance.save()
        return instance

class EmployeeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Employee
        fields = '__all__'

class TaskSerializer(serializers.ModelSerializer):
    employee_assigned = serializers.PrimaryKeyRelatedField(queryset=Employee.objects.all(), allow_null=True)

    class Meta:
        model = Task
        fields = '__all__'

class ScheduleSerializer(serializers.ModelSerializer):
    employee_assigned = serializers.PrimaryKeyRelatedField(queryset=Employee.objects.all(), allow_null=True)

    class Meta:
        model = Schedule
        fields = '__all__'


class NotificationSerializer(serializers.ModelSerializer):
    employee = serializers.CharField(source="employee.empname", read_only=True)
    employee_id = serializers.PrimaryKeyRelatedField(
        queryset=Employee.objects.all(),
        source="employee",
        write_only=True,
        required=False
    )

    class Meta:
        model = Notification
        fields = ["id", "employee", "employee_id", "title", "message", "time", "read"]
        read_only_fields = ["id", "employee", "time", "read"]