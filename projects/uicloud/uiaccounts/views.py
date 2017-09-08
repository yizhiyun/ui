from django.shortcuts import render, redirect
from django.http import HttpResponse
from django.contrib.auth.models import User, Permission, Group
from django.shortcuts import get_object_or_404
from django.contrib.auth import login, logout
# from django.contrib.auth.decorators import login_required
import logging

from .token import Token
from django.conf import settings
token_confirm = Token(settings.SECRET_KEY)

# Get an instance of a logger
logger = logging.getLogger("uicloud.uiaccounts.views")
logger.setLevel(logging.DEBUG)


def register(request):
    '''
    返回用户注册页面
    '''
    return render(request, 'uiaccounts/register.html')


def userLogin(request):
    '''
    验证用户注册信息 返回用户登录页面
    '''
    if 'name' in request.POST:
        name = request.POST['name']
        email = request.POST['email']
        pwd = request.POST['password']
        logger.error('{0}/{1}/{2}'.format(name, email, pwd))
        try:
            user = User.objects.create_user(name, email, pwd, is_active=False)
            user.set_password(pwd)
            user.save()

            token = token_confirm.generate_validate_token(name)
            msg = '''
            {0}:
                欢迎您注册医智云账户！
                医智云将为您提供优质的服务，我们的目标是造福全人类。
                您的支持是我们的动力！
                请点击下面链接激活账户：
                http://127.0.0.1:8000/uiaccounts/active_user/{1}
                \n\n\n\n\n\n\n\n
                本链接一小时有效
            '''.format(name, token)
            user.email_user('医智云用户激活邮件', msg)
            return render(request, 'uiaccounts/login.html')
        except Exception:
            return HttpResponse('sry. this name has been used')
    else:
        next_to = request.GET.get('next', '')
        return render(request, 'uiaccounts/login.html', {'next': next_to})


def active_user(request, token):
    '''
    用户邮箱验证
    '''
    try:
        username = token_confirm.confirm_validate_token(token)
    except Exception:
        return HttpResponse('对不起，验证链接已经过期')
    try:
        user = User.objects.get(username=username)
    except User.DoesNotExist:
        return HttpResponse('对不起，您所验证的用户不存在，请重新注册')
    user.is_active = True
    user.save()
    logger.error(user.username)
    logger.error(user.is_active)
    return render(request, 'uiaccounts/active_user.html')


def afterLogin(request):
    '''
    验证用户登录信息，返回登录后页面或者失败原因
    '''
    if 'name' in request.POST:
        name = request.POST['name']
        pwd = request.POST['password']
        try:
            user = User.objects.get(username=name)
            if user.check_password(pwd):
                if user.is_active:
                    login(request, user)
                    next_to = request.POST.get('next')
                    if next_to:
                        return redirect(next_to)
                    return render(request, 'uiaccounts/afterLogin.html')
                else:
                    return HttpResponse('ERROR: 该账户尚未激活，请前往邮箱进行验证')
            else:
                return HttpResponse('ERROR: 密码错误')

        except Exception:
            return HttpResponse('ERROR: 账户错误')
    else:
        return render(request, 'uiaccounts/afterLogin.html')


def addPermission(request, permission):
    '''
    为用户添加权限
    '''
    user = request.user
    for g in user.groups.all():
        if g.name == permission:
            return HttpResponse('您已拥有{0}权限组!'.format(permission))

    groupList = Group.objects.filter(name=permission)
    if groupList:
        user.groups.add(groupList[0])
    else:
        group = Group(name=permission)
        group.save()

        try:
            # content_type = ContentType.objects.get_for_model(Test)
            perm = Permission.objects.get(
                codename=permission,
                # content_type=content_type,
            )
            group.permissions.add(perm)
            user.groups.add(group)
        except Exception:
            return HttpResponse('并没有该权限')

    user = get_object_or_404(User, pk=user.id)
    if user.has_perm('uiaccounts.{0}'.format(permission)):
        results = '添加权限组{0}成功'.format(permission)
    else:
        results = '添加权限组{0}失败'.format(permission)
    return render(request, 'uiaccounts/afterLogin.html', {'results': results})


def removePermission(request, permission):
    '''
    为用户删除权限
    '''
    user = request.user
    if user.has_perm('uiaccounts.{0}'.format(permission)):
        group = Group.objects.get(name=permission)
        user.groups.remove(group)
        results = '删除权限组{0}成功'.format(permission)
    else:
        results = '您尚未拥有{0}权限组'.format(permission)
    return render(request, 'uiaccounts/afterLogin.html', {'results': results})


def userLogout(request):
    '''
    用户登出
    '''
    if request.user.is_authenticated():
        results = '当前用户{0}退出成功'.format(request.user.username)
        logout(request)
    else:
        results = '您还未登录'
    return render(request, 'uiaccounts/afterLogin.html', {'results': results})
