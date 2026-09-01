// Copyright (c) 2026 Pigsty
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

import { expect, test } from "@playwright/test";
import {
  cleanResourcePath,
  grantMatchesResource,
  hasResourceWildcard,
  matchResource,
  matchWildcard,
  resourcePattern,
} from "../src/common/SecureComponent/resourceMatch";

// policy/resource_test.go TestResourceMatch in silo-pkg (Resource.Match with
// no condition values), verbatim.
const siloPkgVectors: Array<[string, string, boolean]> = [
  ["*", "mybucket", true],
  ["*", "mybucket/myobject", true],
  ["mybucket*", "mybucket", true],
  ["mybucket*", "mybucket/myobject", true],
  ["*/*", "mybucket/myobject", true],
  ["mybucket/*", "mybucket/myobject", true],
  ["mybucket*/myobject", "mybucket/myobject", true],
  ["mybucket*/myobject", "mybucket100/myobject", true],
  ["mybucket?0/2010/photos/*", "mybucket20/2010/photos/1.jpg", true],
  ["mybucket", "mybucket", true],
  ["mybucket?0", "mybucket30", true],
  ["*/*", "mybucket", false],
  ["mybucket/*", "mybucket10/myobject", false],
  ["mybucket?0/2010/photos/*", "mybucket0/2010/photos/1.jpg", false],
  ["mybucket", "mybucket/myobject", false],
];

// wildcard/match_test.go TestMatch in silo-pkg (Match, not MatchSimple),
// verbatim: 53 vectors.
const wildcardVectors: Array<[string, string, boolean]> = [
  ["*", "s3:GetObject", true],
  ["", "s3:GetObject", false],
  ["", "", true],
  ["s3:*", "s3:ListMultipartUploadParts", true],
  ["s3:ListBucketMultipartUploads", "s3:ListBucket", false],
  ["s3:ListBucket", "s3:ListBucket", true],
  ["s3:ListBucketMultipartUploads", "s3:ListBucketMultipartUploads", true],
  ["my-bucket/oo*", "my-bucket/oo", true],
  ["my-bucket/In*", "my-bucket/India/Karnataka/", true],
  ["my-bucket/In*", "my-bucket/Karnataka/India/", false],
  ["my-bucket/In*/Ka*/Ban", "my-bucket/India/Karnataka/Ban", true],
  [
    "my-bucket/In*/Ka*/Ban",
    "my-bucket/India/Karnataka/Ban/Ban/Ban/Ban/Ban",
    true,
  ],
  [
    "my-bucket/In*/Ka*/Ban",
    "my-bucket/India/Karnataka/Area1/Area2/Area3/Ban",
    true,
  ],
  [
    "my-bucket/In*/Ka*/Ban",
    "my-bucket/India/State1/State2/Karnataka/Area1/Area2/Area3/Ban",
    true,
  ],
  ["my-bucket/In*/Ka*/Ban", "my-bucket/India/Karnataka/Bangalore", false],
  ["my-bucket/In*/Ka*/Ban*", "my-bucket/India/Karnataka/Bangalore", true],
  ["my-bucket/*", "my-bucket/India", true],
  ["my-bucket/oo*", "my-bucket/odo", false],
  ["my-bucket?/abc*", "mybucket/abc", false],
  ["my-bucket?/abc*", "my-bucket1/abc", true],
  ["my-?-bucket/abc*", "my--bucket/abc", false],
  ["my-?-bucket/abc*", "my-1-bucket/abc", true],
  ["my-?-bucket/abc*", "my-k-bucket/abc", true],
  ["my??bucket/abc*", "mybucket/abc", false],
  ["my??bucket/abc*", "my4abucket/abc", true],
  ["my-bucket?abc*", "my-bucket/abc", true],
  ["my-bucket/abc?efg", "my-bucket/abcdefg", true],
  ["my-bucket/abc?efg", "my-bucket/abc/efg", true],
  ["my-bucket/abc????", "my-bucket/abc", false],
  ["my-bucket/abc????", "my-bucket/abcde", false],
  ["my-bucket/abc????", "my-bucket/abcdefg", true],
  ["my-bucket/abc?", "my-bucket/abc", false],
  ["my-bucket/abc?", "my-bucket/abcd", true],
  ["my-bucket/abc?", "my-bucket/abcde", false],
  ["my-bucket/mnop*?", "my-bucket/mnop", false],
  ["my-bucket/mnop*?", "my-bucket/mnopqrst/mnopqr", true],
  ["my-bucket/mnop*?", "my-bucket/mnopqrst/mnopqrs", true],
  ["my-bucket/mnop*?", "my-bucket/mnop", false],
  ["my-bucket/mnop*?", "my-bucket/mnopq", true],
  ["my-bucket/mnop*?", "my-bucket/mnopqr", true],
  ["my-bucket/mnop*?and", "my-bucket/mnopqand", true],
  ["my-bucket/mnop*?and", "my-bucket/mnopand", false],
  ["my-bucket/mnop*?and", "my-bucket/mnopqand", true],
  ["my-bucket/mnop*?", "my-bucket/mn", false],
  ["my-bucket/mnop*?", "my-bucket/mnopqrst/mnopqrs", true],
  ["my-bucket/mnop*??", "my-bucket/mnopqrst", true],
  ["my-bucket/mnop*qrst", "my-bucket/mnopabcdegqrst", true],
  ["my-bucket/mnop*?and", "my-bucket/mnopqand", true],
  ["my-bucket/mnop*?and", "my-bucket/mnopand", false],
  ["my-bucket/mnop*?and?", "my-bucket/mnopqanda", true],
  ["my-bucket/mnop*?and", "my-bucket/mnopqanda", false],
  ["my-?-bucket/abc*", "my-bucket/mnopqanda", false],
  ["a?", "a", false],
];

test.describe("wildcard matching", () => {
  test("agrees with silo-pkg's resource vectors", () => {
    for (const [pattern, resource, want] of siloPkgVectors) {
      expect(
        matchResource(pattern, resource),
        `${pattern} vs ${resource}`,
      ).toBe(want);
    }
  });

  test("agrees with silo-pkg's wildcard vectors", () => {
    for (const [pattern, name, want] of wildcardVectors) {
      expect(matchWildcard(pattern, name), `${pattern} vs ${name}`).toBe(want);
    }
  });

  test("treats regular-expression syntax as literal characters", () => {
    expect(matchWildcard("bucket/foo[bar*", "bucket/foo[bar/x")).toBe(true);
    expect(matchWildcard("bucket/foo[bar*", "bucket/foobar/x")).toBe(false);
    expect(matchWildcard("bucket/a+b*", "bucket/a+b")).toBe(true);
    expect(matchWildcard("bucket/a+b*", "bucket/aab")).toBe(false);
    expect(matchWildcard("bucket/data.csv", "bucket/dataXcsv")).toBe(false);
    expect(matchWildcard("bucket/data.csv", "bucket/data.csv")).toBe(true);
    expect(matchWildcard("bucket/(x)$", "bucket/(x)$")).toBe(true);
    expect(matchWildcard("bucket/^x", "bucket/x")).toBe(false);
    expect(() => matchWildcard("bucket/foo[bar*", "anything")).not.toThrow();
  });

  test("is anchored and supports repeated wildcards", () => {
    expect(matchWildcard("foo*", "bucket/foo/x")).toBe(false);
    expect(matchWildcard("*foo*", "bucket/foo/x")).toBe(true);
    expect(matchWildcard("a*b*c", "abc")).toBe(true);
    expect(matchWildcard("a*b*c", "aXXbYYc")).toBe(true);
    expect(matchWildcard("a*b*c", "aXXbYY")).toBe(false);
    expect(matchWildcard("a**b", "ab")).toBe(true);
    expect(matchWildcard("*?", "")).toBe(false);
    expect(matchWildcard("*?", "x")).toBe(true);
  });

  test("compares bytes like the server does", () => {
    expect(matchWildcard("bucket/日?", "bucket/日本")).toBe(false);
    expect(matchWildcard("bucket/日???", "bucket/日本")).toBe(true);
    expect(matchWildcard("bucket/日*", "bucket/日本語")).toBe(true);
  });

  test("fails closed and stays fast on hostile input", () => {
    expect(matchWildcard(undefined as unknown as string, "x")).toBe(false);
    expect(matchWildcard("x", null as unknown as string)).toBe(false);
    expect(matchResource(42 as unknown as string, "x")).toBe(false);
    const started = Date.now();
    expect(matchWildcard("*a*a*a*a*a*a*a*a*a*a*b", "a".repeat(5000))).toBe(
      false,
    );
    expect(Date.now() - started).toBeLessThan(1000);
  });
});

test.describe("resource helpers", () => {
  test("cleanResourcePath mirrors path.Clean", () => {
    expect(cleanResourcePath("")).toBe(".");
    expect(cleanResourcePath("bucket/prefix/")).toBe("bucket/prefix");
    expect(cleanResourcePath("bucket//a/./b/../c")).toBe("bucket/a/c");
    expect(cleanResourcePath("/bucket/../..")).toBe("/");
    expect(cleanResourcePath("../x")).toBe("../x");
    expect(cleanResourcePath("./")).toBe(".");
  });

  test("matchResource accepts the cleaned exact form", () => {
    expect(matchResource("bucket/prefix", "bucket/prefix/")).toBe(true);
    expect(matchResource("bucket/prefix", "bucket//prefix")).toBe(true);
    expect(matchResource("bucket/prefix", "bucket/prefix/x")).toBe(false);
  });

  test("resourcePattern strips only the S3 ARN prefix", () => {
    expect(resourcePattern("arn:aws:s3:::bucket/*")).toBe("bucket/*");
    expect(resourcePattern("console-ui")).toBe("console-ui");
    expect(resourcePattern("arn:aws:s3tables:::b/t")).toBe(
      "arn:aws:s3tables:::b/t",
    );
    expect(hasResourceWildcard("arn:aws:s3:::bucket/?")).toBe(true);
    expect(hasResourceWildcard("arn:aws:s3:::bucket/a.b")).toBe(false);
  });

  test("grantMatchesResource applies S3 patterns and exact keys only", () => {
    expect(grantMatchesResource("arn:aws:s3:::bucket*", "bucket/sub/")).toBe(
      true,
    );
    expect(grantMatchesResource("arn:aws:s3:::bucket/*", "bucket")).toBe(false);
    expect(grantMatchesResource("arn:aws:s3:::bucket/*", "bucket/")).toBe(true);
    expect(
      grantMatchesResource("arn:aws:s3:::bucket/foo[bar*", "bucket/foo[bar/x"),
    ).toBe(true);
    expect(grantMatchesResource("arn:aws:s3:::data*", "mydata/x")).toBe(false);
    expect(
      grantMatchesResource("arn:aws:s3:::bucket/*", "arn:aws:s3:::bucket/*"),
    ).toBe(true);
    expect(grantMatchesResource("arn:aws:s3:::bucket*", "arn:aws:s3:::*")).toBe(
      false,
    );
    expect(grantMatchesResource("console-ui", "console-ui")).toBe(true);
    expect(grantMatchesResource("console-*", "console-ui")).toBe(false);
    expect(
      grantMatchesResource("arn:aws:s3tables:::b/*", "arn:aws:s3tables:::b/t"),
    ).toBe(false);
  });
});
