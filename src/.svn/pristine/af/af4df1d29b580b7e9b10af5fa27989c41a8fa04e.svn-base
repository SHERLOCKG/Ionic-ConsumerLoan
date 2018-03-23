import { Injectable } from "@angular/core";

@Injectable()
export class ValidaService {
    regExp = {
        forID: /[^0\d{17}]/,
        forCompany: /[^A-Za-z\s\d]/,
        forLetter: /[^A-Z\sa-z]/, 
        forArea: /[^A-Z\sa-z\d\.,#&\(\)\/\-]/,
        forRoom: /[^A-Za-z\d]/,
        forNum: /[^\d]/,
        forIDNum: /[^\dA-Za-z]/
    }
    constructor() {}

    public isEmpty(value, emptyMsg) {
        return !value && emptyMsg;
    }

    public isMobile(num, emptyMsg, invalidMsg) {
        return num ? !/^[1-9][0-9]{7}$/.test(num) && invalidMsg : this.isEmpty(num, emptyMsg);
    }

    // public isHouseMobile(num, emptyMsg, invalidMsg) {
    //     return num ? !/^[2|3|5|6|8|9][0-9]{7}$/.test(num) && invalidMsg : this.isEmpty(num, emptyMsg);
    // }

    public isBankCode(num, emptyMsg, invalidMsg, bankList) {
        if (!num) {
            return emptyMsg;
        }
        if (bankList) {
            let isValidBank = false;
            bankList.forEach(bank => {
                if (bank.key == num){
                    isValidBank = true;
                }
            });
            return !isValidBank && invalidMsg;
        }
    }
    public isAccountNum(num, emptyMsg, invalidMsg) {
        return num ? !/^\d{8,12}$/.test(num) && invalidMsg : this.isEmpty(num, emptyMsg);
    }
    public isIDNum(num, emptyMsg, invalidMsg) {
        return num ? !/^[A-Za-z\d]{8,12}$/.test(num) && invalidMsg : this.isEmpty(num, emptyMsg);
    }
    public isEngName(name, emptyMsg, invalidMsg) {
        return name ? !/^[A-Za-z\s]*$/.test(name) && invalidMsg : this.isEmpty(name, emptyMsg);
    }

    public isEngAddr(name, emptyMsg, invalidMsg) {
        return name ? !/^[A-Z\sa-z\d\.,#&\(\)\/]+$/.test(name) && invalidMsg : this.isEmpty(name, emptyMsg);
    }
    public isEngRoom(name, invalidMsg) {
        return name && !/^[A-Za-z\d\s]+$/.test(name) && invalidMsg;
    }

    public isEmail(str, emptyMsg, invalidMsg, outMsg, maxLength) {
        if (!str) {
            return emptyMsg
        } else if(!/^[_A-Za-z0-9-\\+]+(\.[_A-Za-z0-9-]+)*@[A-Za-z0-9-]+(\.[A-Za-z0-9]+)*(\.[A-Za-z]{2,})$/.test(str)) {
            return invalidMsg;
        } else if (str.length > maxLength) {
            return outMsg;
        }
    }

    CNbr(c) {
        if (/[a-zA-Z]/.test(c)) 
        return c.toLowerCase().charCodeAt() - 96;
    }

    calCheckDigit_HKID(id) {
        var ODigit;
        var hkid = id;
        var ArrHKID;
        var _sum;
        var _total;
        var _digit;
        if (id.length == 7){
            ArrHKID = new Array(7);
            for (var i=0; i<=hkid.length-1; i++){
                ArrHKID[i]=hkid.substr(i,1);
            }
            _sum = ArrHKID[1]*7+ArrHKID[2]*6+ArrHKID[3]*5+ArrHKID[4]*4+ArrHKID[5]*3+ArrHKID[6]*2
            _total = 324 + (this.CNbr(ArrHKID[0]) - 1 + 10) * 8 + _sum;
            _digit = 11 - (_total % 11)
        if (!isNaN(_digit)){
            if (_digit >= 0 && _digit < 10){
            ODigit = _digit;
            }else if (_digit == 10){
            ODigit = "A";
            }else if (_digit == 11){
            ODigit = 0;
            }else{
            ODigit = 999;
            }
        }else{
            ODigit = 999;
        }
        }else if (id.length == 8){
        ArrHKID = new Array(8);
        for (i = 0; i <= hkid.length - 1; i++)
            ArrHKID[i] = hkid.substr(i, 1);
        _sum = ArrHKID[2] * 7 + ArrHKID[3] * 6 + ArrHKID[4] * 5 + ArrHKID[5] * 4 + ArrHKID[6] * 3 + ArrHKID[7] * 2
        _total = (((ArrHKID[0].toUpperCase()).charCodeAt()-64) - 1 + 10) * 9 + (((ArrHKID[1].toUpperCase()).charCodeAt()-64) - 1 + 10) * 8 + _sum;
        _digit = 11 - (_total % 11)
        if (!isNaN(_digit)){
            if (_digit >= 0 && _digit < 10){
            ODigit = _digit;
            }else if (_digit == 10){
            ODigit = "A";
            }else if (_digit == 11){
            ODigit = 0;
            }else{
            ODigit = 999;
            }
        }else{
            ODigit = 999;
        }
        }else{
            ODigit = 999;
        }
        return ODigit;
    }

    ckHKID(idNum, digit) {
        if (!idNum) {
          return '請填寫香港身份證號碼';
        }else if (idNum.length < 7 || this.calCheckDigit_HKID(idNum).toString().toLowerCase() != digit.toString().toLowerCase()) {
          return '請填寫正確的香港身份證號碼';
        }
    }

    isBiDay(dayFormat: string) {
        let dateYear = new Date().getFullYear();
        if (!/^(\d{4})-(0?[1-9]|1[0-2])-(0?[1-9]|[12]\d|[3][0-1])$/.test(dayFormat)) {
            return '';
        }
        dateYear = dateYear - Number(dayFormat.split('-')[0]);
        return (dateYear >= 18 && dateYear <= 100) ? dayFormat : '';
    }
    
    isAreaInput(str, invalidMsg, emptyMsg) {
        return str ? !/^[A-Za-z\s\d]+$/.test(str) && invalidMsg : this.isEmpty(str, emptyMsg);
    }

    isNumber(num, invalidMsg, emptyMsg) {
        return num ? !/^\d+$/.test(num) && invalidMsg : this.isEmpty(num, emptyMsg);
    }
}


