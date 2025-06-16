from models.user import User

class UserService:
    def __init__(self):
        self.users = []

    def get_all_users(self):
        return [user.to_dict() for user in self.users]

    def add_user(self, data):
        user = User(user_id=len(self.users) + 1, name=data['name'], email=data['email'])
        self.users.append(user)
