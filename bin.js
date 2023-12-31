#!/usr/bin/env node
const path = require('path');
const fs = require('fs');
const setting = require('./config/setting');

const rootDirectoryFilePath = path.resolve(__dirname, '..', '..');
const npmMoudleRootDirecotry = path.resolve(__dirname, '..', 'notion-generator');

const mainFilePath = path.resolve(npmMoudleRootDirecotry, 'main');
const envFilePath = path.resolve(rootDirectoryFilePath, '.env');
const docDirPath = path.resolve(rootDirectoryFilePath, setting.apiDocFilePath);

const envSample = `
# -------------------------------- 노션 키 값 (필수) ---------------------------------

NOTION_API_KEY = 노션 API 키
NOTION_DATABASE_ID = 노션 데이터베이스 아이디

# ------------------------------------ 옵션 ---------------------------------------

# Api Document를 보관할 Directory 이름
#API_DOC_FILE_PATH = './api_doc'

# Api Document파일 단위 마다 공백 페이지를 추가 여부 ( true: 추가, false: 추가x )
#API_BLANK = true

# --------------------------------- 상태코드 메세지 ----------------------------------

#DEFAULT_MESSAGE_200 = '정상'
#DEFAULT_MESSAGE_400 = '프론트에서 온 데이터 문제'
#DEFAULT_MESSAGE_401 = '토큰이 만료되었거나 토큰이 없음'
#DEFAULT_MESSAGE_403 = '로그인 인증은 확인되었으나 권한이 없음'
#DEFAULT_MESSAGE_409 = '서버에서 확인된 에러의 기타 예외처리'
#DEFAULT_MESSAGE_500 = '서버에서 놓친 심각한 문제 ( 절대 뜨면 안 됨 )'`;

(async () => {
    try {
        if (!fs.existsSync(envFilePath)) {
            fs.writeFileSync(envFilePath, envSample);
            console.log('.env 파일이 생성되었습니다. 필수 값을 채운 후 명령어를 다시 입력해주세요.');
            return;
        }

        if (!fs.readFileSync(envFilePath).includes('NOTION_API_KEY')) {
            fs.appendFileSync(envFilePath, `${envSample}\n`);
            console.log('.env 파일에 필수값을 채운 후 명령어를 다시 입력해주세요.');
            return;
        }
    } catch (err) {
        return console.log('failed to access .env');
    }

    try {
        if (!fs.existsSync(docDirPath)) {
            fs.mkdirSync(docDirPath);

            fs.mkdirSync(path.resolve(docDirPath, 'components'));

            fs.copyFileSync(path.resolve(npmMoudleRootDirecotry, 'module', 'docSample.json'), path.resolve(docDirPath, 'user.json'));

            console.log(`${setting.apiDocFilePath}가 생성되었습니다. 명령어를 다시 입력하여 Notion Page를 생성하세요.`);
            return;
        }
    } catch (err) {
        return console.log(`failed to create ${setting.apiDocFilePath}`);
    }

    require(mainFilePath);
})();
