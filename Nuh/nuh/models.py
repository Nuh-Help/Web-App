from django.db import models
from django.contrib.auth.models import AbstractUser


# Create your models here.

# Base model that stores description and bool
# field of type of need/help i.e. does 'the' person needs food
# description function that returns the description if does is true
class GiveFood(models.Model):
    what_food = models.CharField(max_length=250)
    does = models.fields.BooleanField(default=False)

    def description(self):
        if self.does:
            return self.what_food
        else:
            return None


# Base model that stores description and bool
# field of type of need/help that 'the' person needs and
# description function that returns the description of help/need if does is true
class GiveAccommodation(models.Model):
    what_accommodation = models.CharField(max_length=250)
    does = models.fields.BooleanField(default=False)

    def description(self):
        if self.does:
            return self.what_accommodation
        else:
            return None


# Base model that stores description and bool
# field of type of need/help that 'the' person needs and
# description function that returns the description of help/need if does is true
class GiveClothes(models.Model):
    what_clothes = models.CharField(max_length=250)
    does = models.fields.BooleanField(default=False)

    def description(self):
        if self.does:
            return self.what_clothes
        else:
            return None


# Base model that stores description and bool
# field of type of need/help that 'the' person needs and
# description function that returns the description of help/need if does is true
class GiveMedicine(models.Model):
    what_medicine = models.CharField(max_length=250)
    does = models.fields.BooleanField(default=False)

    def description(self):
        if self.does:
            return self.what_medicine
        else:
            return None


# Base model that stores description and bool
# field of type of need/help that 'the' person needs and
# description function that returns the description of help/need if does is true
class NeedFood(models.Model):
    what_food = models.CharField(max_length=250)
    does = models.fields.BooleanField(default=False)

    def description(self):
        if self.does:
            return self.what_food
        else:
            return None


# Base model that stores description and bool
# field of type of need/help that 'the' person needs and
# description function that returns the description of help/need if does is true
class NeedAccommodation(models.Model):
    what_accommodation = models.CharField(max_length=250)
    does = models.fields.BooleanField(default=False)

    def description(self):
        if self.does:
            return self.what_accommodation
        else:
            return None


# Base model that stores description and bool
# field of type of need/help that 'the' person needs and
# description function that returns the description of help/need if does is true
class NeedClothes(models.Model):
    what_clothes = models.CharField(max_length=250)
    does = models.fields.BooleanField(default=False)

    def description(self):
        if self.does:
            return self.what_clothes
        else:
            return None


# Base model that stores description and bool
# field of type of need/help that 'the' person needs and
# description function that returns the description of help/need if does is true
class NeedMedicine(models.Model):
    what_medicine = models.CharField(max_length=250)
    does = models.fields.BooleanField(default=False)

    def description(self):
        if self.does:
            return self.what_medicine
        else:
            return None


# Base model that is used to link all the helps with one model,
# 'other' field is reserved for other types of help, obviously
# all of them are linked as a foreign key
# does_other has the same purpose as the other does's from before
class GiveHelp(models.Model):
    food = models.ForeignKey(GiveFood, on_delete=models.CASCADE, null=True)
    accommodation = models.ForeignKey(GiveAccommodation, on_delete=models.CASCADE, null=True)
    clothes = models.ForeignKey(GiveClothes, on_delete=models.CASCADE, null=True)
    medicine = models.ForeignKey(GiveMedicine, on_delete=models.CASCADE, null=True)
    other = models.CharField(max_length=500, default=False, null=True)
    does = models.fields.BooleanField(default=False)
    does_other = models.fields.BooleanField(default=False)

    # Check help checks if any of these types of help is active and sets does to true,
    # so it can be later reused for maps
    def check_help(self):
        if (self.food.does or self.accommodation.does or self.clothes.does or
                self.medicine.does or self.does_other):
            self.does = True
        else:
            self.does = False

    # give_help_info is used to get all the descriptions of offered helps
    # checking if they're initialised is not neccessary since it has been secured in the registration process
    def give_help_info(self):
        return [self.food.description(), self.accommodation.description(), self.clothes.description(),
                self.medicine.description(), self.other]


# Base model that is used to link all people that need help with one model,
# 'other' field is reserved for other types of needs of help, obviously
# all of them are linked as a foreign key
# does_other has the same purpose as the other does's from before
class NeedHelp(models.Model):
    food = models.ForeignKey(NeedFood, on_delete=models.CASCADE, null=True)
    accommodation = models.ForeignKey(NeedAccommodation, on_delete=models.CASCADE, null=True)
    clothes = models.ForeignKey(NeedClothes, on_delete=models.CASCADE, null=True)
    medicine = models.ForeignKey(NeedMedicine, on_delete=models.CASCADE, null=True)
    other = models.CharField(max_length=500, default=None, null=True)
    does = models.fields.BooleanField(default=False)
    does_other = models.fields.BooleanField(default=False)

    # Check help checks if any of these types of needs of help is active and sets does to true,
    # so it can be later reused for maps
    def check_help(self):
        if (self.food.does or self.accommodation.does or self.clothes.does or
                self.medicine.does or self.does_other):
            self.does = True
        else:
            self.does = False

    # need_help_info is used to get all the descriptions of offered helps
    # checking if they're initialised is not neccessary since it has been secured in the registration process
    def need_help_info(self):
        return [self.food.description(), self.accommodation.description(), self.clothes.description(),
                self.medicine.description(), self.other]


# Class containing coordinates and links givers of help and needers of help classes
# Get coordinates returns coordinates while get_info function returns all of the descriptions of helps/needs per user
class Info(models.Model):
    latitude = models.DecimalField(decimal_places=8, max_digits=15, default=0)
    longitude = models.DecimalField(decimal_places=8, max_digits=15, default=0)
    need_help = models.ForeignKey(NeedHelp, on_delete=models.CASCADE, null=True)
    give_help = models.ForeignKey(GiveHelp, on_delete=models.CASCADE, null=True)

    def get_coordinates(self):
        return [self.longitude, self.latitude]

    def get_info(self):
        need_help_info = []
        give_help_info = []
        if self.need_help:
            need_help_info = self.need_help.need_help_info()
        if self.give_help:
            give_help_info = self.give_help.give_help_info()
        result = []
        if need_help_info:
            result += need_help_info
        if give_help_info:
            result += give_help_info

        return result


# Custom user model, information returns all the information
# previously gathered by the model classes
# get_email returns email

class User(AbstractUser):
    pointer = models.ForeignKey(Info, on_delete=models.CASCADE, null=True)

    def get_email(self):
        return self.email

    def information(self):
        if self.pointer is not None:
            return self.pointer.get_info() + self.pointer.get_coordinates()
