Feature: URL Configuration

  Scenario: URL Configuration
    Given an url "https://webshop.com/Products/List?SortDirection=dsc&Sort=price&Page=3&Page2=3&SortOrder=dsc"
    When I configure the URL
    Then the URL properties should be set correctly