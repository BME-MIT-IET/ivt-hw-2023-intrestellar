const { Given, When, Then } = require("cucumber");
const { URLSearchParams } = require("url");
const { expect } = require("chai");
const assert = require("chai").assert;

class Url {
  constructor(urlString) {
    this.url = new URL(urlString);
    this.queryParams = Object.fromEntries(this.url.searchParams.entries());
  }

  configure() {
    this.properties = {
      protocol: this.url.protocol,
      hostname: this.url.hostname,
      port: this.url.port,
      path: this.url.pathname,
      queryParams: Object.fromEntries(this.url.searchParams.entries()),
    };
  }
}

Given("an url {string}", function (url) {
  this.url = new Url(url);
});

When("I parse the query string", function () {
  this.queryParams = this.url.queryParams;
});

Then("the query parameters should be correctly parsed", function () {
  const queryParams = this.queryParams;
  expect(queryParams.SortDirection).to.equal("dsc");
  expect(queryParams.Sort).to.equal("price");
  expect(queryParams.Page).to.equal("3");
  expect(queryParams.Page2).to.equal("3");
  expect(queryParams.SortOrder).to.equal("dsc");
});

//for url configuration

When("I configure the URL", function () {
  this.url.configure();
});

Then("the URL properties should be set correctly", function () {
  const urlProperties = this.url.properties;
  expect(urlProperties.protocol).to.equal("https:");
  expect(urlProperties.hostname).to.equal("webshop.com");
  expect(urlProperties.port).to.equal("");
  expect(urlProperties.path).to.equal("/Products/List");
  expect(urlProperties.queryParams.SortDirection).to.equal("dsc");
  expect(urlProperties.queryParams.Sort).to.equal("price");
  expect(urlProperties.queryParams.Page).to.equal("3");
  expect(urlProperties.queryParams.Page2).to.equal("3");
  expect(urlProperties.queryParams.SortOrder).to.equal("dsc");
});

//for url parameter extraction

When("the system extracts and stores the query parameters", function () {
  const queryString = this.url.search.substring(1);
  const params = queryString.split("&");

  this.queryParameters = {};
  params.forEach((param) => {
    const [key, value] = param.split("=");
    this.queryParameters[key] = value;
  });
});

Then(
  "the system should have the following query parameters:",
  function (dataTable) {
    const expectedParameters = dataTable.hashes();

    expectedParameters.forEach((expectedParam) => {
      const { parameter, value } = expectedParam;
      const extractedValue = this.queryParameters[parameter];

      expect(extractedValue).to.equal(value);
    });
  }
);
//has query parameters

When("count the query parameters", function () {
  const queryParams = this.url.searchParams;
  this.queryParamCount = queryParams ? queryParams.size : 0;
});

Then("the url query number should be {string}", function (expectedCount) {
  const actualCount = this.queryParamCount.toString();
  assert.strictEqual(
    actualCount,
    expectedCount,
    "Unexpected query parameter count"
  );
});

//remove the query
When("remove the query", () => {
  urlremovedquery = this.url.clearQuery();
});
Then("the url should be {string}", (parameter) =>
  assert.strictEqual(urlremovedquery.toString(), parameter)
);
