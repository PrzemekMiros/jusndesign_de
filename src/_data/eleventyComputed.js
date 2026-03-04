module.exports = {
  lang: () => "de",
  langPrefix: () => "/de",
  permalink: (data) => {
    const langPrefix = "/de";

    const withLangPrefix = (path) => {
      if (path === "/") {
        return `${langPrefix}/`;
      }

      if (path === langPrefix || path.startsWith(`${langPrefix}/`)) {
        return path;
      }

      return `${langPrefix}${path}`;
    };

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

    if (data.permalink.startsWith("/pl/")) {
      return withLangPrefix(data.permalink.slice(3));
    }

    if (data.permalink === "/pl") {
      return `${langPrefix}/`;
    }

    const normalized = data.permalink.startsWith("/") ? data.permalink : `/${data.permalink}`;
    return withLangPrefix(normalized);
  },
};
