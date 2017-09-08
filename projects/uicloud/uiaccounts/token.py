from itsdangerous import URLSafeTimedSerializer as utsr
import base64
import logging
logger = logging.getLogger("uicloud.uiaccounts.token")
logger.setLevel(logging.DEBUG)


class Token():
    def __init__(self, security_key):
        self.security_key = security_key
        self.salt = base64.encodestring(bytes(security_key.encode('utf8')))

    def generate_validate_token(self, username):
        serializer = utsr(self.security_key)
        logger.error(serializer)
        return serializer.dumps(username, self.salt)

    def confirm_validate_token(self, token, expiration=3600):
        serializer = utsr(self.security_key)
        return serializer.loads(token,
                                salt=self.salt,
                                max_age=expiration)
