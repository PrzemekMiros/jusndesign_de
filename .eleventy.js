const eleventyPluginFilesMinifier = require("@sherby/eleventy-plugin-files-minifier");
const Image = require('@11ty/eleventy-img');
const codeStyleHooks = require("eleventy-plugin-code-style-hooks");
const { parse } = require('node-html-parser');
const markdownIt = require("markdown-it");
const markdownItAnchor = require("markdown-it-anchor");
const slugify = require("slugify"); 

const banner = require('./src/shortcodes/banner.js');
const lineStatic = require('./src/shortcodes/lineStatic.js');
const siteImage = require('./src/shortcodes/Image.js');
const blogImage = require('./src/shortcodes/blogImage.js');
const workImage = require('./src/shortcodes/workImage.js');
const productImage = require('./src/shortcodes/productImage.js');

module.exports = function(eleventyConfig) {

    eleventyConfig.addPassthroughCopy("src/assets/css");
    eleventyConfig.addPassthroughCopy("src/assets/js");
    eleventyConfig.addPassthroughCopy("src/assets/img"); 
    eleventyConfig.addPassthroughCopy("src/assets/pdf"); 
    eleventyConfig.addPassthroughCopy("src/assets/video"); 
    eleventyConfig.addPassthroughCopy("src/assets/fonts");
    eleventyConfig.addPassthroughCopy("src/contactForm.php");
    eleventyConfig.addPassthroughCopy("src/content/posts/img"); 
    eleventyConfig.addPassthroughCopy("src/content/works/img"); 
    eleventyConfig.addPassthroughCopy("src/content/clients/img"); 
    eleventyConfig.addPassthroughCopy("src/content/reviews/img"); 
    eleventyConfig.addPassthroughCopy("src/content/products/img"); 
    eleventyConfig.addPassthroughCopy("src/static");
    eleventyConfig.addPassthroughCopy("src/admin");
    eleventyConfig.addPassthroughCopy("tasks.json");
    eleventyConfig.addWatchTarget("src/assets/sass");
    eleventyConfig.ignores.add("src/admin/**");

    eleventyConfig.addShortcode("bannerStatic", banner);
    eleventyConfig.addShortcode("lineStatic", lineStatic);
    eleventyConfig.addNunjucksAsyncShortcode("Image", siteImage);
    eleventyConfig.addNunjucksAsyncShortcode("blogImage", blogImage);
    eleventyConfig.addNunjucksAsyncShortcode("workImage", workImage);
    eleventyConfig.addNunjucksAsyncShortcode("productImage", productImage);

    eleventyConfig.addPlugin(eleventyPluginFilesMinifier);
    
    eleventyConfig.addFilter("extractHeaders", function(content) {
      const root = parse(content);
      const headers = root.querySelectorAll('h2');
      return headers.map(header => header.innerText);
    });

    eleventyConfig.addFilter("byLang", function(collection, lang) {
      if (!collection) {
        return [];
      }
      return collection.filter(item => (item.data.lang || "de") === lang);
    });

    eleventyConfig.addFilter("toPlUrl", function(url) {
      if (!url) {
        return "/";
      }
      return url.replace(/^\/en(\/|$)/, "/");
    });

    const getOrderValue = (item) => {
      const raw = item?.data?.order;
      const num = typeof raw === "number" ? raw : Number(raw);
      return Number.isFinite(num) ? num : Number.MAX_SAFE_INTEGER;
    };

    const compareByOrder = (a, b) => {
      const delta = getOrderValue(a) - getOrderValue(b);
      if (delta !== 0) {
        return delta;
      }
      const titleA = (a?.data?.title || "").toString();
      const titleB = (b?.data?.title || "").toString();
      return titleA.localeCompare(titleB, "pl");
    };

    eleventyConfig.addFilter("sortByOrder", function(items) {
      if (!Array.isArray(items)) {
        return [];
      }
      return items.slice().sort(compareByOrder);
    });

    // Collection products
eleventyConfig.addCollection('products', (collection) => {
  return collection.getFilteredByGlob("src/content/products/**/*.md")
    .sort(compareByOrder);
});

eleventyConfig.addCollection("productCategories", (collection) => {
  const products = collection.getFilteredByGlob("src/content/products/**/*.md");
  const categories = {};

  products.forEach(product => {
    const lang = product.data.lang || "de";
    const cats = product.data.categories || [];

    if (!categories[lang]) {
      categories[lang] = {};
    }

    cats.forEach(cat => {
      if (!categories[lang][cat]) {
        categories[lang][cat] = [];
      }
      categories[lang][cat].push(product);
    });
  });

  // Sort products within each category by frontmatter "order"
  Object.keys(categories).forEach((lang) => {
    Object.keys(categories[lang]).forEach((cat) => {
      categories[lang][cat].sort(compareByOrder);
    });
  });

  return categories;
});


        // Collections portfolio
        eleventyConfig.addCollection('works', (collection) => {
          const works = collection.getFilteredByGlob('src/content/works/**/*.md').reverse();
            return works.sort((a, b) => {
              const orderA = a.data.order || 0; // Ustawiamy domyślną wartość na wypadek braku pola order
              const orderB = b.data.order || 0;
              return orderA - orderB;
            });
          });

        // Collection blog
        eleventyConfig.addCollection('posts', function(collectionApi) {
          return collectionApi.getFilteredByGlob('src/content/posts/**/*.md').reverse();
          });

        // Collection reviews
        eleventyConfig.addCollection("reviews", (collection) => {

          const reviews = collection.getFilteredByGlob('src/content/reviews/**/*.md').reverse();
          return reviews.sort((a, b) => {
            const orderA = a.data.order || 0; // Ustawiamy domyślną wartość na wypadek braku pola order
            const orderB = b.data.order || 0;
            return orderA - orderB;
          });
          });

        // Collection clients
        eleventyConfig.addCollection("clients", function(collectionApi) {
          return collectionApi.getFilteredByGlob('src/content/clients/**/*.md');
          });


        // Collection faq
        eleventyConfig.addCollection("faq", function(collectionApi) {
          return collectionApi.getFilteredByGlob('src/content/faq/**/*.md');
          });
      
        // Date
        eleventyConfig.addFilter('dateDisplay', require('./src/filters/date-display.js'));
        eleventyConfig.addShortcode("year", () => `${new Date().getFullYear()}`);


      // Code blocks
      eleventyConfig.addPlugin(codeStyleHooks, {
        colorPreviews: true,
        defaultLanguage: 'js',
        highlightSyntax: true,
        languageLabels: true,
        lineNumbers: true,
        markdownTrimTrailingNewline: true,
        prism: function(prism) {
          prism.languages.example = {
            tokenname: /\w+/i
          }
        }, 
      });


      let md = markdownIt({
        html: true,
        breaks: true,
        linkify: true
    }).use(markdownItAnchor, {
        level: 2, 
        slugify: function(str) {
            return slugify(str, {
                lower: true,  
                strict: true 
            });
        }
    });

    eleventyConfig.setLibrary("md", md);
    

    return {
      dir: {
        input: "src",
        output: "public",
        includes: "includes"
      }
    }
  };
