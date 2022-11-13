import os

from rest_framework import generics, status, views
from rest_framework.response import Response

from .models import Course, Problem, TestCase
from .serializers import (CourseSerializer, ProblemSerializer,
                          TestCaseSerializer)


class CourseListView(generics.ListAPIView):
    model = Course
    serializer_class = CourseSerializer
    queryset = Course.objects.all()


class CourseRetrieveView(generics.RetrieveAPIView):
    model = Course
    serializer_class = CourseSerializer

    def get_object(self):
        return generics.get_object_or_404(
            Course.objects.all(), pk=self.kwargs.get("id")
        )


class ProblemListView(generics.ListAPIView):
    model = Problem
    serializer_class = ProblemSerializer

    def get_queryset(self):
        return Problem.objects.filter(course__id=self.kwargs.get("id"))


class ProblemRetrieveView(generics.RetrieveAPIView):
    model = Problem
    serializer_class = ProblemSerializer

    def get_object(self):
        return generics.get_object_or_404(
            Problem.objects.all(), pk=self.kwargs.get("id")
        )


class TestCaseListView(generics.ListAPIView):
    model = TestCase
    serializer_class = TestCaseSerializer

    def get_queryset(self):
        return TestCase.objects.filter(problem__id=self.kwargs.get("id"))


class TestView(views.APIView):
    def post(self, request):
        import subprocess

        code = request.data.get("code", None)
        if not code:
            return Response(status.HTTP_400_BAD_REQUEST)
        try:
            filepath = os.path.join(os.getcwd(), "code", "input_code.py")
            os.makedirs(os.path.dirname(filepath), exist_ok=True)
            with open(filepath, "w") as file:
                file.write(
                    code
                    + """
if __name__ == '__main__':
    import os
    import sys
    inputs = sys.argv[1].split(',')
    expected_result = str(sys.argv[2])

    assert str(solution_code(*inputs)) == str(sys.argv[2]), f'Incorrect result. Inputs: {inputs}. Expected results: {expected_result}'
"""
                )
            for item in TestCase.objects.filter(
                problem__id=request.data.get("problemId")
            ):
                inputs = item.inputs
                expected_result = item.expected_result
                subprocess.check_output(["python3", filepath, inputs, expected_result])
            return Response("All tests passed!", status=status.HTTP_200_OK)
        except subprocess.CalledProcessError as e:
            return Response(e.output, status=status.HTTP_400_BAD_REQUEST)
