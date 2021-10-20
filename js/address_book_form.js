let isUpdate = false;
let contactObj = {};

window.addEventListener("DOMContentLoaded", (event) => {
  validateName();
  validatePhoneNumber();
  validateAddress();
  validateZipcode();

  checkForUpdate();
  localStorage.removeItem('contactEdit');
});

const validateName = () => {
  const name = document.querySelector("#name");
  name.addEventListener("input", function () {
    if (name.value.length == 0) {
      setTextValue(".name-error", "");
      return;
    }
    try {
      checkName(name.value);
      setTextValue(".name-error", "");
    } catch (error) {
      setTextValue(".name-error", error);
    }
  });
};

const validatePhoneNumber = () => {
  const phoneNumber = document.querySelector("#phoneNumber");
  phoneNumber.addEventListener("input", function () {
    if (phoneNumber.value.length == 0) {
      setTextValue(".tel-error", "");
      return;
    }
    try {
      checkPhoneNumber(phoneNumber.value);
      setTextValue(".tel-error", "");
    } catch (error) {
      setTextValue(".tel-error", error);
    }
  });
};

const validateAddress = () => {
  const address = document.querySelector("#address");
  address.addEventListener("input", function () {
    if (address.value.length == 0) {
      setTextValue(".address-error", "");
      return;
    }
    try {
      checkAddress(address.value);
      setTextValue(".address-error", "");
    } catch (error) {
      setTextValue(".address-error", error);
    }
  });
};

const validateZipcode = () => {
  const zip = document.querySelector("#zip");
  zip.addEventListener("input", function () {
    if (zip.value.length == 0) {
      setTextValue(".zip-error", "");
      return;
    }
    try {
      checkZip(zip.value);
      setTextValue(".zip-error", "");
    } catch (error) {
      setTextValue(".zip-error", error);
    }
  });
};

const save = (event) => {
  event.preventDefault();
  event.stopPropagation();
  try {
    setContactObject();
    if (site_properties.use_local_storage.match("true")) {
      createAndUpdateLocalStorage();
      resetForm();
      window.location.replace(site_properties.home_page);
    }
    else {
      createAndUpdateServer();
    }

  } catch (error) {
    alert(error);
  }
};

const createAndUpdateLocalStorage = () => {
  let contactList = JSON.parse(localStorage.getItem("ContactList"));
  if (contactList != undefined) {
    let contactData = contactList.find(contact => contact.id == contactObj.id);
    if (!contactData) {
      contactList.push(contactObj);
    } else {
      const index = contactList
        .map(contact => contact.id)
        .indexOf(contactData.id);
      contactList.splice(index, 1, contactObj);
    }
  } else {
    contactList = [contactObj];
  }
  localStorage.setItem("ContactList", JSON.stringify(contactList));
};

const createAndUpdateServer = () => {
  let postUrl = site_properties.server_url;
  let methodCall = "POST";
  if (isUpdate) {
    methodCall = "PUT";
    postUrl = postUrl + contactObj.id.toString();
  }
  makeServiceCall(methodCall, postUrl, true, contactObj)
    .then((responseText) => {
      resetForm();
      window.location.replace(site_properties.home_page);
    })
    .catch((error) => {
      throw error;
    })
};

const setContactObject = () => {
  if (!isUpdate && site_properties.use_local_storage.match("true")) {
    contactObj.id = generateId();
  }
  contactObj._name = getInputValueById("#name");
  contactObj._phoneNumber = getInputValueById("#phoneNumber");
  contactObj._address = getInputValueById("#address");
  contactObj._city = getInputValueById("#city");
  contactObj._state = getInputValueById("#state");
  contactObj._zip = getInputValueById("#zip");

};

const generateId = () => {
  let contactId = localStorage.getItem("ContactID");
  contactId = !contactId ? 1 : (parseInt(contactId) + 1).toString();
  localStorage.setItem("ContactID", contactId);
  return contactId;
};


const resetForm = () => {
  setValue("#name", "");
  setValue("#phoneNumber", "");
  setValue("#address", "");
  setSelectedIndex('#city', 0);
  setSelectedIndex('#state', 0);
  setValue("#zip", "");
  setTextValue(".name-error", "");
  setTextValue(".tel-error", "");
  setTextValue(".address-error", "");
  setTextValue(".zip-error", "");
};

const checkForUpdate = () => {
  const contactJson = localStorage.getItem('contactEdit');
  isUpdate = contactJson ? true : false;
  if (!isUpdate) {
    return;
  }
  contactObj = JSON.parse(contactJson);
  setForm();
};

const setForm = () => {
  setValue("#name", contactObj._name);
  setValue("#phoneNumber", contactObj._phoneNumber);
  setValue("#address", contactObj._address);
  setValue("#city", contactObj._city);
  setValue("#state", contactObj._state);
  setValue("#zip", contactObj._zip);
};

const setValue = (id, value) => {
  const element = document.querySelector(id);
  element.value = value;
};

const setTextValue = (id, value) => {
  const element = document.querySelector(id);
  element.textContent = value;
};

const setSelectedIndex = (id, index) => {
  const element = document.querySelector(id);
  element.selectedIndex = index;
};

const getInputValueById = (property) => {
  let value = document.querySelector(property).value;
  return value;
};
