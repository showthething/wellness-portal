var rp = require('request-promise');
var Promise = require('bluebird');
var xml2js = Promise.promisifyAll(require('xml2js'));
var _ = require('lodash');
var proxy = require('../proxy');
//var processors = require('xml2js/processors');

module.exports = {
  /**
   * Helper function that handles the http request
   *
   * @param {string} url
   */
  httprequest: function(url) {
    return rp({uri: url, resolveWithFullResponse: true})
      .then(function(response) {
        if (response.statusCode !== 200) {
          throw new Error(response.statusCode);
        } else {
          return response.body;
        }
      });
  },
  httprequestProxy: function(url) {
    return proxy.get(url);
  },
  /**
   * Helper function that converts xml to json
   *
   * @param {xml} xml
   */
  toJson: function(xml) {
    return xml2js.parseStringAsync(xml, {explicitArray: false, attrkey: '__', valueProcessors: [xml2js.processors.parseNumbers, xml2js.processors.parseBooleans], attrValueProcessors: [xml2js.processors.parseNumbers, xml2js.processors.parseBooleans]});
  },
  /**
   * Helper function that takes params hash and converts it into query string
   *
   * @param {object} params
   * @param {Number} id
   */
  toQueryString: function(params, id) {
    var paramsString = '';
    for (var key in params) {
      if (params.hasOwnProperty(key)) {
        paramsString += '&' + key + '=' + encodeURIComponent(params[key]);
      }
    }
    return 'zws-id=' + id + paramsString;
  },
  /**
   * Helper function that checks for the required params
   *
   * @param {object} params
   * @param {array} reqParams -- required parameters
   */
  checkParams: function(params, reqParams) {
    if (reqParams.length < 1)
      return;

    if ((_.isEmpty(params) || !params) && (reqParams.length > 0)) {
      throw new Error('Missing parameters: ' + reqParams.join(', '));
    }

    var paramsKeys = _.keys(params);

    _.each(reqParams, function(reqParam) {
      if (paramsKeys.indexOf(reqParam) === -1) {
        throw new Error('Missing parameter: ' + reqParam);
      }
    });
  }

};
