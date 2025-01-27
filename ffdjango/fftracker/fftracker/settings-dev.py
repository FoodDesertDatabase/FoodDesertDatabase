"""
Django settings for fftracker project.

Generated by 'django-admin startproject' using Django 4.1.2.

For more information on this file, see
https://docs.djangoproject.com/en/4.1/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/4.1/ref/settings/
"""

from pathlib import Path
import os
import logging
from azure.identity import DefaultAzureCredential

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

import mimetypes
mimetypes.add_type("text/css", ".css", True)

# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/4.1/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'django-insecure-#xtryp(1+$_w)9h6i)8+zhg+!#h3knvm4mb1j3mem0p_mb494^'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

ALLOWED_HOSTS = ['foodforwardwebqaeast-b0bph9dkhygdfmaj.eastus-01.azurewebsites.net', 'https://foodforwardwebprodeast-e5bcgbgrcea0eebs.eastus-01.azurewebsites.net/', 'api', 'localhost', '127.0.0.1']

# Application definition

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'rest_framework',
    'corsheaders',
    'fftracker',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'fftracker.urls'

# White listing the localhost:8000 port
# CORS_ORIGIN_WHITELIST = ['http://0.0.0.0:8000']
CORS_ORIGIN_ALLOW_ALL = True

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'fftracker.wsgi.application'
STATIC_ROOT = os.path.join(BASE_DIR, "static/")


# Database
# https://docs.djangoproject.com/en/4.1/ref/settings/#databases

ca_path = os.path.join(os.getcwd() + '/DigiCertGlobalRootCA.crt.pem')

db_username = os.environ.get('APPSETTING_DB_USERNAME')
db_pass = os.environ.get('APPSETTING_DB_PASS')
db_host = os.environ.get('APPSETTING_DB_HOST')

storage_account = 'foodforwardstorage'
storage_container = os.environ.get('APPSETTING_STORAGE_CONTAINER') if os.environ.get('APPSETTING_STORAGE_CONTAINER') else 'images-qa'
storage_key = os.environ.get('APPSETTING_STORAGE_KEY')
if not db_username: db_username = 'FFDAdmin'
if not db_pass: db_pass = 'F00dF0rw@rd'
if not db_host: db_host = 'foodforwardqadb.mysql.database.azure.com'

DEFAULT_FILE_STORAGE = 'storages.backends.azure_storage.AzureStorage'
AZURE_ACCOUNT_NAME = 'foodforwardstorage'
AZURE_CONTAINER = storage_container
AZURE_ACCOUNT_KEY = storage_key

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'foodforwarddb',
	'USER': db_username,
	'PASSWORD': db_pass,
	'HOST': db_host,
	'PORT': '3306',
	'OPTIONS':  {
            'ssl': {'ca': ca_path}
        }
    },
    'foodforwardqa': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'foodforwarddb',
	'USER': 'FFDAdmin',
	'PASSWORD': 'F00dF0rw@rd',
	'HOST': 'foodforwardqadb.mysql.database.azure.com',
	'PORT': '3306',
	'OPTIONS':  {
            'ssl': {'ca': ca_path}
        }
    }
}

LOGGING = {
    "version": 1,
    "disable_existing_loggers": False,
    "handlers": {
        "console": {"class": "logging.StreamHandler"},
    },
    "loggers": {
        "django": {
            "handlers": ["console"],
            "level": os.getenv('DJANGO_LOG_LEVEL', 'INFO')
        },
        "fftracker": {
            "handler": ["console"],
            "level": os.getenv('DJANGO_LOG_LEVEL', 'INFO')
        }
    }
}



# Password validation
# https://docs.djangoproject.com/en/4.1/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


# Internationalization
# https://docs.djangoproject.com/en/4.1/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/4.1/howto/static-files/

STATIC_URL = 'static/'

# Default primary key field type
# https://docs.djangoproject.com/en/4.1/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'
