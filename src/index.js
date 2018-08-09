import { JSORMBase, attr, belongsTo, hasMany } from "jsorm";

const ApplicationRecord = JSORMBase.extend({
  static: {
    jwt: undefined,
    jwtStorage: "plcJwt",
    baseUrl: "https://plc-synchronize.herokuapp.com",
    apiNamespace: "/api/v1",
    generateAuthHeader: function(token) {
      return "Bearer " + token;
    }
  }
})

const plcAuthenticate = (email, password) => {
   const requestBody = JSON.stringify({
     auth: {
       email: email,
       password: password
     }
   });
   const requestOptions = {
     method: "POST",
     body: requestBody,
     headers: { "Content-Type": "application/json" },
     credentials: "same-origin"
   };
   const handleError = (error) => {
     console.log(error);
     return error;
   };
   const handleSuccess = (response) => {
     const getJwt = (json) => {
       localStorage.setItem("plcJwt", json.jwt);
       return json.jwt;
     }
     return response.json().then(getJwt).catch(handleError);
   };
   return fetch(`${ApplicationRecord.baseUrl}${ApplicationRecord.apiNamespace}/plc_user_tokens`, requestOptions).then(handleSuccess).catch(handleError);
};

const PlcUser = ApplicationRecord.extend({
  static: {
    jsonapiType: "plc_users"
  },
  attrs: {
    plcTransactions: hasMany(),
    plcSubscriptions: hasMany(),
    firstName: attr(),
    lastName: attr(),
    email: attr(),
    password: attr(),
    facebook: attr(),
    firstDonationDate: attr({ persist: false }),
    gender: attr(),
    hasOptedOutOfEmail: attr(),
    instagram: attr(),
    lastDonationDate: attr({ persist: false }),
    linkedin: attr(),
    mailOptOut: attr(),
    mailingCity: attr(),
    mailingCountry: attr(),
    mailingPostalCode: attr(),
    mailingState: attr(),
    mailingStreet: attr(),
    maritalStatus: attr(),
    middleName: attr(),
    mobilePhone: attr(),
    parentalStatus: attr(),
    phone: attr(),
    religion: attr(),
    title: attr(),
    twitter: attr()
  }
})

const PlcTransaction = ApplicationRecord.extend({
  static: {
    jsonapiType: "plc_transactions"
  },
  attrs: {
    plcUser: belongsTo(),
    plcSubscription: belongsTo(),
    plcCampaign: belongsTo(),
    plcLineItems: hasMany(),
    amount: attr(),
    closeDate: attr(),
    digitalWalletService: attr(),
    isClosed: attr(),
    isWon: attr(),
    isRefund: attr(),
    shopifyDiscountAmount: attr(),
    shopifyDiscountCode: attr(),
    stageName: attr(),
    taxDeductibleAmount: attr(),
    transactionType: attr()
  }
})

const PlcSubscription = ApplicationRecord.extend({
  static: {
    jsonapiType: "plc_subscriptions"
  },
  attrs: {
    plcUser: belongsTo(),
    plcCampaign: belongsTo(),
    cancelDate: attr(),
    amount: attr(),
    dateEstablished: attr(),
    installments: attr(),
    lastPaymentDate: attr(),
    nextPaymentDate: attr(),
    openEndedStatus: attr()
  }
})

const PlcProduct = ApplicationRecord.extend({
  static: {
    jsonapiType: "plc_products"
  },
  attrs: {
    isActive: attr(),
    isDonation: attr(),
    isProduct: attr(),
    isRefugeeMade: attr(),
    productCode: attr(),
    sku: attr()
  }
})

const PlcLineItem = ApplicationRecord.extend({
  static: {
    jsonapiType: "plc_line_items"
  },
  attrs: {
    plcTransaction: belongsTo(),
    isDonation: attr(),
    isProduct: attr(),
    listPrice: attr(),
    name: attr(),
    productCode: attr(),
    quantity: attr(),
    taxableAmount: attr(),
    totalPrice: attr(),
    unitPrice: attr()
  }
})

const PlcCampaign = ApplicationRecord.extend({
  static: {
    jsonapiType: "plc_campaigns"
  },
  attrs: {
    plcTransactions: hasMany(),
    plcSubscriptions: hasMany(),
    endDate: attr(),
    isActive: attr(),
    name: attr(),
    startDate: attr(),
    originatingLandingPage: attr(),
    uniqueName: attr()
  }
})

export { plcAuthenticate, PlcCampaign, PlcLineItem, PlcProduct, PlcSubscription, PlcTransaction, PlcUser };