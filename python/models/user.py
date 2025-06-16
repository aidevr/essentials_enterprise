class User:
    def __init__(self, user_id, name, email):
        self.user_id = user_id
        self.name = name
        self.email = email

    def to_dict(self):
        """
        Converts the User object to a dictionary representation.
        
        Returns:
            dict: A dictionary containing the user's basic information with the following keys:
            - user_id: The unique identifier of the user
            - name: The user's full name
            - email: The user's email address
            
        This method is commonly used for:
        - Serializing user data for API responses
        - Converting user objects before JSON serialization
        - Providing a simplified view of the user data
        """
        return {
            "user_id": self.user_id,
            "name": self.name,
            "email": self.email
        }
