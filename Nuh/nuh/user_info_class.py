from .models import User as UserModel


# User class that is used to get the information from database, if possible, and make a dictionary out of them
class User:
    user = None
    help_info = None

    def __init__(self, username):
        self.user = UserModel.objects.get(username=username)
        if self.user is not None:
            if self.user.pointer is not None:
                self.help_info = self.user.information()

    def user_help_info(self):
        if self.help_info is not None:
            return [
                {'get_food': self.help_info[0],
                 'get_accommodation': self.help_info[1],
                 'get_clothes': self.help_info[2],
                 'get_medicine': self.help_info[3],
                 'get_other': self.help_info[4],
                 'give_food': self.help_info[5],
                 'give_accommodation': self.help_info[6],
                 'give_clothes': self.help_info[7],
                 'give_medicine': self.help_info[8],
                 'give_other': self.help_info[9],
                 'latitude': self.help_info[10],
                 'longitude': self.help_info[11], }
            ]
