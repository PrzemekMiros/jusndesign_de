module.exports = {
  lang: () => "de",
  langPrefix: () => "",
  permalink: (data) => {
    if (data.permalink === false) {
      return false;
    }

    if (typeof data.permalink !== "string") {
      return data.permalink;
    }

    if (
      data.permalink === "/robots.txt" ||
      data.permalink === "/sitemap.xml" ||
      data.permalink === "/404.html"
    ) {
      return data.permalink;
    }

    if (data.permalink.startsWith("/de/")) {
      return data.permalink.slice(3);
    }

    if (data.permalink === "/de") {
      return "/";
    }

    if (data.permalink.startsWith("/pl/")) {
      return data.permalink.slice(3);
    }

    if (data.permalink === "/pl") {
      return "/";
    }

    return data.permalink.startsWith("/") ? data.permalink : `/${data.permalink}`;
  },
};
