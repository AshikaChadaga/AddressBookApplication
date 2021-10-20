const nameRegex = RegExp("^[A-Z]{1}[A-Za-z\\s]{2,}$");
const phoneNumberRegex = RegExp("^[0-9]{2}\\s{1}[7-9]{1}[0-9]{9}$");
const addressRegex = RegExp('^[a-zA-Z0-9#,&\\s]{4,}$');
const zipRegex = RegExp("^[0-9]{3}\\s{0,1}[0-9]{3}$");

const checkName = (name) => {
  if (!nameRegex.test(name)) {
      throw "NAME is Invalid!";
  }
};

const checkPhoneNumber = (phoneNumber) => {
    if (!phoneNumberRegex.test(phoneNumber)) {
      throw "PHONE NUMBER is Invalid!";
    }
};

const checkAddress = (address) => {
  if (!addressRegex.test(address)) {
    throw "ADDRESS is Invalid!";
  }
};

const checkZip = (zip) => {
    if (!zipRegex.test(zip)) {
      throw "ZIPCODE is Invalid!";
    }
};