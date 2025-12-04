const http = require("http");
const fs = require("fs");
const puppeteer = require("puppeteer");

let server;
let browser;
let page;

beforeAll(async () => {
  server = http.createServer(function (req, res) {
    fs.readFile(__dirname + "/.." + req.url, function (err, data) {
      if (err) {
        res.writeHead(404);
        res.end(JSON.stringify(err));
        return;
      }
      res.writeHead(200);
      res.end(data);
    });
  });

  server.listen(process.env.PORT || 3000);
});

afterAll(() => {
  server.close();
});

beforeEach(async () => {
  browser = await puppeteer.launch({ args: ["--no-sandbox"] }); // Added '--no-sandbox' for compatibility
  page = await browser.newPage();
  await page.goto("http://localhost:3000/index.html");
});

afterEach(async () => {
  await browser.close();
});

describe("the rgb-color class", () => {
  it("should be set to the RGB equivalent of the color yellow", async () => {
    const matches = await page.$eval("style", (style) => {
      const css = style.innerHTML;
      const regex = /\.rgb-color\s*{[^}]*color\s*:\s*rgb\(255\s*,\s*255\s*,\s*0\)\s*;[^}]*}/gi;
      return css.match(regex)?.length || 0;
    });

    expect(matches).toBe(1);
  });
});

describe("the hex-color class", () => {
  it("should be set to the HEX equivalent of the color yellow", async () => {
    const matches = await page.$eval("style", (style) => {
      const css = style.innerHTML;
      const regex = /\.hex-color\s*{[^}]*color\s*:\s*#f{2}f{2}0{2}\s*;[^}]*}/gi;
      return css.match(regex)?.length || 0;
    });

    expect(matches).toBe(1);
  });
});
