from django.shortcuts import render
from django.utils.deprecation import MiddlewareMixin


class CheckUserMiddleware(MiddlewareMixin):

    def process_request(self, request):
        if request.user.is_authenticated():
            return None
        else:
            if request.path == '/uiaccounts/register/' \
                or request.path.startswith('/uiaccounts/login/') \
                    or request.path.startswith('/uiaccounts/afterlogin/') \
                    or request.path.startswith('/uiaccounts/active_user/'):

                return None
            return render(request, 'uiaccounts/login.html', {'next': request.path})
