'use strict';

const assert = require('assert');
const fs = require('fs');
const p = require('path');
const Url = require('../url.min.js');

function sanitizeURL (url) {
    var u = new Url(url, true);

    if (u.query['reload']) {
        delete u.query['reload']
    }

    if (u.query['forceReload']) {
        delete u.query['forceReload']
    }

    if (u.query['device']) {
        delete u.query['device']
    }

    if (u.query['testwebid']) {
        delete u.query['testwebid']
    }

    if (u.query['testWebId']) {
        delete u.query['testWebId']
    }

    if (u.query['testWebID']) {
        delete u.query['testWebID']
    }

    if (u.query['timetravel']) {
        delete u.query['timetravel']
    }

    return u.toString();
}

describe('Url()', function () {
    it('should construct an oobject', function () {
        const u = new Url();
        assert.equal(u instanceof Url, true);
    });
    
    it('should keep URL without transformations if requested', function () {
        assert.equal(
          sanitizeURL('/SearchResults?search=new&make=Buick&year=2016&forceReload=true'),
          '/SearchResults?search=new&make=Buick&year=2016'
        );
    });
    it('should test absolutize url', function () {
        const absoluteUrl = new Url('/foo');
        assert.equal(absoluteUrl.toString(), 'file:///foo');

        const noTransform = new Url('/foo', true);
        assert.equal(noTransform.toString(), '/foo');
    });
});

describe('Url.clearQuery()', function () {
    it('should remove all query parameters from the URL', function () {
      const url1 = new Url('http://example.com/?param1=value1&param2=value2&param3=value3');
      url1.clearQuery();
      assert.equal(url1.toString(), 'http://example.com/');
  
      const url2 = new Url('http://example.com/?param1=value1&param2=value2');
      url2.clearQuery();
      assert.equal(url2.toString(), 'http://example.com/');
  
      const url3 = new Url('http://example.com/?param1=value1');
      url3.clearQuery();
      assert.equal(url3.toString(), 'http://example.com/');
  
      const url4 = new Url('http://example.com/?');
      url4.clearQuery();
      assert.equal(url4.toString(), 'http://example.com/');
    });
  
    it('should preserve other parts of the URL', function () {
      const url = new Url('http://example.com/path?param1=value1#fragment');
      url.clearQuery();
      assert.equal(url.toString(), 'http://example.com/path#fragment');
    });
  
    it('should not modify the URL if it does not have any query parameters', function () {
      const url = new Url('http://example.com/');
      url.clearQuery();
      assert.equal(url.toString(), 'http://example.com/');
    });
  });
  

  describe('Url.encode(), Url.decode()', function () {
    it('should correctly encode and decode query string params', function () {
        var url1 = new Url('http://localhost/?a=%3F').toString();
        var url2 = new Url('http://localhost/?a=%3f').toString();
        assert.equal(url1.toLowerCase(), url2.toLowerCase());
    });
});

  

  describe('Url.queryLength()', function () {
    it('should correctly return correct query lengths', function () {
        let url = new Url('http://localhost/?a=%3F');
        let queryLength = url.queryLength();
        assert.equal(queryLength, 1);

        url = new Url('http://localhost/');
        queryLength = url.queryLength();
        assert.equal(queryLength, 0);

        url = new Url('http://localhost/?a=%3F&test=this&hello=world');
        queryLength = url.queryLength();
        assert.equal(queryLength, 3);
    });
    
    it('should count each query parameter once, even if it appears multiple times', function () {
        const url = new Url('http://example.com/?param1=value1&param1=value2&param1=value3');
        const queryLength = url.queryLength();
        assert.equal(queryLength, 1);
    });

});
  

  describe('Url.query.toString()', function () {
    it('should maintain name for null values, and drop them for undefined values', function () {
      // Test case description: Ensure that the `toString` method of `Url.query` maintains the name for null values and drops them for undefined values.
      const originalStr = 'http://localhost/path?alice=123&bob=&carol';
      const u = new Url(originalStr);
      assert.equal(u.query['alice'], '123');
      assert.equal(u.query['bob'], '');
      assert.equal(u.query['carol'], null);
      assert.equal(u.query['dave'], undefined);
      assert.equal(u.toString(), originalStr);
  
      u.query['eve'] = null;
      assert.equal(u.toString(), originalStr + '&eve');
      u.query['eve'] = undefined;
      assert.equal(u.toString(), originalStr);
  
      u.query['frank'] = 'foo';
      assert.equal(u.toString(), originalStr + '&frank=foo');
      delete u.query.frank;
      assert.equal(u.toString(), originalStr);
    });
  
    it('should maintain name for null values in arrays, and skip undefined values', function () {
      // Test case description: Ensure that the `toString` method of `Url.query` maintains the name for null values in arrays and skips undefined values.
      const originalStr = 'http://localhost/?a&a&a';
      const u = new Url(originalStr);
      assert.equal(u.query.toString(), 'a&a&a');
      assert.equal(u.query.a instanceof Array, true);
      assert.equal(u.query.a[0], null);
      assert.equal(u.query.a[1], null);
      assert.equal(u.query.a[2], null);
      assert.equal(u.queryLength(), 1);
      assert.equal(u.toString(), originalStr);
  
      u.query.a[1] = undefined;
      assert.equal(u.toString(), 'http://localhost/?a&a');
  
      u.query.a[1] = 'foo';
      assert.equal(u.toString(), 'http://localhost/?a&a=foo&a');
  
      u.query.a[1] = undefined;
      assert.equal(u.toString(), 'http://localhost/?a&a');
  
      u.query.a[1] = null;
      assert.equal(u.toString(), originalStr);
    });
  });
  
  describe('Url props interface', function () {
    it('should parse all URL parts correctly', function () {
      // Test case description: Ensure that the `Url` class correctly parses all parts of a URL.
      const str = 'wss://user:pass@example.com:9999/some/path.html?foo=bar#anchor';
      const u = new Url(str);
      assert.equal(u.protocol, 'wss');
      assert.equal(u.user, 'user');
      assert.equal(u.pass, 'pass');
      assert.equal(u.host, 'example.com');
      assert.equal(u.port, '9999');
      assert.equal(u.path, '/some/path.html');
      assert.equal(u.query, 'foo=bar');
      assert.equal(u.query.foo, 'bar');
      assert.equal(u.hash, 'anchor');
      assert.equal(str, u.toString());
    });
  });
  

describe('Url props interface', function () {
    it('should parse all URL parts correctly', function () {
        const str = 'wss://user:pass@example.com:9999/some/path.html?foo=bar#anchor';
        const u = new Url(str);
        assert.equal(u.protocol, 'wss');
        assert.equal(u.user, 'user');
        assert.equal(u.pass, 'pass');
        assert.equal(u.host, 'example.com');
        assert.equal(u.port, '9999');
        assert.equal(u.path, '/some/path.html');
        assert.equal(u.query, 'foo=bar');
        assert.equal(u.query.foo, 'bar');
        assert.equal(u.hash, 'anchor');
        assert.equal(str, u.toString());
    });
});

describe('Path url encoding', function () {
    it('should correctly encode whitespace as %20', function () {
        const u = new Url('http://localhost/path with space');
        assert.equal(u.toString(), 'http://localhost/path%20with%20space');
    });
    // TODO: Fix https://github.com/Mikhus/domurl/issues/49
    xit('should correctly encode Plus Sign (+) to %2b in path.', function () {
        const u = new Url('http://localhost/path+with+plus');
        assert.equal(u.toString(), 'http://localhost/path%2bwith%2bplus');
    });
    xit('should preserve Plus Sign (+) in path.', function () {
        const u = new Url('http://localhost/path+with+plus');
        assert.equal(u.toString(), 'http://localhost/path%2bwith%2bplus');
    });
});
