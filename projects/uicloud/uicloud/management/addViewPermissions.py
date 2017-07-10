#!/usr/bin/env python
from django.contrib.contenttypes.models import ContentType;
from django.contrib.auth.models import Permission;

def add_view_permissions():
    """
    This syncdb hooks takes care of adding a view permission too all our 
    content types.
    """
    # for each of our content types
    for content_type in ContentType.objects.all():
        # build our permission slug
        codename = "view_{}".format(content_type.model)

        # if it doesn't exist..
        if not Permission.objects.filter(content_type=content_type, codename=codename):
            # add it
            Permission.objects.create(content_type=content_type,
                                      codename=codename,
                                      name="Can view {}".format(content_type.name))
            print("Added view permission for {}".format(content_type.name))

if __name__ == "__main__":
    add_view_permissions()
