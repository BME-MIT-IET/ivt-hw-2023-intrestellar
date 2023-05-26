Feature: QueryString Parsing

  Scenario: Parsing QueryString
    Given an url "https://webshop.com/Products/List?SortDirection=dsc&Sort=price&Page=3&Page2=3&SortOrder=dsc"
    When I parse the query string
    Then the query parameters should be correctly parsed


