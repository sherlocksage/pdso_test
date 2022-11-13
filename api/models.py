from django.db import models


class Course(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField()

    def __str__(self) -> str:
        return self.title


class Problem(models.Model):
    course = models.ForeignKey("Course", on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    description = models.TextField()

    def __str__(self) -> str:
        return self.title


class TestCase(models.Model):
    problem = models.ForeignKey("Problem", on_delete=models.CASCADE)
    inputs = models.TextField()
    expected_result = models.TextField()
