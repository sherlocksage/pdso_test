from django.urls import path

from . import views

urlpatterns = [
    path("api/courses/", views.CourseListView.as_view()),
    path("api/course/<id>/", views.CourseRetrieveView.as_view()),
    path("api/problems/<id>/", views.ProblemListView.as_view()),
    path("api/problem/<id>/", views.ProblemRetrieveView.as_view()),
    path("api/testcases/<id>/", views.TestCaseListView.as_view()),
    path("api/test/", views.TestView.as_view()),
]
