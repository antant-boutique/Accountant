from __future__ import print_function

import os.path

from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError
from googleapiclient.http import MediaFileUpload

DriveFolder = {'bill':'1rJHRewitYJ1luUIrOSYXVz1sJIAKtF8F','product':'120Dq0RsLV2IrwMLiErnILVGURbeONlS1','invoice':'1QT7ipOqopPn8Ri_ZgZjYnjPx25qc2yUp'}
SpreadSheet = {'finance':'1pRqwos74q7zpk1kGc6DB_ZpzWRQ0OKQjzqg0-moPy48','materials':'1rv5koHjoPW9fm2Y8ql4QVLBTz6O5mRGnah2IS6n1NYM','products':'1JiNGR9dn-FEkAG13mUND6DEVijpcc8IuGFLbp78Iuz8','designs':'18XI5XZj4JjzvVMCyF6qyAv9ggQHSa2b7kbAhiDMFd5M'}
#Scopes = ['https://www.googleapis.com/auth/spreadsheets','https://www.googleapis.com/auth/drive']
Scopes = ['https://www.googleapis.com/auth/drive']

SAMPLE_SPREADSHEET_ID = '1Biing8a_2ZqOPQd4k1Vec00rANom83oZtraQJT-Imfc'
SAMPLE_RANGE_NAME = 'Cash!A1:G'
EDIT_RANGE_NAME = 'Cash!A1:E'

try:
    CREDS = Credentials.from_authorized_user_file('token.json', Scopes)
except:
    CREDS = ''

def upload_to_folder(fileName,filePath,parent_id,permit='reader',creds=CREDS):
    """Upload a file to the specified folder and prints file ID, folder ID
    Args: Id of the folder
    Returns: ID of the file uploaded

    Load pre-authorized user credentials from the environment.
    TODO(developer) - See https://developers.google.com/identity
    for guides on implementing OAuth2 for the application.
    """
    try:
        # create drive api client
        service = build('drive', 'v3', credentials=creds)

        file_metadata = {
            'name': fileName,
            'parents': [parent_id]
        }
        #media = MediaFileUpload(filePath,
        #                        mimetype='image/jpeg', resumable=True)
        media = MediaFileUpload(filePath,resumable=True)
        # pylint: disable=maybe-no-member
        file = service.files().create(body=file_metadata, media_body=media,
                                      fields='id').execute()
        user_permission = {
            'type': 'anyone',
            'role': '%s'%(permit)
        }
        file_id = file.get('id')
        service.permissions().create(fileId=file_id,
                                               body=user_permission,
                                               fields='id').execute()
        print(F'File ID: "{file.get("id")}".')
        return file.get('id')

    except HttpError as error:
        print(F'An error occurred: {error}')
        return None
