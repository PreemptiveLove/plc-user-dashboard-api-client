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
   return fetch(`${ApplicationRecord.baseUrl}${ApplicationRecord.apiNamespace}/user_token`, requestOptions).then(handleSuccess).catch(handleError);
};

const User = ApplicationRecord.extend({
  static: {
    jsonapiType: "users"
  },
  attrs: {
    transactions: hasMany(),
    subscriptions: hasMany(),
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

const Transaction = ApplicationRecord.extend({
  static: {
    jsonapiType: "transactions"
  },
  attrs: {
    user: belongsTo(),
    subscription: belongsTo(),
    campaign: belongsTo(),
    lineItems: hasMany(),
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

const Subscription = ApplicationRecord.extend({
  static: {
    jsonapiType: "subscriptions"
  },
  attrs: {
    user: belongsTo(),
    campaign: belongsTo(),
    cancelDate: attr(),
    amount: attr(),
    dateEstablished: attr(),
    installments: attr(),
    lastPaymentDate: attr(),
    nextPaymentDate: attr(),
    openEndedStatus: attr()
  }
})

const Product = ApplicationRecord.extend({
  static: {
    jsonapiType: "products"
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

const LineItem = ApplicationRecord.extend({
  static: {
    jsonapiType: "lineItems"
  },
  attrs: {
    transaction: belongsTo(),
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

const Campaign = ApplicationRecord.extend({
  static: {
    jsonapiType: "campaigns"
  },
  attrs: {
    transaction: hasMany(),
    recurringDonations: hasMany(),
    endDate: attr(),
    isActive: attr(),
    name: attr(),
    startDate: attr(),
    originatingLandingPage: attr(),
    uniqueName: attr()
  }
})