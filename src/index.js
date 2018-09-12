import { JSORMBase, attr, belongsTo, hasMany, hasOne } from "jsorm";

const ApplicationRecord = JSORMBase.extend({
  static: {
    jwtStorage: "plcJwt",
    baseUrl: "https://plc-synchronize.herokuapp.com",
    apiNamespace: "/api/v1",
    generateAuthHeader: function(token) {
      return "Bearer " + token;
    }
  }
})

module.exports = {

  authenticate: (email, password) => {
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
    return fetch(`${ApplicationRecord.baseUrl}${ApplicationRecord.apiNamespace}/plc_user_tokens`, requestOptions).then((response) => {
      return new Promise((resolve, reject) => {
        if (response.ok) {
          return response.json().then((json) => {
            const jwt = json.jwt
            localStorage.setItem("plcJwt", jwt);
            resolve({ jwt: jwt });
          });
        } else {
          return response.json().then((response) => {
            reject(response);
          });
        }
      });
    });
  },

  authenticateFromUrl: (urlString) => {
    let params = new URL(urlString).searchParams;
    const jwt = params.get('plcJwt')
    return new Promise((resolve, reject) => {
      if (jwt != null) {
        localStorage.setItem('plcJwt', jwt);
        resolve({ jwt: jwt });
      } else {
        reject(false);
      }
    });
  },

  isAuthenticated: () => {
    return localStorage.getItem("plcJwt") != null
  },

  requestMagicLink: (email) => {
    const requestBody = JSON.stringify({
      email: email
    });
    const requestOptions = {
      method: "POST",
      body: requestBody,
      headers: { "Content-Type": "application/json" },
      credentials: "same-origin"
    };
    return fetch(`${ApplicationRecord.baseUrl}${ApplicationRecord.apiNamespace}/plc_user_magic_links`, requestOptions).then((response) => {
      return new Promise((resolve, reject) => {
        if (response.ok) {
          return resolve(true);
        } else {
          return reject(response);
        }
      });
    });
  },

  PlcUser: ApplicationRecord.extend({
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
  }),

  PlcTransaction: ApplicationRecord.extend({
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
      transactionType: attr(),
      stripeTransactionId: attr(),
      authorizeTransactionId: attr(),
      paypalTransactionId: attr(),
      shopifyTransactionId: attr()
    }
  }),

  PlcSubscription: ApplicationRecord.extend({
    static: {
      jsonapiType: "plc_subscriptions"
    },
    attrs: {
      plcPaymentMethod: hasOne(),
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
  }),

  PlcProduct: ApplicationRecord.extend({
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
  }),

  PlcLineItem: ApplicationRecord.extend({
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
  }),

  PlcCampaign: ApplicationRecord.extend({
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
      uniqueName: attr(),
      displayName: attr()
    }
  }),

  PlcPaymentMethod: ApplicationRecord.extend({
    static: {
      jsonapiType: "plc_payment_methods"
    },
    attrs: {
      plcSubscriptions: belongsTo(),
      stripeSourceId: attr(),
      addressCity: attr(),
      addressCountry: attr(),
      addressLine1: attr(),
      addressLine2: attr(),
      addressState: attr(),
      addressZip: attr(),
      brand: attr(),
      country: attr(),
      expirationMonth: attr(),
      expirationYear: attr(),
      last4: attr(),
      bankName: attr(),
      routingNumber: attr()
    }
  })

};