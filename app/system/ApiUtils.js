var ApiUtils = {
  checkStatus: function(response) {
    if (response.status >= 200 && response.status < 300) {
      return response.json();
    } else {
      let error = new Error(response.statusText);
      error.response = response;
      throw error;
    }
  },
  url: 'http://kargotakip.baransekin.com/',
  baseUrl: 'http://kargotakip.baransekin.com/',
  service: function(endpoint){
    return this.url+endpoint;
  },
  photo: function(path){
    return this.baseUrl+path;
  },
  paramBody: function(params) {
    var formData = new FormData();
    for (var k in params) {
        formData.append(k, params[k]);
    }
    return formData;
  }
};
export { ApiUtils as default };
