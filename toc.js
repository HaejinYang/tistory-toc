Main();
const isSmall = window.matchMedia("(max-width: 1000px");
isSmall.addListener(ClearToc);

function Main() {
    if (!IsArticle()) {
        console.log("홈 화면");

        return;
    }

    let uniqueId = 0;
    const main = document.querySelector('#main');
    main.style.display = "flex";

    const tocWrapper = CreateTocWrapper();
    const tocContainer = CreateTocContainer();
    tocContainer.addEventListener('mouseout', (e) => {
        if (e.target === e.currentTarget) {
            console.log("out");
            RefreshToc();
        }
    });
    tocWrapper.append(tocContainer);

    const innerIndex = document.querySelector('.tt_article_useless_p_margin');
    const tocTarget = innerIndex.querySelectorAll('h1, h2, h3, h4, h5, h6');

    let content = ""
    for (const each of tocTarget) {
        ++uniqueId;
        each.id = `origin-${uniqueId}`;
        const content = document.createElement('p');
        content.innerHTML = each.textContent;
        content.id = `toc-${uniqueId}`;
        content.setAttribute('href', `#${each.id}`);
        const tabLength = GetTabLengthByHeadingTag(each.tagName);
        content.style.cssText = `
                color: black;
                cursor: pointer;
                padding-left: ${tabLength}em;
                margin-top: -1em;
            `;

        content.addEventListener('mouseover', (e) => {
            for (const tocElement of tocContainer.children) {
                BlurToc(tocElement);
            }

            FocusToc(e.target);
        });

        content.addEventListener('mouseout', (e) => {
            for (const tocElement of tocContainer.children) {
                BlurToc(tocElement);
            }
        });

        tocContainer.append(content);
        const br = document.createElement('br');
        tocContainer.append(br);
    }

    main.append(tocWrapper);
    document.addEventListener('scroll', (e) => {
        RefreshToc();
    });

    function RefreshToc() {
        let topElement;
        let topY = 99999;
        for (const each of tocTarget) {
            const rect = each.getBoundingClientRect();
            const offsetY = Math.abs(rect.y);
            if (topY > offsetY) {
                topY = offsetY;
                topElement = each;
            }

            const tocId = `#toc-${each.id.replace("origin-", "")}`;
            const tocElement = document.querySelector(tocId);
            BlurToc(tocElement);
        }

        const tocId = `#toc-${topElement.id.replace("origin-", "")}`;
        const tocElement = document.querySelector(tocId);
        FocusToc(tocElement);
    }

    function FocusToc(e) {
        if (!e) {
            return;
        }

        if (!e.id.includes('toc')) {
            return;
        }

        e.style.textShadow = "0 0 .01px black";
        e.style.backgroundColor = "#eee";
    }

    function BlurToc(e) {
        if (!e) {
            return;
        }

        if (!e.id.includes('toc')) {
            return;
        }

        e.style.textShadow = "";
        e.style.backgroundColor = "";
    }

    function CreateTocWrapper() {
        const wrapper = document.createElement('div');
        wrapper.style.cssText = `
            border-left: 1px solid #ddd;
        `;

        return wrapper;
    }

    function CreateTocContainer() {
        const tocContainer = document.createElement('div');
        tocContainer.id = "toc-container";
        tocContainer.style.cssText = `
            min-width: 100px;
            max-width: 300px;
            border-left: 1px solid #ddd;
            position: sticky;
            padding-top: 2em;
            top: 0px;
            align-self: flex-start;
        `;

        tocContainer.addEventListener('click', (e) => {
            const target = e.target.getAttribute('href');
            if (target) {
                document.querySelector(e.target.getAttribute('href')).scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });

        return tocContainer;
    }

    function IsArticle() {
        const currentUrl = window.location.href;
        const parsedUrl = currentUrl.split("/");
        const ret = parseInt(parsedUrl[parsedUrl.length - 1], 10);

        return typeof ret === 'number' && isFinite(ret);
    }

    function GetTabLengthByHeadingTag(tag) {
        let length = 1;
        let compTag = tag.toLowerCase();
        if (compTag === 'h2') {
            length = 1;
        } else if (compTag === 'h3') {
            length = 2;
        } else if (compTag === 'h4') {
            length = 3;
        } else if (compTag === 'h5') {
            lenght = 4;
        } else if (compTag === 'h6') {
            length = 5;
        } else {
            length = 1;
        }

        return length;
    }
}

function ClearToc(isSmall) {
    if (isSmall.matches) {
        document.querySelector("#toc-container").style.display = "none";
    } else {
        document.querySelector("#toc-container").style.display = "block";
    }
}