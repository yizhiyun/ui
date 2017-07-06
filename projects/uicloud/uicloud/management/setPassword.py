#!/usr/bin/env python
import sys
from django.contrib.auth.models import User

def updatePassword(username="django", password="aaaa1111"):

    user =  User.objects.get(username__exact="{}".format(username))
    user.set_password("{}".format(password))
    user.save()

def run():
    if len(sys.argv) > 2:
        username, password = sys.argv[1], sys.argv[2]
        updatePassword(username, password)
    else:
        updatePassword()

if __name__ == "__main__":
    run()
