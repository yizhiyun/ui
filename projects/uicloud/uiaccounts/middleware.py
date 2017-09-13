from django.shortcuts import render
from django.utils.deprecation import MiddlewareMixin

import logging
logger = logging.getLogger("uicloud.uiaccounts.middleware")
logger.setLevel(logging.DEBUG)


class CheckUserMiddleware(MiddlewareMixin):

    def process_request(self, request):
        if request.user.is_authenticated():
            return None
        else:
            if request.path.startswith('/uiaccounts/'):
                return None
            logger.error(request.path)
            return render(request, 'uiaccounts/login.html', {'next': request.path})
