Main();

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
    tocWrapper.append(tocContainer);

    const innerIndex = document.querySelector('.tt_article_useless_p_margin');
    const tocTarget = innerIndex.querySelectorAll('h1, h2, h3, h4, h5, h6');

    let content = ""
    for (const each of tocTarget) {
        ++uniqueId;
        each.id = `origin-${uniqueId}`;
        const content = document.createElement('span');
        content.innerHTML = AddTabIntoText(each.tagName, each.textContent);
        content.id = `toc-${uniqueId}`;
        content.setAttribute('href', `#${each.id}`);
        content.style.cssText = `
                color: black;
                cursor: pointer;
            `;

        content.addEventListener('mouseover', (e) => {
            for(const tocElement of tocContainer.children) {
                BlurToc(tocElement);
            }

            FocusToc(e.target);
        });

        content.addEventListener('mouseout', (e) => {
            for(const tocElement of tocContainer.children) {
                BlurToc(tocElement);
            }

            RefreshToc();
        });

        tocContainer.append(content);
        const br = document.createElement('br');
        tocContainer.append(br);
    }

    main.append(tocWrapper);

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

    document.addEventListener('scroll', (e) => {
        RefreshToc();
    });
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
    tocContainer.style.cssText = `
            min-width: 100px;
            border-left: 1px solid #ddd;
            position: sticky;
            top: 0px;
            align-self: flex-start;
        `;

    tocContainer.addEventListener('click', (e) => {
        document.querySelector(e.target.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });

    return tocContainer;
}

function IsArticle() {
    const currentUrl = window.location.href;
    const parsedUrl = currentUrl.split("/");
    const ret = parseInt(parsedUrl[parsedUrl.length - 1], 10);

    return typeof ret === 'number' && isFinite(ret);
}

function AddTabIntoText(tag, text) {
    let length = 1;
    compTag = tag.toLowerCase();
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

    let tab = "";
    for (let i = 0; i < length; i++) {
        tab += "&emsp;"
    }

    return `${tab}${text}`;
}