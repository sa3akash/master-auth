import fs from 'fs';
import ejs from 'ejs';

class EmailTemplates {

    public verifyEmail(){
        return ejs.render(fs.readFileSync(__dirname+'/verifyEmailTemplate.ejs', 'utf8'),{
            logo: 'https://a10daa94-9614-44bd-895f-977eef9b9650.b-cdn.net/e/3b5dc763-769d-4c4b-bedc-c6865f54ee32/1b29d1e8-af36-405d-8930-047e51a85e69.png',
            url: '',
        })
    }
    public confirmYourAccount(){
        return ejs.render(fs.readFileSync(__dirname+'/confirmYourAccount.ejs', 'utf8'),{
            logo: 'https://a10daa94-9614-44bd-895f-977eef9b9650.b-cdn.net/e/3b5dc763-769d-4c4b-bedc-c6865f54ee32/1b29d1e8-af36-405d-8930-047e51a85e69.png',
            url: '',
        })
    }
    public emailWithCode(code:string){
        return ejs.render(fs.readFileSync(__dirname+'/EmailWithCode.ejs', 'utf8'),{
            logo: 'https://a10daa94-9614-44bd-895f-977eef9b9650.b-cdn.net/e/3b5dc763-769d-4c4b-bedc-c6865f54ee32/5985c4bf-8a91-4e1c-a72d-7569e7643173.png',
            code: code,
        });
    }
    public twoFaVerification(){
        return ejs.render(fs.readFileSync(__dirname+'/2faVerificationCode.ejs', 'utf8'),{
            logo: 'https://a10daa94-9614-44bd-895f-977eef9b9650.b-cdn.net/e/3b5dc763-769d-4c4b-bedc-c6865f54ee32/5985c4bf-8a91-4e1c-a72d-7569e7643173.png',
            code: '456123',
        })
    }
    public thankYou(){
        return ejs.render(fs.readFileSync(__dirname+'/thankYouForRegistration.ejs', 'utf8'),{
            logo: 'https://be4795ed-4d8d-4326-865b-41036448ec9f.b-cdn.net/e/fd95c8b0-e7d1-4638-9722-4f022af3f6d3/5e7c4152-91d3-4409-b0ab-2c1586b1437e.png',
        })
    }
    public didYouChangePassword(){
        return ejs.render(fs.readFileSync(__dirname+'/didYouChangePassword.ejs', 'utf8'),{
            url: 'https://settings-activity-page.com',
        })
    }
    public newLogin(){
        return ejs.render(fs.readFileSync(__dirname+'/newDeviceLogin.ejs', 'utf8'),{
            // url: 'https://settings-activity-page.com',
        })
    }
}


export const emailTemplates: EmailTemplates = new EmailTemplates();