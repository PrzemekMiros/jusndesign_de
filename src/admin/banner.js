// static/admin/bannerStatic.js
CMS.registerEditorComponent({
    id: "bannerStatic",
    label: "Banner",
    fields: [
      { name: "headerText", label: "Titel", widget: "string" },
      { name: "contentText", label: "Opis", widget: "string" },
      { name: "imageUrl", label: "Obrazek", widget: "image" }
    ],
    pattern: /^{% bannerStatic "(.+)", "(.+)", "(.+)" %}$/,
    fromBlock: function(match) {
      return {
        headerText: match[1],
        contentText: match[2],
        imageUrl: match[3]
      };
    },
    toBlock: function({ headerText, contentText, imageUrl }) {
      return `{% bannerStatic "${headerText}", "${contentText}", "${imageUrl}" %}`;
    },
    toPreview: function({ headerText, contentText, imageUrl }) {
      return `<div class="Post-Banner D-Flex Flex-Wrap">
              <div class="col-md-8">
                  <div class="p-4 p-md-5 pe-md-3">
                      <h3 class="mt-0 Farblicht">${headerText}</h3>
                      <p class="mb-3 Unterüberschrift Farblicht">
                        ${contentText}
                      </p>
                    <a href="/kontakt/" class="Button-Anim BTN-Write Magnetic MT-2 Einblendung" data-strength="40">
                        <div class="button-anim-text">
                            <span>Kontaktieren Sie uns </span>
                            <span>Kontaktieren Sie uns </span>
                        </div>
                        <div class="button-anim-icon">
                            <svg class="icon-pencil" width="18" height="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <rect id="view-box" fill="none"/>
                                    <path id="Shape" d="M.75,17.5A.751.751,0,0,1,0,16.75V12.569a.755.755,0,0,1,.22-.53L11.461.8a2.72 ,2.72,0,0,1,3.848,0L16.7,2.191a2.72,2.72,0,0,1,0,3.848L5.462,17.28a.747.747,0 ,0.1-.531.22ZM1.5,12.879V16h3.12l7.91-7.91L9.41,4.97ZM13.591,7.03l2.051-2.051 a1.223,1.223,0,0,0,0-1.727L14.249,1.858a1.222,1.222,0,0.0-1.727,0L10.47,3.91Z" transform="übersetzen(3,25 3,25)" stroke-width="2px" fill="#fff"/>
                            </svg>
                            <div class="icon-line"></div>
                        </div>
                    </a>
                  </div>
              </div>
              <div class="col-md-4 d-none d-md-block">
                  <img src="${imageUrl}" alt="">
              </div>
            </div>`;
    }
  });
  

