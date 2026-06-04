import { describe, test, expect } from "vitest";
import { parseCodeBlocks } from "./parseCodeBlocks";

describe("parseCodeBlocks", () => {
  test("extracts a single html code block", () => {
    const markdown = 'Texto antes\n```html\n<div>Hello</div>\n```\ntexto despues';
    const result = parseCodeBlocks(markdown);
    expect(result).toEqual([{ language: "html", code: "<div>Hello</div>", index: 0 }]);
  });

  test("extracts a single css code block", () => {
    const markdown = '```css\nbody { color: red; }\n```';
    const result = parseCodeBlocks(markdown);
    expect(result).toEqual([{ language: "css", code: "body { color: red; }", index: 0 }]);
  });

  test("extracts js and javascript blocks", () => {
    const jsMd = '```js\nconst x = 1;\n```';
    const jsResult = parseCodeBlocks(jsMd);
    expect(jsResult[0].language).toBe("js");
    expect(jsResult[0].code).toBe("const x = 1;");

    const jsMd2 = '```javascript\nconst y = 2;\n```';
    const jsResult2 = parseCodeBlocks(jsMd2);
    expect(jsResult2[0].language).toBe("javascript");
  });

  test("extracts multiple code blocks with different languages", () => {
    const markdown = '```html\n<div></div>\n```\n```css\na {}\n```\n```js\nconsole.log(1)\n```';
    const result = parseCodeBlocks(markdown);
    expect(result).toHaveLength(3);
    expect(result[0].language).toBe("html");
    expect(result[1].language).toBe("css");
    expect(result[2].language).toBe("js");
  });

  test("returns empty array when no code blocks", () => {
    expect(parseCodeBlocks("Solo texto plano")).toEqual([]);
    expect(parseCodeBlocks("")).toEqual([]);
  });

  test("handles empty code block", () => {
    const markdown = '```js\n\n```';
    const result = parseCodeBlocks(markdown);
    expect(result).toEqual([{ language: "js", code: "", index: 0 }]);
  });

  test("ignores unsupported language blocks", () => {
    const markdown = '```python\nprint("hi")\n```\n```html\n<p>ok</p>\n```';
    const result = parseCodeBlocks(markdown);
    expect(result).toHaveLength(1);
    expect(result[0].language).toBe("html");
  });
});
